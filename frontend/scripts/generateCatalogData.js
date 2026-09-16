const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const f1 = path.resolve(__dirname, '../public/data/LMS_Course_Catalog.xlsx');
const f2 = path.resolve(__dirname, '../public/data/LMS_Course_Catalog_EarthSciences.xlsx');

function splitList(val) {
  if (!val || typeof val !== 'string') return [];
  return val
    .split(/[,;]+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function parseDurationHours(val) {
  if (!val) return 0;
  const match = String(val).match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

function processWorkbook(filePath, catalogueKey, catalogueLabel, prefix) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return [];
  }
  const wb = XLSX.readFile(filePath);
  const sheet = wb.Sheets['All Courses'] || wb.Sheets[wb.SheetNames[0]];
  const rawRows = XLSX.utils.sheet_to_json(sheet);

  const seenIds = new Set();
  const normalized = [];

  for (const row of rawRows) {
    const rawCourseId = row['Course ID'] ? String(row['Course ID']).trim() : '';
    if (!rawCourseId) continue;

    // Deduplicate within the same catalogue
    if (seenIds.has(rawCourseId)) continue;
    seenIds.add(rawCourseId);

    const name = row['Course name'] ? String(row['Course name']).trim() : '';
    const description = row['Description'] ? String(row['Description']).trim() : '';
    const sector = row['Sector'] ? String(row['Sector']).trim() : '';
    const domain = row['Domain'] ? String(row['Domain']).trim() : '';
    const skills = splitList(row['Skills']);
    const competencies = splitList(row['Competencies']);
    const level = row['Level'] ? String(row['Level']).trim() : 'Intermediate';
    const duration = row['Duration'] ? String(row['Duration']).trim() : '';
    const durationHours = parseDurationHours(duration);
    const trainer = row['Trainer'] ? String(row['Trainer']).trim() : '';
    const trainingMode = row['Training mode'] ? String(row['Training mode']).trim() : '';
    const courseImage = row['Course image'] ? String(row['Course image']).trim() : '';
    const eligibility = row['Eligibility'] ? String(row['Eligibility']).trim() : '';
    const dates = row['Dates'] ? String(row['Dates']).trim() : '';

    const compositeId = `${prefix}-${rawCourseId}`;

    normalized.push({
      id: compositeId,
      courseId: rawCourseId,
      catalogue: catalogueKey,
      catalogueName: catalogueLabel,
      name,
      title: name,
      description,
      sector,
      domain,
      skills,
      competencies,
      level,
      duration,
      durationHours,
      trainer,
      trainingMode,
      courseImage,
      eligibility,
      dates,
    });
  }

  return normalized;
}

const generalCourses = processWorkbook(f1, 'general', 'General Catalogue', 'GENERAL');
const earthCourses = processWorkbook(f2, 'earth_sciences', 'Earth Sciences', 'EARTH');
const allCourses = [...generalCourses, ...earthCourses];

console.log(`Parsed ${generalCourses.length} General courses, ${earthCourses.length} Earth Sciences courses. Total: ${allCourses.length}`);

const outDir = path.resolve(__dirname, '../src/data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const outFile = path.join(outDir, 'coursesCatalog.json');
fs.writeFileSync(outFile, JSON.stringify(allCourses, null, 2));
console.log(`Saved catalog to ${outFile}`);
