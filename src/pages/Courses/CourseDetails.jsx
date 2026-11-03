
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
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

function CourseDetails() {
  const { slug } = useParams();

  const [course, setCourse] = useState(null);
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch published courses
        const courseQuery = query(
          collection(db, "courses"),
          where("status", "==", "Published")
        );

        const courseSnapshot = await getDocs(courseQuery);

        const matchedCourse = courseSnapshot.docs
          .map((item) => ({
            id: item.id,
            ...item.data(),
          }))
          .find((item) => createSlug(item.title) === slug);

        if (!matchedCourse) {
          setCourse(null);
          setPdfs([]);
          return;
        }

        setCourse(matchedCourse);

        // Fetch published PDFs
        const pdfQuery = query(
          collection(db, "pdfs"),
          where("status", "==", "Published")
        );

        const pdfSnapshot = await getDocs(pdfQuery);

        const coursePDFs = pdfSnapshot.docs
          .map((item) => ({
            id: item.id,
            ...item.data(),
          }))
          .filter(
            (pdf) =>
              (pdf.course || "").trim().toLowerCase() ===
              matchedCourse.title.trim().toLowerCase()
          );

        setPdfs(coursePDFs);
      } catch (err) {
        console.error("Course details error:", err);
        setError("Unable to load course details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [slug]);

  if (loading) {
    return (
      <main className="course-detail-page">
        <div className="course-detail-container">
          <p>Loading course...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="course-detail-page">
        <div className="course-detail-container">
          <p>{error}</p>
          <Link to="/courses">Back to Courses</Link>
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="course-detail-page">
        <div className="course-detail-container">
          <h2>Course not found</h2>
          <Link to="/courses">Back to All Courses</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="course-detail-page">
      <div className="course-detail-container">
        <Link to="/courses" className="course-back-link">
          ← Back to All Courses
        </Link>

        <motion.section
          className="course-detail-hero"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span className="courses-eyebrow">
              {course.category}
            </span>

            <h1>{course.title}</h1>
            <p>{course.description}</p>

            <div className="course-detail-meta">
              <span>₹{course.price}</span>
              <span>{pdfs.length} Learning Resources</span>
            </div>
          </div>

          {course.banner && (
            <div className="course-detail-symbol">
              <img src={course.banner} alt={course.title} />
            </div>
          )}
        </motion.section>

        <section className="course-learning-section">
          <div className="course-learning-heading">
            <span className="courses-eyebrow">
              YOUR LEARNING MATERIAL
            </span>

            <h2>Course Resources</h2>
            <p>
              Access the PDFs and learning materials for this course.
            </p>
          </div>

          {pdfs.length === 0 ? (
            <div className="course-resource-empty">
              <h3>No resources available yet</h3>
              <p>Learning materials will be added soon.</p>
            </div>
          ) : (
            <div className="course-pdf-list">
              {pdfs.map((pdf, index) => (
                <motion.div
                  className="course-pdf-item"
                  key={pdf.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <div className="course-pdf-icon">PDF</div>

                  <div className="course-pdf-info">
                    <strong>{pdf.title}</strong>
                    <small>
                      {pdf.description || "PDF Learning Material"}
                    </small>
                  </div>

                  <a
                    href={pdf.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View ↗
                  </a>

                  <a
                    href={pdf.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="course-pdf-download"
                  >
                    Download ↓
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default CourseDetails;
