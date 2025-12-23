import Divider from "./divider";

const StorySection = () => {
  return (
    <section id="about" className="py-24 bg-[#02162C]">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-bold text-foreground w-[20%]">My story </h2>

            <Divider />
          </div>

          {/* Quote */}
          <div className="card-dark p-12 relative">
            <span className="quote-mark absolute top-6 left-8">"</span>
            <blockquote className="text-lg md:text-xl text-foreground leading-relaxed pl-12 pr-12 italic">
              I build modern, scalable web interfaces with a strong focus on performance and user experience.
              Specializing in React and Next.js, I create data-driven dashboards and complex systems that feel simple to use.
              From design to deployment, I turn ideas into reliable digital products.
            </blockquote>
            <span className="quote-mark absolute bottom-6 right-8 rotate-180">"</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
