#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const TARGET_URLS = new Set([
  'https://realsee.ai/Ae44XBBg',
  'https://realsee.ai/GjVV2lEO',
  'https://realsee.ai/v4OORaaL',
  'https://realsee.ai/v4OOR4qm',
  'https://realsee.ai/jmxxR7qV',
]);

function resolveRepoRoot() {
  const scriptDir = __dirname;
  const candidateRoot = path.resolve(scriptDir, '..', '..');
  return candidateRoot;
}

function main() {
  const repoRoot = resolveRepoRoot();
  const toursJsonPath = path.join(repoRoot, 'data', 'tours.json');
  if (!fs.existsSync(toursJsonPath)) {
    console.error('[tag-carousel] 找不到文件:', toursJsonPath);
    process.exit(1);
  }
  const raw = fs.readFileSync(toursJsonPath, 'utf8');
  let data = [];
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error('[tag-carousel] JSON 解析失败:', e.message);
    process.exit(1);
  }

  let updated = 0;
  const normalizedKeyCandidates = ['Showcase Link', 'link', 'url'];

  for (const item of data) {
    let link = null;
    for (const key of normalizedKeyCandidates) {
      if (item && Object.prototype.hasOwnProperty.call(item, key)) {
        link = item[key];
        if (link) break;
      }
    }
    if (typeof link === 'string' && TARGET_URLS.has(link)) {
      if (item.carousel !== true) {
        item.carousel = true;
        updated += 1;
      }
    }
  }

  fs.writeFileSync(toursJsonPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`[tag-carousel] 已标记 carousel: true 数量: ${updated}`);
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error('[tag-carousel] 失败:', err && err.stack ? err.stack : err);
    process.exit(1);
  }
}
