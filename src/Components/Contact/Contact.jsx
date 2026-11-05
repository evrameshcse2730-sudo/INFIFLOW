import { useEffect, useId, useState } from "react";
import emailjs from "@emailjs/browser";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

import { db } from "../../firebase/firebase";
import "./Contact.css";

const EASE = [0.22, 1, 0.36, 1];

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const PHONE_PATTERN = /^\+?[0-9\s()-]{7,20}$/;
const DEFAULT_COUNTRY_CODE = "91";

// Message that is pre-filled in WhatsApp when a client taps the button.
const WHATSAPP_MESSAGE =
  "Hi INIFLOW! I found your website and I'd like to know more about your creative services.";

const infoItems = [
  { icon: Mail, label: "Email / Project Enquiry" },
  { icon: Phone, label: "Let's Connect" },
  { icon: MapPin, label: "Available for Creative Projects" },
];

const headingLines = [
  { text: "Let's Create Something" },
  { accent: "Amazing." },
];

const columnVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const titleVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

const fadeOnlyVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

const lineRevealVariants = {
  hidden: { y: "110%" },
  show: {
    y: "0%",
    transition: { duration: 0.9, ease: EASE },
  },
};

const formVariants = {
  hidden: { opacity: 0, x: 30 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: EASE,
      staggerChildren: 0.06,
      delayChildren: 0.2,
    },
  },
};

// Turns the admin's WhatsApp number into the digits-only format wa.me expects.
// A 10-digit number without a country code is treated as an Indian number.
function normalizeWhatsAppNumber(value) {
  const digits = String(value || "").replace(/\D/g, "").replace(/^0+/, "");
  if (digits.length === 10) return `${DEFAULT_COUNTRY_CODE}${digits}`;
  if (digits.length >= 11 && digits.length <= 15) return digits;
  return "";
}

function Contact() {
  const [form, setForm] = useState(INITIAL_FORM);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const fieldId = useId();
  const reduceMotion = useReducedMotion();

  // Owner's WhatsApp number from Admin → Settings
  useEffect(() => {
    let isMounted = true;

    const fetchWhatsAppNumber = async () => {
      try {
        const snapshot = await getDoc(doc(db, "settings", "website"));
        if (!snapshot.exists() || !isMounted) return;

        setWhatsappNumber(normalizeWhatsAppNumber(snapshot.data().whatsapp));
      } catch (settingsError) {
        console.error("Contact settings fetch error:", settingsError);
      }
    };

    fetchWhatsAppNumber();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      // EmailJS environment configuration
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error(
          "EmailJS configuration missing. Please check your .env file."
        );
      }

      // Validate form data
      const templateParams = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      };

      if (
        !templateParams.name ||
        !templateParams.email ||
        !templateParams.subject ||
        !templateParams.message
      ) {
        throw new Error("Please fill in all required fields.");
      }

      if (templateParams.phone && !PHONE_PATTERN.test(templateParams.phone)) {
        throw new Error("Please enter a valid phone number.");
      }

      // 1. Send email using EmailJS
      await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      // 2. Save enquiry in Firestore
      try {
        await addDoc(collection(db, "enquiries"), {
          ...templateParams,
          status: "New",
          createdAt: serverTimestamp(),
        });
      } catch (firestoreError) {
        console.error(
          "Firestore save error:",
          firestoreError
        );

        setSuccess(
          "Your email was sent successfully, but database saving failed."
        );

        setForm(INITIAL_FORM);

        return;
      }

      // 3. Success
      setSuccess(
        "Thank you! Your message has been sent successfully."
      );

      setForm(INITIAL_FORM);
    } catch (err) {
      console.error("Contact form error:", err);

      setError(
        err.message ||
          "Unable to send your message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const fadeUp = reduceMotion
    ? fadeOnlyVariants
    : fadeUpVariants;

  const lineReveal = reduceMotion
    ? fadeOnlyVariants
    : lineRevealVariants;

  const formIn = reduceMotion
    ? {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            duration: 0.5,
            staggerChildren: 0.04,
          },
        },
      }
    : formVariants;

  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
    : "";

  return (
    <section className="contact-section" id="contact">
      <div
        className="contact-bg-glow contact-glow-one"
        aria-hidden="true"
      />

      <div
        className="contact-bg-glow contact-glow-two"
        aria-hidden="true"
      />

      <svg
        className="contact-wave"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="contactWaveFill"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop
              offset="0%"
              stopColor="#0a6cff"
              stopOpacity="0.18"
            />
            <stop
              offset="60%"
              stopColor="#1ec8ff"
              stopOpacity="0.06"
            />
            <stop
              offset="100%"
              stopColor="#0a6cff"
              stopOpacity="0.12"
            />
          </linearGradient>
        </defs>

        <path
          d="M0,210 C260,140 460,290 760,230 C1040,175 1220,120 1440,160 L1440,320 L0,320 Z"
          fill="url(#contactWaveFill)"
        />

        <path
          d="M0,270 C320,220 560,320 860,270 C1120,230 1280,210 1440,235 L1440,320 L0,320 Z"
          fill="#ffffff"
          fillOpacity="0.6"
        />
      </svg>

      <div className="contact-container">
        {/* Contact Information */}
        <motion.div
          className="contact-intro"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={columnVariants}
        >
          <motion.span
            className="contact-eyebrow"
            variants={fadeUp}
          >
            Get In Touch
          </motion.span>

          <motion.h2
            className="contact-title"
            variants={titleVariants}
            aria-label="Let's Create Something Amazing."
          >
            {headingLines.map((line) => (
              <span
                className="contact-title-line"
                key={line.text || line.accent}
              >
                <motion.span
                  className="contact-title-inner"
                  variants={lineReveal}
                >
                  {line.text}

                  {line.accent && (
                    <span className="contact-gradient-text">
                      {line.accent}
                    </span>
                  )}
                </motion.span>
              </span>
            ))}
          </motion.h2>

          <motion.p
            className="contact-subtitle"
            variants={fadeUp}
          >
            Have a creative idea or project in mind?
            Let's connect and bring it to life.
          </motion.p>

          <motion.div
            className="contact-info"
            variants={fadeUp}
          >
            <h3>Let's Talk</h3>

            <p>
              I'm always open to discussing creative projects,
              collaborations and new opportunities.
            </p>
          </motion.div>

          <motion.ul className="contact-info-list">
            {infoItems.map(({ icon: Icon, label }) => (
              <motion.li
                className="contact-info-item"
                key={label}
                variants={fadeUp}
              >
                <span className="contact-info-icon">
                  <Icon size={19} />
                </span>

                <span className="contact-info-text">
                  {label}
                </span>
              </motion.li>
            ))}
          </motion.ul>

          {/* WhatsApp quick chat (independent from the enquiry form).
              The animated wrapper is always rendered so it reveals with the column;
              the link inside appears as soon as the owner's number has loaded. */}
          <motion.div
            className="contact-whatsapp-wrap"
            variants={fadeUp}
          >
            {whatsappHref && (
              <a
                href={whatsappHref}
                className="contact-whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp (opens WhatsApp in a new tab)"
              >
                <MessageCircle
                  size={19}
                  className="contact-whatsapp-icon"
                />
                Chat on WhatsApp
              </a>
            )}
          </motion.div>

          {/* Paper Plane */}
          <div className="contact-plane" aria-hidden="true">
            <svg
              viewBox="0 0 220 160"
              className="contact-plane-svg"
            >
              <defs>
                <linearGradient
                  id="contactPlaneTop"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#e9f6ff" />
                  <stop offset="100%" stopColor="#7cc8ff" />
                </linearGradient>

                <linearGradient
                  id="contactPlaneSide"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#5fb6ff" />
                  <stop offset="100%" stopColor="#0a6cff" />
                </linearGradient>
              </defs>

              <path
                className="contact-plane-trail"
                d="M10,150 C50,140 70,110 100,112 C125,114 120,135 105,135 C88,135 98,100 130,88"
                fill="none"
                stroke="#0a6cff"
                strokeOpacity="0.35"
                strokeWidth="2"
                strokeDasharray="6 8"
              />

              <g className="contact-plane-body">
                <path
                  d="M120,80 L212,14 L160,118 Z"
                  fill="url(#contactPlaneTop)"
                />

                <path
                  d="M160,118 L212,14 L150,92 Z"
                  fill="url(#contactPlaneSide)"
                />

                <path
                  d="M150,92 L212,14 L146,112 Z"
                  fill="#0050e6"
                  fillOpacity="0.85"
                />
              </g>
            </svg>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          className="contact-form"
          onSubmit={handleSubmit}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={formIn}
        >
          <motion.div
            className="contact-field"
            variants={fadeUp}
          >
            <input
              id={`${fieldId}-name`}
              type="text"
              name="name"
              placeholder=" "
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              required
              maxLength={100}
            />

            <label htmlFor={`${fieldId}-name`}>
              Your Name <span aria-hidden="true">*</span>
            </label>
          </motion.div>

          <motion.div
            className="contact-field"
            variants={fadeUp}
          >
            <input
              id={`${fieldId}-email`}
              type="email"
              name="email"
              placeholder=" "
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
              maxLength={150}
            />

            <label htmlFor={`${fieldId}-email`}>
              Your Email <span aria-hidden="true">*</span>
            </label>
          </motion.div>

          <motion.div
            className="contact-field"
            variants={fadeUp}
          >
            <input
              id={`${fieldId}-phone`}
              type="tel"
              name="phone"
              placeholder=" "
              autoComplete="tel"
              inputMode="tel"
              value={form.phone}
              onChange={handleChange}
              maxLength={20}
            />

            <label htmlFor={`${fieldId}-phone`}>
              Phone Number <small className="contact-optional">(optional)</small>
            </label>
          </motion.div>

          <motion.div
            className="contact-field"
            variants={fadeUp}
          >
            <input
              id={`${fieldId}-subject`}
              type="text"
              name="subject"
              placeholder=" "
              value={form.subject}
              onChange={handleChange}
              required
              maxLength={150}
            />

            <label htmlFor={`${fieldId}-subject`}>
              Subject <span aria-hidden="true">*</span>
            </label>
          </motion.div>

          <motion.div
            className="contact-field is-full is-textarea"
            variants={fadeUp}
          >
            <textarea
              id={`${fieldId}-message`}
              name="message"
              placeholder=" "
              value={form.message}
              onChange={handleChange}
              rows="5"
              required
              maxLength={5000}
            />

            <label htmlFor={`${fieldId}-message`}>
              Tell me about your project{" "}
              <span aria-hidden="true">*</span>
            </label>
          </motion.div>

          {/* Success / Error Messages */}
          <div
            className="contact-status is-full"
            aria-live="polite"
          >
            <AnimatePresence mode="wait">
              {success && (
                <motion.p
                  key="success"
                  className="contact-success"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <CheckCircle size={18} />
                  {success}
                </motion.p>
              )}

              {error && (
                <motion.p
                  key="error"
                  className="contact-error"
                  role="alert"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <AlertCircle size={18} />
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Submit Button */}
          <motion.div
            className="is-full"
            variants={fadeUp}
          >
            <button
              type="submit"
              className="contact-submit"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send via Email"}

              {loading ? (
                <Loader2
                  size={18}
                  className="contact-submit-spinner"
                />
              ) : (
                <Send
                  size={17}
                  className="contact-submit-icon"
                />
              )}
            </button>
          </motion.div>
        </motion.form>
      </div>
    </section>
  );
}

export default Contact;