import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import "./Footer.css";

const quickLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Creative Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Courses", href: "#courses" },
  { name: "Contact", href: "#contact" },
];

const socialLinks = [
  { name: "Instagram", href: "https://instagram.com/" },
  { name: "LinkedIn", href: "https://linkedin.com/" },
  { name: "YouTube", href: "https://youtube.com/" },
];

const INFINITY_PATH =
  "M200,100 C250,30 330,20 360,60 C390,100 370,160 320,170 C270,180 240,140 200,100 C160,60 130,20 80,30 C30,40 10,100 40,140 C70,180 150,170 200,100 Z";

const EASE = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const fadeOnlyVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
};

function Footer() {
  const currentYear = new Date().getFullYear();
  const reduceMotion = useReducedMotion();
  const fadeUp = reduceMotion ? fadeOnlyVariants : fadeUpVariants;

  return (
    <footer className="footer-section">
      <div className="footer-bg-glow footer-glow-one" aria-hidden="true" />
      <div className="footer-bg-glow footer-glow-two" aria-hidden="true" />

      <motion.div
        className="footer-container"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="footer-main">
          <motion.div className="footer-brand" variants={fadeUp}>
            <a href="#home" className="footer-logo" aria-label="INIFLOW home">
              <svg className="footer-logo-mark" viewBox="-30 -20 460 240" aria-hidden="true">
                <defs>
                  <linearGradient id="footerLogoGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#5fd4ff" />
                    <stop offset="40%" stopColor="#1f8bff" />
                    <stop offset="100%" stopColor="#0040d8" />
                  </linearGradient>
                </defs>
                <path
                  d={INFINITY_PATH}
                  fill="none"
                  stroke="url(#footerLogoGradient)"
                  strokeWidth="44"
                  strokeLinejoin="round"
                />
                <path
                  d={INFINITY_PATH}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.5)"
                  strokeWidth="10"
                  strokeLinejoin="round"
                  transform="translate(-3 -10)"
                />
              </svg>
              <span className="footer-logo-text">INIFLOW</span>
            </a>

            <p className="footer-description">
              Turning creative ideas into meaningful digital
              experiences through design, animation and technology.
            </p>

            <div className="footer-socials">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="footer-social"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.name}
                  <ArrowUpRight size={14} className="footer-social-icon" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.nav
            className="footer-links"
            aria-label="Footer navigation"
            variants={fadeUp}
          >
            <h3>Quick Links</h3>
            <ul>
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href}>{link.name}</a>
                </li>
              ))}
            </ul>
          </motion.nav>

          <motion.div className="footer-contact" variants={fadeUp}>
            <h3>Let's Connect</h3>
            <p>Have an idea or project in mind?</p>
            <a href="#contact" className="footer-contact-link">
              Let's Talk
              <ArrowUpRight size={17} className="footer-contact-icon" />
            </a>
          </motion.div>
        </div>

        <motion.div className="footer-bottom" variants={fadeUp}>
          <p>© {currentYear} INIFLOW. All rights reserved.</p>

          <a href="#home" className="footer-back-top">
            Back to Top
            <span className="footer-back-top-icon">
              <ArrowUp size={16} />
            </span>
          </a>
        </motion.div>
      </motion.div>

      <div className="footer-watermark" aria-hidden="true">
        INIFLOW
      </div>
    </footer>
  );
}

export default Footer;