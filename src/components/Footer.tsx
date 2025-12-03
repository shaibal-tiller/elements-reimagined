import { Linkedin, Twitter, Dribbble, Instagram, Heart } from "lucide-react";

const socialLinks = [
  { icon: Linkedin, href: "#" },
  { icon: Dribbble, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Twitter, href: "#" },
];

const Footer = () => {
  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <a href="#home" className="text-2xl font-bold">
            <span className="text-foreground">True</span>
            <span className="text-primary">man</span>
          </a>

          {/* Copyright */}
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-primary fill-primary" /> © 2024 Trueman
          </p>

          {/* Social Links */}
          <div className="flex gap-3">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="social-icon"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
