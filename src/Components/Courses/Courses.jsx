
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
import "./Courses.css";

function createSlug(title = "") {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <section className="courses-preview-section" id="courses">
      <div className="courses-preview-container">

        <motion.div
          className="courses-preview-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="courses-eyebrow">
            LEARN • CREATE • GROW
          </span>

          <h2>
            Explore Your Next
            <span> Creative Skill.</span>
          </h2>

          <p>
            Learn creative skills through structured lessons,
            practical resources and learning materials.
          </p>
        </motion.div>

        {loading ? (
          <p>Loading courses...</p>
        ) : courses.length === 0 ? (
          <p>No courses available yet. Check back soon!</p>
        ) : (
          <div className="courses-preview-grid">
            {courses.slice(0, 3).map((course, index) => (
              <motion.div
                className="course-preview-card"
                key={course.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                }}
                whileHover={{ y: -10 }}
              >
                <div className="course-preview-symbol">
                  {course.banner ? (
                    <img
                      src={course.banner}
                      alt={course.title}
                    />
                  ) : (
                    <span>INIFLOW</span>
                  )}
                </div>

                <span className="course-preview-category">
                  {course.category}
                </span>

                <h3>{course.title}</h3>
                <p>{course.description}</p>

                <Link to={`/courses/${createSlug(course.title)}`}>
                  Explore Course <span>↗</span>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          className="courses-preview-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span>Ready to start learning?</span>

          <Link
            to="/courses"
            className="courses-explore-button"
          >
            Explore All Courses <span>↗</span>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}

export default Courses;
