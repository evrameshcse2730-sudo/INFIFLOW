import { motion } from "framer-motion";
import {
  Clapperboard,
  Layers,
  Box,
  Palette,
  WandSparkles,
  MonitorPlay,
} from "lucide-react";
import "./CreativeSkills.css";

const skills = [
  {
    number: "01",
    title: "Video Editing",
    description:
      "Creating engaging videos with cinematic cuts, storytelling and professional editing.",
    icon: Clapperboard,
  },
  {
    number: "02",
    title: "Motion Graphics",
    description:
      "Bringing ideas to life through smooth animations and dynamic visual elements.",
    icon: Layers,
  },
  {
    number: "03",
    title: "3D Animation",
    description:
      "Exploring 3D worlds, modelling, lighting and animation to create immersive visuals.",
    icon: Box,
  },
  {
    number: "04",
    title: "Graphic Design",
    description:
      "Designing clean and meaningful visuals with typography, colours and composition.",
    icon: Palette,
  },
  {
    number: "05",
    title: "Visual Effects",
    description:
      "Combining creative effects and visual techniques to enhance video experiences.",
    icon: WandSparkles,
  },
  {
    number: "06",
    title: "Creative Production",
    description:
      "Turning creative concepts into polished digital content and visual stories.",
    icon: MonitorPlay,
  },
];

function CreativeSkills() {
  return (
    <section className="creative-skills" id="skills">
      <div className="creative-skills-container">
        <motion.div
          className="skills-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="skills-label">WHAT I DO</span>
          <h2>
            Creative <span>Skills.</span>
          </h2>
          <p>
            A combination of creativity, technology and imagination
            to create engaging digital experiences.
          </p>
        </motion.div>

        <div className="skills-grid">
          {skills.map((skill, index) => {
            const Icon = skill.icon;

            return (
              <motion.article
                className="skill-card"
                key={skill.number}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                whileHover={{ y: -8 }}
              >
                <div className="skill-card-top">
                  <span className="skill-number">{skill.number}</span>
                  <Icon size={27} strokeWidth={1.6} />
                </div>

                <h3>{skill.title}</h3>
                <p>{skill.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CreativeSkills;