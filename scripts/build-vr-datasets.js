#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { fetch } = require('undici');
const cheerio = require('cheerio');

function repoRoot() {
  return path.resolve(__dirname, '..');
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJSON(p, data) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
}

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function fetchHtml(url, timeoutMs = 12000) {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: ctrl.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RealseeDiscoverBot/1.0)'
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(to);
  }
}

function parseHead(html) {
  const $ = cheerio.load(html);
  const pick = (...vals) => vals.find((v) => v && typeof v === 'string' && v.trim()) || null;
  const mProp = (name) => $(`meta[property="${name}"]`).attr('content');
  const mName = (name) => $(`meta[name="${name}"]`).attr('content');
  const title = $('head > title').first().text();
  const ogTitle = mProp('og:title');
  const ogDesc = mProp('og:description');
  const ogImage = mProp('og:image');
  const twTitle = mName('twitter:title');
  const twDesc = mName('twitter:description');
  const twImage = mName('twitter:image');
  return {
    title: pick(ogTitle, twTitle, title),
    description: pick(ogDesc, twDesc),
    cover: pick(ogImage, twImage),
  };
}

async function enrichVrMeta(vrList) {
  if (!process.env.ENRICH_VR_META || process.env.ENRICH_VR_META === '0') return vrList;
  const need = vrList.filter((v) => !v.title || !v.description || !v.cover);
  if (need.length === 0) return vrList;

  const concurrency = Number(process.env.ENRICH_CONCURRENCY || 6);
  let idx = 0; let ok = 0; let fail = 0;
  async function worker() {
    while (true) {
      const i = idx++;
      if (i >= need.length) break;
      const v = need[i];
      try {
        const html = await fetchHtml(v.url);
        const meta = parseHead(html);
        if (meta.title && !v.title) v.title = meta.title;
        if (meta.description && !v.description) v.description = meta.description;
        if (meta.cover && !v.cover) v.cover = meta.cover;
        ok++;
      } catch (_) {
        fail++;
      }
    }
  }
  const workers = Array.from({ length: Math.min(concurrency, need.length) }, () => worker());
  await Promise.all(workers);
  console.log(`[build-vr-datasets] meta enriched ok=${ok} fail=${fail}`);
  return vrList;
}

function sanitizeCoverUrl(url) {
  try {
    const u = new URL(url);
    // 移除所有查询参数，拿原图
    u.search = '';
    return u.toString();
  } catch (_) {
    return url;
  }
}

function extFromPath(p) {
  const e = path.extname(p).toLowerCase();
  if (e === '.jpg' || e === '.jpeg' || e === '.png' || e === '.webp') return e;
  return '.jpg';
}

async function downloadBuffer(url, timeoutMs = 20000) {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal, redirect: 'follow' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const ab = await res.arrayBuffer();
    return Buffer.from(ab);
  } finally {
    clearTimeout(to);
  }
}

async function main() {
  const root = repoRoot();
  const dataDir = path.join(root, 'data');
  const frontendDataDir = path.join(root, 'frontend', 'src', 'data');

  const tours = readJSON(path.join(dataDir, 'tours.json'));
  const photographers = readJSON(path.join(dataDir, 'photographers.json'));
  // 轮播输入：优先旧文件，若缺失则用新 carousels.json
  let carousels = [];
  const legacyCarouselPath = path.join(frontendDataDir, 'carousel.json');
  const newCarouselsPath = path.join(frontendDataDir, 'carousels.json');
  if (fs.existsSync(legacyCarouselPath)) {
    carousels = readJSON(legacyCarouselPath);
  } else if (fs.existsSync(newCarouselsPath)) {
    const arr = readJSON(newCarouselsPath);
    carousels = arr.map((c) => ({ id: c.vrId, imagePath: c.imagePath }));
  } else {
    carousels = [];
  }

  // 摄影师规范表（合并姓名去重，仅保留 vrIds 关联）先构建，便于 VR 关联 author id
  const photographerMap = new Map();
  for (const p of photographers) {
    const key = (p.name || '').trim();
    if (!key) continue;
    const rec = photographerMap.get(key) || {
      id: p.id,
      name: key,
      shortBio: p.shortBio || '',
      aboutTheCreator: p.aboutTheCreator || '',
      Location: p.Location || '',
      Website: p.Website || '',
      email: p.email || '',
      CountryTag: p.CountryTag || '',
      CityTag: p.CityTag || '',
      vrIds: [],
    };
    const ids = new Set(rec.vrIds);
    for (const v of (p.VrLinks || [])) if (v && v.id) ids.add(v.id);
    rec.vrIds = Array.from(ids);
    // 若多条同名，优先保留已有非空字段
    rec.shortBio = rec.shortBio || p.shortBio || '';
    rec.aboutTheCreator = rec.aboutTheCreator || p.aboutTheCreator || '';
    rec.Location = rec.Location || p.Location || '';
    rec.Website = rec.Website || p.Website || '';
    rec.email = rec.email || p.email || '';
    rec.CountryTag = rec.CountryTag || p.CountryTag || '';
    rec.CityTag = rec.CityTag || p.CityTag || '';
    photographerMap.set(key, rec);
  }
  const photographersTable = Array.from(photographerMap.values()).map((r, idx) => ({
    ...r,
    id: idx + 1,
  }));

  const nameToId = new Map(photographersTable.map((p) => [p.name, p.id]));

  // VR 基础集合（去重合并），author 为摄影师 id（若存在）
  const vrMap = new Map();
  const push = (r, authorName) => {
    if (!r || !r.id) return;
    const prev = vrMap.get(r.id) || {};
    const chosenAuthor = prev.author ?? (authorName && nameToId.get(authorName)) ?? null;
    vrMap.set(r.id, {
      id: r.id,
      url: r.url || `https://realsee.ai/${r.id}`,
      category: r.category ?? prev.category ?? null,
      shortCategory: r.shortCategory || prev.shortCategory || 'unknown',
      device: r.device ?? prev.device ?? null,
      title: r.title ?? prev.title ?? null,
      description: r.description ?? prev.description ?? null,
      cover: r.cover ?? prev.cover ?? null,
      author: chosenAuthor,
    });
  };
  for (const t of tours) push(t);
  for (const p of photographers) for (const v of (p.VrLinks || [])) push(v, p.name);
  for (const c of carousels) push(c);

  const vr = Array.from(vrMap.values());
  await enrichVrMeta(vr);

  // 标签集合（category/device）
  const tagSet = new Map();
  for (const v of vr) {
    if (v.category) {
      const id = `category:${slugify(v.shortCategory || v.category)}`;
      if (!tagSet.has(id)) tagSet.set(id, { id, type: 'category', label: v.category });
    }
    if (v.device) {
      const id = `device:${slugify(v.device)}`;
      if (!tagSet.has(id)) tagSet.set(id, { id, type: 'device', label: v.device });
    }
  }
  const vrTags = Array.from(tagSet.values());

  // 设备集合（去重，仅来自 device 字段）
  const deviceSet = new Set(vr.map((v) => v.device).filter(Boolean));
  const vrDevices = Array.from(deviceSet).sort().map((d) => ({ id: slugify(d), name: d }));

  // 基于 VR 表重建 carousels：
  // 1) 优先使用 tours.json 中 carousel=true 的顺序
  // 2) 若为空，回退旧的 carousel.json 的顺序
  // 3) 仅保留在 VR 表中存在的条目
  const carouselIdsFromTours = tours.filter((t) => t.carousel === true).map((t) => t.id);
  const imagePathById = new Map();
  for (const c of carousels) {
    if (c && c.id && c.imagePath) imagePathById.set(c.id, c.imagePath);
  }
  const chosenIds = (carouselIdsFromTours.length > 0 ? carouselIdsFromTours : carousels.map((c) => c.id)).filter((id) => vrMap.has(id));
  const carouselsOut = chosenIds.map((id, idx) => {
    const entry = { vrId: id, order: idx };
    const img = imagePathById.get(id);
    if (img) {
      entry.imagePath = img;
      if (typeof img === 'string' && img.startsWith('/carousel/')) {
        entry.assetPath = `@carousel/${img.slice('/carousel/'.length)}`;
      }
    }
    return entry;
  });

  // 下载 cover 到 frontend/public/cover 并补充 assetCover 路径
  const coverOutDir = path.join(frontendDataDir, '..', '..', 'public', 'cover');
  ensureDir(coverOutDir);
  if (process.env.DOWNLOAD_VR_COVER === '1') {
    let okC = 0, failC = 0;
    for (const v of vr) {
      if (!v.cover) continue;
      try {
        const raw = sanitizeCoverUrl(v.cover);
        const ext = extFromPath(raw);
        const file = path.join(coverOutDir, `${v.id}${ext}`);
        if (!fs.existsSync(file)) {
          const buf = await downloadBuffer(raw);
          fs.writeFileSync(file, buf);
        }
        v.remoteCover = v.cover;
        v.cover = `@cover/${v.id}${ext}`;
        v.assetCover = v.cover;
        okC++;
      } catch (_) {
        failC++;
      }
    }
    console.log(`[build-vr-datasets] cover downloaded ok=${okC} fail=${failC}`);
  }

  // 输出
  writeJSON(path.join(frontendDataDir, 'vr.json'), vr);
  writeJSON(path.join(frontendDataDir, 'vr-tags.json'), vrTags);
  writeJSON(path.join(frontendDataDir, 'vr-devices.json'), vrDevices);
  writeJSON(path.join(frontendDataDir, 'photographers.json'), photographersTable);
  writeJSON(path.join(frontendDataDir, 'carousels.json'), carouselsOut);

  console.log(`[build-vr-datasets] vr: ${vr.length}, tags: ${vrTags.length}, devices: ${vrDevices.length}, photographers: ${photographersTable.length}, carousels: ${carouselsOut.length}`);
}

if (require.main === module) {
  main().catch((err) => {
    console.error('[build-vr-datasets] 失败:', err && err.stack ? err.stack : err);
    process.exit(1);
  });
}


