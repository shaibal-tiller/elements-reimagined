import { useState, /* useRef, */ useEffect } from "react";
import { Menu, X, Download, /* ChevronDown */ } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import cvFile from "@/assets/CV/Shaibal resume 2026.pdf";
// import { useProjects } from "../hooks/useProjects";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Portfolio", href: "portfolio" },
  { name: "Resume", href: "resume" },
  { name: "Contact", href: "contact" },
  { name: "Blog", href: "blog" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const [portfolioOpen, setPortfolioOpen] = useState(false);
  const location = useLocation();
  // const dropdownRef = useRef<HTMLDivElement>(null);
  // const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // const { data: projects, isLoading: projectsLoading } = useProjects();

  // // Extract current project id if on a detail page
  // const currentProjectId = location.pathname.startsWith("/portfolio/")
  //   ? location.pathname.split("/")[2]
  //   : null;

  // // Get up to 5 projects, excluding the current one if on a detail page
  // const dropdownProjects = (projects || [])
  //   .filter((p) => p.id !== currentProjectId)
  //   .slice(0, 5);

  // const hasDropdown = !projectsLoading && dropdownProjects.length > 0;

  const isActive = (href: string) => {
    const path = href.startsWith("/") ? href : `/${href}`;
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleDownloadCV = () => {
    const link = document.createElement("a");
    link.href = cvFile;
    link.download = "Shaibal_Sharif_Resume_2026.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // const openDropdown = () => {
  //   clearTimeout(timeoutRef.current);
  //   setPortfolioOpen(true);
  // };

  // const closeDropdown = () => {
  //   timeoutRef.current = setTimeout(() => setPortfolioOpen(false), 150);
  // };

  // Close mobile menu on route change
  useEffect(() => {
    // setPortfolioOpen(false);
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
    {/* Backdrop overlay when mobile menu is open */}
    {isOpen && (
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={() => setIsOpen(false)}
      />
    )}
    <nav
      style={{ boxShadow: "rgba(0, 0, 0, 0.6) 0px 2px 4px 0px" }}
      className="sticky top-0 left-0 right-0 z-50 bg-[#00283a] backdrop-blur-lg rounded-lg"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            <span className="text-foreground">Shaibal</span>
            <span className="text-primary">Sharif</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`nav-link ${
                  isActive(link.href)
                    ? "text-primary font-semibold border-b-2 border-primary pb-0.5"
                    : ""
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* --- Portfolio hover dropdown (commented out for now) ---
            {navLinks.map((link) =>
              link.name === "Portfolio" && hasDropdown ? (
                <div
                  key={link.name}
                  className="relative"
                  ref={dropdownRef}
                  onMouseEnter={openDropdown}
                  onMouseLeave={closeDropdown}
                >
                  <Link
                    to={link.href}
                    className={`nav-link flex items-center gap-1 ${
                      isActive(link.href)
                        ? "text-primary font-semibold border-b-2 border-primary pb-0.5"
                        : ""
                    }`}
                  >
                    {link.name}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        portfolioOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Link>

                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-200 ${
                      portfolioOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    <div className="bg-slate-800/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl overflow-hidden min-w-[240px]">
                      {dropdownProjects.length > 0 ? (
                        <div className="py-1.5">
                          {dropdownProjects.map((project, i) => (
                            <Link
                              key={project.id}
                              to={`/portfolio/${project.slug}`}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700/50 transition-colors group"
                              style={{
                                animationDelay: `${i * 40}ms`,
                                animation: portfolioOpen
                                  ? `fadeSlideIn 200ms ease-out ${i * 40}ms both`
                                  : "none",
                              }}
                            >
                              <div className="w-8 h-8 rounded-md overflow-hidden flex-shrink-0 bg-slate-700">
                                {(project.coverMedia?.[0]?.src ||
                                  project.images?.[0]?.src) && (
                                  <img
                                    src={
                                      project.coverMedia?.[0]?.src ||
                                      project.images?.[0]?.src
                                    }
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-slate-200 group-hover:text-white truncate font-medium">
                                  {project.title}
                                </p>
                                <p className="text-xs text-slate-500 truncate">
                                  {project.category}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-3 text-sm text-slate-500">
                          No projects yet
                        </div>
                      )}
                      <div className="border-t border-slate-700">
                        <Link
                          to="/portfolio"
                          className="block px-4 py-2.5 text-xs text-slate-400 hover:text-primary hover:bg-slate-700/30 transition-colors text-center font-medium"
                        >
                          View All Projects
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`nav-link ${
                    isActive(link.href)
                      ? "text-primary font-semibold border-b-2 border-primary pb-0.5"
                      : ""
                  }`}
                >
                  {link.name}
                </Link>
              )
            )}
            --- end Portfolio hover dropdown --- */}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={handleDownloadCV}
              className="btn-lime flex items-center gap-2"
            >
              Download CV
              <Download className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 animate-fadeUp">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`nav-link py-2 ${
                    isActive(link.href) ? "text-primary font-semibold" : ""
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {/* Mobile portfolio sub-items (commented out with dropdown)
              {hasDropdown && (
                <div className="pl-4 border-l-2 border-slate-700 space-y-2">
                  {dropdownProjects.slice(0, 3).map((project) => (
                    <Link
                      key={project.id}
                      to={`/portfolio/${project.slug}`}
                      className="block text-sm text-slate-400 hover:text-white py-1 truncate"
                      onClick={() => setIsOpen(false)}
                    >
                      {project.title}
                    </Link>
                  ))}
                </div>
              )}
              */}
              <button
                onClick={handleDownloadCV}
                className="btn-lime flex items-center justify-center gap-2 mt-4"
              >
                Download CV
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
    </>
  );
};

export default Navbar;
