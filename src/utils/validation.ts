// Centralized validation utilities
import type { Project, Skill, Experience, ContactForm } from '../types';

// Re-export validation functions from helpers for better organization
export {
  validateProject,
  validateSkill,
  validateExperience,
  validateContactForm,
  validateEmail,
  validateContactFormField,
  isValidUrl,
  sanitizeUrl,
} from './helpers';

// Additional validation schemas for form validation libraries
export const contactFormValidationRules = {
  name: {
    required: 'Name is required',
    minLength: {
      value: 2,
      message: 'Name must be at least 2 characters',
    },
  },
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address',
    },
  },
  message: {
    required: 'Message is required',
    minLength: {
      value: 10,
      message: 'Message must be at least 10 characters',
    },
  },
};

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
}

// Batch validation function
export const validateContactFormData = (data: Partial<ContactForm>): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.name?.trim()) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  }

  if (!data.email?.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  if (!data.message?.trim()) {
    errors.push({ field: 'message', message: 'Message is required' });
  } else if (data.message.trim().length < 10) {
    errors.push({ field: 'message', message: 'Message must be at least 10 characters' });
  }

  return errors;
};

// Data integrity validation
export const validateDataIntegrity = (
  projects: Project[],
  skills: Skill[],
  experiences: Experience[]
): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Check for duplicate project IDs
  const projectIds = projects.map(p => p.id);
  const duplicateIds = projectIds.filter((id, index) => projectIds.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    errors.push({ field: 'projects', message: `Duplicate project IDs found: ${duplicateIds.join(', ')}` });
  }

  // Check for duplicate skill names
  const skillNames = skills.map(s => s.name);
  const duplicateSkills = skillNames.filter((name, index) => skillNames.indexOf(name) !== index);
  if (duplicateSkills.length > 0) {
    errors.push({ field: 'skills', message: `Duplicate skill names found: ${duplicateSkills.join(', ')}` });
  }

  // Validate that all projects have at least one technology
  const projectsWithoutTech = projects.filter(p => p.technologies.length === 0);
  if (projectsWithoutTech.length > 0) {
    errors.push({ 
      field: 'projects', 
      message: `Projects without technologies: ${projectsWithoutTech.map(p => p.title).join(', ')}` 
    });
  }

  // Validate that all experiences have descriptions
  const experiencesWithoutDesc = experiences.filter(e => e.description.length === 0);
  if (experiencesWithoutDesc.length > 0) {
    errors.push({ 
      field: 'experiences', 
      message: `Experiences without descriptions: ${experiencesWithoutDesc.map(e => e.position).join(', ')}` 
    });
  }

  return errors;
};