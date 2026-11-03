import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { db } from "../../firebase/firebase";
import "./FeaturedProjects.css";

function FeaturedProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const projectsQuery = query(
      collection(db, "projects"),
      where("status", "==", "Published")
    );

    const unsubscribe = onSnapshot(
      projectsQuery,
      (snapshot) => {
        setProjects(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
        setLoading(false);
      },
      (error) => {
        console.error("Projects loading error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <section className="featured-projects" id="projects">
      <div className="featured-projects-container">
        <motion.div
          className="featured-projects-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span>MY CREATIVE WORK</span>
          <h2>
            Featured <span>Projects.</span>
          </h2>
          <p>
            A collection of creative ideas transformed into meaningful
            visual experiences.
          </p>
        </motion.div>

        {loading ? (
          <p className="featured-projects-message">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="featured-projects-message">
            Projects coming soon.
          </p>
        ) : (
          <div className="featured-projects-grid">
            {projects.map((project, index) => (
              <motion.article
                className="featured-project-card"
                key={project.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="featured-project-image">
                  {project.imageUrl && (
                    <img
                      src={project.imageUrl}
                      alt={project.title || "Creative project"}
                      loading="lazy"
                    />
                  )}

                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${project.title}`}
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>

                <div className="featured-project-info">
                  <span>{project.category}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>

                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Explore Project <ArrowUpRight size={17} />
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProjects;