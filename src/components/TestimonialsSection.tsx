import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Divider from "./divider";

const testimonials = [
  {
    name: "Md. Ahsan Iqbal",
    role: "Software Architect, Tiller",
    content:
      "Shaibal consistently delivered high-quality frontend and full-stack solutions. His understanding of React and Next.js, combined with clean architecture practices, made our applications scalable and maintainable.",
    image:
      "https://images.unsplash.com/photo-1603415526960-f7e0328f9b2b?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Mostafizur Rahman",
    role: "Senior Engineering Manager",
    content:
      "Working with Shaibal was effortless. He took ownership of complex features, collaborated well with backend and design teams, and ensured smooth deployments with proper testing and CI/CD workflows.",
    image:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Project Stakeholder",
    role: "Government Digital Platform",
    content:
      "Shaibal played a key role in building data-driven dashboards and GIS-based visualizations. His technical reliability during development and live operations was invaluable to the project’s success.",
    image:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop&crop=face",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const nextTestimonial = () => {
    setDirection("right");
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection("left");
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section id="testimonials" className="pt-12 bg-[#02162C]">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="mb-12 flex items-center justify-between gap-10">
          <h2 className="text-2xl font-bold text-foreground w-[20%]">Testimonials</h2>
          <Divider />
        </div>

        {/* Testimonial */}
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden">
            <div
              key={currentIndex}
              className={`testimonial-card relative transition-all duration-500 ease-out
                ${direction === "right"
                  ? "animate-slide-in-right"
                  : "animate-slide-in-left"
                }
              `}
            >
              <Quote className="w-12 h-12 text-primary mb-6" />

              <p className="text-lg md:text-xl text-foreground leading-relaxed mb-8">
                {current.content}
              </p>

              <div className="flex items-center justify-between flex-wrap gap-6">
                {/* Author */}
                <div className="flex items-center gap-4">
                  <img
                    src={current.image}
                    alt={current.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {current.name}
                    </h4>
                    <p className="text-sm text-primary italic">
                      {current.role}
                    </p>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-2">
                  <button
                    onClick={prevTestimonial}
                    className="w-12 h-12 rounded-full border border-border flex items-center justify-center 
                               text-muted-foreground hover:border-primary hover:text-primary transition-all"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="w-12 h-12 rounded-full border border-border flex items-center justify-center 
                               text-muted-foreground hover:border-primary hover:text-primary transition-all"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? "right" : "left");
                  setCurrentIndex(index);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                    ? "bg-primary w-8"
                    : "bg-muted-foreground/30 w-2"
                  }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
