
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import "./Navbar.css";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Courses", href: "#courses" },
  { name: "Contact", href: "#contact" },
];

const SECTION_IDS = navLinks.map((link) => link.href.slice(1));
const MOBILE_BREAKPOINT = 850;
const EASE = [0.22, 1, 0.36, 1];

const panelVariants = {
  hidden: { opacity: 0, y: -12, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: EASE,
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: { duration: 0.2, ease: EASE },
  },
};

const panelItemVariants = {
  hidden: { opacity: 0, y: -6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASE },
  },
};

const fadeVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState("home");

  const reduceMotion = useReducedMotion();

  const closeMenu = () => setMenuOpen(false);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Active navigation section detection
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      return undefined;
    }

    const sections = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-45% 0px -50% 0px",
      }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Mobile menu keyboard and resize handling
  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [menuOpen]);

  const pillTransition = reduceMotion
    ? { duration: 0 }
    : {
        type: "spring",
        stiffness: 380,
        damping: 32,
      };

  return (
    <motion.header
      className={`iniflow-navbar ${
        scrolled || menuOpen ? "is-scrolled" : ""
      }`}
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: -20 }
      }
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <nav
        className="navbar-container"
        aria-label="Main navigation"
      >
        {/* INIFLOW Logo */}
        <a
          href="#home"
          className="navbar-logo"
          onClick={closeMenu}
          aria-label="INIFLOW home"
        >
          <img
            
  src="https://res.cloudinary.com/tezenm9e/image/upload/v1793765157/fyfx1wgmvxgm0wqxst78.png"
  alt="INIFLOW"
  className="navbar-logo-image"
  fetchPriority="high"
/>
          
        </a>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          {navLinks.map((link) => {
            const isActive =
              activeId === link.href.slice(1);

            return (
              <a
                key={link.name}
                href={link.href}
                className={`navbar-link ${
                  isActive ? "is-active" : ""
                }`}
                aria-current={
                  isActive ? "location" : undefined
                }
                onClick={closeMenu}
              >
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-pill"
                    className="navbar-active-pill"
                    transition={pillTransition}
                  />
                )}

                <span className="navbar-link-text">
                  {link.name}
                </span>
              </a>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <a
          href="#contact"
          className="navbar-cta"
          onClick={closeMenu}
        >
          Let's Talk
          <ArrowUpRight
            size={16}
            className="navbar-cta-icon"
          />
        </a>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="navbar-menu-button"
          onClick={() =>
            setMenuOpen((open) => !open)
          }
          aria-label={
            menuOpen ? "Close menu" : "Open menu"
          }
          aria-expanded={menuOpen}
          aria-controls="navbar-mobile-panel"
        >
          <AnimatePresence
            mode="wait"
            initial={false}
          >
            <motion.span
              key={menuOpen ? "close" : "open"}
              className="navbar-menu-icon"
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, rotate: -90 }
              }
              animate={{
                opacity: 1,
                rotate: 0,
              }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, rotate: 90 }
              }
              transition={{ duration: 0.2 }}
            >
              {menuOpen ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </motion.span>
          </AnimatePresence>
        </button>

        {/* Mobile Navigation Panel */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="navbar-mobile-panel"
              className="navbar-mobile-panel"
              variants={
                reduceMotion
                  ? fadeVariants
                  : panelVariants
              }
              initial="hidden"
              animate="show"
              exit="exit"
            >
              {navLinks.map((link) => {
                const isActive =
                  activeId === link.href.slice(1);

                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    className={`navbar-mobile-link ${
                      isActive ? "is-active" : ""
                    }`}
                    aria-current={
                      isActive ? "location" : undefined
                    }
                    onClick={closeMenu}
                    variants={
                      reduceMotion
                        ? fadeVariants
                        : panelItemVariants
                    }
                  >
                    {link.name}
                  </motion.a>
                );
              })}

              <motion.a
                href="#contact"
                className="navbar-mobile-cta"
                onClick={closeMenu}
                variants={
                  reduceMotion
                    ? fadeVariants
                    : panelItemVariants
                }
              >
                Let's Talk
                <ArrowUpRight size={17} />
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}

export default Navbar;
