import { Link } from "react-router";
import { useState, useEffect } from "react";
import { CLASSES } from "../data/classes";
import "./Home.css";

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
            <span className="stat-count">{CLASSES.length}</span>
            <span className="stat-label">Sinf jadvallari</span>
          </div>
        </div>
      </header>

      <section className="selection-area">
        <div className="section-header">
          <h2 className="section-title">O'z sinfingizni tanlang</h2>
          <div className="search-placeholder">Sinfni qidirish...</div>
        </div>

        <div className="bento-grid">
          {CLASSES.map((cls) => (
            <Link key={cls} to={`/class/${cls}`} className="bento-card">
              <div className="card-glass"></div>
              <div className="card-content">
                <span className="class-label">Sinf</span>
                <h3 className="class-id">{cls.toUpperCase()}</h3>
                <div className="card-footer">
                  <span>Kirish</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
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