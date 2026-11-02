
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../../firebase/firebase";
import "./Settings.css";

const initialSettings = {
  siteName: "INIFLOW",
  tagline: "",
  heroTitle: "",
  heroDescription: "",
  aboutTitle: "",
  aboutDescription: "",
  contactEmail: "",
  phone: "",
  whatsapp: "",
  instagram: "",
  youtube: "",
  footerText: "",
};

function Settings() {
  const [form, setForm] = useState(initialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsRef = doc(db, "settings", "website");
        const snapshot = await getDoc(settingsRef);

        if (snapshot.exists()) {
          setForm({
            ...initialSettings,
            ...snapshot.data(),
          });
        }
      } catch (err) {
        console.error("Settings fetch error:", err);
        setError("Unable to load website settings.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      await setDoc(
        doc(db, "settings", "website"),
        {
          ...form,
          updatedAt: serverTimestamp(),
        }
      );

      setMessage("Website settings saved successfully!");
    } catch (err) {
      console.error("Settings save error:", err);
      setError("Unable to save settings. Check Firebase permissions.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="settings-loading">Loading settings...</div>;
  }

  return (
    <div className="settings-manager">
      <div className="settings-header">
        <div>
          <span className="settings-eyebrow">WEBSITE CONFIGURATION</span>
          <h1>Website Settings</h1>
          <p>Manage your website information and contact details.</p>
        </div>
      </div>

      {message && <div className="settings-success">{message}</div>}
      {error && <div className="settings-error">{error}</div>}

      <form className="settings-form" onSubmit={handleSubmit}>
        <section className="settings-card">
          <h2>General Information</h2>
          <p>Basic website details.</p>

          <div className="settings-grid">
            <div className="settings-field">
              <label>Website Name</label>
              <input
                name="siteName"
                value={form.siteName}
                onChange={handleChange}
                placeholder="INIFLOW"
              />
            </div>

            <div className="settings-field">
              <label>Tagline</label>
              <input
                name="tagline"
                value={form.tagline}
                onChange={handleChange}
                placeholder="Your creative tagline"
              />
            </div>
          </div>
        </section>

        <section className="settings-card">
          <h2>Hero Section</h2>
          <p>Homepage banner content.</p>

          <div className="settings-field">
            <label>Hero Heading</label>
            <input
              name="heroTitle"
              value={form.heroTitle}
              onChange={handleChange}
              placeholder="Enter hero heading"
            />
          </div>

          <div className="settings-field">
            <label>Hero Description</label>
            <textarea
              name="heroDescription"
              value={form.heroDescription}
              onChange={handleChange}
              rows="4"
              placeholder="Enter hero description"
            />
          </div>
        </section>

        <section className="settings-card">
          <h2>About Section</h2>
          <p>Introduce your creative brand.</p>

          <div className="settings-field">
            <label>About Heading</label>
            <input
              name="aboutTitle"
              value={form.aboutTitle}
              onChange={handleChange}
              placeholder="About heading"
            />
          </div>

          <div className="settings-field">
            <label>About Description</label>
            <textarea
              name="aboutDescription"
              value={form.aboutDescription}
              onChange={handleChange}
              rows="5"
              placeholder="About your work and experience"
            />
          </div>
        </section>

        <section className="settings-card">
          <h2>Contact Information</h2>
          <p>Visitors can use these details to contact you.</p>

          <div className="settings-grid">
            <div className="settings-field">
              <label>Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={form.contactEmail}
                onChange={handleChange}
                placeholder="hello@example.com"
              />
            </div>

            <div className="settings-field">
              <label>Phone Number</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="settings-field">
              <label>WhatsApp Number</label>
              <input
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                placeholder="Enter WhatsApp number with country code"
              />
            </div>
          </div>
        </section>

        <section className="settings-card">
          <h2>Social Media</h2>
          <p>Connect your social media profiles.</p>

          <div className="settings-grid">
            <div className="settings-field">
              <label>Instagram URL</label>
              <input
                type="url"
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
              />
            </div>

            <div className="settings-field">
              <label>YouTube URL</label>
              <input
                type="url"
                name="youtube"
                value={form.youtube}
                onChange={handleChange}
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </section>

        <section className="settings-card">
          <h2>Footer</h2>
          <div className="settings-field">
            <label>Footer Text</label>
            <input
              name="footerText"
              value={form.footerText}
              onChange={handleChange}
              placeholder="© INIFLOW. All rights reserved."
            />
          </div>
        </section>

        <div className="settings-save-area">
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Website Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings;
