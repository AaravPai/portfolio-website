import type { Experience } from '../types';

export const experiences: Experience[] = [
  {
    company: 'Tech Company Inc.',
    position: 'Senior Frontend Developer',
    startDate: '2022-01',
    endDate: 'Present',
    description: [
      'Led development of responsive web applications using React and TypeScript',
      'Collaborated with design team to implement pixel-perfect UI components',
      'Mentored junior developers and conducted code reviews',
      'Improved application performance by 40% through optimization techniques',
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'AWS'],
  },
  {
    company: 'Startup Solutions',
    position: 'Full Stack Developer',
    startDate: '2020-06',
    endDate: '2021-12',
    description: [
      'Built full-stack web applications from concept to deployment',
      'Designed and implemented RESTful APIs using Node.js and Express',
      'Worked directly with clients to gather requirements and deliver solutions',
      'Maintained and optimized database performance',
    ],
    technologies: ['React', 'Node.js', 'MongoDB', 'Express.js'],
  },
];

export const education = [
  {
    degree: 'Bachelor of Science in Computer Science',
    school: 'University of Technology',
    year: '2020',
    details:
      'Graduated Magna Cum Laude, relevant coursework in web development, algorithms, and software engineering.',
  },
];

export const personalInfo = {
  name: 'Your Name',
  title: 'Full Stack Developer',
  email: 'your.email@example.com',
  phone: '+1 (555) 123-4567',
  location: 'City, State',
  website: 'https://yourwebsite.com',
  linkedin: 'https://linkedin.com/in/yourprofile',
  github: 'https://github.com/yourusername',
};
