import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import { ArrowUpRight } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import "./About.css";

const EASE = [0.22, 1, 0.36, 1];
const SETTINGS_TIMEOUT_MS = 1500;

const DEFAULT_TITLE = "Creativity meets Technology.";
const DEFAULT_DESCRIPTION =
  "I'm a creative enthusiast passionate about motion design, 3D animation, video editing, and visual storytelling. I transform ideas into engaging digital experiences through creativity and technology.\n\nMy focus is on continuously learning, experimenting, and creating meaningful visual work.";

const CLOUDINARY_IMAGE_UPLOAD = "/image/upload/";
const CLOUDINARY_TRIM_TRANSFORM = "e_trim:10/c_limit,h_1400/f_auto,q_auto";

const visualWords = [
  { word: "DESIGN", symbol: "✳" },
  { word: "CREATE", symbol: "∞" },
  { word: "ANIMATE", symbol: "" },
];

const contentVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const titleVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const wordsVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.35 },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

const fadeOnlyVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

const lineRevealVariants = {
  hidden: { y: "110%" },
  show: {
    y: "0%",
    transition: { duration: 0.9, ease: EASE },
  },
};

const cleanText = (value) => (typeof value === "string" ? value.trim() : "");

const safeImageUrl = (value) => {
  const url = cleanText(value);
  return /^https:\/\//i.test(url) ? url : "";
};

// Asks Cloudinary for a lighter copy with the empty transparent edges trimmed off.
function getTrimmedCloudinaryUrl(url) {
  if (!/^https:\/\/res\.cloudinary\.com\//i.test(url)) return "";

  const uploadIndex = url.indexOf(CLOUDINARY_IMAGE_UPLOAD);
  if (uploadIndex === -1) return "";

  const insertAt = uploadIndex + CLOUDINARY_IMAGE_UPLOAD.length;
  if (url.slice(insertAt).startsWith("e_trim")) return "";

  return `${url.slice(0, insertAt)}${CLOUDINARY_TRIM_TRANSFORM}/${url.slice(insertAt)}`;
}

function About() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  const [aboutTitle, setAboutTitle] = useState(DEFAULT_TITLE);
  const [aboutDescription, setAboutDescription] = useState(DEFAULT_DESCRIPTION);
  const [aboutImageUrl, setAboutImageUrl] = useState("");
  const [failedImageSources, setFailedImageSources] = useState([]);
  const [settingsReady, setSettingsReady] = useState(false);

  const contentInView = useInView(contentRef, { once: true, amount: 0.3 });

  // Fetch About settings from Firestore
  useEffect(() => {
    let isMounted = true;

    const timer = setTimeout(() => {
      if (isMounted) setSettingsReady(true);
    }, SETTINGS_TIMEOUT_MS);

    const fetchAboutSettings = async () => {
      try {
        const settingsRef = doc(db, "settings", "website");
        const snapshot = await getDoc(settingsRef);

        if (!snapshot.exists() || !isMounted) return;

        const data = snapshot.data();

        const title = cleanText(data.aboutTitle);
        if (title) setAboutTitle(title);

        const description = cleanText(data.aboutDescription);
        if (description) setAboutDescription(description);

        const imageUrl = safeImageUrl(data.aboutImageUrl);
        if (imageUrl) setAboutImageUrl(imageUrl);
      } catch (error) {
        console.error("About settings fetch error:", error);
      } finally {
        if (isMounted) setSettingsReady(true);
      }
    };

    fetchAboutSettings();

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const imageSources = useMemo(() => {
    if (!aboutImageUrl) return [];
    const trimmedUrl = getTrimmedCloudinaryUrl(aboutImageUrl);
    return trimmedUrl ? [trimmedUrl, aboutImageUrl] : [aboutImageUrl];
  }, [aboutImageUrl]);

  const imageSrc =
    imageSources.find((source) => !failedImageSources.includes(source)) || "";

  const handleImageError = useCallback(() => {
    setFailedImageSources((previous) =>
      previous.includes(imageSrc) ? previous : [...previous, imageSrc]
    );
  }, [imageSrc]);

  const titleWords = aboutTitle.trim().split(/\s+/);
  const accentWord = titleWords.length > 1 ? titleWords.pop() : "";
  const normalTitle = titleWords.join(" ");

  const descriptionParagraphs = aboutDescription
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

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

  const portraitShiftX = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);

  const glareX = useTransform(smoothX, [-0.5, 0.5], ["20%", "80%"]);
  const glareY = useTransform(smoothY, [-0.5, 0.5], ["15%", "85%"]);

  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255, 255, 255, 0.7), transparent 55%)`;

  const handlePointerMove = useCallback(
    (event) => {
      if (reduceMotion || event.pointerType !== "mouse") return;

      const rect = event.currentTarget.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

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
  const contentState = contentInView && settingsReady ? "show" : "hidden";
  const hasImage = Boolean(imageSrc);

  return (
    <section ref={sectionRef} className="about-section" id="about">
      <div className="about-bg-glow about-glow-one" aria-hidden="true" />
      <div className="about-bg-glow about-glow-two" aria-hidden="true" />

      <div className="about-container">
        <motion.div
          ref={contentRef}
          className="about-content"
          initial="hidden"
          animate={contentState}
          variants={contentVariants}
        >
          <motion.span className="about-label" variants={fadeUp}>
            About Me
          </motion.span>

          <motion.h2 className="about-title" variants={titleVariants}>
            <span className="about-title-line">
              <motion.span className="about-title-inner" variants={lineReveal}>
                {normalTitle || accentWord}
                {normalTitle && accentWord && " "}
                {normalTitle && accentWord && (
                  <span className="about-gradient-text">{accentWord}</span>
                )}
              </motion.span>
            </span>
          </motion.h2>

          {descriptionParagraphs.map((paragraph, index) => (
            <motion.p
              className="about-description"
              variants={fadeUp}
              key={`about-paragraph-${index}`}
            >
              {paragraph}
            </motion.p>
          ))}

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
              <div className="about-card-inner">
                <span className="about-orbit about-orbit-one" aria-hidden="true" />
                <span className="about-orbit about-orbit-two" aria-hidden="true" />

                {!reduceMotion && (
                  <motion.span
                    className="about-card-glare"
                    style={{ background: glare }}
                    aria-hidden="true"
                  />
                )}

                {hasImage ? (
                  <motion.div
                    className="about-portrait-layer"
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.94 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 1, ease: EASE, delay: 0.2 }}
                    style={reduceMotion ? undefined : { x: portraitShiftX }}
                  >
                    <motion.img
                      key={imageSrc}
                      className="about-portrait"
                      src={imageSrc}
                      alt={aboutTitle}
                      decoding="async"
                      animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      onError={handleImageError}
                    />
                  </motion.div>
                ) : (
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
                )}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default About;