import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Briefcase, GraduationCap, Code, Globe, Users, ExternalLink, Play, UserCheck, Loader2 } from 'lucide-react';
import Divider from '@/components/divider';
import { useResume } from '@/hooks/useResume';
import { useProfile, useLinks } from '@/hooks/useProfile';
import { getGDriveEmbedUrl } from '@/lib/mediaUtils';

const Resume: React.FC = () => {
  const { data: resume, isLoading, error } = useResume();
  const { data: profile } = useProfile();
  const { data: links } = useLinks();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="card-white p-8 text-center animate-fadeUp">
        <p className="text-muted-foreground">
          {error?.message || "Resume data not available. Please add it from the admin panel."}
        </p>
      </div>
    );
  }

  // Derive embed URL from the stored video URL
  const videoEmbedUrl = resume.videoResumeUrl
    ? getGDriveEmbedUrl(resume.videoResumeUrl) || resume.videoResumeUrl
    : null;

  return (
    <>
      {/* Contact Info */}
      <div className="card-white p-6 mb-8 animate-fadeUp">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Mail className="w-6 h-6 text-primary" />
          Contact Information
        </h2>
        <Divider color="#e5e7eb76" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {profile?.primary_phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary" />
              <span className="text-foreground">{profile.primary_phone}</span>
            </div>
          )}
          {profile?.email && (
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <span className="text-foreground">{profile.email}</span>
            </div>
          )}
          {profile?.full_address && (
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-foreground">{profile.full_address}</span>
            </div>
          )}
          {links?.linkedin && (
            <div className="flex items-center gap-3">
              <Linkedin className="w-5 h-5 text-primary" />
              <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {links.linkedin.replace('https://', '')}
              </a>
            </div>
          )}
          {links?.github && (
            <div className="flex items-center gap-3">
              <Github className="w-5 h-5 text-primary" />
              <a href={links.github} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {links.github.replace('https://', '')}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Profile */}
      {resume.profile && (
        <div className="card-white p-6 mb-8 animate-fadeUp">
          <h2 className="text-2xl font-bold text-foreground mb-4">Profile</h2>
          <Divider color="#e5e7eb76" />
          <p className="text-foreground mt-4 leading-relaxed">{resume.profile}</p>
        </div>
      )}

      {/* Video Resume */}
      {videoEmbedUrl && (
        <div id="video-resume" className="card-white p-6 mb-8 animate-fadeUp">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Play className="w-6 h-6 text-primary" />
            Video Resume
          </h2>
          <Divider color="#e5e7eb76" />
          <div className="mt-4 aspect-video rounded-lg overflow-hidden bg-black">
            <iframe
              src={videoEmbedUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Work Experience */}
      {resume.workExperience && resume.workExperience.length > 0 && (
        <div className="card-white p-6 mb-8 animate-fadeUp">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" />
            Work Experience
          </h2>
          <Divider color="#e5e7eb76" />
          <div className="mt-6 space-y-8">
            {resume.workExperience.map((exp, index) => (
              <div key={index} className="border-l-4 border-primary pl-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
                  <h4 className="text-lg font-semibold text-foreground">{exp.project}</h4>
                  {exp.period && <span className="text-primary font-medium text-sm whitespace-nowrap">{exp.period}</span>}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-sm text-muted-foreground">{exp.client}</p>
                  {exp.link && (
                    <a href={exp.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      {exp.link.replace('https://', '')}
                    </a>
                  )}
                </div>
                <ul className="space-y-2 text-foreground text-sm">
                  {exp.points.map((point, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-primary mt-1 shrink-0">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Skills */}
      {resume.skillCategories && resume.skillCategories.length > 0 && (
        <div className="card-white p-6 mb-8 animate-fadeUp">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Code className="w-6 h-6 text-primary" />
            Technical Skills
          </h2>
          <Divider color="#e5e7eb76" />
          <div className="mt-6 space-y-6">
            {resume.skillCategories.map((category, index) => (
              <div key={index}>
                <h3 className="text-md font-semibold text-foreground mb-3">{category.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Competencies */}
      {resume.competencies && resume.competencies.length > 0 && (
        <div className="card-white p-6 mb-8 animate-fadeUp">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Professional Competencies
          </h2>
          <Divider color="#e5e7eb76" />
          <div className="mt-6 flex flex-wrap gap-3">
            {resume.competencies.map((item, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education && resume.education.length > 0 && (
        <div className="card-white p-6 mb-8 animate-fadeUp">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary" />
            Education
          </h2>
          <Divider color="#e5e7eb76" />
          <div className="mt-6 space-y-6">
            {resume.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{edu.institution}</h3>
                  <p className="text-muted-foreground">{edu.degree}</p>
                  {edu.grade && <p className="text-sm text-primary font-medium">{edu.grade}</p>}
                </div>
                <span className="text-primary font-medium">{edu.period}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {resume.languages && resume.languages.length > 0 && (
        <div className="card-white p-6 mb-8 animate-fadeUp">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" />
            Languages
          </h2>
          <Divider color="#e5e7eb76" />
          <div className="mt-6 grid grid-cols-2 gap-4">
            {resume.languages.map((lang, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-foreground mb-1">{lang.name}</h3>
                <p className="text-muted-foreground">{lang.level}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* References */}
      {resume.references && resume.references.length > 0 && (
        <div className="card-white p-6 mb-8 animate-fadeUp">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-primary" />
            References
          </h2>
          <Divider color="#e5e7eb76" />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {resume.references.map((ref, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-foreground">{ref.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{ref.title}</p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <span className="text-foreground">{ref.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-foreground">{ref.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Resume;
