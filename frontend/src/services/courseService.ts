import * as XLSX from 'xlsx';
import {
  NormalizedCourse,
  CourseFilters,
  CourseSortOption,
  RecommendedCourseMatch,
  CatalogueMetadata,
  CatalogueType,
} from '../types/course';
import initialCatalogData from '../data/coursesCatalog.json';

// In-memory cache for normalized courses
let memoryCoursesCache: NormalizedCourse[] | null = null;
let activeLoadingPromise: Promise<NormalizedCourse[]> | null = null;

// Helper: Split and normalize skills or competencies string
export function parseDelimitedList(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(s => String(s).trim()).filter(Boolean);
  if (typeof value !== 'string') return [];
  return value
    .split(/[,;]+/)
    .map(s => s.trim())
    .filter(Boolean);
}

// Helper: Extract numeric duration hours
export function parseDurationHours(value: unknown): number {
  if (!value) return 0;
  const match = String(value).match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

// Helper: Parse a raw Excel ArrayBuffer in the browser runtime
function parseWorkbookBuffer(
  buffer: ArrayBuffer,
  catalogueKey: CatalogueType,
  catalogueLabel: string,
  idPrefix: string
): NormalizedCourse[] {
  const wb = XLSX.read(buffer, { type: 'array' });
  const sheetName = wb.SheetNames.includes('All Courses') ? 'All Courses' : wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  if (!sheet) return [];

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
  const seenIds = new Set<string>();
  const results: NormalizedCourse[] = [];

  for (const row of rows) {
    const rawId = row['Course ID'] ? String(row['Course ID']).trim() : '';
    if (!rawId) continue;

    // Deduplicate within the same workbook
    if (seenIds.has(rawId)) continue;
    seenIds.add(rawId);

    const name = row['Course name'] ? String(row['Course name']).trim() : '';
    const description = row['Description'] ? String(row['Description']).trim() : '';
    const sector = row['Sector'] ? String(row['Sector']).trim() : '';
    const domain = row['Domain'] ? String(row['Domain']).trim() : '';
    const skills = parseDelimitedList(row['Skills']);
    const competencies = parseDelimitedList(row['Competencies']);
    const level = row['Level'] ? String(row['Level']).trim() : 'Intermediate';
    const duration = row['Duration'] ? String(row['Duration']).trim() : '';
    const durationHours = parseDurationHours(duration);
    const trainer = row['Trainer'] ? String(row['Trainer']).trim() : '';
    const trainingMode = row['Training mode'] ? String(row['Training mode']).trim() : 'Instructor-led';
    const courseImage = row['Course image'] ? String(row['Course image']).trim() : '';
    const eligibility = row['Eligibility'] ? String(row['Eligibility']).trim() : '';
    const dates = row['Dates'] ? String(row['Dates']).trim() : '';

    const compositeId = `${idPrefix}-${rawId}`;

    results.push({
      id: compositeId,
      courseId: rawId,
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

  return results;
}

class CourseService {
  /**
   * Load courses from in-memory cache, browser Excel fetch, or bundled dataset.
   * Caches results in memory to guarantee high performance and single parsing.
   */
  async loadCourses(forceReload = false): Promise<NormalizedCourse[]> {
    if (memoryCoursesCache && !forceReload) {
      return memoryCoursesCache;
    }

    if (activeLoadingPromise && !forceReload) {
      return activeLoadingPromise;
    }

    activeLoadingPromise = (async () => {
      try {
        // Attempt runtime fetch & parse of the actual .xlsx files from public/data/
        const [generalRes, earthRes] = await Promise.all([
          fetch('/data/LMS_Course_Catalog.xlsx').catch(() => null),
          fetch('/data/LMS_Course_Catalog_EarthSciences.xlsx').catch(() => null),
        ]);

        let parsedGeneral: NormalizedCourse[] = [];
        let parsedEarth: NormalizedCourse[] = [];

        if (generalRes && generalRes.ok) {
          const buf = await generalRes.arrayBuffer();
          parsedGeneral = parseWorkbookBuffer(buf, 'general', 'General Catalogue', 'GENERAL');
        }

        if (earthRes && earthRes.ok) {
          const buf = await earthRes.arrayBuffer();
          parsedEarth = parseWorkbookBuffer(buf, 'earth_sciences', 'Earth Sciences', 'EARTH');
        }

        if (parsedGeneral.length > 0 || parsedEarth.length > 0) {
          const combined = [...parsedGeneral, ...parsedEarth];
          memoryCoursesCache = combined;
          return combined;
        }
      } catch (err) {
        console.warn('Runtime Excel parse failed, falling back to pre-bundled catalogue:', err);
      }

      // Pre-bundled fallback derived directly from the exact same Excel files
      const fallback = (initialCatalogData as unknown as NormalizedCourse[]) || [];
      memoryCoursesCache = fallback;
      return fallback;
    })();

    const result = await activeLoadingPromise;
    activeLoadingPromise = null;
    return result;
  }

  /**
   * Retrieve all normalized courses.
   */
  async getAllCourses(): Promise<NormalizedCourse[]> {
    return this.loadCourses();
  }

  /**
   * Look up a course by composite ID (e.g. "GENERAL-C0991") or original Course ID (e.g. "C0991").
   */
  async getCourseById(idOrCourseId: string): Promise<NormalizedCourse | undefined> {
    const courses = await this.getAllCourses();
    const query = idOrCourseId.trim().toLowerCase();

    // 1. Direct composite ID match
    const byCompositeId = courses.find(c => c.id.toLowerCase() === query);
    if (byCompositeId) return byCompositeId;

    // 2. Direct original Course ID match
    const byCourseId = courses.find(c => c.courseId.toLowerCase() === query);
    if (byCourseId) return byCourseId;

    // 3. Prefix fuzzy match (e.g. general_c0991 or earth_c0991)
    return courses.find(c => c.id.toLowerCase().replace(/[-_]/g, '') === query.replace(/[-_]/g, ''));
  }

  /**
   * Search courses using case-insensitive partial match across all key fields.
   */
  searchCourses(query: string, courses: NormalizedCourse[]): NormalizedCourse[] {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return courses;

    return courses.filter(c => {
      const titleMatch = c.name.toLowerCase().includes(trimmed);
      const idMatch = c.courseId.toLowerCase().includes(trimmed) || c.id.toLowerCase().includes(trimmed);
      const descMatch = c.description.toLowerCase().includes(trimmed);
      const sectorMatch = c.sector.toLowerCase().includes(trimmed);
      const domainMatch = c.domain.toLowerCase().includes(trimmed);
      const trainerMatch = c.trainer.toLowerCase().includes(trimmed);
      const skillsMatch = c.skills.some(s => s.toLowerCase().includes(trimmed));
      const compMatch = c.competencies.some(comp => comp.toLowerCase().includes(trimmed));

      return (
        titleMatch ||
        idMatch ||
        descMatch ||
        sectorMatch ||
        domainMatch ||
        trainerMatch ||
        skillsMatch ||
        compMatch
      );
    });
  }

  /**
   * Filter courses dynamically based on user selections.
   */
  filterCourses(filters: CourseFilters, courses: NormalizedCourse[]): NormalizedCourse[] {
    let result = courses;

    // Search query filter
    if (filters.search) {
      result = this.searchCourses(filters.search, result);
    }

    // Catalogue filter
    if (filters.catalogue && filters.catalogue !== 'all') {
      result = result.filter(c => c.catalogue === filters.catalogue);
    }

    // Sector filter
    if (filters.sector && filters.sector !== 'all') {
      result = result.filter(c => c.sector.toLowerCase() === filters.sector!.toLowerCase());
    }

    // Domain filter
    if (filters.domain && filters.domain !== 'all') {
      result = result.filter(c => c.domain.toLowerCase() === filters.domain!.toLowerCase());
    }

    // Level filter
    if (filters.level && filters.level !== 'all') {
      result = result.filter(c => c.level.toLowerCase() === filters.level!.toLowerCase());
    }

    // Training Mode filter
    if (filters.trainingMode && filters.trainingMode !== 'all') {
      result = result.filter(c => c.trainingMode.toLowerCase() === filters.trainingMode!.toLowerCase());
    }

    // Specific skill filter
    if (filters.skill && filters.skill !== 'all') {
      const skillQuery = filters.skill.toLowerCase();
      result = result.filter(c => c.skills.some(s => s.toLowerCase() === skillQuery));
    }

    // Specific competency filter
    if (filters.competency && filters.competency !== 'all') {
      const compQuery = filters.competency.toLowerCase();
      result = result.filter(c => c.competencies.some(cp => cp.toLowerCase() === compQuery));
    }

    // Trainer filter
    if (filters.trainer && filters.trainer !== 'all') {
      result = result.filter(c => c.trainer.toLowerCase() === filters.trainer!.toLowerCase());
    }

    // Duration range filters
    if (typeof filters.minDuration === 'number') {
      result = result.filter(c => c.durationHours >= filters.minDuration!);
    }
    if (typeof filters.maxDuration === 'number') {
      result = result.filter(c => c.durationHours <= filters.maxDuration!);
    }

    return result;
  }

  /**
   * Sort courses based on available Excel fields.
   */
  sortCourses(courses: NormalizedCourse[], sortOption: CourseSortOption): NormalizedCourse[] {
    const list = [...courses];
    switch (sortOption) {
      case 'name-asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return list.sort((a, b) => b.name.localeCompare(a.name));
      case 'duration-asc':
        return list.sort((a, b) => a.durationHours - b.durationHours);
      case 'duration-desc':
        return list.sort((a, b) => b.durationHours - a.durationHours);
      case 'level-asc': {
        const order: Record<string, number> = { easy: 1, medium: 2, advanced: 3 };
        return list.sort((a, b) => (order[a.level.toLowerCase()] || 2) - (order[b.level.toLowerCase()] || 2));
      }
      case 'level-desc': {
        const order: Record<string, number> = { easy: 1, medium: 2, advanced: 3 };
        return list.sort((a, b) => (order[b.level.toLowerCase()] || 2) - (order[a.level.toLowerCase()] || 2));
      }
      default:
        return list;
    }
  }

  /**
   * Filter courses by Sector
   */
  async getCoursesBySector(sector: string): Promise<NormalizedCourse[]> {
    const all = await this.getAllCourses();
    const target = sector.trim().toLowerCase();
    return all.filter(c => c.sector.toLowerCase() === target);
  }

  /**
   * Filter courses by Domain
   */
  async getCoursesByDomain(domain: string): Promise<NormalizedCourse[]> {
    const all = await this.getAllCourses();
    const target = domain.trim().toLowerCase();
    return all.filter(c => c.domain.toLowerCase() === target);
  }

  /**
   * Filter courses by Skill
   */
  async getCoursesBySkill(skill: string): Promise<NormalizedCourse[]> {
    const all = await this.getAllCourses();
    const target = skill.trim().toLowerCase();
    return all.filter(c => c.skills.some(s => s.toLowerCase() === target || s.toLowerCase().includes(target)));
  }

  /**
   * Filter courses by Level
   */
  async getCoursesByLevel(level: string): Promise<NormalizedCourse[]> {
    const all = await this.getAllCourses();
    const target = level.trim().toLowerCase();
    return all.filter(c => c.level.toLowerCase() === target);
  }

  /**
   * Transparent skill-based course recommendations:
   * Compares learner target / deficit skills against the course's skills.
   * Calculates transparent overlap percentage without claiming artificial intelligence.
   */
  async getRecommendedCourses(
    userSkills: string[],
    options?: { limit?: number; catalogue?: 'all' | CatalogueType }
  ): Promise<RecommendedCourseMatch[]> {
    const all = await this.getAllCourses();
    const limit = options?.limit ?? 6;
    const catalogueFilter = options?.catalogue ?? 'all';

    const normalizedUserSkills = userSkills
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);

    if (normalizedUserSkills.length === 0) {
      // Return top beginner / foundational courses if no user skills specified
      return all
        .slice(0, limit)
        .map(course => ({
          course,
          matchedSkills: [],
          matchScore: 60,
          matchPercentage: 60,
          recommendationReason: 'Recommended foundational curriculum for developing core competencies',
        }));
    }

    const matches: RecommendedCourseMatch[] = [];

    for (const course of all) {
      if (catalogueFilter !== 'all' && course.catalogue !== catalogueFilter) {
        continue;
      }

      const matchedSkills: string[] = [];

      for (const courseSkill of course.skills) {
        const cSkillLower = courseSkill.toLowerCase();
        for (const uSkill of normalizedUserSkills) {
          if (cSkillLower.includes(uSkill) || uSkill.includes(cSkillLower)) {
            if (!matchedSkills.includes(courseSkill)) {
              matchedSkills.push(courseSkill);
            }
          }
        }
      }

      // Check competencies as well for secondary match
      let compBoost = 0;
      for (const comp of course.competencies) {
        const compLower = comp.toLowerCase();
        for (const uSkill of normalizedUserSkills) {
          if (compLower.includes(uSkill)) {
            compBoost += 10;
            break;
          }
        }
      }

      if (matchedSkills.length > 0 || compBoost > 0) {
        const totalCourseSkills = Math.max(course.skills.length, 1);
        const rawPercentage = Math.round((matchedSkills.length / totalCourseSkills) * 100);
        const matchPercentage = Math.min(99, Math.max(50, rawPercentage + compBoost));

        let reason = 'Personalized course recommendation based on your skill targets';
        if (matchedSkills.length > 0) {
          reason = `Covers ${matchedSkills.slice(0, 2).join(' & ')} required for your target competency profile`;
        }

        matches.push({
          course,
          matchedSkills,
          matchScore: matchPercentage,
          matchPercentage,
          recommendationReason: reason,
        });
      }
    }

    // Sort by highest match percentage first
    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return matches.slice(0, limit);
  }

  /**
   * Extract dynamic metadata (unique Sectors, Domains, Levels, Training Modes)
   * from the actual loaded Excel data.
   */
  async getCatalogueMeta(): Promise<CatalogueMetadata> {
    const courses = await this.getAllCourses();

    const sectors = Array.from(new Set(courses.map(c => c.sector).filter(Boolean))).sort();
    const domains = Array.from(new Set(courses.map(c => c.domain).filter(Boolean))).sort();
    const levels = Array.from(new Set(courses.map(c => c.level).filter(Boolean))).sort();
    const trainingModes = Array.from(new Set(courses.map(c => c.trainingMode).filter(Boolean))).sort();

    const allSkillsSet = new Set<string>();
    courses.forEach(c => c.skills.forEach(s => allSkillsSet.add(s)));

    const allCompSet = new Set<string>();
    courses.forEach(c => c.competencies.forEach(cp => allCompSet.add(cp)));

    const totalGeneral = courses.filter(c => c.catalogue === 'general').length;
    const totalEarthSciences = courses.filter(c => c.catalogue === 'earth_sciences').length;

    return {
      totalCourses: courses.length,
      totalGeneral,
      totalEarthSciences,
      sectors,
      domains,
      levels,
      trainingModes,
      allSkills: Array.from(allSkillsSet).sort(),
      allCompetencies: Array.from(allCompSet).sort(),
    };
  }

  /**
   * In-session enrollment tracker (pure in-memory / session state without database)
   */
  getEnrolledCourseIds(): string[] {
    try {
      const stored = sessionStorage.getItem('skillsync_enrolled_courses');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  enrollInCourse(compositeId: string): boolean {
    try {
      const list = this.getEnrolledCourseIds();
      if (!list.includes(compositeId)) {
        list.push(compositeId);
        sessionStorage.setItem('skillsync_enrolled_courses', JSON.stringify(list));
      }
      return true;
    } catch {
      return false;
    }
  }

  isEnrolled(compositeId: string): boolean {
    const list = this.getEnrolledCourseIds();
    return list.includes(compositeId);
  }
}

export const courseService = new CourseService();
