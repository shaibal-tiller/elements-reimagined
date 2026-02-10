import React, { useState, useEffect } from "react";
import { Linkedin, Twitter, Dribbble, Instagram, Mail, Facebook, Github } from "lucide-react";
import avatarImg from "@/assets/avatar.jpg";
import Divider from "./divider";
import { getAge } from "@/lib/utils";

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/in/shaibal-sharif/" },
  { icon: Facebook, href: "https://www.facebook.com/shaibalsharif/" },
  { icon: Instagram, href: "#" },
  {
    icon: Github,
    href: "#",
    isGithub: true,
    accounts: [
      { name: "shaibal-tiller", url: "https://github.com/shaibal-tiller" },
      { name: "shaibalsharif", url: "https://github.com/shaibalsharif" }
    ]
  },
  { icon: Mail, href: `https://wa.me/8801521330598` },
];

const profileInfo = [
  { label: "Residence:", value: "Mirpur" },
  { label: "City:", value: "Dhaka" },
  { label: "Age:", value: `${getAge("1998-06-25").toString()} yrs` },
];

const ProfileCard = () => {
  const fullText = "I'm a Software Engineer working as a Full Stack Web Developer";
  const [displayText, setDisplayText] = useState("");
  const [showGithubMenu, setShowGithubMenu] = useState(false);

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.github-menu-container')) {
        setShowGithubMenu(false);
      }
    };

    if (showGithubMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showGithubMenu]);

  const handleGithubClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowGithubMenu(!showGithubMenu);
  };

  return (
    <div className="relative w-full max-w-sm animate-scaleIn h-fit">
      {/* Background gradient matching the screenshot */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-teal-900 rounded-3xl" />

      {/* Content - Added proper padding bottom */}
      <div className="relative p-8 pb-10 text-white">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-36 h-36 rounded-full overflow-hidden ring-4 ring-slate-700/50">
              <img
                src={avatarImg}
                alt="Sharif Shaibal"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-2 right-2 w-7 h-7 bg-lime-500 rounded-full border-4 border-slate-800"></div>
          </div>
        </div>

        {/* Name & Title */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">Sharif Shaibal</h3>
          <p className="text-xs text-slate-300 uppercase tracking-[0.2em] leading-relaxed min-h-[50px] px-2">
            {displayText}
            <span className="inline-block w-[2px] h-3 bg-lime-500 ml-1 animate-pulse align-middle" />
          </p>
        </div>

        {/* Divider */}
        <div className="mb-5">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-3 mb-5">
          {socialLinks.map((social, index) => (
            <div key={index} className="relative github-menu-container">
              {social.isGithub ? (
                <>
                  <button
                    onClick={handleGithubClick}
                    className="w-11 h-11 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700
                             flex items-center justify-center text-white hover:bg-lime-500 hover:border-lime-400
                             hover:text-slate-900 transition-all duration-300 hover:scale-110"
                    aria-label="GitHub accounts"
                  >
                    <social.icon className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {showGithubMenu && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-slate-800 
                                  border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 min-w-[170px]
                                  animate-in fade-in slide-in-from-top-2 duration-200">
                      {social.accounts?.map((account, idx) => (
                        <a
                          key={idx}
                          href={account.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-3 py-2.5 text-xs text-slate-200 hover:bg-lime-500 
                                   hover:text-slate-900 transition-all border-b border-slate-700 last:border-b-0
                                   flex items-center gap-2 font-medium"
                          onClick={() => setShowGithubMenu(false)}
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>{account.name}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <a
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="w-11 h-11 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700
                           flex items-center justify-center text-white hover:bg-lime-500 hover:border-lime-400
                           hover:text-slate-900 transition-all duration-300 hover:scale-110"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mb-5">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
        </div>

        {/* Profile Info */}
        <div className="space-y-3 mb-5">
          {profileInfo.map((info, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-white font-semibold uppercase tracking-wider text-xs">
                {info.label}
              </span>
              <span className="text-slate-300 font-medium text-sm">{info.value}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mb-6">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
        </div>

        {/* Contact Button */}
        <a
          href="https://wa.me/8801521330598"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-3/4 mx-auto py-3 px-6 bg-lime-500 hover:bg-lime-400 
                   text-slate-900 font-bold rounded-full text-center transition-all duration-300
                   hover:scale-105 shadow-lg hover:shadow-lime-500/50 flex items-center justify-center gap-2 text-sm"
        >
          Contact Me
          <Mail className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export default ProfileCard;