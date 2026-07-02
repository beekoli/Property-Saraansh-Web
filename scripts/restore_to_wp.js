const fs = require('fs');
const path = require('path');
const axios = require('axios');

const propertiesFile = path.resolve(__dirname, '../src/data/properties.json');
const blogsFile = path.resolve(__dirname, '../src/data/blogs.json');
const blogHtmlDir = path.resolve(__dirname, '../.next/server/app/blog');

// Credentials are read from environment variables — never hardcode them.
// Set them before running, e.g. (PowerShell):
//   $env:WP_USER="karmaglobalretail"; $env:WP_APP_PASSWORD="xxxx xxxx xxxx"; node scripts/restore_to_wp.js
const username = process.env.WP_USER;
const appPassword = process.env.WP_APP_PASSWORD;
if (!username || !appPassword) {
  throw new Error('Missing WP_USER / WP_APP_PASSWORD environment variables. Set them before running (do not hardcode credentials).');
}
const apiBase = 'https://login.propertysaraansh.com/wp-json/wp/v2';

// Basic Auth Token
const authHeader = 'Basic ' + Buffer.from(`${username}:${appPassword}`).toString('base64');

const client = axios.create({
  headers: {
    'Authorization': authHeader,
    'Content-Type': 'application/json'
  }
});

// Extract YouTube Video ID from HTML
function extractVideoId(slug) {
  const filePath = path.join(blogHtmlDir, `${slug}.html`);
  if (!fs.existsSync(filePath)) return null;
  const html = fs.readFileSync(filePath, 'utf8');
  
  // Search for youtube embed url
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
  console.log("Starting WordPress Restoration...\n");

  // Clean up existing properties and posts to prevent duplicate slugs
  await deleteExistingItems('properties');
  await deleteExistingItems('posts');

  // 1. Restore Properties
  if (fs.existsSync(propertiesFile)) {
    const properties = JSON.parse(fs.readFileSync(propertiesFile, 'utf8'));
    console.log(`Found ${properties.length} properties to restore.`);
    
    for (const prop of properties) {
      console.log(`\nUploading Property: ${prop.title.rendered}...`);
      try {
        // Prepare properties body
        const payload = {
          title: prop.title.rendered,
          slug: prop.slug,
          content: prop.content.rendered,
          excerpt: prop.excerpt ? prop.excerpt.rendered : "",
          status: 'publish',
          acf: prop.acf
        };
        
        const response = await client.post(`${apiBase}/properties`, payload);
        console.log(`  Successfully restored property: ${prop.slug} (ID: ${response.data.id})`);
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
      console.log(`\nUploading Blog Post: ${post.title.rendered}...`);
      try {
        // Extract video ID from local cached html file
        const videoId = extractVideoId(post.slug);
        
        // Prepare post body
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
        console.log(`  Successfully restored blog post: ${post.slug} (ID: ${response.data.id})`);
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
