import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StorySection from "@/components/StorySection";
import ServicesSection from "@/components/ServicesSection";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className=" bg-[#02162C] relative">

      <div className="shadow-lg fixed top-0 left-0 right-0 bg-[#02162C]  p-3 pb-0 z-[99]">
        <Navbar />
      </div>
     
      <HeroSection />
      <StorySection />
      <ServicesSection />
      <PricingSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;
