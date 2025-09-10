// Centralized data exports
export { projects } from './projects';
export { skills } from './skills';
export { experiences, education, personalInfo } from './resume';

// Re-export types for convenience
export type { Project, Skill, Experience, ContactForm, ThemeContextType } from '../types';

// Re-export validation utilities
export {
  validateProject,
  validateSkill,
  validateExperience,
  validateContactForm,
  validateContactFormData,
  validateDataIntegrity,
  contactFormValidationRules,
} from '../utils/validation';

// Re-export helper functions
export {
  getProjectsByCategory,
  getSkillsByCategory,
  sortSkillsByProficiency,
  getExperienceByDateRange,
  calculateExperienceDuration,
  formatDate,
  isValidUrl,
  sanitizeUrl,
} from '../utils/helpers';