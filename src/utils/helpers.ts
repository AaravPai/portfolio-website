// Utility functions for the portfolio website
import type { Project, Skill, Experience, ContactForm } from '../types';

export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

export const formatDate = (dateString: string): string => {
  if (dateString === 'Present') return dateString;

  // Handle YYYY-MM format specifically
  if (dateString.match(/^\d{4}-\d{2}$/)) {
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  }

  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Data validation utilities
export const validateProject = (project: unknown): project is Project => {
  if (!project || typeof project !== 'object') return false;
  
  const p = project as Record<string, unknown>;
  
  return (
    typeof p.id === 'string' &&
    typeof p.title === 'string' &&
    typeof p.description === 'string' &&
    typeof p.longDescription === 'string' &&
    Array.isArray(p.technologies) &&
    p.technologies.every((tech) => typeof tech === 'string') &&
    typeof p.imageUrl === 'string' &&
    (p.liveUrl === undefined || typeof p.liveUrl === 'string') &&
    (p.githubUrl === undefined || typeof p.githubUrl === 'string') &&
    typeof p.featured === 'boolean'
  );
};

export const validateSkill = (skill: unknown): skill is Skill => {
  if (!skill || typeof skill !== 'object') return false;
  
  const s = skill as Record<string, unknown>;
  const validCategories = ['frontend', 'backend', 'tools', 'other'];
  const validProficiencies = [1, 2, 3, 4, 5];
  
  return (
    typeof s.name === 'string' &&
    validCategories.includes(s.category as string) &&
    validProficiencies.includes(s.proficiency as number) &&
    (s.icon === undefined || typeof s.icon === 'string')
  );
};

export const validateExperience = (experience: unknown): experience is Experience => {
  if (!experience || typeof experience !== 'object') return false;
  
  const e = experience as Record<string, unknown>;
  
  return (
    typeof e.company === 'string' &&
    typeof e.position === 'string' &&
    typeof e.startDate === 'string' &&
    (typeof e.endDate === 'string' || e.endDate === 'Present') &&
    Array.isArray(e.description) &&
    e.description.every((desc) => typeof desc === 'string') &&
    Array.isArray(e.technologies) &&
    e.technologies.every((tech) => typeof tech === 'string')
  );
};

export const validateContactForm = (form: unknown): form is ContactForm => {
  if (!form || typeof form !== 'object') return false;
  
  const f = form as Record<string, unknown>;
  
  return (
    typeof f.name === 'string' &&
    f.name.trim().length > 0 &&
    typeof f.email === 'string' &&
    validateEmail(f.email) &&
    typeof f.message === 'string' &&
    f.message.trim().length > 0
  );
};

// Helper functions for data manipulation
export const getProjectsByCategory = (projects: Project[], featured?: boolean): Project[] => {
  if (featured === undefined) return projects;
  return projects.filter((project) => project.featured === featured);
};

export const getSkillsByCategory = (skills: Skill[], category?: Skill['category']): Skill[] => {
  if (!category) return skills;
  return skills.filter((skill) => skill.category === category);
};

export const sortSkillsByProficiency = (skills: Skill[]): Skill[] => {
  return [...skills].sort((a, b) => b.proficiency - a.proficiency);
};

export const getExperienceByDateRange = (experiences: Experience[]): Experience[] => {
  return [...experiences].sort((a, b) => {
    const aDate = a.endDate === 'Present' ? new Date() : new Date(a.endDate);
    const bDate = b.endDate === 'Present' ? new Date() : new Date(b.endDate);
    return bDate.getTime() - aDate.getTime();
  });
};

export const calculateExperienceDuration = (startDate: string, endDate: string | 'Present'): string => {
  const start = new Date(startDate);
  const end = endDate === 'Present' ? new Date() : new Date(endDate);
  
  // Calculate difference in months more accurately
  let months = (end.getFullYear() - start.getFullYear()) * 12;
  months -= start.getMonth();
  months += end.getMonth();
  
  // Adjust for day of month
  if (end.getDate() < start.getDate()) {
    months--;
  }
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years === 0) {
    return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  } else if (remainingMonths === 0) {
    return `${years} year${years !== 1 ? 's' : ''}`;
  } else {
    return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  }
};

// Form validation helpers
export const validateContactFormField = (field: keyof ContactForm, value: string): string | null => {
  switch (field) {
    case 'name':
      if (!value.trim()) return 'Name is required';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      return null;
    
    case 'email':
      if (!value.trim()) return 'Email is required';
      if (!validateEmail(value)) return 'Please enter a valid email address';
      return null;
    
    case 'message':
      if (!value.trim()) return 'Message is required';
      if (value.trim().length < 10) return 'Message must be at least 10 characters';
      return null;
    
    default:
      return null;
  }
};

// URL validation helpers
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};
