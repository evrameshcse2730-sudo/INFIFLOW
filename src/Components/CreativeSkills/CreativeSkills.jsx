import { useCallback } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
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

const EASE = [0.22, 1, 0.36, 1];

const headingVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const fadeOnlyVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
};

const lineRevealVariants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.9, ease: EASE } },
};

function SkillCard({ skill, variants, reduceMotion }) {
  const Icon = skill.icon;

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 150, damping: 18 });
  const smoothY = useSpring(pointerY, { stiffness: 150, damping: 18 });
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);

  const handlePointerMove = useCallback(
    (event) => {
      const card = event.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);

      if (reduceMotion || event.pointerType !== "mouse") return;
      pointerX.set(x / rect.width - 0.5);
      pointerY.set(y / rect.height - 0.5);
    },
    [reduceMotion, pointerX, pointerY]
  );

  const handlePointerLeave = useCallback(() => {
    pointerX.set(0);
    pointerY.set(0);
  }, [pointerX, pointerY]);

  return (
    <motion.article
      className="skill-card"
      variants={variants}
      whileHover={reduceMotion ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      style={
        reduceMotion
          ? undefined
          : { rotateX, rotateY, transformPerspective: 900 }
      }
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="skill-card-top">
        <span className="skill-icon">
          <Icon size={26} strokeWidth={1.7} />
        </span>
        <span className="skill-number" aria-hidden="true">
          {skill.number}
        </span>
      </div>

      <h3 className="skill-title">{skill.title}</h3>
      <p className="skill-description">{skill.description}</p>

      <span className="skill-card-line" aria-hidden="true" />
    </motion.article>
  );
}

function CreativeSkills() {
  const reduceMotion = useReducedMotion();

  const fadeUp = reduceMotion ? fadeOnlyVariants : fadeUpVariants;
  const lineReveal = reduceMotion ? fadeOnlyVariants : lineRevealVariants;

  return (
    <section className="creative-skills" id="skills">
      <div className="skills-bg-glow skills-glow-one" aria-hidden="true" />
      <div className="skills-bg-glow skills-glow-two" aria-hidden="true" />

      <div className="creative-skills-container">
        <motion.div
          className="skills-heading"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={headingVariants}
        >
          <motion.span className="skills-label" variants={fadeUp}>
            What I Do
          </motion.span>

          <h2 className="skills-title" aria-label="Creative Skills.">
            <span className="skills-title-line">
              <motion.span className="skills-title-inner" variants={lineReveal}>
                Creative <span className="skills-gradient-text">Skills.</span>
              </motion.span>
            </span>
          </h2>

          <motion.p className="skills-subtitle" variants={fadeUp}>
            A combination of creativity, technology and imagination
            to create engaging digital experiences.
          </motion.p>
        </motion.div>

        <motion.div
          className="skills-grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={gridVariants}
        >
          {skills.map((skill) => (
            <SkillCard
              key={skill.number}
              skill={skill}
              variants={fadeUp}
              reduceMotion={reduceMotion}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default CreativeSkills;