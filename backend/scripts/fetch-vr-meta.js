#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { fetch } = require('undici');
const cheerio = require('cheerio');

function resolveRepoRoot() {
  const scriptDir = __dirname;
  return path.resolve(scriptDir, '..', '..');
}

function pickFirst(...values) {
  for (const v of values) {
    if (v && typeof v === 'string' && v.trim().length > 0) return v.trim();
  }
  return null;
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; RealseeDiscoverBot/1.0; +https://example.com/bot)'
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  const text = await res.text();
  return text;
}

function parseHead(html) {
  const $ = cheerio.load(html);
  const titleTag = $('head > title').first().text();
  const meta = (name, attr = 'property') => {
    const sel = `meta[${attr}="${name}"]`;
    const el = $(sel).attr('content');
    return el || null;
  };
  const nameMeta = (name) => meta(name, 'name');

  const ogTitle = meta('og:title');
  const ogDesc = meta('og:description');
  const ogImage = meta('og:image');
  const twTitle = nameMeta('twitter:title');
  const twDesc = nameMeta('twitter:description');
  const twImage = nameMeta('twitter:image');

  return {
    title: pickFirst(ogTitle, twTitle, titleTag),
    description: pickFirst(ogDesc, twDesc),
    cover: pickFirst(ogImage, twImage),
  };
}

async function main() {
  const repoRoot = resolveRepoRoot();
  const dataPath = path.join(repoRoot, 'data', 'carousel.json');
  if (!fs.existsSync(dataPath)) {
    console.error('[fetch-vr-meta] 找不到文件:', dataPath);
    process.exit(1);
  }
  const raw = fs.readFileSync(dataPath, 'utf8');
  let items = JSON.parse(raw);

  let success = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const url = item.url;
    if (!url) continue;
    try {
      const html = await fetchHtml(url);
      const meta = parseHead(html);
      if (meta.title) item.title = meta.title;
      if (meta.description) item.description = meta.description;
      if (meta.cover) item.cover = meta.cover;
      success += 1;
      console.log(`[fetch-vr-meta] OK ${i + 1}/${items.length}: ${url}`);
    } catch (e) {
      console.warn(`[fetch-vr-meta] FAIL ${i + 1}/${items.length}: ${url} -> ${e.message}`);
    }
  }

  fs.writeFileSync(dataPath, JSON.stringify(items, null, 2), 'utf8');
  console.log(`[fetch-vr-meta] 完成，成功 ${success}/${items.length}`);
}

if (require.main === module) {
  main().catch((err) => {
    console.error('[fetch-vr-meta] 失败:', err && err.stack ? err.stack : err);
    process.exit(1);
  });
}
