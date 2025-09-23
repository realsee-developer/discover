#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function resolveRepoRoot() {
  return path.resolve(__dirname, '..');
}

function extractIdFromUrl(url) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    return parts[parts.length - 1] || null;
  } catch (_) {
    return null;
  }
}

function toShortCategory(category) {
  if (!category || typeof category !== 'string') return 'unknown';
  const map = {
    'Restaurant': 'restaurant',
    'Aerial 3D': 'aerial',
    'Church': 'church',
    'Residential': 'residential',
    'Retail': 'retail',
    'Museum': 'museum',
    'Office': 'office',
    'Hotel': 'hotel',
    'Outdoor': 'outdoor',
    'Gym': 'gym',
    'Exhibition': 'exhibition',
    'Construction': 'construction',
    'Industrial': 'industrial',
    'Campus': 'campus',
    'Tourism': 'tourism',
    'Car': 'car',
    'Clinic': 'clinic',
  };
  return map[category] || category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function main() {
  const repoRoot = resolveRepoRoot();
  const toursPath = path.join(repoRoot, 'data', 'tours.json');
  const outPath = path.join(repoRoot, 'data', 'carousel.json');

  if (!fs.existsSync(toursPath)) {
    console.error('[extract-carousel] 找不到文件:', toursPath);
    process.exit(1);
  }

  const raw = fs.readFileSync(toursPath, 'utf8');
  let tours = [];
  try {
    tours = JSON.parse(raw);
  } catch (e) {
    console.error('[extract-carousel] tours.json 解析失败:', e.message);
    process.exit(1);
  }

  const result = [];
  for (const t of tours) {
    if (t && t.carousel === true) {
      const url = t['Showcase Link'] || t.link || t.url || null;
      const id = url ? extractIdFromUrl(url) : null;
      const category = t['空间类型标签'] || null;
      const shortCategory = toShortCategory(category);
      const imageFile = `${id}_${shortCategory}.jpg`;
      const imagePath = `/carousel/${imageFile}`;
      result.push({
        id,
        url,
        category,
        shortCategory,
        device: t['拍摄设备'] || null,
        imageFile,
        imagePath,
      });
    }
  }

  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');
  console.log(`[extract-carousel] 输出 ${result.length} 条到: ${outPath}`);
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error('[extract-carousel] 失败:', err && err.stack ? err.stack : err);
    process.exit(1);
  }
}
