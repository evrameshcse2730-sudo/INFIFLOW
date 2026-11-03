
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";
import "./CoursePages.css";

function createSlug(title = "") {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const q = query(
          collection(db, "courses"),
          where("status", "==", "Published")
        );

        const snapshot = await getDocs(q);

        setCourses(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }))
        );
      } catch (err) {
        console.error("Courses fetch error:", err);
        setError("Unable to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <main className="course-page">
      <section className="course-page-hero">
        <span className="courses-eyebrow">
          INIFLOW LEARNING SPACE
        </span>

        <h1>
          Learn Something
          <span> Extraordinary.</span>
        </h1>

        <p>
          Discover creative courses, build new skills and
          turn your ideas into reality.
        </p>
      </section>

      <section className="course-catalog">
        <div className="course-catalog-heading">
          <div>
            <span className="courses-eyebrow">EXPLORE & LEARN</span>
            <h2>All Courses</h2>
          </div>

          <span>
            {loading ? "Loading..." : `${courses.length} Courses Available`}
          </span>
        </div>

        {loading ? (
          <p>Loading courses...</p>
        ) : error ? (
          <p>{error}</p>
        ) : courses.length === 0 ? (
          <p>No published courses available yet.</p>
        ) : (
          <div className="course-catalog-grid">
            {courses.map((course, index) => (
              <motion.article
                key={course.id}
                className="catalog-course-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                whileHover={{ y: -8 }}
              >
                <div className="catalog-course-art">
                  {course.banner ? (
                    <img src={course.banner} alt={course.title} />
                  ) : (
                    <span>INIFLOW</span>
                  )}
                </div>

                <div className="catalog-course-info">
                  <span className="course-preview-category">
                    {course.category}
                  </span>

                  <h3>{course.title}</h3>
                  <p>{course.description}</p>

                  <div className="catalog-course-meta">
                    <span>₹{course.price}</span>
                  </div>

                  <Link to={`/courses/${createSlug(course.title)}`}>
                    View Course <span>↗</span>
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default CoursesPage;
