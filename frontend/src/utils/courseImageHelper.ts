import { NormalizedCourse } from '../types/course';

const SECTOR_FALLBACK_IMAGES: Record<string, string> = {
  'Atmospheric & Climate Sciences': 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&auto=format&fit=crop&q=80',
  'Ocean & Marine Sciences': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
  'Geospatial Sciences': 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&auto=format&fit=crop&q=80',
  'Earth System & Polar Sciences': 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=800&auto=format&fit=crop&q=80',
  'Computing & Data Sciences': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
  'Earth, Environmental & Engineering Sciences': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80',
  'Information Technology & Computing': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
  'Communication, Soft Skills & Design': 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&auto=format&fit=crop&q=80',
  'Human Resources & Finance': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
  'Management & Governance': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
  'Health & Safety': 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
};

const DEFAULT_COURSE_IMAGE = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';

export function getCourseFallbackImage(sector?: string): string {
  if (!sector) return DEFAULT_COURSE_IMAGE;
  return SECTOR_FALLBACK_IMAGES[sector] || DEFAULT_COURSE_IMAGE;
}

export function resolveCourseImage(course: Pick<NormalizedCourse, 'courseImage' | 'sector'>): string {
  if (course.courseImage && course.courseImage.startsWith('http')) {
    return course.courseImage;
  }
  return getCourseFallbackImage(course.sector);
}
