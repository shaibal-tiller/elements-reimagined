import { getAge } from "../assets/data.js";
import {
  Code2,
  LayoutDashboard,
  Server,
  Database,
  Wrench,
  LifeBuoy,
  ArrowRight,
} from "lucide-react";

export const personalInfo = {
  name: "Mohshin Ahamed Sharif Shaibal",
  short_name: "Sharif Shaibal",
  reverse_short_name: "Shaibal Sharif",
  first_short_name: "Mohshin Ahamed ",
  email: "shaibalsharif@gmail.com",
  business_email: "shaibal.tiller@gmail.com",
  company_email: "shaibal@tiller.com.bd",
  student_email: "sharif15-7348@diu.edu.bd",

  primary_phone: "+8801521330598",
  secondary_phone: "+8801978330598",

  full_address: "Mirpur, Dhaka, Bangladesh",
  residence: "Mirpur",
  city: "Dhaka",
  country: "Bangladesh",
  dob: "1998-06-25",
  gender: "Male",
  age: getAge(this.dob),
};

export const links = {
  facebook: "",
  linkedin: "",
  github: "",
  whatsapp: "",
};

export const services = [
  {
    icon: Code2,
    title: "Full-Stack Web Development",
    description:
      "Building scalable, production-ready web applications using React, Next.js, Node.js, and modern web standards—from frontend to backend.",
  },
  {
    icon: LayoutDashboard,
    title: "Frontend Engineering",
    description:
      "Crafting responsive, accessible, and high-performance user interfaces with React, Next.js, HTML, CSS, and Tailwind for exceptional UX.",
  },
  {
    icon: Server,
    title: "Backend & API Development",
    description:
      "Developing secure backend systems with Node.js and Next.js APIs, including authentication, role-based access control, and REST integrations.",
  },
  {
    icon: Database,
    title: "Database & Server Management",
    description:
      "Managing PostgreSQL, MySQL, and Firebase databases along with deploying and maintaining applications on local servers and cloud infrastructure.",
  },
  {
    icon: Wrench,
    title: "CI/CD, Testing & Deployment",
    description:
      "Implementing automated testing, Docker-based CI/CD pipelines, and smooth deployment workflows for reliable and maintainable systems.",
  },
  {
    icon: LifeBuoy,
    title: "Technical Support & Event Facilitation",
    description:
      "Providing on-ground technical support as a backstopper—ensuring system stability, rapid issue resolution, and smooth project or event execution.",
  },
];

export const skills = [];
export const profile = `React/Next.js frontend engineer. Delivers robust, tested code & enjoys collaborative problem-solving. Brings a positive, fun energy
 to the team, enhancing productivity & morale. Passionate about creating exceptional user experiences.`;
