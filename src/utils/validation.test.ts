import {
  contactFormValidationRules,
  validateContactFormData,
  validateDataIntegrity,
  ValidationError,
} from './validation';
import type { Project, Skill, Experience } from '../types';

describe('Contact Form Validation Rules', () => {
  test('validation rules are properly defined', () => {
    expect(contactFormValidationRules.name.required).toBe('Name is required');
    expect(contactFormValidationRules.email.required).toBe('Email is required');
    expect(contactFormValidationRules.message.required).toBe('Message is required');
    
    expect(contactFormValidationRules.name.minLength.value).toBe(2);
    expect(contactFormValidationRules.message.minLength.value).toBe(10);
    
    expect(contactFormValidationRules.email.pattern.value).toBeInstanceOf(RegExp);
  });
});

describe('Batch Contact Form Validation', () => {
  test('validates complete valid form', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a valid message that is long enough.',
    };
    
    const errors = validateContactFormData(validData);
    expect(errors).toHaveLength(0);
  });

  test('returns errors for invalid form', () => {
    const invalidData = {
      name: '',
      email: 'invalid-email',
      message: 'Short',
    };
    
    const errors = validateContactFormData(invalidData);
    expect(errors).toHaveLength(3);
    
    expect(errors.find(e => e.field === 'name')?.message).toBe('Name is required');
    expect(errors.find(e => e.field === 'email')?.message).toBe('Please enter a valid email address');
    expect(errors.find(e => e.field === 'message')?.message).toBe('Message must be at least 10 characters');
  });

  test('validates partial form data', () => {
    const partialData = {
      name: 'John',
      // email missing
      message: 'This is a valid message.',
    };
    
    const errors = validateContactFormData(partialData);
    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe('email');
  });

  test('handles whitespace-only values', () => {
    const whitespaceData = {
      name: '   ',
      email: '  ',
      message: '   ',
    };
    
    const errors = validateContactFormData(whitespaceData);
    expect(errors).toHaveLength(3);
  });
});

describe('Data Integrity Validation', () => {
  const validProjects: Project[] = [
    {
      id: '1',
      title: 'Project 1',
      description: 'Description',
      longDescription: 'Long description',
      technologies: ['React'],
      imageUrl: '/img1.jpg',
      featured: true,
    },
    {
      id: '2',
      title: 'Project 2',
      description: 'Description',
      longDescription: 'Long description',
      technologies: ['Vue'],
      imageUrl: '/img2.jpg',
      featured: false,
    },
  ];

  const validSkills: Skill[] = [
    { name: 'React', category: 'frontend', proficiency: 5 },
    { name: 'Node.js', category: 'backend', proficiency: 4 },
  ];

  const validExperiences: Experience[] = [
    {
      company: 'Company A',
      position: 'Developer',
      startDate: '2020-01',
      endDate: '2021-12',
      description: ['Did some work'],
      technologies: ['React'],
    },
  ];

  test('validates clean data without errors', () => {
    const errors = validateDataIntegrity(validProjects, validSkills, validExperiences);
    expect(errors).toHaveLength(0);
  });

  test('detects duplicate project IDs', () => {
    const duplicateProjects = [
      ...validProjects,
      { ...validProjects[0], title: 'Different Title' }, // Same ID
    ];
    
    const errors = validateDataIntegrity(duplicateProjects, validSkills, validExperiences);
    expect(errors.some(e => e.field === 'projects' && e.message.includes('Duplicate project IDs'))).toBe(true);
  });

  test('detects duplicate skill names', () => {
    const duplicateSkills = [
      ...validSkills,
      { ...validSkills[0], category: 'tools' as const }, // Same name
    ];
    
    const errors = validateDataIntegrity(validProjects, duplicateSkills, validExperiences);
    expect(errors.some(e => e.field === 'skills' && e.message.includes('Duplicate skill names'))).toBe(true);
  });

  test('detects projects without technologies', () => {
    const projectsWithoutTech = [
      ...validProjects,
      {
        id: '3',
        title: 'Empty Project',
        description: 'Description',
        longDescription: 'Long description',
        technologies: [], // Empty array
        imageUrl: '/img3.jpg',
        featured: false,
      },
    ];
    
    const errors = validateDataIntegrity(projectsWithoutTech, validSkills, validExperiences);
    expect(errors.some(e => e.field === 'projects' && e.message.includes('without technologies'))).toBe(true);
  });

  test('detects experiences without descriptions', () => {
    const experiencesWithoutDesc = [
      ...validExperiences,
      {
        company: 'Company B',
        position: 'Senior Developer',
        startDate: '2022-01',
        endDate: 'Present',
        description: [], // Empty array
        technologies: ['Vue'],
      },
    ];
    
    const errors = validateDataIntegrity(validProjects, validSkills, experiencesWithoutDesc);
    expect(errors.some(e => e.field === 'experiences' && e.message.includes('without descriptions'))).toBe(true);
  });

  test('returns multiple errors when multiple issues exist', () => {
    const badProjects = [
      { ...validProjects[0] },
      { ...validProjects[0] }, // Duplicate ID
      {
        id: '3',
        title: 'Bad Project',
        description: 'Description',
        longDescription: 'Long description',
        technologies: [], // No technologies
        imageUrl: '/img3.jpg',
        featured: false,
      },
    ];
    
    const badSkills = [
      { ...validSkills[0] },
      { ...validSkills[0] }, // Duplicate name
    ];
    
    const errors = validateDataIntegrity(badProjects, badSkills, validExperiences);
    expect(errors.length).toBeGreaterThan(1);
  });
});