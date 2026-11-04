import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Box,
  Film,
  Layers,
  Play,
  Video,
  Zap,
} from "lucide-react";
import { db } from "../../firebase/firebase";
import "./Hero.css";

const COURSES_LINK = "#courses";
const PROJECTS_LINK = "#projects";
const ABOUT_LINK = "#about";

const SETTINGS_TIMEOUT_MS = 1500;
const LOGO_MODES = ["default", "image", "hidden"];

const HERO_DEFAULTS = {
  eyebrow: "Creative Studio",
  titleLines: ["Animation", "Video Editing"],
  accent: "& Motion Design",
  pillars: ["Learning", "Creating", "Sharing"],
  overlay: 70,
};

const services = [
  { icon: Video, label: "Video Editing" },
  { icon: Box, label: "3D Animation" },
  { icon: Layers, label: "Motion Graphics" },
  { icon: Zap, label: "VFX" },
  { icon: Film, label: "Filmmaking" },
];

const INFINITY_PATH =
  "M200,100 C250,30 330,20 360,60 C390,100 370,160 320,170 C270,180 240,140 200,100 C160,60 130,20 80,30 C30,40 10,100 40,140 C70,180 150,170 200,100 Z";

const EASE = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const contentVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const titleVariants = {
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

const lineRevealVariants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.9, ease: EASE } },
};

const visualVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: EASE } },
};

const servicesVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.6,
      delay: 0.75,
      delayChildren: 0.85,
      staggerChildren: 0.07,
    },
  },
};

const cleanText = (value) => (typeof value === "string" ? value.trim() : "");

const safeUrl = (value) => {
  const url = cleanText(value);
  return /^https:\/\//i.test(url) ? url : "";
};

function buildHeroContent(data) {
  const settings = data || {};

  const titleLines = cleanText(settings.heroTitle)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const accent = cleanText(settings.heroAccent);
  const hasCustomTitle = titleLines.length > 0 || Boolean(accent);

  const pillarsText = cleanText(settings.heroDescription);
  const pillars = pillarsText
    ? pillarsText.split("•").map((item) => item.trim()).filter(Boolean)
    : HERO_DEFAULTS.pillars;

  const rawOverlay = settings.heroOverlay;
  const overlayNumber =
    rawOverlay === "" || rawOverlay === null || rawOverlay === undefined
      ? HERO_DEFAULTS.overlay
      : Number(rawOverlay);
  const overlay = Number.isFinite(overlayNumber)
    ? Math.min(90, Math.max(0, overlayNumber))
    : HERO_DEFAULTS.overlay;

  const logoUrl = safeUrl(settings.heroLogoUrl);
  let logoMode = LOGO_MODES.includes(settings.heroLogoMode)
    ? settings.heroLogoMode
    : "default";
  if (logoMode === "image" && !logoUrl) logoMode = "default";

  return {
    eyebrow: cleanText(settings.heroEyebrow) || HERO_DEFAULTS.eyebrow,
    titleLines: hasCustomTitle ? titleLines : HERO_DEFAULTS.titleLines,
    accent: hasCustomTitle ? accent : HERO_DEFAULTS.accent,
    pillars,
    videoUrl: safeUrl(settings.heroVideoUrl),
    posterUrl: safeUrl(settings.heroPosterUrl),
    overlay,
    logoMode,
    logoUrl,
  };
}

function InfinityMark() {
  return (
    <svg
      className="hero-infinity"
      viewBox="-30 -20 460 240"
      role="img"
      aria-label="INIFLOW infinity mark"
    >
      <defs>
        <linearGradient id="heroInfBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5fd4ff" />
          <stop offset="35%" stopColor="#1f8bff" />
          <stop offset="70%" stopColor="#0a5cff" />
          <stop offset="100%" stopColor="#0040d8" />
        </linearGradient>
        <linearGradient id="heroInfShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="55%" stopColor="#001a66" stopOpacity="0" />
          <stop offset="100%" stopColor="#001a66" stopOpacity="0.35" />
        </linearGradient>
        <filter id="heroInfGlow" x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      <path
        d={INFINITY_PATH}
        fill="none"
        stroke="#2a8cff"
        strokeWidth="40"
        opacity="0.35"
        filter="url(#heroInfGlow)"
      />
      <path
        d={INFINITY_PATH}
        fill="none"
        stroke="url(#heroInfBody)"
        strokeWidth="34"
        strokeLinejoin="round"
      />
      <path
        d={INFINITY_PATH}
        fill="none"
        stroke="url(#heroInfShade)"
        strokeWidth="34"
        strokeLinejoin="round"
      />
      <path
        d={INFINITY_PATH}
        fill="none"
        stroke="rgba(255, 255, 255, 0.55)"
        strokeWidth="8"
        strokeLinejoin="round"
        transform="translate(-3 -9)"
      />
      <path
        className="hero-inf-sheen"
        d={INFINITY_PATH}
        fill="none"
        stroke="#ffffff"
        strokeWidth="10"
        strokeLinecap="round"
        pathLength="1000"
        strokeDasharray="90 910"
        opacity="0.8"
      />

      <g className="hero-inf-bubbles">
        <circle cx="378" cy="38" r="5" />
        <circle cx="396" cy="74" r="3" />
        <circle cx="22" cy="172" r="4" />
        <circle cx="212" cy="30" r="3" />
      </g>
    </svg>
  );
}

function Hero() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  const [settingsData, setSettingsData] = useState(null);
  const [settingsReady, setSettingsReady] = useState(false);
  const [readyVideoUrl, setReadyVideoUrl] = useState("");
  const [failedVideoUrl, setFailedVideoUrl] = useState("");

  const saveData = useMemo(
    () => typeof navigator !== "undefined" && Boolean(navigator.connection?.saveData),
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => setSettingsReady(true), SETTINGS_TIMEOUT_MS);

    const unsubscribe = onSnapshot(
      doc(db, "settings", "website"),
      (snapshot) => {
        setSettingsData(snapshot.exists() ? snapshot.data() : null);
        setSettingsReady(true);
      },
      (error) => {
        console.error("Hero settings error:", error);
        setSettingsReady(true);
      }
    );

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  const hero = useMemo(() => buildHeroContent(settingsData), [settingsData]);

  const showVideo =
    Boolean(hero.videoUrl) &&
    !reduceMotion &&
    !saveData &&
    failedVideoUrl !== hero.videoUrl;
  const videoIsReady = showVideo && readyVideoUrl === hero.videoUrl;
  const showPoster = Boolean(hero.posterUrl) && !videoIsReady;
  const hasMedia = showVideo || Boolean(hero.posterUrl);
  const showLogo = hero.logoMode !== "hidden";

  const attachVideo = useCallback((element) => {
    videoRef.current = element;
    if (!element) return;
    element.defaultMuted = true;
    element.muted = true;
    const playPromise = element.play?.();
    if (playPromise?.catch) playPromise.catch(() => {});
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!showVideo || !section || !("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      const video = videoRef.current;
      if (!video) return;
      if (entry.isIntersecting) {
        const playPromise = video.play();
        if (playPromise?.catch) playPromise.catch(() => {});
      } else {
        video.pause();
      }
    });

    observer.observe(section);
    return () => observer.disconnect();
  }, [showVideo, hero.videoUrl]);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 60, damping: 18, mass: 0.6 });
  const smoothY = useSpring(pointerY, { stiffness: 60, damping: 18, mass: 0.6 });

  const rotateY = useTransform(smoothX, [-1, 1], [-12, 12]);
  const rotateX = useTransform(smoothY, [-1, 1], [10, -10]);
  const orbX = useTransform(smoothX, [-1, 1], [-24, 24]);
  const orbY = useTransform(smoothY, [-1, 1], [-18, 18]);

  const handlePointerMove = useCallback(
    (event) => {
      if (reduceMotion || event.pointerType !== "mouse") return;
      const rect = event.currentTarget.getBoundingClientRect();
      pointerX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
      pointerY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
    },
    [reduceMotion, pointerX, pointerY]
  );

  const handlePointerLeave = useCallback(() => {
    pointerX.set(0);
    pointerY.set(0);
  }, [pointerX, pointerY]);

  const fadeUp = reduceMotion ? fadeOnlyVariants : fadeUpVariants;
  const lineReveal = reduceMotion ? fadeOnlyVariants : lineRevealVariants;
  const visualIn = reduceMotion ? fadeOnlyVariants : visualVariants;
  const revealState = settingsReady ? "show" : "hidden";

  const headingLabel = [...hero.titleLines, hero.accent].filter(Boolean).join(" ");

  return (
    <section
      ref={sectionRef}
      className={`hero-section ${hasMedia ? "has-media" : ""}`}
      id="home"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {hasMedia && (
        <div
          className="hero-media"
          aria-hidden="true"
          style={{ "--hero-overlay": hero.overlay / 100 }}
        >
          {showPoster && (
            <img className="hero-media-poster" src={hero.posterUrl} alt="" />
          )}

          {showVideo && (
            <video
              key={hero.videoUrl}
              ref={attachVideo}
              className={`hero-media-video ${videoIsReady ? "is-ready" : ""}`}
              src={hero.videoUrl}
              poster={hero.posterUrl || undefined}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onCanPlay={() => setReadyVideoUrl(hero.videoUrl)}
              onError={() => setFailedVideoUrl(hero.videoUrl)}
            />
          )}

          <span className="hero-media-overlay" />
        </div>
      )}

      <motion.div
        className="hero-backdrop"
        aria-hidden="true"
        style={reduceMotion ? undefined : { x: orbX, y: orbY }}
      >
        <span className="hero-orb hero-orb-one" />
        <span className="hero-orb hero-orb-two" />
        <span className="hero-orb hero-orb-three" />
      </motion.div>

      <svg
        className="hero-wave"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="heroWaveFill" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0a6cff" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#1ec8ff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#0a6cff" stopOpacity="0.16" />
          </linearGradient>
        </defs>
        <path
          d="M0,240 C240,170 420,300 720,250 C1020,200 1200,120 1440,170 L1440,320 L0,320 Z"
          fill="url(#heroWaveFill)"
        />
        <path
          d="M0,280 C300,230 520,320 820,280 C1100,245 1260,210 1440,240 L1440,320 L0,320 Z"
          fill="#ffffff"
          fillOpacity="0.6"
        />
      </svg>

      <div className="hero-inner">
        <motion.div
          className={`hero-container ${showLogo ? "" : "is-logo-hidden"}`}
          initial="hidden"
          animate={revealState}
          variants={containerVariants}
        >
          <motion.div className="hero-content" variants={contentVariants}>
            <motion.span className="hero-eyebrow" variants={fadeUp}>
              {hero.eyebrow}
            </motion.span>

            <motion.h1
              className="hero-title"
              variants={titleVariants}
              aria-label={headingLabel}
            >
              {hero.titleLines.map((line, index) => (
                <span className="hero-title-line" key={`line-${index}`}>
                  <motion.span className="hero-title-inner" variants={lineReveal}>
                    {line}
                  </motion.span>
                </span>
              ))}

              {hero.accent && (
                <span className="hero-title-line">
                  <motion.span className="hero-title-inner" variants={lineReveal}>
                    <span className="hero-gradient-text">{hero.accent}</span>
                  </motion.span>
                </span>
              )}
            </motion.h1>

            {hero.pillars.length > 0 && (
              <motion.p className="hero-pillars" variants={fadeUp}>
                {hero.pillars.map((pillar, index) => (
                  <span className="hero-pillar" key={`${pillar}-${index}`}>
                    {index > 0 && <span className="hero-pillar-dot" aria-hidden="true" />}
                    {pillar}
                  </span>
                ))}
              </motion.p>
            )}

            <motion.div className="hero-actions" variants={fadeUp}>
              <a href={COURSES_LINK} className="hero-primary-btn">
                <span className="hero-btn-icon">
                  <Play size={13} fill="currentColor" />
                </span>
                Explore Courses
              </a>

              <a href={PROJECTS_LINK} className="hero-secondary-btn">
                View Projects
                <ArrowRight size={17} className="hero-btn-arrow" />
              </a>
            </motion.div>
          </motion.div>

          {showLogo && (
            <motion.div className="hero-visual" variants={visualIn}>
              <motion.div
                className="hero-visual-tilt"
                style={reduceMotion ? undefined : { rotateX, rotateY }}
              >
                <div className="hero-glass-sphere" aria-hidden="true" />

                <div className="hero-infinity-float">
                  {hero.logoMode === "image" ? (
                    <img
                      className="hero-custom-logo"
                      src={hero.logoUrl}
                      alt="INIFLOW logo"
                    />
                  ) : (
                    <InfinityMark />
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        <motion.ul
          className="hero-services"
          initial="hidden"
          animate={revealState}
          variants={servicesVariants}
          aria-label="What we do"
        >
          {services.map(({ icon: Icon, label }) => (
            <motion.li className="hero-service" key={label} variants={fadeUp}>
              <span className="hero-service-icon">
                <Icon size={26} strokeWidth={1.6} />
              </span>
              <span className="hero-service-label">{label}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      <motion.a
        href={ABOUT_LINK}
        className="hero-scroll"
        aria-label="Scroll to explore"
        animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown size={16} />
      </motion.a>
    </section>
  );
}

export default Hero;