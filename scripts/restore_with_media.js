const fs = require('fs');
const path = require('path');
const axios = require('axios');

const propertiesFile = path.resolve(__dirname, '../src/data/properties.json');
const blogsFile = path.resolve(__dirname, '../src/data/blogs.json');
const blogHtmlDir = path.resolve(__dirname, '../.next/server/app/blog');
const mediaDir = path.resolve(__dirname, '../temp_extracted_media');
const publicDir = path.resolve(__dirname, '../public');

// Credentials are read from environment variables — never hardcode them.
const username = process.env.WP_USER;
const appPassword = process.env.WP_APP_PASSWORD;
if (!username || !appPassword) {
  throw new Error('Missing WP_USER / WP_APP_PASSWORD environment variables. Set them before running (do not hardcode credentials).');
}
const apiBase = 'https://login.propertysaraansh.com/wp-json/wp/v2';

const authHeader = 'Basic ' + Buffer.from(`${username}:${appPassword}`).toString('base64');

const client = axios.create({
  headers: {
    'Authorization': authHeader,
    'Content-Type': 'application/json'
  }
});

// Recursively find all files in a directory
function walkDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

// Build index of local files (filename -> absolute path)
function buildFileIndex() {
  console.log("Indexing local media files...");
  const index = {};
  
  // 1. Index public directory
  const publicFiles = walkDir(publicDir);
  for (const f of publicFiles) {
    const name = path.basename(f).toLowerCase();
    index[name] = f;
  }
  
  // 2. Index temp_extracted_media directory (takes priority)
  const mediaFiles = walkDir(mediaDir);
  for (const f of mediaFiles) {
    const name = path.basename(f).toLowerCase();
    index[name] = f;
  }
  
  console.log(`Indexed ${Object.keys(index).length} unique files.`);
  return index;
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.webp': return 'image/webp';
    case '.gif': return 'image/gif';
    case '.svg': return 'image/svg+xml';
    default: return 'application/octet-stream';
  }
}

// Cache of uploaded media (url/filename -> mediaID)
const uploadCache = {};

async function uploadMediaFile(filename, localPath) {
  const cacheKey = filename.toLowerCase();
  if (uploadCache[cacheKey]) {
    return uploadCache[cacheKey];
  }

  console.log(`  Uploading media: ${filename} from ${localPath}...`);
  try {
    const buffer = fs.readFileSync(localPath);
    const mimeType = getMimeType(localPath);
    
    const response = await axios.post(`${apiBase}/media`, buffer, {
      headers: {
        'Authorization': authHeader,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': mimeType
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    
    const mediaId = response.data.id;
    console.log(`    Successfully uploaded ${filename} => WP Media ID: ${mediaId}`);
    uploadCache[cacheKey] = mediaId;
    return mediaId;
  } catch (err) {
    console.error(`    Failed to upload ${filename}:`, err.response ? err.response.data : err.message);
    return null;
  }
}

// Check if value is an image URL and resolve it to a local file
async function resolveImageField(value, fileIndex) {
  if (typeof value !== 'string') return value;
  if (!value.startsWith('http')) return value;
  
  // Exclude maps embed and other non-image URLs
  if (value.includes('google.com/maps') || value.includes('youtube.com') || value.includes('youtu.be')) {
    return value;
  }

  const filename = path.basename(value);
  const ext = path.extname(filename).toLowerCase();
  const validExts = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'];
  if (!validExts.includes(ext)) {
    return value;
  }

  const localPath = fileIndex[filename.toLowerCase()];
  if (localPath) {
    const mediaId = await uploadMediaFile(filename, localPath);
    return mediaId || null;
  } else {
    console.warn(`  Warning: Local file not found for URL: ${value} (filename: ${filename})`);
    // Fallback: try to download and upload it, or default to null
    try {
      console.log(`    Attempting download for fallback: ${value}`);
      const downloadRes = await axios.get(value, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(downloadRes.data);
      const tempPath = path.resolve(__dirname, `../temp_download_${filename}`);
      fs.writeFileSync(tempPath, buffer);
      const mediaId = await uploadMediaFile(filename, tempPath);
      fs.unlinkSync(tempPath);
      return mediaId || null;
    } catch (dlErr) {
      console.error(`    Fallback download failed for ${value}: ${dlErr.message}`);
      return null;
    }
  }
}

// Extract YouTube Video ID from HTML
function extractVideoId(slug) {
  const filePath = path.join(blogHtmlDir, `${slug}.html`);
  if (!fs.existsSync(filePath)) return null;
  const html = fs.readFileSync(filePath, 'utf8');
  const ytMatch = html.match(/youtube\.com\/embed\/([A-Za-z0-9_-]+)/);
  if (ytMatch) {
    return ytMatch[1];
  }
  return null;
}

async function deleteExistingItems(endpointName) {
  console.log(`Cleaning up existing items in /${endpointName}...`);
  try {
    const response = await client.get(`${apiBase}/${endpointName}?per_page=100`);
    const items = response.data;
    console.log(`Found ${items.length} items to clean up in /${endpointName}.`);
    for (const item of items) {
      console.log(`  Deleting item ID ${item.id} (${item.slug || item.title?.rendered})...`);
      try {
        await client.delete(`${apiBase}/${endpointName}/${item.id}?force=true`);
      } catch (delErr) {
        console.error(`    Failed to delete ID ${item.id}:`, delErr.response ? delErr.response.data : delErr.message);
      }
    }
  } catch (err) {
    console.error(`Error cleaning up /${endpointName}:`, err.response ? err.response.data : err.message);
  }
}

async function restoreAll() {
  console.log("Starting WordPress Restoration with Media Mapping...\n");

  const fileIndex = buildFileIndex();

  // Clean up existing properties and posts to prevent duplicate slugs
  await deleteExistingItems('properties');
  await deleteExistingItems('posts');

  // 1. Restore Properties
  if (fs.existsSync(propertiesFile)) {
    const properties = JSON.parse(fs.readFileSync(propertiesFile, 'utf8'));
    console.log(`\nFound ${properties.length} properties to restore.`);
    
    for (const prop of properties) {
      console.log(`\nProcessing Property: ${prop.title.rendered}...`);
      try {
        // Map ACF image fields
        const mappedAcf = { ...prop.acf };
        
        // Loop through ACF fields to find and upload images
        for (const [key, value] of Object.entries(mappedAcf)) {
          // If key is an image field, resolve it
          if (
            key === 'project_logo' ||
            key === 'site_plan_image' ||
            key.startsWith('gallery_image_') ||
            key.startsWith('floor_plan_') && key.endsWith('_image') ||
            key.startsWith('amenity_') && key.endsWith('_icon')
          ) {
            if (value) {
              mappedAcf[key] = await resolveImageField(value, fileIndex);
            } else {
              mappedAcf[key] = null;
            }
          }
        }

        // Resolve featured media image if set
        let featuredMediaId = 0;
        if (prop._embedded && prop._embedded['wp:featuredmedia'] && prop._embedded['wp:featuredmedia'].length > 0) {
          const featUrl = prop._embedded['wp:featuredmedia'][0].source_url;
          featuredMediaId = await resolveImageField(featUrl, fileIndex) || 0;
        }

        // Prepare property payload (without featured media initially to avoid theme bug)
        const payload = {
          title: prop.title.rendered,
          slug: prop.slug,
          content: prop.content.rendered,
          excerpt: prop.excerpt ? prop.excerpt.rendered : "",
          status: 'publish',
          acf: mappedAcf
        };
        
        const response = await client.post(`${apiBase}/properties`, payload);
        const newId = response.data.id;
        console.log(`  Successfully restored property: ${prop.slug} (ID: ${newId})`);

        if (featuredMediaId) {
          console.log(`  Setting featured media ID ${featuredMediaId} for property ${newId}...`);
          try {
            await client.post(`${apiBase}/properties/${newId}`, {
              featured_media: featuredMediaId
            });
            console.log(`    Successfully set featured media.`);
          } catch (featErr) {
            console.error(`    Failed to set featured media for property:`, featErr.response ? featErr.response.data : featErr.message);
          }
        }
      } catch (err) {
        console.error(`  Error restoring property ${prop.slug}:`, err.response ? err.response.data : err.message);
      }
    }
  } else {
    console.log("No properties file found.");
  }

  // 2. Restore Blogs
  if (fs.existsSync(blogsFile)) {
    const blogs = JSON.parse(fs.readFileSync(blogsFile, 'utf8'));
    console.log(`\nFound ${blogs.length} blog posts to restore.`);
    
    for (const post of blogs) {
      console.log(`\nProcessing Blog Post: ${post.title.rendered}...`);
      try {
        // Resolve featured image
        let featuredMediaId = 0;
        if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'].length > 0) {
          const featUrl = post._embedded['wp:featuredmedia'][0].source_url;
          featuredMediaId = await resolveImageField(featUrl, fileIndex) || 0;
        }

        // Extract video ID from local cached html file
        const videoId = extractVideoId(post.slug);
        
        // Prepare post payload (without featured media initially to avoid theme bug)
        const payload = {
          title: post.title.rendered,
          slug: post.slug,
          content: post.content.rendered,
          excerpt: post.excerpt ? post.excerpt.rendered : "",
          date: post.date,
          status: 'publish',
          acf: videoId ? { video_id: videoId } : {}
        };
        
        const response = await client.post(`${apiBase}/posts`, payload);
        const newId = response.data.id;
        console.log(`  Successfully restored blog post: ${post.slug} (ID: ${newId})`);

        if (featuredMediaId) {
          console.log(`  Setting featured media ID ${featuredMediaId} for blog post ${newId}...`);
          try {
            await client.post(`${apiBase}/posts/${newId}`, {
              featured_media: featuredMediaId
            });
            console.log(`    Successfully set featured media.`);
          } catch (featErr) {
            console.error(`    Failed to set featured media for blog post:`, featErr.response ? featErr.response.data : featErr.message);
          }
        }
      } catch (err) {
        console.error(`  Error restoring blog post ${post.slug}:`, err.response ? err.response.data : err.message);
      }
    }
  } else {
    console.log("No blogs file found.");
  }
  
  console.log("\nRestoration Process Finished.");
}

restoreAll();
