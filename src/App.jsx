import { useState, useEffect } from "react";
import { Routes, Route, NavLink, useLocation } from "react-router";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ClassPage from "./pages/ClassPage.jsx";
import CalculatorPage from "./pages/CalculatorPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import OnlineWatcher from "./components/online/OnlineWatcher.jsx";
import UpdateModal from "./components/UpdateModal.jsx";
import { formatUpdatedAt } from "./utils/formatDate";
import { CLASSES } from "./data/classes";
import { LayoutGrid, Calendar, ArrowLeftRight, Sparkles } from "lucide-react";
import "./App.css";

const STORAGE_KEY = "dars_jadval_class_order";

export default function App() {
  const [showUpdate, setShowUpdate] = useState(false);
  const location = useLocation();

  // Determine user's pinned or primary class (defaults to first in saved order or 10b)
  const [primaryClass, setPrimaryClass] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && CLASSES.includes(parsed[0])) {
          return parsed[0];
        }
      }
    } catch {
      // ignore
    }
    return "10b";
  });

  // Listen to order changes from Home component via storage event
  useEffect(() => {
    const checkOrder = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0 && CLASSES.includes(parsed[0])) {
            setPrimaryClass(parsed[0]);
          }
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener("storage", checkOrder);
    return () => window.removeEventListener("storage", checkOrder);
  }, []);

  const beta = formatUpdatedAt(__SCHEDULE_UPDATED_AT__);


  const isHome = location.pathname === "/";
  const isClassPage = location.pathname.startsWith("/class/");
  const isCalculator = location.pathname.startsWith("/hisoblovchi") || location.pathname.startsWith("/uchrashuvlar");

  return (
    <div className="ios-shell">
      {/* Dynamic Ambient Frosted Glass Mesh Blobs */}
      <div className="ios-ambient-layer" aria-hidden="true">
        <div className="ambient-blob ambient-blob-1"></div>
        <div className="ambient-blob ambient-blob-2"></div>
        <div className="ambient-blob ambient-blob-3"></div>
      </div>

      {/* Unified iOS Glass Navbar */}
      <Navbar />

      {/* Online / Offline Banner */}
      <OnlineWatcher />

      {/* Main Viewport */}
      <main className="ios-viewport">
        <Routes>
          <Route path="/" element={<Home onPrimaryClassChange={(cls) => setPrimaryClass(cls)} />} />
          <Route path="/class/:className" element={<ClassPage />} />
          <Route path="/hisoblovchi" element={<CalculatorPage />} />
          <Route path="/uchrashuvlar" element={<CalculatorPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Floating iPhone Glass Dock (Bottom Tab Bar) */}
      <nav className="ios-floating-dock-wrap" aria-label="Asosiy menyu">
        <div className="ios-floating-dock">
          {/* Tab 1: Sinflar (Home) */}
          <NavLink
            to="/"
            end
            className={({ isActive }) => `dock-tab-btn ${isActive ? "active" : ""}`}
            title="Sinflar ro'yxati"
          >
            <div className="dock-tab-icon">
              <LayoutGrid size={20} strokeWidth={2.2} />
              {isHome && <span className="dock-active-dot"></span>}
            </div>
            <span className="dock-tab-label">Sinflar</span>
          </NavLink>

          {/* Tab 2: Mening Sinfim / Darslar */}
          <NavLink
            to={`/class/${primaryClass}`}
            className={() => `dock-tab-btn ${isClassPage ? "active" : ""}`}
            title={`Mening sinfim (${primaryClass.toUpperCase()})`}
          >
            <div className="dock-tab-icon">
              <Calendar size={20} strokeWidth={2.2} />
              {isClassPage && <span className="dock-active-dot"></span>}
            </div>
            <span className="dock-tab-label">{primaryClass.toUpperCase()} Jadval</span>
          </NavLink>

          {/* Tab 3: Uchrashuvlar Hisoblagichi */}
          <NavLink
            to="/hisoblovchi"
            className={() => `dock-tab-btn ${isCalculator ? "active" : ""}`}
            title="Sinflar uchrashuvi hisoblagichi"
          >
            <div className="dock-tab-icon">
              <ArrowLeftRight size={20} strokeWidth={2.2} />
              {isCalculator && <span className="dock-active-dot"></span>}
            </div>
            <span className="dock-tab-label">Hisoblagich</span>
          </NavLink>

          {/* Tab 4: Yangilanishlar / Info Modal */}
          <button
            type="button"
            className="dock-tab-btn"
            onClick={() => setShowUpdate(true)}
            title="Ilova haqida & Yangiliklar"
          >
            <div className="dock-tab-icon">
              <Sparkles size={20} strokeWidth={2.2} />
            </div>
            <span className="dock-tab-label">Yangiliklar</span>
          </button>
        </div>
      </nav>

      {/* Universal Update Modal */}
      <UpdateModal
        isOpen={showUpdate}
        onClose={() => setShowUpdate(false)}
        betaVersion={beta}
      />
    </div>
  );
}
