import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router";
import "./Navbar.css";

const CLASSES = [
  "6a", "6b",
  "7a", "7b",
  "8a", "8b",
  "9a", "9b", "9d"
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Scroll holatini kuzatish
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Menu ochiq bo'lganda body scroll'ni o'chirish
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  // Escape tugmasi bilan menuni yopish
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  // Route o'zgarganda menuni yopish
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Hozirgi sinfni aniqlash
  const getCurrentClass = () => {
    const match = location.pathname.match(/\/class\/(\w+)/);
    return match ? match[1].toUpperCase() : null;
  };

  const currentClass = getCurrentClass();

  return (
    <>
      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-container">

          {/* LOGO */}
          <NavLink
            to="/"
            className="logo"
            aria-label="Bosh sahifa"
          >
            Jurnal uz
          </NavLink>

          {/* MOBILE: Hozirgi sinf ko'rsatish */}
          {currentClass && (
            <div className="current-class-mobile">
              {currentClass}-sinf
            </div>
          )}

          {/* HAMBURGER BUTTON */}
          <button
            className={`menu-toggle ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Menyuni yopish" : "Menyuni ochish"}
            aria-expanded={menuOpen}
            aria-controls="nav-menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* NAV LINKS */}
          <nav
            id="nav-menu"
            className={`nav-links ${menuOpen ? "open" : ""}`}
            role="navigation"
            aria-label="Asosiy navigatsiya"
          >
            {CLASSES.map((cls) => (
              <NavLink
                key={cls}
                to={`/class/${cls}`}
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                {cls.toUpperCase()}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* BLUR OVERLAY */}
      <div
        className={`blur-overlay ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      ></div>
    </>
  );
}