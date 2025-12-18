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
    <section id="services" className="py-24 bg-[#02162C]">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
         <h2 className="text-2xl font-bold text-foreground w-[30%]">My Services</h2>
            <Divider  />
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-card group"
              style={{ animationDelay: `${index * 0.1}s` }}
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
