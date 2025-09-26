#!/usr/bin/env node

/**
 * Sync static assets under `frontend/public` to Cloudflare R2.
 *
 * Required environment variables:
 * - CLOUDFLARE_ACCOUNT_ID
 * - CLOUDFLARE_R2_ACCESS_KEY_ID
 * - CLOUDFLARE_R2_SECRET_ACCESS_KEY
 * - CLOUDFLARE_R2_BUCKET (e.g. "realsee-discover-assets")
 * - CLOUDFLARE_R2_ENDPOINT (e.g. "https://discover-assets.realsee.dev")
 */

const path = require('path');
const process = require('process');
const fs = require('fs');
const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const mime = require('mime-types');
const dotenv = require('dotenv');
const sharp = require('sharp');

const projectRoot = path.resolve(__dirname, '..');

const envFiles = [
  path.join(projectRoot, '.env.local'),
  path.join(projectRoot, '.env'),
  path.join(__dirname, '.env.local'),
  path.join(__dirname, '.env'),
  path.join(projectRoot, 'frontend', '.env.local'),
  path.join(projectRoot, 'frontend', '.env'),
];

for (const envFile of envFiles) {
  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile, override: false });
  }
}

const REQUIRED_ENV = [
  'CLOUDFLARE_ACCOUNT_ID',
  'CLOUDFLARE_R2_ACCESS_KEY_ID',
  'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
  'CLOUDFLARE_R2_BUCKET',
  'CLOUDFLARE_R2_ENDPOINT',
];

function assertEnv() {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

function createS3Client() {
  const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT;
  return new S3Client({
    region: 'auto',
    endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
  });
}

function listFilesRecursively(rootDir) {
  const result = [];
  const queue = [rootDir];
  while (queue.length > 0) {
    const current = queue.pop();
    const stat = fs.statSync(current);
    if (stat.isDirectory()) {
      const entries = fs.readdirSync(current);
      for (const entry of entries) {
        queue.push(path.join(current, entry));
      }
    } else if (stat.isFile()) {
      result.push(current);
    }
  }
  return result;
}

function computeKey(rootDir, filePath) {
  const relative = path.relative(rootDir, filePath).replace(/\\/g, '/');
  return relative;
}

async function objectExists(client, bucket, key) {
  try {
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch (error) {
    if (error.$metadata && error.$metadata.httpStatusCode === 404) return false;
    if (error.Code === 'NotFound' || error.name === 'NotFound') return false;
    throw error;
  }
}

async function uploadFile({ client, bucket, key, filePath }) {
  const body = fs.createReadStream(filePath);
  const contentType = mime.lookup(filePath) || 'application/octet-stream';

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  );
}

const BLUR_PLACEHOLDER_FILE = path.join(projectRoot, 'frontend', 'src', 'data', 'blur-placeholders.json');

async function generateBlurDataUrl(filePath) {
  const buffer = await sharp(filePath)
    .resize(32, 32, { fit: 'inside' })
    .blur()
    .toFormat('webp', { quality: 60 })
    .toBuffer();
  return `data:image/webp;base64,${buffer.toString('base64')}`;
}

async function ensureBlurPlaceholderMap(files, publicDir) {
  const result = {};
  for (const filePath of files) {
    const ext = path.extname(filePath).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'].includes(ext)) {
      continue;
    }
    const key = `/${computeKey(publicDir, filePath)}`;
    try {
      result[key] = await generateBlurDataUrl(filePath);
    } catch (error) {
      console.warn(`[sync-assets-to-r2] Failed to generate blur for ${key}: ${error.message}`);
    }
  }
  await fs.promises.mkdir(path.dirname(BLUR_PLACEHOLDER_FILE), { recursive: true });
  await fs.promises.writeFile(BLUR_PLACEHOLDER_FILE, JSON.stringify(result, null, 2));
  console.log(`[sync-assets-to-r2] Generated blur placeholder map → ${BLUR_PLACEHOLDER_FILE}`);
}

async function main() {
  try {
    assertEnv();
  } catch (error) {
    console.error(`[sync-assets-to-r2] ${error.message}`);
    process.exit(1);
  }

  const bucket = process.env.CLOUDFLARE_R2_BUCKET;
  const client = createS3Client();
  const publicDir = path.join(projectRoot, 'frontend', 'public');
  const includeDirs = ['bg', 'carousel', 'cover', 'professional'];

  if (!fs.existsSync(publicDir) || !fs.statSync(publicDir).isDirectory()) {
    console.error(`[sync-assets-to-r2] Public directory not found: ${publicDir}`);
    process.exit(1);
  }

  const rootFiles = fs
    .readdirSync(publicDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(publicDir, entry.name));

  const targets = includeDirs
    .map((dir) => path.join(publicDir, dir))
    .filter((dirPath) => fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory());

  const directoryFiles = targets.flatMap((dir) => listFilesRecursively(dir));
  const files = [...rootFiles, ...directoryFiles];

  if (files.length === 0) {
    console.warn('[sync-assets-to-r2] No files found under target directories or public root.');
    return;
  }

  await ensureBlurPlaceholderMap(files, publicDir);

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const filePath of files) {
    const key = computeKey(publicDir, filePath);
    try {
      const exists = await objectExists(client, bucket, key);
      if (exists) {
        skipped += 1;
        continue;
      }
      await uploadFile({ client, bucket, key, filePath });
      uploaded += 1;
      console.log(`[sync-assets-to-r2] Uploaded ${key}`);
    } catch (error) {
      failed += 1;
      console.error(`[sync-assets-to-r2] Failed to upload ${key}:`, error.message || error);
    }
  }

  console.log(
    `[sync-assets-to-r2] Completed. uploaded=${uploaded} skipped=${skipped} failed=${failed} total=${files.length}`,
  );
  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('[sync-assets-to-r2] Unexpected error:', error && error.stack ? error.stack : error);
  process.exit(1);
});


