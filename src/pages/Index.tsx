import React from 'react';
import { Play } from 'lucide-react';
import StorySection from '@/components/StorySection';
import ServicesSection from '@/components/ServicesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactSection from '@/components/ContactSection';
import Divider from '@/components/divider';

const stats = [
  { number: "74+", label: "Completed Projects" },
  { number: "50+", label: "Happy Customers" },
  { number: "14+", label: "Honors and Awards" },
];

const Index: React.FC = () => {
  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 md:gap-6 mt-8 animate-fadeUp" >
        {stats.map((stat, index) => (
          <div
            key={index}
            className="card-white p-4 md:p-6 text-center hover:scale-105 transition-transform duration-300"
          >
            <div className="text-3xl md:text-5xl font-bold text-primary">{stat.number}</div>
            <Divider color="#e5e7eb76" />
            <div className="text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <StorySection />
      <ServicesSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
};

export default Index;