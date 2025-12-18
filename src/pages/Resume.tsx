import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Briefcase, GraduationCap, Award, Code, Database, Wrench } from 'lucide-react';
import Divider from '@/components/ui/Divider';

const Resume: React.FC = () => {
  const tools = [
    "JavaScript", "TypeScript", "React.js", "Next.js", "Tailwind CSS",
    "Context API", "Redux", "PostgreSQL", "MySQL", "Firebase",
    "Git", "Bitbucket", "OpenLayers", "Google Map API", "Docker"
  ];

  const projects = [
    {
      year: "2022",
      name: "PLIS (Planning Information System)",
      points: [
        "Developed dashboard for analyzing government project feasibility",
        "Implemented authentication and role-based access control",
        "Integrated APIs for GIS and structural data",
        "Implemented OpenLayers map view analysis and export",
        "Developed PDF report generation for assessment results"
      ]
    },
    {
      year: "2023 - Present",
      name: "NSD (National Sanitation Dashboard)",
      points: [
        "Built multi-user dashboard to visualize nationwide sanitation levels",
        "Developed data visualization features using D3.js",
        "Implemented authentication and user role management",
        "Integrated APIs for real-time sanitation and asset data"
      ]
    },
    {
      year: "2022",
      name: "Tiller Website",
      points: [
        "Designed and developed tiller.com.bd from scratch",
        "Ensured SEO optimization and performance enhancements"
      ]
    }
  ];

  return (
    <>
   
     

      {/* Contact Info */}
      <div className="card-white p-6 mb-8 animate-fadeUp" style={{ animationDelay: "0.1s" }}>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Mail className="w-6 h-6 text-primary" />
          Contact Information
        </h2>
        <Divider color="#e5e7eb76" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-primary" />
            <span className="text-foreground">+880-152-1330598</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-primary" />
            <span className="text-foreground">shaibalsharif@gmail.com</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="text-foreground">Mirpur, Dhaka</span>
          </div>
          <div className="flex items-center gap-3">
            <Linkedin className="w-5 h-5 text-primary" />
            <a href="https://linkedin.com/in/shaibal-sharif" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              linkedin.com/in/shaibal-sharif
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Github className="w-5 h-5 text-primary" />
            <a href="https://github.com/shaibalsharif" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              github.com/shaibalsharif
            </a>
          </div>
        </div>
      </div>

      {/* Profile */}
      <div className="card-white p-6 mb-8 animate-fadeUp" style={{ animationDelay: "0.2s" }}>
        <h2 className="text-2xl font-bold text-foreground mb-4">Profile</h2>
        <Divider color="#e5e7eb76" />
        <p className="text-foreground mt-4 leading-relaxed">
          React/Next.js frontend engineer. Delivers robust, tested code & enjoys collaborative problem-solving. 
          Brings a positive, fun energy to the team, enhancing productivity & morale. Passionate about creating 
          exceptional user experiences.
        </p>
      </div>

      {/* Work Experience */}
      <div className="card-white p-6 mb-8 animate-fadeUp" style={{ animationDelay: "0.3s" }}>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-primary" />
          Work Experience
        </h2>
        <Divider color="#e5e7eb76" />
        <div className="mt-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-foreground">Software Engineer</h3>
            <span className="text-primary font-medium">2022 - Present</span>
          </div>
          <p className="text-lg text-muted-foreground mb-4">Tiller</p>
          <ul className="space-y-2 text-foreground">
            <li className="flex gap-2"><span className="text-primary">•</span> Developed and maintained web applications using React.js and Next.js</li>
            <li className="flex gap-2"><span className="text-primary">•</span> Integrated REST APIs for seamless data communication</li>
            <li className="flex gap-2"><span className="text-primary">•</span> Worked on authentication systems with role-based access control</li>
            <li className="flex gap-2"><span className="text-primary">•</span> Built interactive dashboards with dynamic data visualization</li>
            <li className="flex gap-2"><span className="text-primary">•</span> Ensured responsive UI/UX using Figma for design references</li>
            <li className="flex gap-2"><span className="text-primary">•</span> Managed version control with Git and Bitbucket</li>
            <li className="flex gap-2"><span className="text-primary">•</span> Implemented CI/CD pipelines using Docker for automated deployments</li>
            <li className="flex gap-2"><span className="text-primary">•</span> Wrote unit tests & integration tests with Jest</li>
          </ul>
        </div>
      </div>

      {/* Education */}
      <div className="card-white p-6 mb-8 animate-fadeUp" style={{ animationDelay: "0.4s" }}>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-primary" />
          Education
        </h2>
        <Divider color="#e5e7eb76" />
        <div className="mt-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-foreground">B.Sc. in Computer Science & Engineering</h3>
              <p className="text-lg text-muted-foreground">Daffodil International University</p>
            </div>
            <span className="text-primary font-medium">2016 - 2020</span>
          </div>
        </div>
      </div>

      {/* Technical Skills */}
      <div className="card-white p-6 mb-8 animate-fadeUp" style={{ animationDelay: "0.5s" }}>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Code className="w-6 h-6 text-primary" />
          Technical Skills
        </h2>
        <Divider color="#e5e7eb76" />
        <div className="mt-6 flex flex-wrap gap-3">
          {tools.map((tool, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="card-white p-6 mb-8 animate-fadeUp" style={{ animationDelay: "0.6s" }}>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-primary" />
          Featured Projects
        </h2>
        <Divider color="#e5e7eb76" />
        <div className="mt-6 space-y-6">
          {projects.map((project, index) => (
            <div key={index} className="border-l-4 border-primary pl-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-foreground">{project.name}</h3>
                <span className="text-primary font-medium">{project.year}</span>
              </div>
              <ul className="space-y-2 text-foreground">
                {project.points.map((point, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-primary">•</span> {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="card-white p-6 mb-8 animate-fadeUp" style={{ animationDelay: "0.7s" }}>
        <h2 className="text-2xl font-bold text-foreground mb-4">Languages</h2>
        <Divider color="#e5e7eb76" />
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">English</h3>
            <p className="text-muted-foreground">Fluent</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Bangla</h3>
            <p className="text-muted-foreground">Native</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Resume;