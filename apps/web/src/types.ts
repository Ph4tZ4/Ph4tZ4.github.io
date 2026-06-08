export interface Education {
  degree: string;
  institution: string;
  year: string;
  description: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Expertise {
  area: string;
  description: string;
}

export interface About {
  years: string;
  location: string;
  status: string;
  description: string;
  detail: string;
  philosophy: string;
  interests: string[];
  education: Education[];
  experience: Experience[];
  expertise: Expertise[];
}

export interface Skill {
  name: string;
  level: number;
  category: string;
}

export interface Project {
  title: string;
  tech: string;
  description: string;
  image: string;
  link?: string;
  repoLink?: string;
  demoLink?: string;
}

export interface Certificate {
  title: string;
  issuer: string;
  date: string;
  description: string;
  image: string;
}

export interface Portfolio {
  about: About;
  skills: Skill[];
  projects: Project[];
  certificates: Certificate[];
}

export type PageId = 'home' | 'about' | 'skills' | 'projects' | 'certificates' | 'contact';

export const emptyPortfolio: Portfolio = {
  about: {
    years: '',
    location: '',
    status: '',
    description: '',
    detail: '',
    philosophy: '',
    interests: [],
    education: [],
    experience: [],
    expertise: [],
  },
  skills: [],
  projects: [],
  certificates: [],
};
