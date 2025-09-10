import type { Skill } from '../types';

export const skills: Skill[] = [
  // Languages
  { name: 'Java', category: 'languages', proficiency: 5 },
  { name: 'Python', category: 'languages', proficiency: 5 },
  { name: 'SQL', category: 'languages', proficiency: 3 },
  { name: 'C', category: 'languages', proficiency: 4 },

  // Backend / APIs
  { name: 'PostgreSQL', category: 'backend', proficiency: 3 },
  { name: 'Flask', category: 'backend', proficiency: 3 },
  { name: 'psycopg2', category: 'backend', proficiency: 2 }, // specific PostgreSQL library
  { name: 'REST APIs', category: 'backend', proficiency: 5 },

  // Tools
  { name: 'GitHub', category: 'tools', proficiency: 5 },
  { name: 'Postman', category: 'tools', proficiency: 4 },
  { name: 'AWS Lambda', category: 'tools', proficiency: 5 },
  { name: 'AWS API Gateway', category: 'tools', proficiency: 5 },
  { name: 'AWS CloudWatch', category: 'tools', proficiency: 5 },
  { name: 'AWS S3', category: 'tools', proficiency: 3 },
  { name: 'AWS IAM', category: 'tools', proficiency: 4 },

  // Other
  { name: 'Agile/Scrum', category: 'other', proficiency: 4 },
];
