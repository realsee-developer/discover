#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function resolvePathRelativeToRepoRoot(relativePath) {
  const cwd = process.cwd();
  const scriptDir = __dirname;
  // Try to detect repo root by finding the directory that contains both backend and frontend
  const candidateRootFromScript = path.resolve(scriptDir, '..', '..');
  const candidateRootFromCwd = path.resolve(cwd);

  const looksLikeRepoRoot = (p) => {
    try {
      return fs.existsSync(path.join(p, 'backend')) && fs.existsSync(path.join(p, 'frontend'));
    } catch (_) {
      return false;
    }
  };

  const repoRoot = looksLikeRepoRoot(candidateRootFromScript)
    ? candidateRootFromScript
    : looksLikeRepoRoot(candidateRootFromCwd)
      ? candidateRootFromCwd
      : candidateRootFromScript; // fallback

  return path.resolve(repoRoot, relativePath);
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

function convertXlsxToJson(xlsxFilePath) {
  // Lazy require to avoid throwing if dependency not installed yet
  const xlsx = require('xlsx');
  const workbook = xlsx.readFile(xlsxFilePath);
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];
  const json = xlsx.utils.sheet_to_json(sheet, { defval: null });
  return json;
}

function convertCsvToJson(csvFilePath) {
  const { parse } = require('csv-parse/sync');
  const csvContent = fs.readFileSync(csvFilePath, 'utf8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  return records;
}

function main() {
  const photographersXlsx = process.env.PHOTOGRAPHERS_XLSX_PATH
    ? path.resolve(process.env.PHOTOGRAPHERS_XLSX_PATH)
    : resolvePathRelativeToRepoRoot('data/photographers.xlsx');

  const toursCsv = process.env.TOURS_CSV_PATH
    ? path.resolve(process.env.TOURS_CSV_PATH)
    : resolvePathRelativeToRepoRoot('data/tours.csv');

  const photographersJsonOut = process.env.PHOTOGRAPHERS_JSON_OUT
    ? path.resolve(process.env.PHOTOGRAPHERS_JSON_OUT)
    : resolvePathRelativeToRepoRoot('data/photographers.json');

  const toursJsonOut = process.env.TOURS_JSON_OUT
    ? path.resolve(process.env.TOURS_JSON_OUT)
    : resolvePathRelativeToRepoRoot('data/tours.json');

  if (!fs.existsSync(photographersXlsx)) {
    console.error(`[convert-data] 找不到 photographers.xlsx: ${photographersXlsx}`);
    process.exit(1);
  }
  if (!fs.existsSync(toursCsv)) {
    console.error(`[convert-data] 找不到 tours.csv: ${toursCsv}`);
    process.exit(1);
  }

  console.log('[convert-data] 读取 Excel:', photographersXlsx);
  const photographers = convertXlsxToJson(photographersXlsx);
  console.log(`[convert-data] Excel 行数: ${photographers.length}`);

  console.log('[convert-data] 读取 CSV:', toursCsv);
  const tours = convertCsvToJson(toursCsv);
  console.log(`[convert-data] CSV 行数: ${tours.length}`);

  console.log('[convert-data] 写入 JSON:', photographersJsonOut);
  writePrettyJson(photographersJsonOut, photographers);

  console.log('[convert-data] 写入 JSON:', toursJsonOut);
  writePrettyJson(toursJsonOut, tours);

  console.log('[convert-data] 完成');
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error('[convert-data] 失败:', err && err.stack ? err.stack : err);
    process.exit(1);
  }
}
