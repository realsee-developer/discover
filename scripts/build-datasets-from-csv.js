#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { fetch } = require('undici');
const cheerio = require('cheerio');

const CATEGORY_SHORTCUTS = {
  'restaurant': 'restaurant',
  'aerial 3d': 'aerial',
  'aerial': 'aerial',
  'church': 'church',
  'residential': 'residential',
  'retail': 'retail',
  'museum': 'museum',
  'office': 'office',
  'hotel': 'hotel',
  'outdoor': 'outdoor',
  'outside': 'outside',
  'gym': 'gym',
  'exhibition': 'exhibition',
  'exibition': 'exhibition',
  'construction': 'construction',
  'industrial': 'industrial',
  'campus': 'campus',
  'tourism': 'tourism',
  'car': 'car',
  'clinic': 'clinic',
  'showroom': 'showroom',
  'school': 'school',
  'rv': 'rv',
  'village hall': 'village-hall',
  'village-hall': 'village-hall',
  'studio': 'studio',
  'office ': 'office',
};

const TRUE_FLAGS = new Set(['1', 'true', 'yes', 'y', '是', 'on']);
const COVER_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

function repoRoot() {
  return path.resolve(__dirname, '..');
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    const text = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(text);
  } catch (error) {
    console.warn(`[build-datasets-from-csv] 读取 JSON 失败: ${filePath}`, error.message);
    return null;
  }
}

function writeJson(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function toAscii(input) {
  return String(input || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
    .replace(/\u00a0/g, ' ');
}

function slugify(value) {
  const base = toAscii(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  return base || 'item';
}

function cleanValue(value, { multiline = false } = {}) {
  if (value == null) return '';
  let str = String(value).replace(/\r\n/g, '\n').replace(/\u00a0/g, ' ');
  if (!multiline) {
    str = str.replace(/\s+/g, ' ');
  }
  str = str.trim();
  if (!str) return '';
  str = toAscii(str);
  const lower = str.toLowerCase();
  if (lower.includes('待补充') || lower === 'tbd' || lower === 'pending') return '';
  if (str === '/' || str === '-' || str === '--') return '';
  return multiline ? str : str.trim();
}

function sanitizeUrl(value) {
  const cleaned = cleanValue(value, { multiline: false });
  if (!cleaned) return '';
  const match = cleaned.match(/https?:\/\/[^\s"'，。,；;（）()<>]+/i);
  let candidate = match ? match[0] : cleaned;
  candidate = candidate.replace(/[()（）]+$/g, '').replace(/[，。,；;]+$/g, '').trim();
  if (!candidate) return '';
  if (/^https?:\/\//i.test(candidate)) return candidate;
  if (candidate.toLowerCase().startsWith('mailto:')) return candidate;
  if (candidate.startsWith('www.')) return `https://${candidate}`;
  return candidate;
}

function normalizeEmail(value) {
  const cleaned = cleanValue(value);
  if (!cleaned) return '';
  let email = cleaned;
  if (email.toLowerCase().startsWith('mailto:')) email = email.slice(7);
  return email.trim().toLowerCase();
}

function guessPlatformFromUrl(url) {
  if (!url) return null;
  const lower = url.toLowerCase();
  if (lower.includes('instagram.com')) return 'instagram';
  if (lower.includes('linkedin.com')) return 'linkedin';
  if (lower.includes('facebook.com')) return 'facebook';
  if (lower.includes('vimeo.com')) return 'vimeo';
  if (lower.includes('youtu')) return 'youtube';
  if (lower.includes('twitter.com') || lower.includes('x.com')) return 'twitter';
  if (lower.includes('tiktok.com')) return 'tiktok';
  if (lower.includes('weibo.com')) return 'weibo';
  if (lower.includes('zhihu.com')) return 'zhihu';
  if (lower.includes('bilibili.com')) return 'bilibili';
  return null;
}

function normalizeSocialPlatform(label, url) {
  const lower = (label || '').toLowerCase();
  if (lower.includes('linkedin')) return 'linkedin';
  if (lower.includes('instagram')) return 'instagram';
  if (lower.includes('facebook')) return 'facebook';
  if (lower.includes('vimeo')) return 'vimeo';
  if (lower.includes('youtube')) return 'youtube';
  if (lower === 'x' || lower.includes('twitter')) return 'twitter';
  if (lower.includes('tiktok')) return 'tiktok';
  if (lower.includes('weibo')) return 'weibo';
  if (lower.includes('zhihu')) return 'zhihu';
  if (lower.includes('bilibili')) return 'bilibili';
  return guessPlatformFromUrl(url);
}

function parseSocialMedia(value) {
  const cleaned = cleanValue(value, { multiline: true });
  if (!cleaned) return {};
  const segments = cleaned
    .split(/[\n;,，；]+/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  const result = {};
  for (const segment of segments) {
    let platform = '';
    let rest = segment;
    const match = segment.match(/^(.*?)\s*[:：\-]\s*(.+)$/);
    if (match) {
      platform = match[1].trim();
      rest = match[2].trim();
    }
    const entry = sanitizeUrl(rest) || cleanValue(rest, { multiline: false });
    if (!entry) continue;
    const key = normalizeSocialPlatform(platform, entry);
    if (!key) continue;
    if (!result[key]) result[key] = entry;
  }
  return result;
}

function extractVrId(rawUrl) {
  const sanitized = sanitizeUrl(rawUrl);
  if (!sanitized) return null;
  const direct = sanitized.match(/realsee\.(?:ai|jp)\/([A-Za-z0-9]+)/i);
  if (direct) return direct[1];
  const fallback = sanitized.match(/([A-Za-z0-9]{6,})$/);
  if (fallback) return fallback[1];
  return null;
}

function toShortCategory(category) {
  if (!category) return 'unknown';
  const key = category.trim().toLowerCase();
  return CATEGORY_SHORTCUTS[key] || slugify(category);
}

function boolFromFlag(value) {
  const cleaned = cleanValue(value);
  if (!cleaned) return false;
  return TRUE_FLAGS.has(cleaned.trim().toLowerCase());
}

function createProfessional(name) {
  return {
    name,
    slug: slugify(name),
    shortBio: '',
    aboutTheCreator: '',
    Location: '',
    Website: '',
    email: '',
    CountryTag: '',
    CityTag: '',
    profile: '',
    blogArticle: '',
    behindScenesVideo: '',
    linkedin: '',
    instagram: '',
    facebook: '',
    vimeo: '',
    youtube: '',
    twitter: '',
    tiktok: '',
    weibo: '',
    zhihu: '',
    bilibili: '',
    vrIds: [],
    _vrIdSet: new Set(),
  };
}

function assignIfEmpty(target, key, value) {
  if (!value) return;
  if (!target[key]) target[key] = value;
}

function parseProfessionals(csvPath) {
  const text = fs.readFileSync(csvPath, 'utf8');
  const rows = parse(text, {
    columns: true,
    skip_empty_lines: false,
    relax_column_count: true,
  });

  const professionalsMap = new Map();
  const professionalOrder = [];
  const vrCandidates = [];
  let currentName = '';

  for (const row of rows) {
    const rawName = cleanValue(row['所属用户']);
    if (rawName) currentName = rawName;
    const name = currentName;

    const vrUrl = sanitizeUrl(row['Showcase Link']);
    const vrId = extractVrId(vrUrl);
    const hasData = name || vrId;
    if (!hasData) continue;

    if (!name) {
      console.warn('[build-datasets-from-csv] 行缺少所属用户但包含 VR，已跳过');
      continue;
    }

    let professional = professionalsMap.get(name);
    if (!professional) {
      professional = createProfessional(name);
      professionalsMap.set(name, professional);
      professionalOrder.push(professional);
    }

    assignIfEmpty(professional, 'profile', sanitizeUrl(row['Profile']));
    assignIfEmpty(professional, 'shortBio', cleanValue(row['Short Bio']));
    assignIfEmpty(
      professional,
      'aboutTheCreator',
      cleanValue(row['About the Creator'], { multiline: true }),
    );
    assignIfEmpty(professional, 'Location', cleanValue(row['Location']));
    assignIfEmpty(professional, 'Website', sanitizeUrl(row['Website']));
    assignIfEmpty(
      professional,
      'behindScenesVideo',
      sanitizeUrl(row['Behind the Scenes 视频（YouTube链接）']),
    );
    assignIfEmpty(professional, 'blogArticle', sanitizeUrl(row['合作Blog']));
    assignIfEmpty(professional, 'email', normalizeEmail(row['邮箱（主页不显示）']));
    assignIfEmpty(professional, 'CountryTag', cleanValue(row['CountryTag'] || row['国家标签']));
    assignIfEmpty(professional, 'CityTag', cleanValue(row['CityTag'] || row['城市标签']));

    const socials = parseSocialMedia(row['Social Media']);
    const socialKeys = [
      'linkedin',
      'instagram',
      'facebook',
      'vimeo',
      'youtube',
      'twitter',
      'tiktok',
      'weibo',
      'zhihu',
      'bilibili',
    ];
    for (const key of socialKeys) {
      if (socials[key]) assignIfEmpty(professional, key, socials[key]);
    }

    if (vrId) {
      if (!professional._vrIdSet.has(vrId)) {
        professional._vrIdSet.add(vrId);
        professional.vrIds.push(vrId);
      }
      const category = cleanValue(row['空间类型标签']);
      const device = cleanValue(row['拍摄设备']);
      vrCandidates.push({
        id: vrId,
        url: vrUrl || `https://realsee.ai/${vrId}`,
        category: category || null,
        device: device || null,
        shortCategory: category ? toShortCategory(category) : 'unknown',
        authorName: name,
        source: 'professionals',
      });
    }
  }

  const professionals = professionalOrder.map((prof, index) => {
    delete prof._vrIdSet;
    const output = {
      id: index + 1,
      name: prof.name,
      slug: prof.slug,
      shortBio: prof.shortBio,
      aboutTheCreator: prof.aboutTheCreator,
      Location: prof.Location,
      Website: prof.Website,
      email: prof.email,
      CountryTag: prof.CountryTag,
      CityTag: prof.CityTag,
      vrIds: prof.vrIds,
    };
    const optionalKeys = [
      'profile',
      'blogArticle',
      'behindScenesVideo',
      'linkedin',
      'instagram',
      'facebook',
      'vimeo',
      'youtube',
      'twitter',
      'tiktok',
      'weibo',
      'zhihu',
      'bilibili',
    ];
    for (const key of optionalKeys) {
      if (prof[key]) output[key] = prof[key];
    }
    return output;
  });

  return { professionals, vrCandidates };
}

function parseTours(csvPath) {
  const text = fs.readFileSync(csvPath, 'utf8');
  const rows = parse(text, {
    columns: true,
    skip_empty_lines: false,
    relax_column_count: true,
  });

  const vrCandidates = [];
  const carouselIds = [];
  const carouselSet = new Set();

  for (const row of rows) {
    const url = sanitizeUrl(row['Showcase Link']);
    const vrId = extractVrId(url);
    if (!vrId) continue;

    const category = cleanValue(row['空间类型标签']);
    const device = cleanValue(row['拍摄设备']);
    const shortCategory = category ? toShortCategory(category) : 'unknown';
    const isCarousel = boolFromFlag(row['是否carousel']);

    vrCandidates.push({
      id: vrId,
      url: url || `https://realsee.ai/${vrId}`,
      category: category || null,
      device: device || null,
      shortCategory,
      authorName: null,
      source: 'tours',
    });

    if (isCarousel && !carouselSet.has(vrId)) {
      carouselSet.add(vrId);
      carouselIds.push(vrId);
    }
  }

  return { vrCandidates, carouselIds };
}

function loadExistingVrMeta(frontendDataDir) {
  const existing = readJsonIfExists(path.join(frontendDataDir, 'vr.json'));
  if (!Array.isArray(existing)) return new Map();
  const map = new Map();
  for (const item of existing) {
    if (!item || !item.id) continue;
    map.set(item.id, item);
  }
  return map;
}

function loadExistingCarousels(frontendDataDir) {
  const existing = readJsonIfExists(path.join(frontendDataDir, 'carousels.json'));
  if (!Array.isArray(existing)) return { list: [], map: new Map() };
  const map = new Map();
  for (const item of existing) {
    if (!item || !item.vrId) continue;
    if (item.imagePath) map.set(item.vrId, item.imagePath);
  }
  return { list: existing, map };
}

function mergeVrCandidate(vrMap, candidate) {
  if (!candidate || !candidate.id) return;
  const prev = vrMap.get(candidate.id) || {};
  const merged = { ...prev };
  merged.id = candidate.id;
  merged.url = candidate.url || prev.url || `https://realsee.ai/${candidate.id}`;
  if (candidate.category) merged.category = candidate.category;
  if (candidate.device) merged.device = candidate.device;
  if (candidate.authorName) merged.authorName = candidate.authorName;
  if (candidate.shortCategory && candidate.shortCategory !== 'unknown') {
    merged.shortCategory = candidate.shortCategory;
  } else if (!merged.shortCategory && merged.category) {
    merged.shortCategory = toShortCategory(merged.category);
  }
  if (hasCandidateMeta(candidate)) {
    if (candidate.title) merged.title = candidate.title;
    if (candidate.description) merged.description = candidate.description;
    if (candidate.cover) merged.cover = candidate.cover;
    if (candidate.assetCover) merged.assetCover = candidate.assetCover;
    if (candidate.remoteCover) merged.remoteCover = candidate.remoteCover;
  }
  if (candidate.cover && candidate.cover.startsWith('/cover/')) {
    merged.assetCover = candidate.cover;
  }
  vrMap.set(candidate.id, merged);
}

function detectCarouselImage(root, vrId) {
  const publicDir = path.join(root, 'frontend', 'public', 'carousel');
  const dataDir = path.join(root, 'data', 'carousel');
  const exts = ['.jpg', '.jpeg', '.png', '.webp'];
  for (const dir of [publicDir, dataDir]) {
    for (const ext of exts) {
      const candidate = path.join(dir, `${vrId}${ext}`);
      if (fs.existsSync(candidate)) {
        if (dir === publicDir) return `/carousel/${vrId}${ext}`;
        return `/carousel/${vrId}${ext}`;
      }
    }
  }
  return '';
}

function buildCarousels(root, existingCarousels, carouselIds) {
  const ids = [];
  const seen = new Set();
  for (const id of carouselIds) {
    if (!id || seen.has(id)) continue;
    seen.add(id);
    ids.push(id);
  }
  const fallback = ids.length > 0 ? ids : existingCarousels.list.map((item) => item.vrId).filter(Boolean);
  const resolved = [];
  for (let index = 0; index < fallback.length; index++) {
    const vrId = fallback[index];
    if (!vrId) continue;
    const entry = { vrId, order: index };
    const existingPath = existingCarousels.map.get(vrId);
    const imagePath = existingPath || detectCarouselImage(root, vrId);
    if (imagePath) entry.imagePath = imagePath;
    resolved.push(entry);
  }
  return resolved;
}

function buildTags(vrList) {
  const tagMap = new Map();
  const deviceMap = new Map();
  for (const item of vrList) {
    if (!item || !item.id) continue;
    if (item.category) {
      const short = toShortCategory(item.category);
      const tagId = `category:${short}`;
      if (!tagMap.has(tagId)) {
        tagMap.set(tagId, { id: tagId, type: 'category', label: item.category });
      }
    }
    if (item.device) {
      const deviceId = slugify(item.device);
      const tagId = `device:${deviceId}`;
      if (!deviceMap.has(deviceId)) deviceMap.set(deviceId, item.device);
      if (!tagMap.has(tagId)) {
        tagMap.set(tagId, { id: tagId, type: 'device', label: item.device });
      }
    }
  }
  const tags = Array.from(tagMap.values()).sort((a, b) => a.id.localeCompare(b.id));
  const devices = Array.from(deviceMap.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.id.localeCompare(b.id));
  return { tags, devices };
}

function finalizeVrList(vrMap, professionals) {
  const nameToId = new Map(professionals.map((p) => [p.name, p.id]));
  const result = [];
  for (const [id, entry] of vrMap.entries()) {
    const category = entry.category || null;
    const shortCategory = entry.shortCategory || (category ? toShortCategory(category) : 'unknown');
    const device = entry.device || null;
    const author = entry.authorName ? nameToId.get(entry.authorName) || null : null;
    result.push({
      id,
      url: entry.url || `https://realsee.ai/${id}`,
      category,
      shortCategory,
      device,
      title: entry.title || null,
      description: entry.description || null,
      cover: entry.cover || null,
      author,
      remoteCover: entry.remoteCover || null,
      assetCover: entry.assetCover || (entry.cover && entry.cover.startsWith('@') ? entry.cover : null),
    });
  }
  result.sort((a, b) => a.id.localeCompare(b.id));
  return result;
}

function hasReadableMeta(vr) {
  if (!vr) return false;
  const title = typeof vr.title === 'string' ? vr.title.trim() : '';
  const cover = typeof vr.cover === 'string' ? vr.cover.trim() : '';
  const assetCover = typeof vr.assetCover === 'string' ? vr.assetCover.trim() : '';
  const remoteCover = typeof vr.remoteCover === 'string' ? vr.remoteCover.trim() : '';
  return Boolean(title && (cover || assetCover || remoteCover));
}

function hasCandidateMeta(candidate) {
  if (!candidate) return false;
  if (candidate.category) return true;
  if (candidate.device) return true;
  if (candidate.title) return true;
  if (candidate.description) return true;
  if (candidate.cover) return true;
  if (candidate.assetCover) return true;
  if (candidate.remoteCover) return true;
  return false;
}

function removeExistingCovers(dir, id) {
  for (const ext of COVER_EXTENSIONS) {
    const file = path.join(dir, `${id}${ext}`);
    if (fs.existsSync(file)) {
      try {
        fs.unlinkSync(file);
      } catch (error) {
        console.warn(`[build-datasets-from-csv] 删除旧封面失败 ${file}: ${error.message}`);
      }
    }
  }
}

function inferCoverExtension(url, contentType) {
  if (contentType) {
    const lower = contentType.toLowerCase();
    if (lower.includes('png')) return '.png';
    if (lower.includes('webp')) return '.webp';
    if (lower.includes('jpeg') || lower.includes('jpg')) return '.jpg';
  }
  if (url) {
    try {
      const parsed = new URL(url);
      const ext = path.extname(parsed.pathname).toLowerCase();
      if (COVER_EXTENSIONS.includes(ext)) return ext;
      if (ext === '.jfif') return '.jpg';
    } catch (error) {
      // ignore invalid URL
    }
  }
  return '.jpg';
}

function describeMetaState(vr) {
  return {
    id: vr.id,
    hasTitle: Boolean(vr.title && String(vr.title).trim()),
    hasCover: Boolean(vr.cover && String(vr.cover).trim()),
    hasAssetCover: Boolean(vr.assetCover && String(vr.assetCover).trim()),
    hasRemoteCover: Boolean(vr.remoteCover && String(vr.remoteCover).trim()),
  };
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; RealseeDiscoverBot/1.0; +https://discover.realsee.ai)',
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return res.text();
}

function parseHead(html) {
  const $ = cheerio.load(html);
  const pick = (...values) => {
    for (const value of values) {
      if (value && typeof value === 'string' && value.trim()) return value.trim();
    }
    return null;
  };

  const select = (name, attr = 'property') => {
    const el = $(`meta[${attr}="${name}"]`).attr('content');
    return el || null;
  };

  const nameMeta = (name) => select(name, 'name');
  const ogTitle = select('og:title');
  const ogDesc = select('og:description');
  const ogImage = select('og:image');
  const twTitle = nameMeta('twitter:title');
  const twDesc = nameMeta('twitter:description');
  const twImage = nameMeta('twitter:image');

  return {
    title: pick(ogTitle, twTitle, $('head > title').first().text()),
    description: pick(ogDesc, twDesc),
    cover: pick(ogImage, twImage),
  };
}

async function fetchVrMetaWithCache(vrList, vrMap, cacheDir, coverOutputDir) {
  ensureDir(cacheDir);
  ensureDir(coverOutputDir);
  const summary = { fetched: 0, cached: 0, failed: 0, missing: [], downloaded: 0, downloadFailed: 0 };

  for (const vr of vrList) {
    if (!vr || !vr.id || !vr.url) continue;
    const cachePath = path.join(cacheDir, `${vr.id}.json`);
    let meta = null;

    if (fs.existsSync(cachePath)) {
      try {
        meta = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
        summary.cached += 1;
      } catch (error) {
        console.warn(`[build-datasets-from-csv] 读取缓存失败 ${vr.id}: ${error.message}`);
      }
    }

    if (!meta) {
      try {
        const html = await fetchHtml(vr.url);
        meta = parseHead(html);
        summary.fetched += 1;
        fs.writeFileSync(cachePath, JSON.stringify(meta, null, 2), 'utf8');
      } catch (error) {
        summary.failed += 1;
        console.warn(`[build-datasets-from-csv] 获取 VR 元数据失败 ${vr.id}: ${error.message}`);
      }
    }

    if (!meta) {
      summary.missing.push({ id: vr.id, reason: 'fetch-failed' });
      continue;
    }
    const prev = vrMap.get(vr.id) || {};
    const merged = { ...prev };
    if (!merged.title && meta.title) merged.title = meta.title;
    if (!merged.description && meta.description) merged.description = meta.description;
    if (!merged.cover && meta.cover) {
      merged.remoteCover = meta.cover;
    }

    if (meta.cover) {
      const coverUrl = meta.cover.trim();
      removeExistingCovers(coverOutputDir, vr.id);
      try {
        const response = await fetch(coverUrl, { redirect: 'follow' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const contentType = response.headers.get('content-type');
        const ext = inferCoverExtension(coverUrl, contentType);
        const outputPath = path.join(coverOutputDir, `${vr.id}${ext}`);
        fs.writeFileSync(outputPath, buffer);
        merged.cover = `/cover/${vr.id}${ext}`;
        merged.assetCover = merged.cover;
        summary.downloaded += 1;
      } catch (error) {
        summary.downloadFailed += 1;
        console.warn(`[build-datasets-from-csv] 下载封面失败 ${vr.id}: ${error.message}`);
      }
    }

    vrMap.set(vr.id, merged);

    const state = describeMetaState(merged);
    if (!state.hasTitle || (!state.hasCover && !state.hasAssetCover && !state.hasRemoteCover)) {
      summary.missing.push({ id: vr.id, reason: 'no-visible-meta', state });
    }
  }

  return summary;
}

async function main() {
  const root = repoRoot();
  const dataDir = path.join(root, 'data');
  const frontendDataDir = path.join(root, 'frontend', 'src', 'data');
  const cacheDir = path.join(dataDir, '.vr-meta-cache');
  const coverOutputDir = path.join(root, 'frontend', 'public', 'cover');

  const professionalsCsvPath = process.env.PROFESSIONALS_CSV_PATH
    ? path.resolve(process.env.PROFESSIONALS_CSV_PATH)
    : path.join(dataDir, 'professionals.csv');
  const toursCsvPath = process.env.TOURS_CSV_PATH
    ? path.resolve(process.env.TOURS_CSV_PATH)
    : path.join(dataDir, 'tours.csv');

  if (!fs.existsSync(professionalsCsvPath)) {
    console.error(`[build-datasets-from-csv] 找不到 professionals CSV: ${professionalsCsvPath}`);
    process.exit(1);
  }
  if (!fs.existsSync(toursCsvPath)) {
    console.error(`[build-datasets-from-csv] 找不到 tours CSV: ${toursCsvPath}`);
    process.exit(1);
  }

  const existingVrMeta = loadExistingVrMeta(frontendDataDir);
  const existingCarousels = loadExistingCarousels(frontendDataDir);
  const { professionals: parsedProfessionals, vrCandidates: professionalVrCandidates } = parseProfessionals(
    professionalsCsvPath,
  );
  let professionals = parsedProfessionals;
  const { vrCandidates: tourVrCandidates, carouselIds } = parseTours(toursCsvPath);

  const vrMap = new Map();
  for (const [id, meta] of existingVrMeta.entries()) {
    vrMap.set(id, {
      id,
      url: meta.url || `https://realsee.ai/${id}`,
      category: meta.category || null,
      shortCategory: meta.shortCategory || (meta.category ? toShortCategory(meta.category) : 'unknown'),
      device: meta.device || null,
      authorName: null,
      title: meta.title || null,
      description: meta.description || null,
      cover: meta.cover || null,
      assetCover: meta.assetCover || null,
      remoteCover: meta.remoteCover || null,
    });
  }

  for (const candidate of professionalVrCandidates) mergeVrCandidate(vrMap, candidate);
  for (const candidate of tourVrCandidates) mergeVrCandidate(vrMap, candidate);

  const fetchTargets = Array.from(vrMap.values()).map((entry) => ({
    id: entry.id,
    url: entry.url || `https://realsee.ai/${entry.id}`,
  }));

  const metaSummary = await fetchVrMetaWithCache(fetchTargets, vrMap, cacheDir, coverOutputDir);

  const rawVrList = finalizeVrList(vrMap, professionals);

  let vrList = rawVrList;
  let removedVrIds = new Set();
  let removedCount = 0;

  if (existingVrMeta.size > 0) {
    removedVrIds = new Set(
      rawVrList.filter((item) => !hasReadableMeta(item) && !existingVrMeta.has(item.id)).map((item) => item.id),
    );
    vrList = rawVrList.filter((item) => !removedVrIds.has(item.id));
    removedCount = removedVrIds.size;

    if (removedVrIds.size > 0) {
      const filteredProfessionals = professionals.map((prof) => {
        const filteredVrIds = prof.vrIds.filter((id) => !removedVrIds.has(id));
        return { ...prof, vrIds: filteredVrIds };
      });
      professionals = filteredProfessionals;
    }
  }

  const { tags: vrTags, devices: vrDevices } = buildTags(vrList);
  const filteredCarouselIds = existingVrMeta.size > 0
    ? carouselIds.filter((id) => !removedVrIds.has(id))
    : carouselIds;
  const carousels = buildCarousels(root, existingCarousels, filteredCarouselIds);

  writeJson(path.join(frontendDataDir, 'professionals.json'), professionals);
  writeJson(path.join(frontendDataDir, 'vr.json'), vrList);
  writeJson(path.join(frontendDataDir, 'vr-tags.json'), vrTags);
  writeJson(path.join(frontendDataDir, 'vr-devices.json'), vrDevices);
  writeJson(path.join(frontendDataDir, 'carousels.json'), carousels);

  const message = `[build-datasets-from-csv] professionals=${professionals.length}, vr=${vrList.length}, tags=${vrTags.length}, devices=${vrDevices.length}, carousels=${carousels.length}, meta:fetched=${metaSummary.fetched}, meta:cached=${metaSummary.cached}, meta:failed=${metaSummary.failed}, meta:missing=${metaSummary.missing.length}, cover:downloaded=${metaSummary.downloaded}, cover:failed=${metaSummary.downloadFailed}`;
  if (existingVrMeta.size > 0 && removedCount > 0) {
    console.log(`${message}, removed=${removedCount}`);
  } else {
    console.log(message);
  }

  if (metaSummary.missing.length > 0) {
    const reportPath = path.join(dataDir, 'build-datasets-report.json');
    const payload = {
      timestamp: new Date().toISOString(),
      metaSummary,
      removedVrIds: Array.from(removedVrIds),
    };
    fs.writeFileSync(reportPath, JSON.stringify(payload, null, 2), 'utf8');
    console.warn(`[build-datasets-from-csv] 详尽报告已写入 ${reportPath}`);
  }
}

try {
  main();
} catch (error) {
  console.error('[build-datasets-from-csv] 失败:', error && error.stack ? error.stack : error);
  process.exit(1);
}

