import { LucideIcon } from "lucide-react";

// Firestore document interfaces (what's stored in the database)
// These use string names for icons instead of component references

export interface FirestoreProjectImage {
  src: string;
  caption: string;
  details: string;
  type?: "image" | "video";
}

export interface FirestoreProjectFeature {
  title: string;
  desc: string;
  iconName: string;
}

export interface FirestoreProjectContribution {
  title: string;
  desc: string;
}

export interface FirestoreProjectTheme {
  primary: string;
  secondary: string;
  bgMain: string;
  bgGradient: string;
  accentBlur: string;
  textMain: string;
  pillBg: string;
  pillBorder: string;
  pillText: string;
  techFrontendColor?: string;
  techBackendColor?: string;
  techDevopsColor?: string;
}

export interface FirestoreHeaderInfo {
  label: string;
  text: string;
  iconName: string;
}

export interface FirestoreTechStack {
  frontend: string[];
  backend: string[];
  devops: string[];
}

export interface FirestoreProject {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  company: string;
  bannerIconName: string;
  theme: FirestoreProjectTheme;
  headerInfo: FirestoreHeaderInfo[];
  overview: string;
  features: FirestoreProjectFeature[];
  images: FirestoreProjectImage[];
  contributions: FirestoreProjectContribution[];
  techStack: FirestoreTechStack;
  marqueeIconNames: string[];
  challenge: {
    title: string;
    desc: string;
  };
  coverMedia?: FirestoreProjectImage[];
  order?: number; // For sorting
}

export interface FirestoreProfile {
  name: string;
  short_name: string;
  reverse_short_name: string;
  first_short_name: string;
  email: string;
  business_email: string;
  company_email: string;
  student_email: string;
  primary_phone: string;
  secondary_phone: string;
  full_address: string;
  residence: string;
  city: string;
  country: string;
  dob: string;
  gender: string;
  age: string;
  bio: string;
}

export interface FirestoreLinks {
  facebook: string;
  linkedin: string;
  github: string;
  whatsapp: string;
}

export interface FirestoreService {
  id?: string;
  iconName: string;
  title: string;
  description: string;
  order?: number;
}

export interface FirestoreSkill {
  id?: string;
  name: string;
  category: string;
  level: number;
  order?: number;
}

// Client-side interfaces (with resolved icon components)
// These are used in React components after conversion

export interface ProjectImage {
  src: string;
  caption: string;
  details: string;
  type?: "image" | "video";
}

export interface ProjectFeature {
  title: string;
  desc: string;
  icon: LucideIcon;
}

export interface ProjectContribution {
  title: string;
  desc: string;
}

export interface ProjectTheme {
  primary: string;
  secondary: string;
  bgMain: string;
  bgGradient: string;
  accentBlur: string;
  textMain: string;
  pillBg: string;
  pillBorder: string;
  pillText: string;
  techFrontendColor?: string;
  techBackendColor?: string;
  techDevopsColor?: string;
}

export interface HeaderInfo {
  label: string;
  text: string;
  icon: LucideIcon;
}

export interface TechStack {
  frontend: string[];
  backend: string[];
  devops: string[];
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  company: string;
  bannerIcon: LucideIcon;
  theme: ProjectTheme;
  headerInfo: HeaderInfo[];
  overview: string;
  features: ProjectFeature[];
  images: ProjectImage[];
  contributions: ProjectContribution[];
  techStack: TechStack;
  marqueeIcons: LucideIcon[];
  challenge: {
    title: string;
    desc: string;
  };
  coverMedia?: ProjectImage[];
}

export interface Service {
  id?: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface Profile {
  name: string;
  short_name: string;
  reverse_short_name: string;
  first_short_name: string;
  email: string;
  business_email: string;
  company_email: string;
  student_email: string;
  primary_phone: string;
  secondary_phone: string;
  full_address: string;
  residence: string;
  city: string;
  country: string;
  dob: string;
  gender: string;
  age: string;
  bio: string;
}

export interface Links {
  facebook: string;
  linkedin: string;
  github: string;
  whatsapp: string;
}

export interface ResumeSkillCategory {
  title: string;
  skills: string[];
}

export interface ResumeWorkExperience {
  project: string;
  client: string;
  period: string;
  link?: string;
  points: string[];
}

export interface ResumeEducation {
  institution: string;
  degree: string;
  grade?: string;
  period: string;
}

export interface ResumeLanguage {
  name: string;
  level: string;
}

export interface ResumeReference {
  name: string;
  title: string;
  phone: string;
  email: string;
}

export interface FirestoreResume {
  profile: string;
  videoResumeUrl: string;
  skillCategories: ResumeSkillCategory[];
  workExperience: ResumeWorkExperience[];
  competencies: string[];
  education: ResumeEducation[];
  languages: ResumeLanguage[];
  references: ResumeReference[];
}
