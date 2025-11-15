import { useState } from "react";
import { NavLink } from "react-router";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const classes = [
    "5a", "5b",
    "6a", "6b",
    "7a", "7b",
    "8a", "8b",
    "9a", "9b", "9d"
  ];

  return (
    <>
      <header className="navbar">
        <div className="nav-container">

          {/* LOGO */}
          <NavLink
            to="/"
            className="logo"
            onClick={() => setMenuOpen(false)}
          >
            Jurnal uz
          </NavLink>

          {/* HAMBURGER BUTTON */}
          <button
            className={`menu-toggle ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* NAV LINKS */}
          <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
            {classes.map((cls) => (
              <NavLink
                key={cls}
                to={`/class/${cls}`}
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
                onClick={() => setMenuOpen(false)}
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
      ></div>
    </>
  );
}
