import type { Experience } from '../types';

export const experiences: Experience[] = [
  {
    company: 'Amazon',
    position: 'SDE I Summer Intern',
    startDate: '2025-05',
    endDate: '2025-08',
    description: [
      'Developed an internal web platform for the Amazon Business Integrated Ordering team to centralize API debugging, cutting average debugging effort from minutes to seconds',
      'Engineered a serverless backend using AWS Lambda (Java) behind API Gateway, integrating with CloudWatch APIs and debugging tools to retrieve and aggregate logs across 6 accounts in 3 regions',
      'Built a React frontend to visualize logs and metadata, enabling faster issue diagnosis and ticket response times',
      'Optimized workflows using multi-threading and caching, ensuring faster response times and scalability in production environments',
    ],
    technologies: ['AWS Lambda', 'Java', 'API Gateway', 'CloudWatch', 'React', 'Caching', 'Multi-threading'],
  },
  {
    company: 'Open Ag and Technology and Systems Center',
    position: 'Undergraduate Student Researcher',
    startDate: '2024-05',
    endDate: '2025-05',
    description: [
      'Co-Authored 2 research papers',
      'Developed custom GPT models for integrating with external APIs, enhancing data interaction capabilities',
      'Created an API using Flask and Ngrok to facilitate secure querying of a private PostgreSQL database',
    ],
    technologies: ['Python', 'Flask', 'Ngrok', 'PostgreSQL', 'Custom GPT Models'],
  },
  {
    company: 'The Data Mine - Purdue University',
    position: 'Undergraduate Data Science Researcher',
    startDate: '2024-01',
    endDate: '2024-05',
    description: [
      'Collaborated with the Aerospace Corporation to develop a method for organizing telemetry data and detecting anomalies',
      'Researched and developed algorithms to reduce noise in telemetry data and generate better estimates using Kalman Filtering',
      'Utilized Python to filter RINEX data files from NASA’s Grace mission, plot enhanced estimates, and identify known anomalies',
    ],
    technologies: ['Python', 'Kalman Filtering', 'RINEX Data', 'Data Analysis'],
  },
  {
    company: 'Purdue University - Data Interoperability in Agriculture Research',
    position: 'Undergraduate Student Researcher for Credit',
    startDate: '2024-01',
    endDate: '2024-05',
    description: [
      'Used Python and NATS infrastructure to develop an event-based data pipeline to enhance agricultural efficiency',
      'Coordinated with real-world sensors on Purdue campus to detect predefined events and notify interested parties in real time',
      'Wrote functions to analyze data from the pipeline to make dynamic, data-driven decisions in real time',
    ],
    technologies: ['Python', 'NATS', 'Event-Driven Systems', 'Data Pipelines'],
  },
];

export const education = [
  {
    degree: 'Bachelor of Science in Computer Science',
    school: 'Purdue University',
    year: '2026',
    details:
      'Graduating December of 2026',
  },
];

export const personalInfo = {
  name: 'Aarav Pai',
  title: 'Software Engineer',
  email: 'aaravspai@gmail.com',
  phone: '+1 (415)-832-0776',
  location: 'Sunnyvale, CA',
  website: 'https://aaravpai.github.io/portfolio-website/',
  linkedin: 'https://www.linkedin.com/in/aaravpai/',
  github: 'https://github.com/AaravPai',
};
