
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section">
      <div className="footer-container">

        <div className="footer-main">
          <div className="footer-brand">
            <a href="#home" className="footer-logo">
              INI<span>FLOW.</span>
            </a>

            <p>
              Turning creative ideas into meaningful digital
              experiences through design, animation and technology.
            </p>

            <div className="footer-socials">
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>

              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>

              <a
                href="https://youtube.com/"
                target="_blank"
                rel="noreferrer"
              >
                YouTube
              </a>
            </div>
          </div>

          <div className="footer-links">
            <h3>Quick Links</h3>
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#skills">Creative Skills</a>
            <a href="#projects">Projects</a>
            <a href="#courses">Courses</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="footer-contact">
            <h3>Let's Connect</h3>
            <p>Have an idea or project in mind?</p>
            <a href="#contact" className="footer-contact-link">
              Let's Talk <span>↗</span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {currentYear} INIFLOW. All rights reserved.
          </p>

          <a href="#home" className="footer-back-top">
            Back to Top <span>↑</span>
          </a>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
