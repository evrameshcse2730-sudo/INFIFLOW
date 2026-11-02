
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../../firebase/firebase";
import "./ProjectsManager.css";

const initialForm = {
  title: "",
  description: "",
  category: "",
  imageUrl: "",
  projectUrl: "",
  status: "Published",
};

function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const snapshot = await getDocs(collection(db, "projects"));

      setProjects(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }))
      );
    } catch (err) {
      console.error("Projects fetch error:", err);
      setError("Unable to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.category.trim()) {
      setError("Please enter project title and category.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const projectData = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        imageUrl: form.imageUrl.trim(),
        projectUrl: form.projectUrl.trim(),
        status: form.status,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, "projects", editingId), projectData);
      } else {
        await addDoc(collection(db, "projects"), {
          ...projectData,
          createdAt: serverTimestamp(),
        });
      }

      setForm(initialForm);
      setEditingId(null);
      await fetchProjects();
    } catch (err) {
      console.error("Project save error:", err);
      setError("Unable to save project. Check Firebase permissions.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project) => {
    setForm({
      title: project.title || "",
      description: project.description || "",
      category: project.category || "",
      imageUrl: project.imageUrl || "",
      projectUrl: project.projectUrl || "",
      status: project.status || "Published",
    });

    setEditingId(project.id);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "projects", id));
      setProjects((previous) =>
        previous.filter((project) => project.id !== id)
      );
    } catch (err) {
      console.error("Project delete error:", err);
      setError("Unable to delete project.");
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
  };

  return (
    <div className="projects-manager">
      <div className="projects-header">
        <div>
          <span className="projects-eyebrow">PORTFOLIO MANAGEMENT</span>
          <h1>Projects</h1>
          <p>Manage and showcase creative projects.</p>
        </div>

        <div className="projects-count">
          <strong>{projects.length}</strong>
          <span>Total Projects</span>
        </div>
      </div>

      {error && <div className="projects-error">{error}</div>}

      <div className="projects-form-card">
        <h2>{editingId ? "Edit Project" : "Add New Project"}</h2>
        <p className="projects-subtitle">
          Add project information to your portfolio.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="projects-form-grid">
            <div className="projects-field">
              <label>Project Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter project title"
                required
              />
            </div>

            <div className="projects-field">
              <label>Category *</label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Video Editing / Animation / 3D"
                required
              />
            </div>

            <div className="projects-field projects-full">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe this project"
                rows="4"
              />
            </div>

            <div className="projects-field projects-full">
              <label>Thumbnail Image URL</label>
              <input
                type="url"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="Paste image URL"
              />
              <small>Direct image upload will be added later.</small>
            </div>

            <div className="projects-field projects-full">
              <label>Project Video / Demo URL</label>
              <input
                type="url"
                name="projectUrl"
                value={form.projectUrl}
                onChange={handleChange}
                placeholder="YouTube / Vimeo / Demo link"
              />
            </div>

            <div className="projects-field">
              <label>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="projects-form-actions">
            {editingId && (
              <button
                type="button"
                className="projects-cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="projects-submit-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Project"
                : "Add Project"}
            </button>
          </div>
        </form>
      </div>

      <div className="projects-list-card">
        <div className="projects-list-heading">
          <div>
            <h2>All Projects</h2>
            <p>Your portfolio projects.</p>
          </div>

          <button onClick={fetchProjects} className="projects-refresh-btn">
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="projects-empty">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="projects-empty">
            <h3>No projects yet</h3>
            <p>Add your first project using the form above.</p>
          </div>
        ) : (
          <div className="projects-list">
            {projects.map((project) => (
              <div className="project-item" key={project.id}>
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="project-thumbnail"
                  />
                ) : (
                  <div className="project-thumbnail-placeholder">
                    PROJECT
                  </div>
                )}

                <div className="project-info">
                  <h3>{project.title}</h3>
                  <p>{project.category}</p>
                  <span
                    className={`project-status ${
                      project.status === "Published" ? "published" : "draft"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <div className="project-actions">
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-view-btn"
                    >
                      View
                    </a>
                  )}

                  <button
                    className="project-edit-btn"
                    onClick={() => handleEdit(project)}
                  >
                    Edit
                  </button>

                  <button
                    className="project-delete-btn"
                    onClick={() => handleDelete(project.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectsManager;
