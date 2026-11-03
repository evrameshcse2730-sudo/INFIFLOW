
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import "./Navbar.css";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Courses", href: "#courses" },
  { name: "Contact", href: "#contact" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="iniflow-navbar">
      <nav className="navbar-container">
        <a href="#home" className="navbar-logo" onClick={closeMenu}>
          INI<span>FLOW.</span>
        </a>

        <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={closeMenu}
            >
              {link.name}
            </a>
          ))}

          <a
            href="#contact"
            className="navbar-cta"
            onClick={closeMenu}
          >
            Let's Talk <ArrowUpRight size={17} />
          </a>
        </div>

        <button
          className="navbar-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
