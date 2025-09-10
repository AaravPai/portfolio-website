export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export interface Skill {
  name: string;
  category: 'languages' | 'backend' | 'tools' | 'other';
  proficiency: 1 | 2 | 3 | 4 | 5;
  icon?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string | 'Present';
  description: string[];
  technologies: string[];
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
