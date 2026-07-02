import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

export interface UploadOptions {
  videoPath: string;
  title: string;
  description: string;
  tags?: string[];
  categoryId?: string;
  thumbnailPath?: string;
  publishDate?: string;
}

export interface UploadedVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
  slug: string;
}

function getOAuthClient() {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      'Missing YouTube credentials. Please set YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, and YOUTUBE_REFRESH_TOKEN in .env.local'
    );
  }

  // Use google.auth.OAuth2 from googleapis to avoid version conflicts
  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oAuth2Client.setCredentials({ refresh_token: refreshToken });
  return oAuth2Client;
}

function generateSlug(title: string, id: string): string {
  const slugifiedTitle = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60);
  return `${slugifiedTitle}-${id}`;
}

export async function uploadVideo(options: UploadOptions): Promise<UploadedVideo> {
  const {
    videoPath,
    title,
    description,
    tags = ['real estate', 'noida', 'property', 'property saraansh'],
    categoryId = '22',
    thumbnailPath,
    publishDate,
  } = options;

  if (!fs.existsSync(videoPath)) {
    throw new Error(`Video file not found: ${videoPath}`);
  }

  console.log(`\n📹 Starting upload: ${path.basename(videoPath)}`);
  console.log(`📝 Title: ${title}`);

  const auth = getOAuthClient();
  const youtube = google.youtube({ version: 'v3', auth });

  const requestBody = {
    snippet: {
      title,
      description,
      tags,
      categoryId,
      defaultLanguage: 'en',
    },
    status: {
      privacyStatus: publishDate ? 'private' : 'public',
      publishAt: publishDate ? new Date(publishDate).toISOString() : undefined,
      selfDeclaredMadeForKids: false,
    },
  };

  const fileSize = fs.statSync(videoPath).size;
  const media = {
    mimeType: 'video/*',
    body: fs.createReadStream(videoPath),
  };

  console.log(`\n⬆️  Uploading ${(fileSize / 1024 / 1024).toFixed(1)} MB...`);

  const response = await youtube.videos.insert({
    part: ['snippet', 'status'],
    requestBody,
    media,
  });

  const videoId = response.data.id!;
  const publishedAt = response.data.snippet?.publishedAt || new Date().toISOString();
  const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  console.log(`\n✅ Upload complete!`);
  console.log(`🔗 YouTube URL: https://www.youtube.com/watch?v=${videoId}`);

  // Upload thumbnail if provided
  if (thumbnailPath && fs.existsSync(thumbnailPath)) {
    console.log(`\n🖼️  Uploading thumbnail...`);
    await youtube.thumbnails.set({
      videoId,
      media: {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(thumbnailPath),
      },
    });
    console.log(`✅ Thumbnail uploaded!`);
  }

  // Ping Google sitemap
  const sitemapUrl = process.env.GOOGLE_SITEMAP_URL;
  if (sitemapUrl) {
    try {
      await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
      console.log(`\n📡 Sitemap pinged: ${sitemapUrl}`);
    } catch {
      console.log(`\n⚠️  Sitemap ping failed (non-critical)`);
    }
  }

  return {
    id: videoId,
    title,
    description,
    thumbnail,
    publishedAt: publishedAt.split('T')[0],
    url: `https://www.youtube.com/watch?v=${videoId}`,
    slug: generateSlug(title, videoId),
  };
}
