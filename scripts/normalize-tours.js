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

function pickFirst(...values) {
  for (const v of values) {
    if (typeof v === 'string' && v.trim().length > 0) return v.trim();
  }
  return null;
}

function main() {
  const repoRoot = resolveRepoRoot();
  const srcPath = path.join(repoRoot, 'data', 'tours.json');
  const outPath = path.join(repoRoot, 'frontend', 'src', 'data', 'tours.json');

  if (!fs.existsSync(srcPath)) {
    console.error('[normalize-tours] 找不到源数据:', srcPath);
    process.exit(1);
  }

  const raw = fs.readFileSync(srcPath, 'utf8');
  let items = [];
  try {
    items = JSON.parse(raw);
  } catch (e) {
    console.error('[normalize-tours] 解析失败:', e.message);
    process.exit(1);
  }

  const normalized = [];
  for (const t of items) {
    if (!t || typeof t !== 'object') continue;
    const url = pickFirst(t['Showcase Link'], t.link, t.url);
    if (!url) continue;
    const id = extractIdFromUrl(url);
    if (!id) continue;
    const category = pickFirst(t['空间类型标签']);
    const shortCategory = toShortCategory(category);
    const device = pickFirst(t['拍摄设备']);
    const carousel = t.carousel === true;

    const nt = {
      id,
      url,
      category: category || null,
      shortCategory,
      device: device || null,
      carousel,
    };

    // 预留字段：如果源数据已有元信息，则带上（无则忽略）
    if (typeof t.title === 'string') nt.title = t.title;
    if (typeof t.description === 'string') nt.description = t.description;
    if (typeof t.cover === 'string') nt.cover = t.cover;

    normalized.push(nt);
  }

  // 确保输出目录存在
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(normalized, null, 2), 'utf8');
  console.log(`[normalize-tours] 标准化输出 ${normalized.length} 条 -> ${outPath}`);
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error('[normalize-tours] 失败:', err && err.stack ? err.stack : err);
    process.exit(1);
  }
}


