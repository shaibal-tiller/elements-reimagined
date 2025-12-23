import { useState } from "react";
import { Send, MapPin, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  { icon: MapPin, label: "Address", value: "Mirpur, Dhaka, Bangladesh" },
  { icon: Mail, label: "Email", value: "shaibalsharif@gmail.com" },
  { icon: Phone, label: "Phone", value: "+88 01521330598" },
];

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "Thank you for reaching out. I'll get back to you soon.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-24 bg-[#02162C]">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl font-bold text-foreground">Write me a message</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto bg-[#00283A] rounded-3xl">
          {/* Contact Form */}
          <div className="card-dark p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground !bg-[#02162C]
                             placeholder:text-muted-foreground focus:outline-none focus:border-primary 
                             transition-colors duration-300"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground !bg-[#02162C]
                             placeholder:text-muted-foreground focus:outline-none focus:border-primary 
                             transition-colors duration-300"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground !bg-[#02162C]
                             placeholder:text-muted-foreground focus:outline-none focus:border-primary 
                             transition-colors duration-300 resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>
              <button type="submit" className="btn-lime w-full flex items-center justify-center gap-2">
                Send Message
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              * I promise the confidentiality of your personal information
            </p>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">Let's work together</h3>
              <p className="text-muted-foreground leading-relaxed">
                I'm always excited to take on new projects and collaborate with amazing people. 
                Whether you have a question or just want to say hi, feel free to reach out!
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <info.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{info.label}</p>
                    <p className="text-foreground font-medium">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
