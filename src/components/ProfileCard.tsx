import React, { useState, useEffect, useRef, useCallback } from "react";
import { Linkedin, Twitter, Dribbble, Instagram, Mail, Facebook, Github } from "lucide-react";
import avatarImg from "@/assets/avatar.jpg";
import Divider from "./divider";
import { getAge } from "@/lib/utils";

const HIRE_TEXT = "AVAILABLE FOR HIRE";

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

  // "Available for Hire" badge state
  const [badgeExpanded, setBadgeExpanded] = useState(false);
  const [badgeText, setBadgeText] = useState("");
  const badgeTypingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startBadgeTyping = useCallback(() => {
    setBadgeExpanded(true);
    setBadgeText("");
    if (badgeTypingRef.current) clearInterval(badgeTypingRef.current);
    let i = 0;
    badgeTypingRef.current = setInterval(() => {
      i++;
      if (i <= HIRE_TEXT.length) {
        setBadgeText(HIRE_TEXT.slice(0, i));
      } else {
        if (badgeTypingRef.current) clearInterval(badgeTypingRef.current);
      }
    }, 55);
  }, []);

  const collapseBadge = useCallback(() => {
    if (badgeTypingRef.current) clearInterval(badgeTypingRef.current);
    setBadgeText("");
    setBadgeExpanded(false);
  }, []);

  useEffect(() => {
    return () => { if (badgeTypingRef.current) clearInterval(badgeTypingRef.current); };
  }, []);

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

  const renderSocialLinks = (compact = false) => {
    const size = compact ? "w-9 h-9" : "w-11 h-11";
    const iconSize = compact ? "w-3.5 h-3.5" : "w-4 h-4";
    return socialLinks.map((social, index) => (
      <div key={index} className="relative github-menu-container">
        {social.isGithub ? (
          <>
            <button
              onClick={handleGithubClick}
              className={`${size} rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700
                       flex items-center justify-center text-white hover:bg-lime-500 hover:border-lime-400
                       hover:text-slate-900 transition-all duration-300 hover:scale-110`}
              aria-label="GitHub accounts"
            >
              <social.icon className={iconSize} />
            </button>
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
                    className="flex items-center gap-2 px-3 py-2.5 text-xs text-slate-200 hover:bg-lime-500
                             hover:text-slate-900 transition-all border-b border-slate-700 last:border-b-0 font-medium"
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
            className={`${size} rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700
                     flex items-center justify-center text-white hover:bg-lime-500 hover:border-lime-400
                     hover:text-slate-900 transition-all duration-300 hover:scale-110`}
          >
            <social.icon className={iconSize} />
          </a>
        )}
      </div>
    ));
  };

  return (
    <div className="relative w-full max-w-sm animate-scaleIn h-fit">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-teal-900 rounded-3xl" />

      {/* Desktop: full vertical layout */}
      <div className="relative p-8 pb-10 text-white hidden md:block">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div
            className="relative"
            onMouseEnter={startBadgeTyping}
            onMouseLeave={collapseBadge}
          >
            <div className={`w-36 h-36 rounded-full overflow-hidden ring-4 transition-all duration-700 ${badgeExpanded ? "ring-lime-500/60 scale-90" : "ring-slate-700/50 scale-100"}`}>
              <img
                src={avatarImg}
                alt="Sharif Shaibal"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Green dot → expands into "AVAILABLE FOR HIRE" pill */}
            <div
              className="absolute bottom-1 right-1 bg-lime-500 border-4 border-slate-800 rounded-full flex items-center justify-center overflow-hidden whitespace-nowrap"
              style={{
                width: badgeExpanded ? 180 : 28,
                height: badgeExpanded ? 32 : 28,
                transition: "width 700ms cubic-bezier(0.4,0,0.2,1), height 500ms cubic-bezier(0.4,0,0.2,1), box-shadow 600ms ease",
                boxShadow: badgeExpanded ? "0 0 16px rgba(132,204,22,0.5)" : "none",
              }}
            >
              <span
                className="text-slate-900 text-[10px] font-bold tracking-widest uppercase"
                style={{
                  opacity: badgeExpanded ? 1 : 0,
                  transition: "opacity 400ms ease 350ms",
                }}
              >
                {badgeText}
                {badgeExpanded && (
                  <span className="inline-block w-[1px] h-2.5 bg-slate-900 ml-0.5 animate-pulse align-middle" />
                )}
              </span>
            </div>
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

        <div className="h-[1px] bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-5" />

        {/* Social Links */}
        <div className="flex justify-center gap-3 mb-5">
          {renderSocialLinks()}
        </div>

        <div className="h-[1px] bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-5" />

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

        <div className="h-[1px] bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-6" />

        {/* Contact Button */}
        <a
          href="https://wa.me/8801521330598"
          target="_blank"
          rel="noopener noreferrer"
          className="w-3/4 mx-auto py-3 px-6 bg-lime-500 hover:bg-lime-400
                   text-slate-900 font-bold rounded-full text-center transition-all duration-300
                   hover:scale-105 shadow-lg hover:shadow-lime-500/50 flex items-center justify-center gap-2 text-sm"
        >
          Contact Me
          <Mail className="w-4 h-4" />
        </a>
      </div>

      {/* Mobile: compact horizontal layout */}
      <div className="relative p-5 text-white md:hidden">
        <div className="flex items-center gap-4 mb-4">
          {/* Small avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-slate-700/50">
              <img src={avatarImg} alt="Sharif Shaibal" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-lime-500 border-[3px] border-slate-800 rounded-full" />
          </div>
          {/* Name + title */}
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-white leading-tight">Sharif Shaibal</h3>
            <p className="text-[10px] text-lime-400 font-bold uppercase tracking-widest mt-1">Available for Hire</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1 line-clamp-2">
              Software Engineer &bull; Full Stack Developer
            </p>
          </div>
        </div>

        {/* Info row */}
        <div className="flex justify-between text-[10px] uppercase tracking-wider mb-4 px-1">
          {profileInfo.map((info, index) => (
            <div key={index} className="text-center">
              <span className="text-slate-400 block">{info.label}</span>
              <span className="text-white font-semibold">{info.value}</span>
            </div>
          ))}
        </div>

        {/* Social + CTA row */}
        <div className="flex items-center gap-2">
          <div className="flex gap-2 flex-1">
            {renderSocialLinks(true)}
          </div>
          <a
            href="https://wa.me/8801521330598"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 py-2 px-5 bg-lime-500 active:bg-lime-400
                     text-slate-900 font-bold rounded-full text-xs flex items-center gap-1.5 shadow-lg"
          >
            Contact
            <Mail className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;