import type { Project } from '../types';

export const projects: Project[] = [
  {
    id: 'project-1',
    title: 'E-commerce Platform',
    description: 'Full-stack e-commerce solution with React and Node.js',
    longDescription:
      'A comprehensive e-commerce platform built with modern web technologies. Features include user authentication, product catalog, shopping cart, payment processing, and admin dashboard.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    imageUrl: '/images/ecommerce-preview.svg',
    liveUrl: 'https://example-store.com',
    githubUrl: 'https://github.com/user/ecommerce',
    featured: true,
  },
  {
    id: 'project-2',
    title: 'Task Management App',
    description: 'Collaborative task management application',
    longDescription:
      'A collaborative task management application with real-time updates, team collaboration features, and project tracking capabilities.',
    technologies: ['React', 'TypeScript', 'Firebase', 'Material-UI'],
    imageUrl: '/images/taskapp-preview.svg',
    liveUrl: 'https://example-tasks.com',
    githubUrl: 'https://github.com/user/taskapp',
    featured: true,
  },
];
