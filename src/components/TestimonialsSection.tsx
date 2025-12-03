import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Paul Freeman",
    role: "Interior Designer",
    content: "Working with Emma was an absolute pleasure. Her attention to detail and creative vision transformed our project beyond expectations. I highly recommend her services to anyone looking for exceptional design work.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Oscar Oldman",
    role: "Photographer",
    content: "Emma's design skills are truly remarkable. She understood our brand vision immediately and delivered stunning results. Her professionalism and creativity make her stand out in the industry.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Victoria Newman",
    role: "Model",
    content: "I've worked with many designers, but Emma's work is exceptional. She brings a unique perspective and incredible attention to detail that elevates every project she touches.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl font-bold text-foreground">Testimonials</h2>
          <span className="text-muted-foreground">4</span>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <div className="testimonial-card relative">
            <Quote className="w-12 h-12 text-primary mb-6" />
            
            <p className="text-lg md:text-xl text-foreground leading-relaxed mb-8">
              {current.content}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={current.image}
                  alt={current.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary"
                />
                <div>
                  <h4 className="font-semibold text-foreground">{current.name}</h4>
                  <p className="text-sm text-primary italic">{current.role}</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-2">
                <button
                  onClick={prevTestimonial}
                  className="w-12 h-12 rounded-full border border-border flex items-center justify-center 
                             text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-12 h-12 rounded-full border border-border flex items-center justify-center 
                             text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-primary w-8" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
