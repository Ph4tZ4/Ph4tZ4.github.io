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
  education?: Education[];
  experience?: Experience[];
  philosophy?: string;
  interests?: string[];
  expertise?: Expertise[];
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
  image?: string;
  /** Legacy field — older records store the repo URL here. */
  link?: string;
  repoLink?: string;
  demoLink?: string;
}

export interface Certificate {
  title: string;
  issuer: string;
  date: string;
  description: string;
  image?: string;
}

export interface PortfolioData {
  about: About;
  skills: Skill[];
  projects: Project[];
  certificates?: Certificate[];
}
