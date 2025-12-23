import { Linkedin, Twitter, Dribbble, Instagram, Mail } from "lucide-react";
import avatarImg from "@/assets/avatar.jpg";
import Divider from "./divider";
import { getAge } from "@/lib/utils";

const socialLinks = [
  { icon: Linkedin, href: "#" },
  { icon: Dribbble, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Twitter, href: "#" },
];

const profileInfo = [
  { label: "Residence:", value: "Mirpur" },
  { label: "City:", value: "Dhaka" },
  { label: "Age:", value: `${getAge("1998-06-25").toString()} yrs` },
];

const ProfileCard = () => {
  return (
    <div className="card-white p-8 w-full max-w-sm animate-scaleIn">
      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-lime">
            <img
              src={avatarImg}
              alt="Emma Trueman"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-lg">
            <span className="text-primary-foreground text-xs font-bold">✓</span>
          </div>
        </div>
      </div>

      {/* Name & Title */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-card-foreground mb-1">Sharif Shaibal</h3>
        <p className="text-sm text-muted-foreground uppercase tracking-wider">
          I'm Full Stack Web Developer
        </p>
        <p className="text-sm text-muted-foreground uppercase tracking-wider">& </p>
        <p className="text-sm text-muted-foreground uppercase tracking-wider">
          Software Engineer
        </p>
      </div>

      {/* Social Links */}
      <Divider />
      <div className="flex justify-center gap-3 mb-6">
        {socialLinks.map((social, index) => (
          <a
            key={index}
            href={social.href}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center 
                       text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300"
          >
            <social.icon className="w-4 h-4" />
          </a>
        ))}
      </div>
      <Divider />

      {/* Profile Info */}
      <div className="space-y-3 mb-6">
        {profileInfo.map((info, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-muted-foreground uppercase tracking-wider text-xs">
              {info.label}
            </span>
            <span className="text-card-foreground font-medium">{info.value}</span>
          </div>
        ))}
      </div>

      {/* Contact Button */}
      <button className="btn-lime w-full flex items-center justify-center gap-2">
        Contact Me
        <Mail className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ProfileCard;
