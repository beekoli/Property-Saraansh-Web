const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { execSync } = require('child_process');

const TOKEN_PATH = path.join(__dirname, 'token_drive.json');
const CLIENT_SECRET_PATH = 'c:\\Users\\YC COMPUTER\\Downloads\\client_secret_153224674856-dmm236tiosgmef8t4pdi029hslbllta5.apps.googleusercontent.com.json';
const BACKUP_ZIP_NAME = 'backup-property-saraansh.zip';
const BACKUP_ZIP_PATH = path.join(__dirname, '..', BACKUP_ZIP_NAME);

// SCOPES required for Google Drive upload (drive.file allows creating and managing files created by this app)
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

async function getOAuth2Client() {
  // Load client secrets from local file.
  if (!fs.existsSync(CLIENT_SECRET_PATH)) {
    throw new Error(`Client secret file not found at ${CLIENT_SECRET_PATH}. Please make sure it exists.`);
  }

  const content = fs.readFileSync(CLIENT_SECRET_PATH, 'utf8');
  const credentials = JSON.parse(content);
  const { client_id, client_secret } = credentials.installed;
  
  // Create OAuth2 client. We use a local redirect URI on port 3000
  const redirectUri = 'http://localhost:3000';
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri);

  // Check if we have previously stored a token.
  if (fs.existsSync(TOKEN_PATH)) {
    const token = fs.readFileSync(TOKEN_PATH, 'utf8');
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
  }

  // If no token exists, authenticate the user
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        const reqUrl = req.url || '';
        const parsedUrl = new URL(reqUrl, 'http://localhost:3000');
        const code = parsedUrl.searchParams.get('code');

        if (code) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body style="font-family: Arial, sans-serif; text-align: center; padding-top: 50px; background-color: #f0fdf4; color: #166534;">
                <div style="display: inline-block; padding: 30px; border: 1px solid #bbf7d0; border-radius: 8px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                  <h1 style="margin-top: 0; color: #15803d;">Authentication Successful!</h1>
                  <p style="font-size: 16px;">Google Drive has been connected successfully.</p>
                  <p style="font-size: 14px; color: #86efac;">You can close this tab and return to the terminal.</p>
                </div>
              </body>
            </html>
          `);
          
          server.close();

          console.log('⚡ Code received. Exchanging for tokens...');
          const { tokens } = await oAuth2Client.getToken(code);
          oAuth2Client.setCredentials(tokens);
          // Store the token to disk for later program executions
          fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
          console.log('💾 Token stored to:', TOKEN_PATH);
          resolve(oAuth2Client);
        } else {
          res.writeHead(404);
          res.end('Not Found');
        }
      } catch (err) {
        res.writeHead(500);
        res.end(`Authentication error: ${err.message}`);
        server.close();
        reject(err);
      }
    });

    server.listen(3000, () => {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent',
      });
      console.log('\n🔑 Action Required: Please authenticate with Google to connect Google Drive.');
      console.log('👉 Open this link in your browser:\n');
      console.log(`\x1b[36m${authUrl}\x1b[0m\n`);
      console.log('Waiting for authentication...');
    });
  });
}

function createBackupZip() {
  console.log('\n📦 Compressing codebase...');
  
  // Remove existing backup zip if it exists to avoid adding it to itself
  if (fs.existsSync(BACKUP_ZIP_PATH)) {
    fs.unlinkSync(BACKUP_ZIP_PATH);
  }

  // Define files/folders to include in backup
  const targets = [
    'src',
    'public',
    'scripts',
    'package.json',
    'package-lock.json',
    'tsconfig.json',
    'next.config.ts',
    '.env.local'
  ];

  const filesStr = targets.join(' ');
  const command = `tar -a -cf "${BACKUP_ZIP_NAME}" ${filesStr}`;
  
  console.log(`Running: ${command}`);
  execSync(command, { cwd: path.join(__dirname, '..') });
  
  if (fs.existsSync(BACKUP_ZIP_PATH)) {
    const stats = fs.statSync(BACKUP_ZIP_PATH);
    console.log(`✅ Compression complete! Created: ${BACKUP_ZIP_NAME} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
  } else {
    throw new Error('Failed to create backup zip file.');
  }
}

async function uploadToDrive(auth) {
  const drive = google.drive({ version: 'v3', auth });
  
  const timestamp = new Date().toISOString()
    .replace(/T/, '_')
    .replace(/\..+/, '')
    .replace(/:/g, '-');
    
  const driveFileName = `Property-Saraansh-Backup_${timestamp}.zip`;
  
  console.log(`\n⬆️ Uploading to Google Drive as: ${driveFileName}...`);
  
  const fileMetadata = {
    name: driveFileName,
    description: 'Automated backup of Property Saraansh Next.js codebase',
  };
  
  const media = {
    mimeType: 'application/zip',
    body: fs.createReadStream(BACKUP_ZIP_PATH),
  };
  
  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id, name, webViewLink',
  });
  
  console.log('\n🎉 Backup Uploaded Successfully!');
  console.log('====================================');
  console.log(`🆔 File ID: ${response.data.id}`);
  console.log(`📁 File Name: ${response.data.name}`);
  console.log(`🔗 Link: ${response.data.webViewLink}`);
  console.log('====================================');
  
  // Clean up local zip
  try {
    fs.unlinkSync(BACKUP_ZIP_PATH);
    console.log('🧹 Cleaned up local backup zip file.');
  } catch (err) {
    console.log(`⚠️ Warning: Could not clean up local zip file: ${err.message}`);
  }
}

async function main() {
  console.log('🚀 Property Saraansh — Google Drive Backup Utility');
  console.log('==================================================');
  
  // 1. Authenticate with Google
  const auth = await getOAuth2Client();
  
  // 2. Create the backup zip
  createBackupZip();
  
  // 3. Upload to Google Drive
  await uploadToDrive(auth);
  
  console.log('\n✅ Backup process completed successfully.');
}

main().catch((err) => {
  console.error('\n❌ Backup failed:', err.message);
  process.exit(1);
});
