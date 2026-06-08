import { Schema, model, type InferSchemaType } from 'mongoose';

const EducationSchema = new Schema(
  {
    degree: String,
    institution: String,
    year: String,
    description: String,
  },
  { _id: false },
);

const ExperienceSchema = new Schema(
  {
    role: String,
    company: String,
    period: String,
    description: String,
  },
  { _id: false },
);

const ExpertiseSchema = new Schema(
  {
    area: String,
    description: String,
  },
  { _id: false },
);

const AboutSchema = new Schema(
  {
    years: String,
    location: String,
    status: String,
    description: String,
    detail: String,
    philosophy: String,
    interests: { type: [String], default: [] },
    education: { type: [EducationSchema], default: [] },
    experience: { type: [ExperienceSchema], default: [] },
    expertise: { type: [ExpertiseSchema], default: [] },
  },
  { _id: false },
);

const SkillSchema = new Schema(
  {
    name: String,
    level: Number,
    category: String,
  },
  { _id: false },
);

const ProjectSchema = new Schema(
  {
    title: String,
    tech: String,
    description: String,
    image: String,
    link: String,
    repoLink: String,
    demoLink: String,
  },
  { _id: false },
);

const CertificateSchema = new Schema(
  {
    title: String,
    issuer: String,
    date: String,
    description: String,
    image: String,
  },
  { _id: false },
);

const PortfolioSchema = new Schema(
  {
    // Singleton key so there is always exactly one portfolio document.
    key: { type: String, default: 'main', unique: true, index: true },
    about: { type: AboutSchema, default: {} },
    skills: { type: [SkillSchema], default: [] },
    projects: { type: [ProjectSchema], default: [] },
    certificates: { type: [CertificateSchema], default: [] },
  },
  { timestamps: true },
);

export type PortfolioDoc = InferSchemaType<typeof PortfolioSchema>;

export const Portfolio = model('Portfolio', PortfolioSchema);
