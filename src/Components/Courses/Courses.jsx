import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";
import "./Courses.css";

const PREVIEW_LIMIT = 4;
const EASE = [0.22, 1, 0.36, 1];

const headingVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
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

const headingLines = [
  { text: "Explore Your Next" },
  { accent: "Creative Skill." },
];

function createSlug(title = "") {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const handleCardPointerMove = (event) => {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  card.style.setProperty("--my", `${event.clientY - rect.top}px`);
};

function getTrackStep(track) {
  const firstCard = track.firstElementChild;
  if (!firstCard) return 0;
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  return firstCard.getBoundingClientRect().width + gap;
}

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carousel, setCarousel] = useState({ pages: 1, active: 0 });
  const trackRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const q = query(
          collection(db, "courses"),
          where("status", "==", "Published")
        );

        const snapshot = await getDocs(q);

        const courseList = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setCourses(courseList);
      } catch (error) {
        console.error("Homepage courses error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const previewCourses = useMemo(
    () => courses.slice(0, PREVIEW_LIMIT),
    [courses]
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const step = getTrackStep(track);
      if (!step) return;

      const maxScroll = track.scrollWidth - track.clientWidth;
      const pages = maxScroll > 1 ? Math.round(maxScroll / step) + 1 : 1;
      const active = Math.min(pages - 1, Math.round(track.scrollLeft / step));

      setCarousel((prev) =>
        prev.pages === pages && prev.active === active ? prev : { pages, active }
      );
    };

    const scheduleMeasure = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    track.addEventListener("scroll", scheduleMeasure, { passive: true });

    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(scheduleMeasure) : null;
    resizeObserver?.observe(track);

    return () => {
      track.removeEventListener("scroll", scheduleMeasure);
      resizeObserver?.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [loading, previewCourses.length]);

  const goToPage = useCallback(
    (page) => {
      const track = trackRef.current;
      if (!track) return;

      const maxScroll = track.scrollWidth - track.clientWidth;
      track.scrollTo({
        left: Math.min(page * getTrackStep(track), maxScroll),
        behavior: reduceMotion ? "auto" : "smooth",
      });
    },
    [reduceMotion]
  );

  const fadeUp = reduceMotion ? fadeOnlyVariants : fadeUpVariants;
  const lineReveal = reduceMotion ? fadeOnlyVariants : lineRevealVariants;

  return (
    <section className="courses-preview-section" id="courses">
      <div className="courses-bg-glow courses-glow-one" aria-hidden="true" />
      <div className="courses-bg-glow courses-glow-two" aria-hidden="true" />

      <div className="courses-preview-container">
        <motion.div
          className="courses-preview-heading"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={headingVariants}
        >
          <motion.span className="courses-eyebrow" variants={fadeUp}>
            Learn • Create • Grow
          </motion.span>

          <motion.h2
            className="courses-title"
            variants={titleVariants}
            aria-label="Explore Your Next Creative Skill."
          >
            {headingLines.map((line) => (
              <span className="courses-title-line" key={line.text || line.accent}>
                <motion.span className="courses-title-inner" variants={lineReveal}>
                  {line.text}
                  {line.accent && (
                    <span className="courses-gradient-text">{line.accent}</span>
                  )}
                </motion.span>
              </span>
            ))}
          </motion.h2>

          <motion.p className="courses-subtitle" variants={fadeUp}>
            Learn creative skills through structured lessons,
            practical resources and learning materials.
          </motion.p>
        </motion.div>

        {loading ? (
          <div className="courses-preview-track is-static" role="status">
            <span className="courses-sr-only">Loading courses...</span>
            {[0, 1, 2, 3].map((item) => (
              <div className="course-preview-skeleton" key={item} aria-hidden="true">
                <span className="course-preview-skeleton-media" />
                <span className="course-preview-skeleton-line" />
                <span className="course-preview-skeleton-line is-short" />
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <motion.p
            className="courses-preview-message"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            No courses available yet. Check back soon!
          </motion.p>
        ) : (
          <>
            <div
              className="courses-preview-track"
              ref={trackRef}
              role="region"
              aria-label="Featured courses"
            >
              {previewCourses.map((course, index) => {
                const coursePath = `/courses/${createSlug(course.title)}`;

                return (
                  <motion.article
                    className="course-preview-card"
                    key={course.id}
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.7, ease: EASE, delay: index * 0.1 },
                    }}
                    whileHover={
                      reduceMotion
                        ? undefined
                        : { y: -8, transition: { type: "spring", stiffness: 260, damping: 22 } }
                    }
                    viewport={{ once: true, amount: 0.2 }}
                    onPointerMove={handleCardPointerMove}
                  >
                    <Link
                      to={coursePath}
                      className="course-preview-media"
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      {course.banner ? (
                        <img
                          src={course.banner}
                          alt=""
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <span className="course-preview-fallback">INIFLOW</span>
                      )}
                      <span className="course-preview-shade" />
                    </Link>

                    <div className="course-preview-body">
                      {course.category && (
                        <span className="course-preview-category">{course.category}</span>
                      )}

                      <h3 className="course-preview-title">{course.title}</h3>

                      {course.description && (
                        <p className="course-preview-description">{course.description}</p>
                      )}

                      <Link
                        to={coursePath}
                        className="course-preview-button"
                        aria-label={`View course: ${course.title}`}
                      >
                        View Course
                        <ArrowRight size={16} className="course-preview-button-icon" />
                      </Link>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            {carousel.pages > 1 && (
              <div className="courses-preview-dots" role="group" aria-label="Course slides">
                {Array.from({ length: carousel.pages }, (_, page) => (
                  <button
                    key={page}
                    type="button"
                    className={`courses-preview-dot ${
                      page === carousel.active ? "is-active" : ""
                    }`}
                    aria-label={`Go to slide ${page + 1}`}
                    aria-current={page === carousel.active ? "true" : undefined}
                    onClick={() => goToPage(page)}
                  >
                    <span className="courses-preview-dot-bar" />
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        <motion.div
          className="courses-preview-bottom"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span className="courses-bottom-text">Ready to start learning?</span>

          <Link
            to="/courses"
            className="courses-explore-button"
          >
            Explore All Courses
            <ArrowUpRight size={17} className="courses-explore-icon" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default Courses;