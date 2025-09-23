#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function resolveRepoRoot() {
  const scriptDir = __dirname;
  return path.resolve(scriptDir, '..', '..');
}

function findImageForId(dir, id) {
  const exts = ['.webp', '.jpeg', '.jpg', '.png'];
  const files = fs.readdirSync(dir);
  // Priority: exact <id>.* first, then <id>_*.*
  for (const ext of exts) {
    const candidate = `${id}${ext}`;
    if (files.includes(candidate)) return candidate;
  }
  for (const file of files) {
    for (const ext of exts) {
      if (file.startsWith(`${id}_`) && file.endsWith(ext)) return file;
    }
  }
  return null;
}

function main() {
  const repoRoot = resolveRepoRoot();
  const dataPath = path.join(repoRoot, 'data', 'carousel.json');
  const publicDir = path.join(repoRoot, 'frontend', 'public', 'carousel');

  if (!fs.existsSync(dataPath)) {
    console.error('[sync-carousel-images] 找不到文件:', dataPath);
    process.exit(1);
  }
  if (!fs.existsSync(publicDir)) {
    console.error('[sync-carousel-images] 找不到目录:', publicDir);
    process.exit(1);
  }

  const raw = fs.readFileSync(dataPath, 'utf8');
  let items = [];
  try {
    items = JSON.parse(raw);
  } catch (e) {
    console.error('[sync-carousel-images] JSON 解析失败:', e.message);
    process.exit(1);
  }

  let updated = 0;
  for (const item of items) {
    const id = item.id;
    const found = findImageForId(publicDir, id);
    if (found) {
      const newFile = found;
      const newPath = `/carousel/${newFile}`;
      if (item.imageFile !== newFile || item.imagePath !== newPath) {
        item.imageFile = newFile;
        item.imagePath = newPath;
        updated += 1;
      }
    }
  }

  fs.writeFileSync(dataPath, JSON.stringify(items, null, 2), 'utf8');
  console.log(`[sync-carousel-images] 已同步 ${updated} 条`);
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error('[sync-carousel-images] 失败:', err && err.stack ? err.stack : err);
    process.exit(1);
  }
}
