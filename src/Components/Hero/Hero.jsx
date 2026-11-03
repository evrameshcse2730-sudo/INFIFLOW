
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Play,
  Sparkles,
  Code2,
  Layers3,
  Box,
} from "lucide-react";
import "./Hero.css";

const floatingItems = [
  { icon: Code2, label: "Creative Coding", className: "hero-float-one" },
  { icon: Layers3, label: "Motion Design", className: "hero-float-two" },
  { icon: Box, label: "3D Creativity", className: "hero-float-three" },
];

function Hero() {
  return (
    <section className="hero-section" id="home">
      <div className="hero-bg-glow hero-glow-one" />
      <div className="hero-bg-glow hero-glow-two" />
      <div className="hero-grid-pattern" />

      <div className="hero-container">
        <div className="hero-content">
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles size={15} />
            <span>CREATIVITY MEETS TECHNOLOGY</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            Turning Ideas Into
            <span className="hero-gradient-text">
              {" "}Digital Experiences.
            </span>
          </motion.h1>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            I'm a creative designer and digital creator passionate about
            video editing, motion graphics, 3D animation and visual
            storytelling. I create experiences that inspire and connect.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
          >
            <a href="#projects" className="hero-primary-btn">
              Explore My Work
              <ArrowUpRight size={19} />
            </a>

            <a href="#about" className="hero-secondary-btn">
              <span className="hero-play-icon">
                <Play size={15} fill="currentColor" />
              </span>
              Discover More
            </a>
          </motion.div>

          <motion.div
            className="hero-bottom-info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <span className="hero-status-dot" />
            <span>AVAILABLE FOR CREATIVE PROJECTS</span>
          </motion.div>
        </div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.85, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="hero-orbit hero-orbit-one" />
          <div className="hero-orbit hero-orbit-two" />

          <motion.div
            className="hero-main-card"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="hero-card-top">
              <span className="hero-card-dot" />
              <span className="hero-card-dot" />
              <span className="hero-card-dot" />
              <span className="hero-card-label">INIFLOW / CREATIVE SPACE</span>
            </div>

            <div className="hero-card-art">
              <div className="hero-art-circle" />
              <div className="hero-art-square" />
              <div className="hero-art-line" />
              <div className="hero-art-center">
                <span>IN</span>
                <strong>FLOW</strong>
              </div>
              <div className="hero-art-sparkle">
                <Sparkles size={30} />
              </div>
            </div>

            <div className="hero-card-bottom">
              <div>
                <span>CREATIVE PORTFOLIO</span>
                <h3>Imagine. Create. Inspire.</h3>
              </div>
              <ArrowUpRight size={25} />
            </div>
          </motion.div>

          {floatingItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.label}
                className={`hero-floating-card ${item.className}`}
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3 + index,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <span className="hero-floating-icon">
                  <Icon size={19} />
                </span>
                <span>{item.label}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <motion.a
        href="#about"
        className="hero-scroll"
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <span>SCROLL TO EXPLORE</span>
        <ArrowDown size={17} />
      </motion.a>
    </section>
  );
}

export default Hero;
