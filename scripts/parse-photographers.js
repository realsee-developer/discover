#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function resolveRepoRoot() {
  return path.resolve(__dirname, '..');
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writePrettyJson(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function extractIdFromUrl(url) {
  if (!url || typeof url !== 'string') return null;
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

function parseSocialMedia(text) {
  // 允许格式："LinkedIn: url; Instagram: url" 或直接粘贴多个 URL。
  if (!text || typeof text !== 'string') return {};
  const result = {};
  const parts = text.split(/[\n;，,]+/).map((s) => s.trim()).filter(Boolean);
  for (const part of parts) {
    const m = part.match(/^(LinkedIn|Instagram|Twitter|Facebook|YouTube|Youtube|X|Weibo|知乎|Bilibili)\s*[:：]\s*(.+)$/i);
    if (m) {
      const keyRaw = m[1];
      const url = m[2].trim();
      const key = keyRaw
        .replace(/Youtube/i, 'YouTube')
        .replace(/微博|Weibo/i, 'Weibo')
        .replace(/知乎/i, 'Zhihu')
        .replace(/Bilibili/i, 'Bilibili')
        .replace(/^x$/i, 'X');
      result[key] = url;
      continue;
    }
    // 未带平台名，尝试从域名猜平台
    try {
      const u = new URL(part);
      const host = u.hostname;
      if (host.includes('instagram')) result['Instagram'] = part;
      else if (host.includes('linkedin')) result['LinkedIn'] = part;
      else if (host.includes('twitter.com') || host === 'x.com') result['X'] = part;
      else if (host.includes('facebook')) result['Facebook'] = part;
      else if (host.includes('youtube') || host.includes('youtu.be')) result['YouTube'] = part;
      else result[host] = part;
    } catch (_) {
      // ignore
    }
  }
  return result;
}

function normalizeString(value) {
  if (value == null) return '';
  if (typeof value === 'number') return String(value);
  return String(value).trim();
}

function normalizePending(value) {
  const s = normalizeString(value);
  if (!s) return '';
  // 将“待补充”视为空
  if (s.includes('待补充')) return '';
  return s;
}

function parseVrLinksFromUrl(url, category, device) {
  const normalizedUrl = normalizeString(url);
  const id = extractIdFromUrl(normalizedUrl);
  const cat = normalizeString(category) || null;
  const dev = normalizeString(device) || null;
  if (!normalizedUrl || !id) return [];
  const shortCategory = toShortCategory(cat || '');
  return [
    {
      id,
      url: normalizedUrl,
      category: cat,
      shortCategory,
      device: dev,
      title: null,
      description: null,
      cover: null,
    },
  ];
}

function main() {
  const repoRoot = resolveRepoRoot();
  const xlsxPath = process.env.REALSEE_SHOWCASE_XLSX
    ? path.resolve(process.env.REALSEE_SHOWCASE_XLSX)
    : path.join(repoRoot, 'data', 'Realsee Showcase.xlsx');
  const outPath = process.env.PHOTOGRAPHERS_JSON_OUT
    ? path.resolve(process.env.PHOTOGRAPHERS_JSON_OUT)
    : path.join(repoRoot, 'data', 'photographers.json');

  if (!fs.existsSync(xlsxPath)) {
    console.error('[parse-photographers] 找不到 Excel:', xlsxPath);
    process.exit(1);
  }

  const xlsx = require('xlsx');
  const wb = xlsx.readFile(xlsxPath);
  const sheetName = '手搓版-暂时先做的创作者页面';
  const ws = wb.Sheets[sheetName];
  if (!ws) {
    console.error('[parse-photographers] 找不到工作表:', sheetName);
    process.exit(1);
  }

  // 显式展开纵向合并单元格，避免 JSON 行缺失值
  try {
    const merges = ws['!merges'] || [];
    for (const m of merges) {
      const s = m.s; // start { c, r }
      const e = m.e; // end   { c, r }
      // 仅处理同一列的纵向合并，避免横向误填充
      if (s && e && s.c === e.c && e.r > s.r) {
        const topAddr = xlsx.utils.encode_cell({ c: s.c, r: s.r });
        const topCell = ws[topAddr];
        if (!topCell) continue;
        for (let r = s.r + 1; r <= e.r; r++) {
          const addr = xlsx.utils.encode_cell({ c: s.c, r });
          if (!ws[addr]) {
            ws[addr] = { t: topCell.t, v: topCell.v, w: topCell.w };
          }
        }
      }
    }
  } catch (_) {
    // 忽略合并展开异常，后续仍可依靠向下填充策略
  }

  const rows = xlsx.utils.sheet_to_json(ws, { defval: '' });

  // 头部信息用于读取超链接（sheet_to_json 不会带出 .l.Target）
  const range = xlsx.utils.decode_range(ws['!ref']);
  const headerRowIndex = range.s.r;
  const headerRows = xlsx.utils.sheet_to_json(ws, { header: 1, defval: '' });
  const headerRow = headerRows[0] || [];
  const headerToCol = new Map();
  for (let c = range.s.c; c <= range.e.c; c++) {
    const headerName = (headerRow[c - range.s.c] || '').toString().trim();
    if (headerName) headerToCol.set(headerName, c);
  }

  function getHyperlinkAt(headerName, excelRow) {
    const col = headerToCol.get(headerName);
    if (col == null) return null;
    const addr = xlsx.utils.encode_cell({ c: col, r: excelRow });
    const cell = ws[addr];
    if (cell && cell.l && cell.l.Target) return String(cell.l.Target);
    return null;
  }

  // 按所属用户聚合，多行合并 VR 链接与社交媒体
  const byName = new Map();
  let currentName = '';

  for (let idx = 0; idx < rows.length; idx++) {
    const row = rows[idx];
    const rawName = normalizePending(row['所属用户']);
    if (rawName) currentName = rawName; // 向下填充

    const name = currentName;
    const shortBio = normalizePending(row['Short Bio']);
    const about = normalizePending(row['About the Creator']);
    const location = normalizePending(row['Location']);

    // 读取文本值，若为空则从单元格超链接回退
    const excelRow = headerRowIndex + 1 + idx; // 数据行在表头下一行开始
    let website = normalizePending(row['Website']);
    if (!website) website = normalizeString(getHyperlinkAt('Website', excelRow));

    let socialRaw = normalizePending(row['Social Media']);
    if (!socialRaw) socialRaw = normalizeString(getHyperlinkAt('Social Media', excelRow));

    let youtube = normalizePending(row['Behind the Scenes 视频（YouTube链接）']);
    if (!youtube) youtube = normalizeString(getHyperlinkAt('Behind the Scenes 视频（YouTube链接）', excelRow));

    let blog = normalizePending(row['合作Blog']);
    if (!blog) blog = normalizeString(getHyperlinkAt('合作Blog', excelRow));

    let email = normalizePending(row['邮箱（主页不显示）']);
    if (!email) {
      const mailto = getHyperlinkAt('邮箱（主页不显示）', excelRow);
      if (mailto && /^mailto:/i.test(mailto)) email = mailto.replace(/^mailto:/i, '');
    }

    // VR 链接：文本为空时使用超链接
    let showcaseUrl = normalizePending(row['Showcase Link']);
    if (!showcaseUrl) showcaseUrl = normalizeString(getHyperlinkAt('Showcase Link', excelRow));
    const categoryCell = normalizePending(row['空间类型标签']);
    const deviceCell = normalizePending(row['拍摄设备']);
    const vrLinks = parseVrLinksFromUrl(showcaseUrl, categoryCell, deviceCell);

    // 若无姓名且无 VR 链接，跳过
    if (!name && vrLinks.length === 0) continue;

    if (!byName.has(name)) {
      byName.set(name, {
        id: 0, // 生成阶段再赋值
        name: name || '',
        shortBio: '',
        aboutTheCreator: '',
        Location: '',
        Website: '',
        SocialMedia: {},
        Youtube: '',
        blog: '',
        VrLinks: [],
        email: '',
        CountryTag: '',
        CityTag: '',
      });
    }

    const item = byName.get(name);

    // 基础字段：若已有值则保留，否则写入非空值
    if (!item.shortBio && shortBio) item.shortBio = shortBio;
    if (!item.aboutTheCreator && about) item.aboutTheCreator = about;
    if (!item.Location && location) item.Location = location;
    if (!item.Website && website) item.Website = website;
    if (!item.Youtube && youtube) item.Youtube = youtube;
    if (!item.blog && blog) item.blog = blog;
    if (!item.email && email) item.email = email;

    // 合并社交媒体
    const sm = parseSocialMedia(socialRaw);
    for (const k of Object.keys(sm)) {
      if (!item.SocialMedia[k]) item.SocialMedia[k] = sm[k];
    }

    // 合并 VR 链接（按 id 去重）
    for (const link of vrLinks) {
      if (!link || !link.id) continue;
      const exists = item.VrLinks.some((l) => l.id === link.id);
      if (!exists) item.VrLinks.push(link);
    }
  }

  // 读取 US 摄影师network名单，合并 Email/国家/城市标签
  const usSheetName = 'US 摄影师network名单';
  const usWs = wb.Sheets[usSheetName];
  const usMap = new Map();
  if (usWs) {
    // 展开纵向合并
    try {
      const merges = usWs['!merges'] || [];
      for (const m of merges) {
        const s = m.s; const e = m.e;
        if (s && e && s.c === e.c && e.r > s.r) {
          const topAddr = xlsx.utils.encode_cell({ c: s.c, r: s.r });
          const topCell = usWs[topAddr];
          if (!topCell) continue;
          for (let r = s.r + 1; r <= e.r; r++) {
            const addr = xlsx.utils.encode_cell({ c: s.c, r });
            if (!usWs[addr]) usWs[addr] = { t: topCell.t, v: topCell.v, w: topCell.w };
          }
        }
      }
    } catch (_) {}

    const usRows = xlsx.utils.sheet_to_json(usWs, { defval: '' });

    // 建立表头列索引以便读取超链接
    const usRange = xlsx.utils.decode_range(usWs['!ref']);
    const usHeaderRows = xlsx.utils.sheet_to_json(usWs, { header: 1, defval: '' });
    const usHeaderRow = usHeaderRows[0] || [];
    const usHeaderToCol = new Map();
    for (let c = usRange.s.c; c <= usRange.e.c; c++) {
      const headerName = (usHeaderRow[c - usRange.s.c] || '').toString().trim();
      if (headerName) usHeaderToCol.set(headerName, c);
    }
    function usHyperlinkAt(headerName, excelRow) {
      const col = usHeaderToCol.get(headerName);
      if (col == null) return null;
      const addr = xlsx.utils.encode_cell({ c: col, r: excelRow });
      const cell = usWs[addr];
      if (cell && cell.l && cell.l.Target) return String(cell.l.Target);
      return null;
    }

    for (let i = 0; i < usRows.length; i++) {
      const r = usRows[i];
      const name = normalizePending(r['Name']);
      if (!name) continue;
      const excelRow = usRange.s.r + 1 + i;
      let emailUS = normalizePending(r['Email']);
      if (!emailUS) {
        const mailto = usHyperlinkAt('Email', excelRow);
        if (mailto && /^mailto:/i.test(mailto)) emailUS = mailto.replace(/^mailto:/i, '');
      }
      const country = normalizePending(r['国家标签']);
      const city = normalizePending(r['城市标签']);
      const key = name.toLowerCase();
      if (!usMap.has(key)) usMap.set(key, { email: '', country: '', city: '' });
      const obj = usMap.get(key);
      if (!obj.email && emailUS) obj.email = emailUS;
      if (!obj.country && country) obj.country = country;
      if (!obj.city && city) obj.city = city;
    }
  }

  // 输出阶段赋予递增 id，并合入 US 字段
  const photographers = Array.from(byName.values()).map((p, idx) => {
    const key = (p.name || '').toLowerCase();
    const us = usMap.get(key);
    const merged = { ...p };
    if (us) {
      if (!merged.email && us.email) merged.email = us.email;
      if (!merged.CountryTag && us.country) merged.CountryTag = us.country;
      if (!merged.CityTag && us.city) merged.CityTag = us.city;
    }
    // 保证字段存在，即使为空
    if (!('CountryTag' in merged)) merged.CountryTag = '';
    if (!('CityTag' in merged)) merged.CityTag = '';
    return { ...merged, id: idx + 1 };
  });

  writePrettyJson(outPath, photographers);
  console.log(`[parse-photographers] 输出 ${photographers.length} 条到: ${outPath}`);
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error('[parse-photographers] 失败:', err && err.stack ? err.stack : err);
    process.exit(1);
  }
}


