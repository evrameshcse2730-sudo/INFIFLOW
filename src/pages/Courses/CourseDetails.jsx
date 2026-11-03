
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  BookOpen,
  FileText,
  Download,
  ExternalLink,
} from "lucide-react";

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
  const [classes, setClasses] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        setError("");

        setCourse(null);
        setClasses([]);
        setPdfs([]);
        setSelectedClassId("");

        // 1. Fetch published courses
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
          return;
        }

        setCourse(matchedCourse);

        // 2. Fetch published classes belonging to this course
        const classSnapshot = await getDocs(
          collection(db, "classes")
        );

        const courseClasses = classSnapshot.docs
          .map((item) => ({
            id: item.id,
            ...item.data(),
          }))
          .filter(
            (item) =>
              item.courseId === matchedCourse.id &&
              item.status === "Published"
          )
          .sort(
            (a, b) =>
              Number(a.order || 0) - Number(b.order || 0)
          );

        setClasses(courseClasses);

        // 3. Fetch published PDFs
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
            (pdf) => pdf.courseId === matchedCourse.id && pdf.classId
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

  // PDFs belonging only to the selected class
  const selectedClassPDFs = useMemo(() => {
    if (!selectedClassId) return [];

    return pdfs.filter(
      (pdf) => pdf.classId === selectedClassId
    );
  }, [pdfs, selectedClassId]);

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

        {/* COURSE HERO */}
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
              <span>{classes.length} Learning Classes</span>
            </div>
          </div>

          {course.banner && (
            <div className="course-detail-symbol">
              <img src={course.banner} alt={course.title} />
            </div>
          )}
        </motion.section>

        {/* CLASSES SECTION */}
        <section className="course-learning-section">
          <div className="course-learning-heading">
            <span className="courses-eyebrow">
              YOUR LEARNING JOURNEY
            </span>

            <h2>Explore Classes</h2>

            <p>
              Select a class to access its learning materials and PDFs.
            </p>
          </div>

          {classes.length === 0 ? (
            <div className="course-resource-empty">
              <BookOpen size={32} />
              <h3>No classes available yet</h3>
              <p>Classes will be added soon.</p>
            </div>
          ) : (
            <div className="course-classes-grid">
              {classes.map((item, index) => {
                const isSelected = selectedClassId === item.id;

                const resourceCount = pdfs.filter(
                  (pdf) => pdf.classId === item.id
                ).length;

                return (
                  <motion.button
                    type="button"
                    className={`course-class-card ${
                      isSelected ? "selected" : ""
                    }`}
                    key={item.id}
                    onClick={() => setSelectedClassId(item.id)}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="course-class-icon">
                      <BookOpen size={22} />
                    </div>

                    <div className="course-class-info">
                      <span>CLASS {index + 1}</span>
                      <h3>{item.title}</h3>

                      <p>
                        {item.description || "Explore this learning class."}
                      </p>

                      <small>
                        {resourceCount} PDF Resources
                      </small>
                    </div>

                    <span className="course-class-arrow">
                      {isSelected ? "✓" : "→"}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          )}
        </section>

        {/* SELECTED CLASS PDF SECTION */}
        {selectedClassId && (
          <motion.section
            className="course-selected-resources"
            key={selectedClassId}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="course-learning-heading">
              <span className="courses-eyebrow">
                SELECTED CLASS MATERIAL
              </span>

              <h2>
                {classes.find(
                  (item) => item.id === selectedClassId
                )?.title}
              </h2>

              <p>
                PDFs and learning resources for this class.
              </p>
            </div>

            {selectedClassPDFs.length === 0 ? (
              <div className="course-resource-empty">
                <FileText size={32} />
                <h3>No PDFs available in this class</h3>
                <p>
                  Learning materials will be added soon.
                </p>
              </div>
            ) : (
              <div className="course-pdf-list">
                {selectedClassPDFs.map((pdf, index) => (
                  <motion.div
                    className="course-pdf-item"
                    key={pdf.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                  >
                    <div className="course-pdf-icon">
                      PDF
                    </div>

                    <div className="course-pdf-info">
                      <strong>{pdf.title}</strong>

                      <small>
                        {pdf.description || "PDF Learning Material"}
                      </small>
                    </div>

                    <a
                      href={pdf.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={16} />
                      View
                    </a>

                    <a
                      href={pdf.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="course-pdf-download"
                    >
                      <Download size={16} />
                      Download
                    </a>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        )}
      </div>
    </main>
  );
}

export default CourseDetails;
