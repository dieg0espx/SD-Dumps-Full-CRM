const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CLOUD_NAME = 'dku1gnuat';
const API_KEY = '416529686821769';
const API_SECRET = 'vwhdv2_kGVTWxyKoYWn0XOraWVY';
const FOLDER = 'sddumps';

// Images to upload
const images = [
  { file: 'public/logo.png', publicId: 'logo' },
  { file: 'public/dumpster.png', publicId: 'dumpster' },
  { file: 'public/miniature.png', publicId: 'miniature' },
  { file: 'public/dumpster-.png', publicId: 'dumpster-alt' },
  { file: 'public/placeholder-logo.png', publicId: 'placeholder-logo' },
  { file: 'public/placeholder.jpg', publicId: 'placeholder' },
  { file: 'public/placeholder-user.jpg', publicId: 'placeholder-user' },
  { file: 'public/favicon/apple-touch-icon.png', publicId: 'favicon/apple-touch-icon' },
  { file: 'public/favicon/favicon-96x96.png', publicId: 'favicon/favicon-96x96' },
  { file: 'public/favicon/web-app-manifest-192x192.png', publicId: 'favicon/web-app-manifest-192x192' },
  { file: 'public/favicon/web-app-manifest-512x512.png', publicId: 'favicon/web-app-manifest-512x512' },
];

function generateSignature(params) {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');

  return crypto
    .createHash('sha1')
    .update(sortedParams + API_SECRET)
    .digest('hex');
}

function uploadImage(filePath, publicId) {
  const timestamp = Math.round(Date.now() / 1000);

  const params = {
    folder: FOLDER,
    public_id: publicId,
    timestamp: timestamp.toString(),
  };

  const signature = generateSignature(params);

  const curlCmd = `curl -s -X POST https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload \
    -F "file=@${filePath}" \
    -F "api_key=${API_KEY}" \
    -F "timestamp=${timestamp}" \
    -F "signature=${signature}" \
    -F "folder=${FOLDER}" \
    -F "public_id=${publicId}"`;

  try {
    const result = execSync(curlCmd, { encoding: 'utf-8' });
    return JSON.parse(result);
  } catch (error) {
    throw new Error(error.message);
  }
}

function main() {
  console.log('Starting Cloudinary upload to folder: ' + FOLDER + '\n');

  const results = {};
  const errors = [];

  for (const img of images) {
    const fullPath = path.join(__dirname, '..', img.file);

    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  Skipping ${img.file} - file not found`);
      continue;
    }

    console.log(`📤 Uploading ${img.file}...`);

    try {
      const result = uploadImage(fullPath, img.publicId);
      if (result.error) {
        console.log(`   ❌ Error: ${result.error.message}\n`);
        errors.push({ file: img.file, error: result.error.message });
      } else {
        results[img.publicId] = result.secure_url;
        console.log(`   ✅ ${result.secure_url}\n`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
      errors.push({ file: img.file, error: error.message });
    }
  }

  console.log('\n=== Upload Results ===\n');
  console.log(JSON.stringify(results, null, 2));

  if (errors.length > 0) {
    console.log('\n=== Errors ===\n');
    errors.forEach(e => console.log(`${e.file}: ${e.error}`));
  }

  console.log('\n=== URL Mapping for Code Replacement ===\n');
  Object.entries(results).forEach(([id, url]) => {
    const originalPath = images.find(i => i.publicId === id)?.file.replace('public', '');
    if (originalPath) {
      console.log(`"${originalPath}" -> "${url}"`);
    }
  });
}

main();
