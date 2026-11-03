
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { Mail, Send, MapPin, Phone } from "lucide-react";
import { db } from "../../firebase/firebase";
import "./Contact.css";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      await addDoc(collection(db, "enquiries"), {
        ...form,
        status: "New",
        createdAt: serverTimestamp(),
      });

      setSuccess("Thank you! Your message has been sent.");
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error("Contact form error:", err);
      setError("Unable to send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        <motion.div
          className="contact-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span>GET IN TOUCH</span>
          <h2>
            Let's Create Something <span>Amazing.</span>
          </h2>
          <p>
            Have a creative idea or project in mind?
            Let's connect and bring it to life.
          </p>
        </motion.div>

        <div className="contact-content">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3>Let's Talk</h3>
            <p>
              I'm always open to discussing creative projects,
              collaborations and new opportunities.
            </p>

            <div className="contact-info-item">
              <Mail size={21} />
              <span>Email / Project Enquiry</span>
            </div>

            <div className="contact-info-item">
              <Phone size={21} />
              <span>Let's Connect</span>
            </div>

            <div className="contact-info-item">
              <MapPin size={21} />
              <span>Available for Creative Projects</span>
            </div>
          </motion.div>

          <motion.form
            className="contact-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              placeholder="Tell me about your project..."
              value={form.message}
              onChange={handleChange}
              rows="5"
              required
            />

            {success && <p className="contact-success">{success}</p>}
            {error && <p className="contact-error">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
              <Send size={17} />
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
