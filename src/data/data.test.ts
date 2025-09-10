import { projects } from './projects';
import { skills } from './skills';
import { experiences, education, personalInfo } from './resume';
import { validateProject, validateSkill, validateExperience } from '../utils/helpers';
import type { Project, Skill, Experience } from '../types';

describe('Projects Data', () => {
  test('all projects are valid', () => {
    projects.forEach((project, index) => {
      expect(validateProject(project)).toBe(true);
    });
  });

  test('projects have required fields', () => {
    projects.forEach((project) => {
      expect(project.id).toBeDefined();
      expect(project.title).toBeDefined();
      expect(project.description).toBeDefined();
      expect(project.longDescription).toBeDefined();
      expect(project.technologies).toBeDefined();
      expect(project.imageUrl).toBeDefined();
      expect(typeof project.featured).toBe('boolean');
    });
  });

  test('project technologies are non-empty arrays', () => {
    projects.forEach((project) => {
      expect(Array.isArray(project.technologies)).toBe(true);
      expect(project.technologies.length).toBeGreaterThan(0);
      project.technologies.forEach((tech) => {
        expect(typeof tech).toBe('string');
        expect(tech.trim().length).toBeGreaterThan(0);
      });
    });
  });

  test('project IDs are unique', () => {
    const ids = projects.map((project) => project.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('at least one project is featured', () => {
    const featuredProjects = projects.filter((project) => project.featured);
    expect(featuredProjects.length).toBeGreaterThan(0);
  });
});

describe('Skills Data', () => {
  test('all skills are valid', () => {
    skills.forEach((skill) => {
      expect(validateSkill(skill)).toBe(true);
    });
  });

  test('skills have required fields', () => {
    skills.forEach((skill) => {
      expect(skill.name).toBeDefined();
      expect(skill.category).toBeDefined();
      expect(skill.proficiency).toBeDefined();
      expect(['frontend', 'backend', 'tools', 'other']).toContain(skill.category);
      expect([1, 2, 3, 4, 5]).toContain(skill.proficiency);
    });
  });

  test('skill names are unique', () => {
    const names = skills.map((skill) => skill.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });

  test('skills cover all categories', () => {
    const categories = skills.map((skill) => skill.category);
    const uniqueCategories = new Set(categories);
    expect(uniqueCategories.has('frontend')).toBe(true);
    expect(uniqueCategories.has('backend')).toBe(true);
    expect(uniqueCategories.has('tools')).toBe(true);
  });

  test('proficiency levels are realistic', () => {
    skills.forEach((skill) => {
      expect(skill.proficiency).toBeGreaterThanOrEqual(1);
      expect(skill.proficiency).toBeLessThanOrEqual(5);
    });
  });
});

describe('Experience Data', () => {
  test('all experiences are valid', () => {
    experiences.forEach((experience) => {
      expect(validateExperience(experience)).toBe(true);
    });
  });

  test('experiences have required fields', () => {
    experiences.forEach((experience) => {
      expect(experience.company).toBeDefined();
      expect(experience.position).toBeDefined();
      expect(experience.startDate).toBeDefined();
      expect(experience.endDate).toBeDefined();
      expect(Array.isArray(experience.description)).toBe(true);
      expect(Array.isArray(experience.technologies)).toBe(true);
    });
  });

  test('experience descriptions are meaningful', () => {
    experiences.forEach((experience) => {
      expect(experience.description.length).toBeGreaterThan(0);
      experience.description.forEach((desc) => {
        expect(typeof desc).toBe('string');
        expect(desc.trim().length).toBeGreaterThan(10);
      });
    });
  });

  test('experience technologies are valid', () => {
    experiences.forEach((experience) => {
      expect(experience.technologies.length).toBeGreaterThan(0);
      experience.technologies.forEach((tech) => {
        expect(typeof tech).toBe('string');
        expect(tech.trim().length).toBeGreaterThan(0);
      });
    });
  });

  test('date formats are consistent', () => {
    experiences.forEach((experience) => {
      // Check start date format (YYYY-MM)
      if (experience.startDate !== 'Present') {
        expect(experience.startDate).toMatch(/^\d{4}-\d{2}$/);
      }
      
      // Check end date format
      if (experience.endDate !== 'Present') {
        expect(experience.endDate).toMatch(/^\d{4}-\d{2}$/);
      }
    });
  });

  test('chronological order makes sense', () => {
    experiences.forEach((experience) => {
      if (experience.endDate !== 'Present') {
        const startDate = new Date(experience.startDate);
        const endDate = new Date(experience.endDate);
        expect(endDate.getTime()).toBeGreaterThan(startDate.getTime());
      }
    });
  });
});

describe('Education Data', () => {
  test('education entries have required fields', () => {
    education.forEach((edu) => {
      expect(edu.degree).toBeDefined();
      expect(edu.school).toBeDefined();
      expect(edu.year).toBeDefined();
      expect(typeof edu.degree).toBe('string');
      expect(typeof edu.school).toBe('string');
      expect(typeof edu.year).toBe('string');
    });
  });

  test('education years are realistic', () => {
    education.forEach((edu) => {
      const year = parseInt(edu.year);
      expect(year).toBeGreaterThan(1950);
      expect(year).toBeLessThanOrEqual(new Date().getFullYear());
    });
  });
});

describe('Personal Info Data', () => {
  test('personal info has required fields', () => {
    expect(personalInfo.name).toBeDefined();
    expect(personalInfo.title).toBeDefined();
    expect(personalInfo.email).toBeDefined();
    expect(typeof personalInfo.name).toBe('string');
    expect(typeof personalInfo.title).toBe('string');
    expect(typeof personalInfo.email).toBe('string');
  });

  test('email format is valid', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test(personalInfo.email)).toBe(true);
  });

  test('URLs are valid format if provided', () => {
    if (personalInfo.website) {
      expect(personalInfo.website.startsWith('http')).toBe(true);
    }
    if (personalInfo.linkedin) {
      expect(personalInfo.linkedin.startsWith('http')).toBe(true);
    }
    if (personalInfo.github) {
      expect(personalInfo.github.startsWith('http')).toBe(true);
    }
  });
});

describe('Data Consistency', () => {
  test('skills mentioned in projects exist in skills data', () => {
    const allSkillNames = skills.map((skill) => skill.name.toLowerCase());
    
    projects.forEach((project) => {
      project.technologies.forEach((tech) => {
        // This is a soft check - not all project technologies need to be in skills
        // but we can log if there are technologies not covered
        const techLower = tech.toLowerCase();
        if (!allSkillNames.includes(techLower)) {
          console.warn(`Technology "${tech}" in project "${project.title}" not found in skills data`);
        }
      });
    });
  });

  test('skills mentioned in experiences exist in skills data', () => {
    const allSkillNames = skills.map((skill) => skill.name.toLowerCase());
    
    experiences.forEach((experience) => {
      experience.technologies.forEach((tech) => {
        const techLower = tech.toLowerCase();
        if (!allSkillNames.includes(techLower)) {
          console.warn(`Technology "${tech}" in experience at "${experience.company}" not found in skills data`);
        }
      });
    });
  });

  test('data arrays are not empty', () => {
    expect(projects.length).toBeGreaterThan(0);
    expect(skills.length).toBeGreaterThan(0);
    expect(experiences.length).toBeGreaterThan(0);
    expect(education.length).toBeGreaterThan(0);
  });
});