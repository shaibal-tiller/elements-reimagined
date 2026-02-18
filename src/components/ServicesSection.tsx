import {
  Code2,
  LayoutDashboard,
  Server,
  Database,
  Wrench,
  LifeBuoy,
  ArrowRight,
} from "lucide-react";
import Divider from "./divider";

const services = [
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

const ServicesSection = () => {
  return (
    <section id="services" className="pt-12 bg-[#02162C]">
      <div className="container mx-auto px-3 md:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-4 mb-8 md:mb-12">
         <h2 className="text-xl md:text-2xl font-bold text-foreground whitespace-nowrap shrink-0">My Services</h2>
            <Divider  />
        </div>

        {/* Services Grid - Mobile: 2-col compact, Desktop: full cards */}
        {/* Mobile grid */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-[#00283A] p-4 rounded-xl border border-border flex flex-col items-center text-center gap-2"
            >
              <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center">
                <service.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xs font-semibold text-foreground leading-tight">{service.title}</h3>
            </div>
          ))}
        </div>
        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-card group"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-6
                              group-hover:bg-primary transition-colors duration-500">
                <service.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
              <p className="text-muted-foreground mb-6">{service.description}</p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-primary font-semibold
                           hover:gap-4 transition-all duration-300"
              >
                Order now
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
