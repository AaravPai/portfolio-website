import {
  validateProject,
  validateSkill,
  validateExperience,
  validateContactForm,
  validateEmail,
  getProjectsByCategory,
  getSkillsByCategory,
  sortSkillsByProficiency,
  getExperienceByDateRange,
  calculateExperienceDuration,
  validateContactFormField,
  isValidUrl,
  sanitizeUrl,
  formatDate,
} from './helpers';
import type { Project, Skill, Experience, ContactForm } from '../types';

describe('Email Validation', () => {
  test('validates correct email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    expect(validateEmail('test+tag@example.org')).toBe(true);
  });

  test('rejects invalid email addresses', () => {
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('test@')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('test@.com')).toBe(false);
  });
});

describe('Project Validation', () => {
  const validProject: Project = {
    id: 'test-1',
    title: 'Test Project',
    description: 'A test project',
    longDescription: 'A longer description of the test project',
    technologies: ['React', 'TypeScript'],
    imageUrl: '/images/test.jpg',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/user/repo',
    featured: true,
  };

  test('validates correct project object', () => {
    expect(validateProject(validProject)).toBe(true);
  });

  test('validates project without optional fields', () => {
    const projectWithoutOptional = {
      ...validProject,
      liveUrl: undefined,
      githubUrl: undefined,
    };
    expect(validateProject(projectWithoutOptional)).toBe(true);
  });

  test('rejects project with missing required fields', () => {
    const invalidProject = { ...validProject };
    delete (invalidProject as any).title;
    expect(validateProject(invalidProject)).toBe(false);
  });

  test('rejects project with invalid field types', () => {
    const invalidProject = {
      ...validProject,
      technologies: 'not-an-array',
    };
    expect(validateProject(invalidProject)).toBe(false);
  });

  test('rejects non-object input', () => {
    expect(validateProject(null)).toBe(false);
    expect(validateProject('string')).toBe(false);
    expect(validateProject(123)).toBe(false);
  });
});

describe('Skill Validation', () => {
  const validSkill: Skill = {
    name: 'React',
    category: 'frontend',
    proficiency: 5,
    icon: 'react-icon',
  };

  test('validates correct skill object', () => {
    expect(validateSkill(validSkill)).toBe(true);
  });

  test('validates skill without optional icon', () => {
    const skillWithoutIcon = {
      ...validSkill,
      icon: undefined,
    };
    expect(validateSkill(skillWithoutIcon)).toBe(true);
  });

  test('rejects skill with invalid category', () => {
    const invalidSkill = {
      ...validSkill,
      category: 'invalid-category',
    };
    expect(validateSkill(invalidSkill)).toBe(false);
  });

  test('rejects skill with invalid proficiency', () => {
    const invalidSkill = {
      ...validSkill,
      proficiency: 6,
    };
    expect(validateSkill(invalidSkill)).toBe(false);
  });
});

describe('Experience Validation', () => {
  const validExperience: Experience = {
    company: 'Test Company',
    position: 'Developer',
    startDate: '2020-01',
    endDate: 'Present',
    description: ['Did some work', 'Achieved results'],
    technologies: ['React', 'Node.js'],
  };

  test('validates correct experience object', () => {
    expect(validateExperience(validExperience)).toBe(true);
  });

  test('validates experience with date string endDate', () => {
    const experienceWithDateEnd = {
      ...validExperience,
      endDate: '2022-12',
    };
    expect(validateExperience(experienceWithDateEnd)).toBe(true);
  });

  test('rejects experience with invalid description array', () => {
    const invalidExperience = {
      ...validExperience,
      description: ['valid', 123], // number in array
    };
    expect(validateExperience(invalidExperience)).toBe(false);
  });
});

describe('Contact Form Validation', () => {
  const validForm: ContactForm = {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello, this is a test message.',
  };

  test('validates correct contact form', () => {
    expect(validateContactForm(validForm)).toBe(true);
  });

  test('rejects form with empty name', () => {
    const invalidForm = {
      ...validForm,
      name: '   ',
    };
    expect(validateContactForm(invalidForm)).toBe(false);
  });

  test('rejects form with invalid email', () => {
    const invalidForm = {
      ...validForm,
      email: 'invalid-email',
    };
    expect(validateContactForm(invalidForm)).toBe(false);
  });

  test('rejects form with empty message', () => {
    const invalidForm = {
      ...validForm,
      message: '',
    };
    expect(validateContactForm(invalidForm)).toBe(false);
  });
});

describe('Data Helper Functions', () => {
  const mockProjects: Project[] = [
    {
      id: '1',
      title: 'Featured Project',
      description: 'A featured project',
      longDescription: 'Long description',
      technologies: ['React'],
      imageUrl: '/img1.jpg',
      featured: true,
    },
    {
      id: '2',
      title: 'Regular Project',
      description: 'A regular project',
      longDescription: 'Long description',
      technologies: ['Vue'],
      imageUrl: '/img2.jpg',
      featured: false,
    },
  ];

  const mockSkills: Skill[] = [
    { name: 'React', category: 'frontend', proficiency: 5 },
    { name: 'Node.js', category: 'backend', proficiency: 4 },
    { name: 'Docker', category: 'tools', proficiency: 3 },
  ];

  test('filters projects by featured status', () => {
    expect(getProjectsByCategory(mockProjects, true)).toHaveLength(1);
    expect(getProjectsByCategory(mockProjects, false)).toHaveLength(1);
    expect(getProjectsByCategory(mockProjects)).toHaveLength(2);
  });

  test('filters skills by category', () => {
    expect(getSkillsByCategory(mockSkills, 'frontend')).toHaveLength(1);
    expect(getSkillsByCategory(mockSkills, 'backend')).toHaveLength(1);
    expect(getSkillsByCategory(mockSkills)).toHaveLength(3);
  });

  test('sorts skills by proficiency', () => {
    const sorted = sortSkillsByProficiency(mockSkills);
    expect(sorted[0].proficiency).toBe(5);
    expect(sorted[1].proficiency).toBe(4);
    expect(sorted[2].proficiency).toBe(3);
  });
});

describe('Experience Helper Functions', () => {
  const mockExperiences: Experience[] = [
    {
      company: 'Company A',
      position: 'Developer',
      startDate: '2020-01',
      endDate: '2021-12',
      description: ['Work'],
      technologies: ['React'],
    },
    {
      company: 'Company B',
      position: 'Senior Developer',
      startDate: '2022-01',
      endDate: 'Present',
      description: ['More work'],
      technologies: ['Vue'],
    },
  ];

  test('sorts experiences by end date', () => {
    const sorted = getExperienceByDateRange(mockExperiences);
    expect(sorted[0].endDate).toBe('Present');
    expect(sorted[1].endDate).toBe('2021-12');
  });

  test('calculates experience duration correctly', () => {
    // Mock current date for consistent testing
    const mockDate = new Date('2023-06-01');
    vi.spyOn(globalThis, 'Date').mockImplementation(() => mockDate as any);

    expect(calculateExperienceDuration('2023-01-01', '2023-03-01')).toBe('2 months');
    expect(calculateExperienceDuration('2022-01-01', '2023-01-01')).toBe('1 year');
    expect(calculateExperienceDuration('2021-01-01', '2023-03-01')).toBe('2 years, 2 months');

    vi.restoreAllMocks();
  });
});

describe('Contact Form Field Validation', () => {
  test('validates name field', () => {
    expect(validateContactFormField('name', 'John Doe')).toBeNull();
    expect(validateContactFormField('name', '')).toBe('Name is required');
    expect(validateContactFormField('name', 'J')).toBe('Name must be at least 2 characters');
  });

  test('validates email field', () => {
    expect(validateContactFormField('email', 'test@example.com')).toBeNull();
    expect(validateContactFormField('email', '')).toBe('Email is required');
    expect(validateContactFormField('email', 'invalid')).toBe('Please enter a valid email address');
  });

  test('validates message field', () => {
    expect(validateContactFormField('message', 'This is a valid message')).toBeNull();
    expect(validateContactFormField('message', '')).toBe('Message is required');
    expect(validateContactFormField('message', 'Short')).toBe('Message must be at least 10 characters');
  });
});

describe('URL Validation and Sanitization', () => {
  test('validates URLs correctly', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('http://example.com')).toBe(true);
    expect(isValidUrl('invalid-url')).toBe(false);
    expect(isValidUrl('')).toBe(false);
  });

  test('sanitizes URLs correctly', () => {
    expect(sanitizeUrl('example.com')).toBe('https://example.com');
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
    expect(sanitizeUrl('')).toBe('');
  });
});

describe('Date Formatting', () => {
  test('formats dates correctly', () => {
    expect(formatDate('Present')).toBe('Present');
    expect(formatDate('2023-01')).toBe('January 2023');
    expect(formatDate('2022-12')).toBe('December 2022');
  });
});