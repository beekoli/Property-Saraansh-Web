#!/usr/bin/env ts-node
/**
 * Usage:
 *   npm run upload-video -- --video "C:\path\to\video.mp4" --title "My Video Title" --description "Description here"
 *
 * Optional flags:
 *   --thumbnail "C:\path\to\thumb.jpg"
 *   --tags "tag1,tag2,tag3"
 *   --publish-date "2026-07-01"   (schedule for future; omit to publish immediately)
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { uploadVideo } from '../src/lib/youtubeUpload';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env.local') });

function parseArgs(argv: string[]): Record<string, string> {
  const args: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].replace(/^--/, '');
      args[key] = argv[i + 1] || '';
      i++;
    }
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const videoPath = args['video'];
  const title = args['title'];
  const description = args['description'] || `Watch the full video by Property Saraansh. Expert real estate insights on Noida properties, investments, and market trends.`;
  const thumbnailPath = args['thumbnail'];
  const tagsRaw = args['tags'];
  const publishDate = args['publish-date'];

  if (!videoPath) {
    console.error('❌ Error: --video flag is required');
    console.log('\nUsage:');
    console.log('  npm run upload-video -- --video "C:\\path\\to\\video.mp4" --title "Video Title"');
    process.exit(1);
  }

  if (!title) {
    console.error('❌ Error: --title flag is required');
    process.exit(1);
  }

  const tags = tagsRaw
    ? tagsRaw.split(',').map((t) => t.trim())
    : ['real estate noida', 'property saraansh', 'noida property', 'real estate investment'];

  console.log('\n🚀 Property Saraansh — YouTube Video Upload');
  console.log('==========================================');

  const uploaded = await uploadVideo({
    videoPath,
    title,
    description,
    tags,
    categoryId: '22', // People & Blogs
    thumbnailPath,
    publishDate,
  });

  // Save to data/videos.json so the site picks it up automatically
  const dataDir = path.join(__dirname, '../data');
  const dataFile = path.join(dataDir, 'videos.json');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  let videos: any[] = [];
  if (fs.existsSync(dataFile)) {
    videos = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  }

  // Add new video at the top
  videos.unshift({
    id: uploaded.id,
    title: uploaded.title,
    description: uploaded.description,
    thumbnail: uploaded.thumbnail,
    publishedAt: uploaded.publishedAt,
    duration: '0:00', // YouTube API needs a separate call for duration; update manually or extend script
    category: 'Real Estate',
    views: '0 views',
    likes: '0',
    comments: '0',
  });

  fs.writeFileSync(dataFile, JSON.stringify(videos, null, 2));

  console.log(`\n📁 Video data saved to: data/videos.json`);
  console.log(`\n📺 Watch on YouTube: ${uploaded.url}`);
  console.log(`🔗 Site slug: /our-videos/${uploaded.slug}`);
  console.log('\n✅ Done! Deploy your site to make the new video live.');
}

main().catch((err) => {
  console.error('\n❌ Upload failed:', err.message);
  process.exit(1);
});
