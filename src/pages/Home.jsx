import { Link } from "react-router";
import { useState, useEffect, useRef } from "react";
import { CLASSES } from "../data/classes";
import "./Home.css";

const STORAGE_KEY = "dars_jadval_class_order";

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Saqlangan sinflar ketma-ketligini yuklash
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

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const saveOrder = (newOrder) => {
    setClassList(newOrder);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrder));
    } catch {
      // ignore
    }
  };

  // Sinflarni o'z o'rnini almashtirish (drag & drop)
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

  // Birinchi o'ringa qo'yish (Mening sinfim / Pin)
  const pinToTop = (cls, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (classList[0] === cls) return;
    const remaining = classList.filter((c) => c !== cls);
    const updated = [cls, ...remaining];
    saveOrder(updated);
    if (navigator.vibrate) navigator.vibrate(25);
  };

  // Kartani oldinga/orqaga bitta surish (card ichidagi tugma)
  const moveCard = (index, direction, e) => {
    e.preventDefault();
    e.stopPropagation();
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= classList.length) return;
    const updated = [...classList];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    saveOrder(updated);
    if (navigator.vibrate) navigator.vibrate(15);
  };

  // Boshlang'ich tartibga qaytarish
  const resetOrder = (e) => {
    e.preventDefault();
    saveOrder(CLASSES);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const isCustomized = JSON.stringify(classList) !== JSON.stringify(CLASSES);

  return (
    <main className="home-container">
      {/* Dynamic Background Elements */}
      <div className="blob-blur"></div>
      
      <header className="home-header">
        <div className="header-badge">2025-2026 O'quv yili</div>
        <h1 className="main-title">
          Raqamli Jurnal <span className="text-gradient">Aqlli Jadval</span>
        </h1>
        <p className="description">
          Maktab hayotini boshqarish endi osonroq. Darslar, o'qituvchilar va 
          xona ma'lumotlari yagona interaktiv platformada.
        </p>

        <div className="quick-stats">
          <div className="stat-card">
            <span className="stat-time">{currentTime.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="stat-label">Hozirgi vaqt</span>
          </div>
          <div className="stat-card">
            <span className="stat-count">{classList.length}</span>
            <span className="stat-label">Sinf jadvallari</span>
          </div>
        </div>

        {/* Sinflar Uchrashuvi Hisoblagichi Promosi */}
        <Link to="/hisoblovchi" className="calculator-promo-banner">
          <div className="promo-badge">⚡ Yangi funksiya</div>
          <div className="promo-content">
            <h2 className="promo-title">Sinflar Uchrashuvi Hisoblagichi</h2>
            <p className="promo-desc">
              Masalan <b>10b</b> va <b>9a</b>: qaysi xonada va qaysi soatda ketma-ket dars o'tib, tanaffusda uchrashishini aniqlang!
            </p>
          </div>
          <div className="promo-action">
            <span>Ochish</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </header>

      <section className="selection-area">
        <div className="section-header">
          <div className="section-title-wrap">
            <h2 className="section-title">O'z sinfingizni tanlang</h2>
            <span className="section-subtitle">
              Sinflarni surib yoki ⭐ orqali o'zingizga qulay tartiblang
            </span>
          </div>
          {isCustomized && (
            <button
              onClick={resetOrder}
              className="reset-order-btn"
              title="Sinflar tartibini asliga qaytarish"
            >
              Asliga qaytarish ↺
            </button>
          )}
        </div>

        <div className="bento-grid">
          {classList.map((cls, idx) => {
            const isFirst = idx === 0 && isCustomized;
            const isDragging = draggedIdx === idx;
            const isDragOver = dragOverIdx === idx;

            return (
              <Link
                key={cls}
                to={`/class/${cls}`}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
                className={`bento-card ${isFirst ? "pinned-card" : ""} ${isDragging ? "is-dragging" : ""} ${isDragOver ? "is-drag-over" : ""}`}
                onClick={(e) => {
                  if (wasDraggingRef.current) {
                    e.preventDefault();
                  }
                }}
              >
                <div className="card-glass"></div>
                <div className="card-content">
                  <div className="card-top-bar">
                    <span className="class-label">
                      {isFirst ? "⭐ Asosiy" : "Sinf"}
                    </span>

                    {/* Card ichiga joylangan ixcham boshqaruv */}
                    <div
                      className="card-inline-actions"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={(e) => moveCard(idx, -1, e)}
                        className="card-shift-btn"
                        title="Oldinga surish"
                        aria-label="Oldinga surish"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        disabled={idx === classList.length - 1}
                        onClick={(e) => moveCard(idx, 1, e)}
                        className="card-shift-btn"
                        title="Keyinga surish"
                        aria-label="Keyinga surish"
                      >
                        ›
                      </button>
                      <button
                        type="button"
                        className={`card-pin-btn ${isFirst ? "is-pinned" : ""}`}
                        onClick={(e) => pinToTop(cls, e)}
                        title={isFirst ? "Asosiy sinf" : "Boshiga o'tkazish (Mening sinfim)"}
                        aria-label={`${cls.toUpperCase()} sinfini boshiga o'tkazish`}
                      >
                        {isFirst ? "★" : "☆"}
                      </button>
                    </div>
                  </div>

                  <h3 className="class-id">{cls.toUpperCase()}</h3>

                  <div className="card-footer">
                    <span>Kirish</span>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-line"></div>
        <p className="support-text">
          Tizim bo'yicha savollaringiz bormi? 
          <a href="https://T.me/ibrohimovich_o1" className="dev-link"> Dasturchi bilan aloqa</a>
        </p>
      </footer>
    </main>
  );
}