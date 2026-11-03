import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import "./About.css"

function About() {
  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <motion.div
          className="about-content"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="about-label">ABOUT ME</span>

          <h2>
            Creativity meets
            <span> Technology.</span>
          </h2>

          <p>
            I'm a creative enthusiast passionate about motion design,
            3D animation, video editing, and visual storytelling.
            I transform ideas into engaging digital experiences
            through creativity and technology.
          </p>

          <p>
            My focus is on continuously learning, experimenting,
            and creating meaningful visual work.
          </p>

          <a href="#contact" className="about-link">
            Let's Connect <ArrowUpRight size={18} />
          </a>
        </motion.div>

        <motion.div
          className="about-visual"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="about-visual-card">
            <span>DESIGN</span>
            <span className="about-symbol">✳</span>
            <span>CREATE</span>
            <span className="about-symbol">∞</span>
            <span>ANIMATE</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default About;