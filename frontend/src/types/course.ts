export type CatalogueType = 'general' | 'earth_sciences';

export interface NormalizedCourse {
  id: string; // Composite unique ID, e.g. "GENERAL-C0991" or "EARTH-C1000"
  courseId: string; // Original ID from Excel, e.g. "C0991"
  catalogue: CatalogueType;
  catalogueName: string; // "General Catalogue" | "Earth Sciences"
  name: string; // Course name
  title: string; // Convenient alias for name
  description: string;
  sector: string;
  domain: string;
  skills: string[]; // Parsed & trimmed array of skills
  competencies: string[]; // Parsed & trimmed array of competencies
  level: 'Easy' | 'Medium' | 'Advanced' | string;
  duration: string; // e.g. "4 hours"
  durationHours: number; // Parsed numeric duration for numerical filtering & sorting
  trainer: string;
  trainingMode: 'Instructor-led' | 'Blended' | 'Self-paced' | string;
  courseImage: string;
  eligibility: string;
  dates: string;
}

export interface CourseFilters {
  catalogue?: 'all' | CatalogueType;
  sector?: string;
  domain?: string;
  level?: string;
  trainingMode?: string;
  search?: string;
  minDuration?: number;
  maxDuration?: number;
  skill?: string;
  competency?: string;
  trainer?: string;
}

export type CourseSortOption =
  | 'name-asc'
  | 'name-desc'
  | 'duration-asc'
  | 'duration-desc'
  | 'level-asc'
  | 'level-desc'
  | 'default';

export interface RecommendedCourseMatch {
  course: NormalizedCourse;
  matchedSkills: string[];
  matchScore: number; // 0 - 100
  matchPercentage: number; // 0 - 100
  recommendationReason: string;
}

export interface CatalogueMetadata {
  totalCourses: number;
  totalGeneral: number;
  totalEarthSciences: number;
  sectors: string[];
  domains: string[];
  levels: string[];
  trainingModes: string[];
  allSkills: string[];
  allCompetencies: string[];
}
