import type { Skill } from '../types';

export const skills: Skill[] = [
  // Frontend
  { name: 'React', category: 'frontend', proficiency: 5 },
  { name: 'TypeScript', category: 'frontend', proficiency: 4 },
  { name: 'JavaScript', category: 'frontend', proficiency: 5 },
  { name: 'HTML/CSS', category: 'frontend', proficiency: 5 },
  { name: 'Vue.js', category: 'frontend', proficiency: 3 },

  // Backend
  { name: 'Node.js', category: 'backend', proficiency: 4 },
  { name: 'Python', category: 'backend', proficiency: 4 },
  { name: 'Express.js', category: 'backend', proficiency: 4 },
  { name: 'MongoDB', category: 'backend', proficiency: 3 },
  { name: 'PostgreSQL', category: 'backend', proficiency: 3 },

  // Tools
  { name: 'Git', category: 'tools', proficiency: 5 },
  { name: 'Docker', category: 'tools', proficiency: 3 },
  { name: 'AWS', category: 'tools', proficiency: 3 },
  { name: 'Figma', category: 'tools', proficiency: 4 },

  // Other
  { name: 'Agile/Scrum', category: 'other', proficiency: 4 },
  { name: 'REST APIs', category: 'other', proficiency: 5 },
];
