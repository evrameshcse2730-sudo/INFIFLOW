import { Fragment, useCallback, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import "./About.css";

const EASE = [0.22, 1, 0.36, 1];

const headingLines = [
  { text: "Creativity meets" },
  { accent: "Technology." },
];

const visualWords = [
  { word: "DESIGN", symbol: "✳" },
  { word: "CREATE", symbol: "∞" },
  { word: "ANIMATE" },
];

const contentVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const titleVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const wordsVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
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

function About() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 120, damping: 18 });
  const smoothY = useSpring(pointerY, { stiffness: 120, damping: 18 });

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
  const glareX = useTransform(smoothX, [-0.5, 0.5], ["20%", "80%"]);
  const glareY = useTransform(smoothY, [-0.5, 0.5], ["15%", "85%"]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255, 255, 255, 0.7), transparent 55%)`;

  const handlePointerMove = useCallback(
    (event) => {
      if (reduceMotion || event.pointerType !== "mouse") return;
      const rect = event.currentTarget.getBoundingClientRect();
      pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
      pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
    },
    [reduceMotion, pointerX, pointerY]
  );

  const handlePointerLeave = useCallback(() => {
    pointerX.set(0);
    pointerY.set(0);
  }, [pointerX, pointerY]);

  const fadeUp = reduceMotion ? fadeOnlyVariants : fadeUpVariants;
  const lineReveal = reduceMotion ? fadeOnlyVariants : lineRevealVariants;

  return (
    <section ref={sectionRef} className="about-section" id="about">
      <div className="about-bg-glow about-glow-one" aria-hidden="true" />
      <div className="about-bg-glow about-glow-two" aria-hidden="true" />

      <div className="about-container">
        <motion.div
          className="about-content"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={contentVariants}
        >
          <motion.span className="about-label" variants={fadeUp}>
            About Me
          </motion.span>

          <motion.h2
            className="about-title"
            variants={titleVariants}
            aria-label="Creativity meets Technology."
          >
            {headingLines.map((line) => (
              <span className="about-title-line" key={line.text || line.accent}>
                <motion.span className="about-title-inner" variants={lineReveal}>
                  {line.text}
                  {line.accent && (
                    <span className="about-gradient-text">{line.accent}</span>
                  )}
                </motion.span>
              </span>
            ))}
          </motion.h2>

          <motion.p className="about-description" variants={fadeUp}>
            I'm a creative enthusiast passionate about motion design,
            3D animation, video editing, and visual storytelling.
            I transform ideas into engaging digital experiences
            through creativity and technology.
          </motion.p>

          <motion.p className="about-description" variants={fadeUp}>
            My focus is on continuously learning, experimenting,
            and creating meaningful visual work.
          </motion.p>

          <motion.div className="about-actions" variants={fadeUp}>
            <a href="#contact" className="about-link">
              Let's Connect
              <span className="about-link-icon">
                <ArrowUpRight size={17} />
              </span>
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="about-visual"
          style={reduceMotion ? undefined : { y: parallaxY }}
        >
          <motion.div
            className="about-visual-reveal"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: EASE }}
          >
            <motion.div
              className="about-visual-card"
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
              style={reduceMotion ? undefined : { rotateX, rotateY }}
            >
              <span className="about-orbit about-orbit-one" aria-hidden="true" />
              <span className="about-orbit about-orbit-two" aria-hidden="true" />

              {!reduceMotion && (
                <motion.span
                  className="about-card-glare"
                  style={{ background: glare }}
                  aria-hidden="true"
                />
              )}

              <motion.div
                className="about-words"
                aria-label="Design, Create, Animate"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
                variants={wordsVariants}
              >
                {visualWords.map(({ word, symbol }, index) => (
                  <Fragment key={word}>
                    <motion.span
                      className={`about-word ${index === 1 ? "is-accent" : ""}`}
                      variants={fadeUp}
                    >
                      {word}
                    </motion.span>
                    {symbol && (
                      <motion.span
                        className={`about-symbol ${symbol === "✳" ? "is-spinning" : ""}`}
                        variants={fadeUp}
                        aria-hidden="true"
                      >
                        {symbol}
                      </motion.span>
                    )}
                  </Fragment>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default About;