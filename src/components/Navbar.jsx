import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { CLASSES } from "../data/classes";
import { ChevronLeft, Moon, Sun, Layers, ArrowLeftRight } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const syncThemeColor = (light) => {
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", light ? "#eef4ff" : "#030610");
    }
  };

  // Load theme preference
  useEffect(() => {
    const saved = localStorage.getItem("ios_light_mode") === "true";
    setIsLightMode(saved);
    if (saved) {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
    syncThemeColor(saved);
  }, []);

  const toggleTheme = () => {
    const next = !isLightMode;
    setIsLightMode(next);
    if (next) {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
    syncThemeColor(next);
    localStorage.setItem("ios_light_mode", next.toString());
  };

  // Scroll detection for enhanced glass elevation
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on location change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isHome = location.pathname === "/";
  const isCalculator = location.pathname.startsWith("/hisoblovchi") || location.pathname.startsWith("/uchrashuvlar");
  const currentClass = location.pathname.match(/\/class\/(\w+)/)?.[1]?.toUpperCase();

  return (
    <>
      <header className={`ios-navbar ${scrolled ? "is-scrolled" : ""}`}>
        <div className="ios-nav-inner">
          {/* Left: Brand or iOS Back Button */}
          <div className="ios-nav-left">
            {!isHome ? (
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="ios-back-btn"
                aria-label="Orqaga qaytish"
              >
                <ChevronLeft size={20} strokeWidth={2.5} />
                <span>Orqaga</span>
              </button>
            ) : (
              <NavLink to="/" className="ios-brand-link">
                <span className="brand-dot"></span>
                <span className="brand-name">Jurnal<span className="brand-suffix">.uz</span></span>
              </NavLink>
            )}
          </div>

          {/* Center: Dynamic Title or Class Badge */}
          <div className="ios-nav-center">
            {currentClass ? (
              <div className="ios-current-pill">
                <span className="pill-dot"></span>
                <span>{currentClass} Sinf</span>
              </div>
            ) : isCalculator ? (
              <div className="ios-current-pill calc-pill">
                <ArrowLeftRight size={14} />
                <span>Uchrashuvlar</span>
              </div>
            ) : (
              <span className="ios-nav-title">Raqamli Jadval</span>
            )}
          </div>

          {/* Right: Quick Class Menu & Theme Switcher */}
          <div className="ios-nav-right">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className={`ios-icon-btn ${menuOpen ? "active" : ""}`}
              title="Barcha sinflar"
              aria-label="Barcha sinflar"
            >
              <Layers size={18} />
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="ios-icon-btn"
              title={isLightMode ? "To'q ko'k shaffof rejim" : "Och ko'k shaffof rejim"}
              aria-label="Mavzuni almashtirish"
            >
              {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </div>

        {/* Quick Classes Drawer (iOS Glass Dropdown) */}
        {menuOpen && (
          <div className="ios-classes-drawer" role="menu">
            <div className="drawer-header">
              <span className="drawer-title">Sinflar jadvali</span>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setMenuOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="drawer-grid">
              {CLASSES.map((cls) => {
                const isActive = location.pathname === `/class/${cls}`;
                return (
                  <NavLink
                    key={cls}
                    to={`/class/${cls}`}
                    className={`drawer-class-chip ${isActive ? "active" : ""}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>{cls.toUpperCase()}</span>
                  </NavLink>
                );
              })}
            </div>
            <div className="drawer-footer">
              <NavLink
                to="/hisoblovchi"
                className="drawer-calc-link"
                onClick={() => setMenuOpen(false)}
              >
                <ArrowLeftRight size={15} />
                <span>Uchrashuvlar hisoblagichi</span>
              </NavLink>
            </div>
          </div>
        )}
      </header>

      {/* Dimmed backdrop when drawer is open */}
      {menuOpen && (
        <div
          className="ios-nav-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
