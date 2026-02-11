import { getIcon, getIcons } from "../iconRegistry";
import {
  FirestoreProject,
  FirestoreService,
  FirestoreProfile,
  FirestoreLinks,
  Project,
  Service,
  Profile,
  Links,
} from "../../types/firebase";

/**
 * Convert Firestore project document to client-side project with resolved icons
 */
export const convertFirestoreProject = (doc: FirestoreProject): Project => {
  return {
    id: doc.id,
    title: doc.title,
    subtitle: doc.subtitle,
    category: doc.category,
    year: doc.year,
    company: doc.company,
    bannerIcon: getIcon(doc.bannerIconName),
    theme: doc.theme,
    headerInfo: doc.headerInfo.map((info) => ({
      label: info.label,
      text: info.text,
      icon: getIcon(info.iconName),
    })),
    overview: doc.overview,
    features: doc.features.map((feature) => ({
      title: feature.title,
      desc: feature.desc,
      icon: getIcon(feature.iconName),
    })),
    images: doc.images,
    contributions: doc.contributions,
    techStack: doc.techStack,
    marqueeIcons: getIcons(doc.marqueeIconNames),
    challenge: doc.challenge,
    coverMedia: doc.coverMedia || [],
  };
};

/**
 * Convert client-side project to Firestore document format
 * Used for migration scripts
 */
export const convertProjectToFirestore = (
  project: Project,
  iconNameMap: Map<unknown, string>
): FirestoreProject => {
  return {
    id: project.id,
    title: project.title,
    subtitle: project.subtitle,
    category: project.category,
    year: project.year,
    company: project.company,
    bannerIconName: iconNameMap.get(project.bannerIcon) || "Code2",
    theme: project.theme,
    headerInfo: project.headerInfo.map((info) => ({
      label: info.label,
      text: info.text,
      iconName: iconNameMap.get(info.icon) || "Code2",
    })),
    overview: project.overview,
    features: project.features.map((feature) => ({
      title: feature.title,
      desc: feature.desc,
      iconName: iconNameMap.get(feature.icon) || "Code2",
    })),
    images: project.images,
    contributions: project.contributions,
    techStack: project.techStack,
    marqueeIconNames: project.marqueeIcons.map(
      (icon) => iconNameMap.get(icon) || "Code2"
    ),
    challenge: project.challenge,
    coverMedia: project.coverMedia || [],
  };
};

/**
 * Convert Firestore service document to client-side service with resolved icon
 */
export const convertFirestoreService = (doc: FirestoreService): Service => {
  return {
    id: doc.id,
    icon: getIcon(doc.iconName),
    title: doc.title,
    description: doc.description,
  };
};

/**
 * Convert Firestore profile document to client-side profile
 */
export const convertFirestoreProfile = (doc: FirestoreProfile): Profile => {
  return { ...doc };
};

/**
 * Convert Firestore links document to client-side links
 */
export const convertFirestoreLinks = (doc: FirestoreLinks): Links => {
  return { ...doc };
};
