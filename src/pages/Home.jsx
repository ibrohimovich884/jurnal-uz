import { Link } from "react-router";
import { useState, useRef } from "react";
import { CLASSES, UPDATED_CLASSES } from "../data/classes";
import { ChevronRight, RotateCcw } from "lucide-react";
import "./Home.css";

const STORAGE_KEY = "dars_jadval_class_order";

export default function Home({ onPrimaryClassChange }) {
  // Saqlangan sinflar ketma-ketligi
  const [classList, setClassList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter((c) => CLASSES.includes(c));
          const missing = CLASSES.filter((c) => !valid.includes(c));
          return [...valid, ...missing];
        }
      }
    } catch {
      // ignore
    }
    return CLASSES;
  });

  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const wasDraggingRef = useRef(false);

  const saveOrder = (newOrder) => {
    setClassList(newOrder);
    if (onPrimaryClassChange && newOrder.length > 0) {
      onPrimaryClassChange(newOrder[0]);
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrder));
      window.dispatchEvent(new Event("storage"));
    } catch {
      // ignore
    }
  };

  // Drag & drop
  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    wasDraggingRef.current = true;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIdx !== index) {
      setDragOverIdx(index);
    }
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      return;
    }

    const updated = [...classList];
    const [movedItem] = updated.splice(draggedIdx, 1);
    updated.splice(index, 0, movedItem);
    saveOrder(updated);

    if (navigator.vibrate) navigator.vibrate(20);

    setDraggedIdx(null);
    setDragOverIdx(null);
    setTimeout(() => {
      wasDraggingRef.current = false;
    }, 100);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
    setTimeout(() => {
      wasDraggingRef.current = false;
    }, 100);
  };

  // Reset order
  const resetOrder = (e) => {
    e.preventDefault();
    saveOrder(CLASSES);
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event("storage"));
    } catch {
      // ignore
    }
  };

  const isCustomized = JSON.stringify(classList) !== JSON.stringify(CLASSES);

  return (
    <div className="ios-home-page">
      {/* Minimalist Header */}
      <header className="ios-minimal-header">
        <h1 className="ios-main-heading">
          Dars Jadvali <span className="blue-gradient-text">Jurnal.uz</span>
        </h1>
        <p className="ios-hero-subtext">
          O'z sinfingizni tanlang va dars jadvalini ko'ring.
        </p>
      </header>

      {/* Class Directory */}
      <section className="ios-classes-section">
        {isCustomized && (
          <div className="ios-section-bar">
            <span></span>
            <button
              type="button"
              onClick={resetOrder}
              className="ios-reset-btn"
              title="Tartibni asliga qaytarish"
            >
              <RotateCcw size={13} />
              <span>Asliga qaytarish</span>
            </button>
          </div>
        )}

        {/* Translucent Blue Bento Grid */}
        <div className="ios-bento-grid">
          {classList.map((cls, idx) => {
            const isDragging = draggedIdx === idx;
            const isDragOver = dragOverIdx === idx;
            const isUpdated = UPDATED_CLASSES.includes(cls);

            return (
              <Link
                key={cls}
                to={`/class/${cls}`}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
                className={`ios-class-card ${!isUpdated ? "is-unupdated" : ""} ${isDragging ? "is-dragging" : ""} ${isDragOver ? "is-drag-over" : ""}`}
                onClick={(e) => {
                  if (wasDraggingRef.current) {
                    e.preventDefault();
                  }
                }}
              >
                {/* Specular Highlight Sheen */}
                <div className="card-specular-sheen"></div>

                <div className="card-header-row">
                  <span className="card-badge">Sinf</span>
                  <div className="card-arrow-bubble">
                    <ChevronRight size={14} strokeWidth={2.5} />
                  </div>
                </div>

                <div className="card-center">
                  <span className="card-class-number">{cls.toUpperCase()}</span>
                  <span className="card-class-subtext">Dars jadvali</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Minimalist Footer */}
      <footer className="ios-home-footer">
        <p className="footer-note">
          <a
            href="https://T.me/ibrohimovich_o1"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-dev-link"
          >
            Dasturchi bilan aloqa
          </a>
        </p>
      </footer>
    </div>
  );
}