import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../../firebase/firebase";
import "./Settings.css";

const HERO_DEFAULTS = {
  heroEyebrow: "",
  heroTitle: "",
  heroAccent: "",
  heroDescription: "",
  heroVideoUrl: "",
  heroPosterUrl: "",
  heroOverlay: "70",
  heroLogoMode: "default",
  heroLogoUrl: "",
};

const initialSettings = {
  siteName: "INIFLOW",
  tagline: "",
  ...HERO_DEFAULTS,
  aboutTitle: "",
  aboutDescription: "",
  contactEmail: "",
  phone: "",
  whatsapp: "",
  instagram: "",
  youtube: "",
  footerText: "",
};

const HERO_URL_FIELDS = [
  { name: "heroVideoUrl", label: "Background video URL" },
  { name: "heroPosterUrl", label: "Poster image URL" },
  { name: "heroLogoUrl", label: "Custom logo URL" },
];

const LOGO_OPTIONS = [
  { value: "default", label: "Animated infinity (default)" },
  { value: "image", label: "Custom logo image" },
  { value: "hidden", label: "Hide logo" },
];

const toText = (value) => (value === null || value === undefined ? "" : String(value));

const isHttpsUrl = (value) => /^https:\/\//i.test(toText(value).trim());

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
    const { name, value } = e.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetHero = () => {
    setForm((previous) => ({
      ...previous,
      ...HERO_DEFAULTS,
    }));
    setError("");
    setMessage("Hero section reset to defaults. Click Save to apply.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const invalidUrlField = HERO_URL_FIELDS.find(
      ({ name }) => toText(form[name]).trim() && !isHttpsUrl(form[name])
    );

    if (invalidUrlField) {
      setMessage("");
      setError(`${invalidUrlField.label} must start with https://`);
      return;
    }

    if (form.heroLogoMode === "image" && !toText(form.heroLogoUrl).trim()) {
      setMessage("");
      setError("Add a custom logo URL or choose another logo option.");
      return;
    }

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

  const videoPreview = isHttpsUrl(form.heroVideoUrl) ? toText(form.heroVideoUrl).trim() : "";
  const posterPreview = isHttpsUrl(form.heroPosterUrl) ? toText(form.heroPosterUrl).trim() : "";
  const logoPreview = isHttpsUrl(form.heroLogoUrl) ? toText(form.heroLogoUrl).trim() : "";

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
          <div className="settings-card-header">
            <div>
              <h2>Hero Section</h2>
              <p>Homepage banner content, background video and logo.</p>
            </div>

            <button
              type="button"
              className="settings-secondary-button"
              onClick={resetHero}
            >
              Reset to Default
            </button>
          </div>

          <div className="settings-subsection">
            <h3>Content</h3>
            <p className="settings-hint">
              Leave a field empty to use the default homepage text.
            </p>

            <div className="settings-grid">
              <div className="settings-field">
                <label htmlFor="heroEyebrow">Small Label</label>
                <input
                  id="heroEyebrow"
                  name="heroEyebrow"
                  value={form.heroEyebrow}
                  onChange={handleChange}
                  placeholder="Creative Studio"
                />
              </div>

              <div className="settings-field">
                <label htmlFor="heroAccent">Highlighted Line (blue gradient)</label>
                <input
                  id="heroAccent"
                  name="heroAccent"
                  value={form.heroAccent}
                  onChange={handleChange}
                  placeholder="& Motion Design"
                />
              </div>
            </div>

            <div className="settings-field">
              <label htmlFor="heroTitle">Hero Heading</label>
              <textarea
                id="heroTitle"
                name="heroTitle"
                value={form.heroTitle}
                onChange={handleChange}
                rows="3"
                placeholder={"Animation\nVideo Editing"}
              />
              <span className="settings-hint">
                Each new line becomes a new heading line.
              </span>
            </div>

            <div className="settings-field">
              <label htmlFor="heroDescription">Tagline Under Heading</label>
              <input
                id="heroDescription"
                name="heroDescription"
                value={form.heroDescription}
                onChange={handleChange}
                placeholder="Learning • Creating • Sharing"
              />
              <span className="settings-hint">
                Separate words with • to show them as dotted items.
              </span>
            </div>
          </div>

          <div className="settings-subsection">
            <h3>Background Video</h3>
            <p className="settings-hint">
              Upload the video to Cloudinary and paste its https:// link. Use a short,
              muted-friendly MP4 (under 10 MB) for fast loading.
            </p>

            <div className="settings-grid">
              <div className="settings-field">
                <label htmlFor="heroVideoUrl">Background Video URL</label>
                <input
                  id="heroVideoUrl"
                  type="url"
                  name="heroVideoUrl"
                  value={form.heroVideoUrl}
                  onChange={handleChange}
                  placeholder="https://res.cloudinary.com/.../video.mp4"
                />
                {videoPreview && (
                  <div className="settings-preview">
                    <video
                      key={videoPreview}
                      src={videoPreview}
                      poster={posterPreview || undefined}
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                  </div>
                )}
              </div>

              <div className="settings-field">
                <label htmlFor="heroPosterUrl">Poster Image URL</label>
                <input
                  id="heroPosterUrl"
                  type="url"
                  name="heroPosterUrl"
                  value={form.heroPosterUrl}
                  onChange={handleChange}
                  placeholder="https://res.cloudinary.com/.../poster.jpg"
                />
                <span className="settings-hint">
                  Shown while the video loads, and to visitors who prefer reduced motion.
                </span>
                {posterPreview && (
                  <div className="settings-preview">
                    <img src={posterPreview} alt="Hero poster preview" />
                  </div>
                )}
              </div>
            </div>

            <div className="settings-field">
              <label htmlFor="heroOverlay">
                Light Overlay Strength
                <span className="settings-range-value">{form.heroOverlay}%</span>
              </label>
              <input
                id="heroOverlay"
                className="settings-range"
                type="range"
                name="heroOverlay"
                min="0"
                max="90"
                step="5"
                value={form.heroOverlay}
                onChange={handleChange}
              />
              <span className="settings-hint">
                Higher keeps the text easier to read. Lower shows more of the video.
              </span>
            </div>
          </div>

          <div className="settings-subsection">
            <h3>Right Side Logo</h3>

            <div className="settings-segmented" role="radiogroup" aria-label="Hero logo">
              {LOGO_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`settings-segment ${
                    form.heroLogoMode === option.value ? "is-active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="heroLogoMode"
                    value={option.value}
                    checked={form.heroLogoMode === option.value}
                    onChange={handleChange}
                  />
                  {option.label}
                </label>
              ))}
            </div>

            {form.heroLogoMode === "image" && (
              <div className="settings-field settings-logo-field">
                <label htmlFor="heroLogoUrl">Custom Logo URL</label>
                <input
                  id="heroLogoUrl"
                  type="url"
                  name="heroLogoUrl"
                  value={form.heroLogoUrl}
                  onChange={handleChange}
                  placeholder="https://res.cloudinary.com/.../logo.png"
                />
                <span className="settings-hint">
                  Use a transparent PNG, WebP or SVG. It floats and tilts like the default logo.
                </span>
                {logoPreview && (
                  <div className="settings-preview is-logo">
                    <img src={logoPreview} alt="Custom logo preview" />
                  </div>
                )}
              </div>
            )}
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