import { Palette, Layout, Home, Gamepad2, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Palette,
    title: "Architecture",
    description: "Creating stunning architectural designs that blend form and function seamlessly.",
  },
  {
    icon: Layout,
    title: "UI/UX Design",
    description: "Crafting intuitive user experiences and beautiful interfaces that users love.",
  },
  {
    icon: Home,
    title: "Interior Design",
    description: "Transforming spaces into inspiring environments that reflect your personality.",
  },
  {
    icon: Gamepad2,
    title: "Game Design",
    description: "Building immersive gaming experiences with engaging mechanics and visuals.",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl font-bold text-foreground">My Services</h2>
          <span className="text-muted-foreground">2</span>
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
