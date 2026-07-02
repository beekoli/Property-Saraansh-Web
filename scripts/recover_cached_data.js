const fs = require('fs');
const path = require('path');

const propertiesDir = path.resolve(__dirname, '../.next/server/app/properties');
const blogDir = path.resolve(__dirname, '../.next/server/app/blog');
const outputDir = path.resolve(__dirname, '../src/data');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Decode HTML entities
function decodeHtml(html) {
  if (!html) return '';
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&ndash;/g, '-')
    .replace(/&mdash;/g, '--');
}

// Parse braces to find matching JSON ending
function findJsonObjects(text) {
  const objects = [];
  let pos = 0;
  
  while (true) {
    const start = text.indexOf('{"', pos);
    if (start === -1) break;
    
    let braceCount = 0;
    let end = -1;
    let inString = false;
    let escape = false;
    
    for (let i = start; i < text.length; i++) {
      const char = text[i];
      
      if (escape) {
        escape = false;
        continue;
      }
      
      if (char === '\\') {
        escape = true;
        continue;
      }
      
      if (char === '"') {
        inString = !inString;
        continue;
      }
      
      if (!inString) {
        if (char === '{') {
          braceCount++;
        } else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            end = i;
            break;
          }
        }
      }
    }
    
    if (end !== -1) {
      const candidate = text.substring(start, end + 1);
      try {
        const parsed = JSON.parse(candidate);
        if (parsed && typeof parsed === 'object') {
          objects.push(parsed);
        }
      } catch (e) {}
      pos = start + 1;
    } else {
      break;
    }
  }
  
  return objects;
}

// Reconstruct a property listing from its .rsc file
function extractPropertyFromRsc(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf8');
  const candidates = findJsonObjects(content);
  
  for (const obj of candidates) {
    if (obj.slug && obj.title && obj.title.rendered && obj.id && obj.acf) {
      if (obj.content && obj.content.rendered) {
        return obj;
      }
    }
  }
  return null;
}

// Parse a blog post from its pre-rendered HTML file
function parseBlogFromHtml(filePath, slug) {
  if (!fs.existsSync(filePath)) return null;
  const html = fs.readFileSync(filePath, 'utf8');
  
  // 1. Title
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const title = h1Match ? decodeHtml(h1Match[1].trim()) : '';
  
  if (!title) return null;
  
  // 2. Featured Image
  const ogImgMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/);
  const featuredImage = ogImgMatch ? ogImgMatch[1] : '';
  
  // 3. Excerpt / Meta Description
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/);
  const excerpt = descMatch ? decodeHtml(descMatch[1].trim()) : '';
  
  // 4. Date
  const dateRegex = /By Saraansh Seth<\/span>[\s\S]*?<span>([\s\S]*?)<\/span>/;
  const dateMatch = html.match(dateRegex);
  let date = dateMatch ? dateMatch[1].trim() : '2026-06-11T12:00:00';
  
  // Try to find article published time meta tag
  const publishedMatch = html.match(/<meta\s+property="article:published_time"\s+content="([^"]+)"/);
  if (publishedMatch) {
    date = publishedMatch[1];
  }
  
  // 5. Content
  let contentHtml = '';
  const startIdx = html.indexOf('class="blog-content');
  if (startIdx !== -1) {
    const divStart = html.lastIndexOf('<div', startIdx);
    if (divStart !== -1) {
      let divCount = 0;
      let contentEnd = -1;
      for (let i = divStart; i < html.length; i++) {
        if (html.substring(i, i + 4) === '<div') {
          divCount++;
        } else if (html.substring(i, i + 5) === '</div') {
          divCount--;
          if (divCount === 0) {
            contentEnd = i + 6;
            break;
          }
        }
      }
      if (contentEnd !== -1) {
        const fullDiv = html.substring(divStart, contentEnd);
        const innerStart = fullDiv.indexOf('>') + 1;
        const innerEnd = fullDiv.lastIndexOf('</div>');
        contentHtml = fullDiv.substring(innerStart, innerEnd).trim();
      }
    }
  }

  // Fallback to basic schema or meta info if JSON-LD schemas aren't there
  const ogTitle = title;
  const ogDescription = excerpt;
  
  // Build Yoast/RankMath equivalents
  const rankMathJson = {
    title: title,
    description: excerpt,
    og_title: ogTitle,
    og_description: ogDescription,
    og_image: featuredImage ? [{ url: featuredImage }] : [],
    canonical: `https://www.propertysaraansh.com/blog/${slug}`,
    og_url: `https://www.propertysaraansh.com/blog/${slug}`,
    og_type: "article",
    robots: { index: "index", follow: "follow" }
  };

  return {
    id: Math.floor(Math.random() * 10000) + 1000,
    date: date,
    slug: slug,
    title: { rendered: title },
    excerpt: { rendered: excerpt },
    content: { rendered: contentHtml },
    _embedded: {
      'wp:featuredmedia': featuredImage ? [{ source_url: featuredImage }] : []
    },
    rank_math_json: rankMathJson
  };
}

// ----------------- EXECUTION -----------------

console.log("Starting data recovery from build cache...");

// 1. Recover Properties
const properties = [];
if (fs.existsSync(propertiesDir)) {
  const files = fs.readdirSync(propertiesDir);
  for (const file of files) {
    if (file.endsWith('.rsc')) {
      const filePath = path.join(propertiesDir, file);
      try {
        const prop = extractPropertyFromRsc(filePath);
        if (prop) {
          properties.push(prop);
          console.log(`Recovered property: ${prop.slug}`);
        }
      } catch (err) {
        console.error(`Error parsing property file ${file}:`, err.message);
      }
    }
  }
} else {
  console.warn("Properties build cache directory not found.");
}

// 2. Recover Blogs
const blogs = [];
if (fs.existsSync(blogDir)) {
  const files = fs.readdirSync(blogDir);
  for (const file of files) {
    if (file.endsWith('.html') && file !== 'index.html') {
      const slug = path.basename(file, '.html');
      const filePath = path.join(blogDir, file);
      try {
        const post = parseBlogFromHtml(filePath, slug);
        if (post) {
          blogs.push(post);
          console.log(`Recovered blog: ${post.slug}`);
        }
      } catch (err) {
        console.error(`Error parsing blog file ${file}:`, err.message);
      }
    }
  }
} else {
  console.warn("Blogs build cache directory not found.");
}

// 3. Save Results
const propertiesFile = path.join(outputDir, 'properties.json');
const blogsFile = path.join(outputDir, 'blogs.json');

fs.writeFileSync(propertiesFile, JSON.stringify(properties, null, 2));
fs.writeFileSync(blogsFile, JSON.stringify(blogs, null, 2));

console.log(`\nRecovery Completed!`);
console.log(`Properties saved: ${properties.length} entries to src/data/properties.json`);
console.log(`Blogs saved: ${blogs.length} entries to src/data/blogs.json`);
