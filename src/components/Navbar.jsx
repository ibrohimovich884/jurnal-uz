import { useState } from "react";
import { Link } from "react-router";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const classes = ["6a", "6b", "7a", "7b", "8a", "8b", "9a", "9b", "9d"];

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <img src="../public/icon.svg" alt="Svg" /> Jurnal.uz
        </Link>

        <button
          className={`menu-toggle ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          {classes.map((cls) => (
            <Link
              key={cls}
              to={`/class/${cls}`}
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              {cls.toUpperCase()}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
