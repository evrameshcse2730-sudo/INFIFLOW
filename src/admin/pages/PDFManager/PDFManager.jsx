
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
import { uploadToCloudinary } from "../../../firebase/cloudinary";
import "./PDFManager.css";

function PDFManager() {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const initialForm = {
    title: "",
    course: "",
    description: "",
    pdfUrl: "",
    publicId: "",
    status: "Published",
  };

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const fetchPDFs = async () => {
    try {
      setLoading(true);
      setError("");

      const snapshot = await getDocs(collection(db, "pdfs"));

      setPdfs(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }))
      );
    } catch (err) {
      console.error("PDF fetch error:", err);
      setError("Unable to load PDFs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPDFs();
  }, []);

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    if (file.type !== "application/pdf") {
      setError("Please select a PDF file.");
      e.target.value = "";
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError("PDF size must be less than 20 MB.");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const result = await uploadToCloudinary(file, "pdf");

      setForm((previous) => ({
        ...previous,
        pdfUrl: result.url,
        publicId: result.publicId,
      }));
    } catch (err) {
      console.error("PDF upload error:", err);
      setError(err.message || "PDF upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.course.trim() || !form.pdfUrl.trim()) {
      setError("Please fill in all required fields and upload a PDF.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const pdfData = {
        title: form.title.trim(),
        course: form.course.trim(),
        description: form.description.trim(),
        pdfUrl: form.pdfUrl.trim(),
        publicId: form.publicId || "",
        status: form.status,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, "pdfs", editingId), pdfData);
      } else {
        await addDoc(collection(db, "pdfs"), {
          ...pdfData,
          createdAt: serverTimestamp(),
        });
      }

      setForm(initialForm);
      setEditingId(null);
      await fetchPDFs();
    } catch (err) {
      console.error("PDF save error:", err);
      setError("Unable to save PDF. Please check Firebase permissions.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (pdf) => {
    setForm({
      title: pdf.title || "",
      course: pdf.course || "",
      description: pdf.description || "",
      pdfUrl: pdf.pdfUrl || "",
      publicId: pdf.publicId || "",
      status: pdf.status || "Published",
    });

    setEditingId(pdf.id);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (pdf) => {
    const confirmDelete = window.confirm(
      "Delete this PDF record? The Cloudinary file will remain in storage."
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "pdfs", pdf.id));
      setPdfs((previous) => previous.filter((item) => item.id !== pdf.id));
    } catch (err) {
      console.error("PDF delete error:", err);
      setError("Unable to delete PDF.");
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
  };

  return (
    <div className="pdf-manager">
      <div className="pdf-manager-header">
        <div>
          <span className="pdf-eyebrow">CONTENT MANAGEMENT</span>
          <h1>PDF Library</h1>
          <p>Manage course notes, resources and downloadable PDFs.</p>
        </div>

        <div className="pdf-count">
          <span>{pdfs.length}</span>
          <small>Total PDFs</small>
        </div>
      </div>

      {error && <div className="pdf-error">{error}</div>}

      <div className="pdf-form-card">
        <div className="pdf-section-heading">
          <div>
            <h2>{editingId ? "Edit PDF" : "Add New PDF"}</h2>
            <p>Enter the PDF details below.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="pdf-form-grid">
            <div className="pdf-field">
              <label>PDF Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter PDF title"
                required
              />
            </div>

            <div className="pdf-field">
              <label>Course Name *</label>
              <input
                name="course"
                value={form.course}
                onChange={handleChange}
                placeholder="Enter course name"
                required
              />
            </div>

            <div className="pdf-field pdf-full">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter a short description"
                rows="3"
              />
            </div>

            <div className="pdf-field pdf-full">
              <label>Upload PDF *</label>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleUpload}
                disabled={uploading || saving}
              />

              {uploading && <small>Uploading PDF to Cloudinary...</small>}

              {form.pdfUrl && !uploading && (
                <small>
                  PDF uploaded successfully.{" "}
                  <a href={form.pdfUrl} target="_blank" rel="noreferrer">
                    Preview PDF
                  </a>
                </small>
              )}
            </div>

            <div className="pdf-field">
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

          <div className="pdf-form-actions">
            {editingId && (
              <button
                type="button"
                className="pdf-cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="pdf-submit-btn"
              disabled={saving || uploading}
            >
              {uploading
                ? "Uploading..."
                : saving
                ? "Saving..."
                : editingId
                ? "Update PDF"
                : "Add PDF"}
            </button>
          </div>
        </form>
      </div>

      <div className="pdf-list-card">
        <div className="pdf-section-heading">
          <div>
            <h2>All PDFs</h2>
            <p>Manage your existing PDF resources.</p>
          </div>

          <button
            type="button"
            className="pdf-refresh-btn"
            onClick={fetchPDFs}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="pdf-empty">Loading PDFs...</div>
        ) : pdfs.length === 0 ? (
          <div className="pdf-empty">
            <h3>No PDFs added yet</h3>
            <p>Add your first PDF using the form above.</p>
          </div>
        ) : (
          <div className="pdf-list">
            {pdfs.map((pdf) => (
              <div className="pdf-item" key={pdf.id}>
                <div className="pdf-icon">PDF</div>

                <div className="pdf-item-info">
                  <h3>{pdf.title}</h3>
                  <p>{pdf.course}</p>
                  <span
                    className={`pdf-status ${
                      pdf.status === "Published" ? "published" : "draft"
                    }`}
                  >
                    {pdf.status}
                  </span>
                </div>

                <div className="pdf-item-actions">
                  <a
                    href={pdf.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pdf-view-btn"
                  >
                    View
                  </a>

                  <button
                    type="button"
                    className="pdf-edit-btn"
                    onClick={() => handleEdit(pdf)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="pdf-delete-btn"
                    onClick={() => handleDelete(pdf)}
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

export default PDFManager;
