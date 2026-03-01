import { useParams } from "react-router";
import { useState } from "react";
import schedules from "../data/schedules";
import UpdateModal from "../components/UpdateModal";
import LessonItem from "../components/LessonItem";
import "./ClassPage.css";

export default function ClassPage() {
  const { className } = useParams();
  const schedule = schedules[className];
  const [showUpdate, setShowUpdate] = useState(false);

  const uzbekDays = ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];
  const now = new Date();
  const currentDayName = uzbekDays[now.getDay()];
  
  // 14:00 dan keyin ertangi kunni "Hozir" deb ko'rsatish mantiqi
  let targetIndex = now.getDay();
  if (now.getHours() >= 14) {
    targetIndex = targetIndex === 6 ? 1 : targetIndex + 1;
  }
  const activeDayName = uzbekDays[targetIndex];
  const beta = "2026.03.01 — 10:37";

  if (!schedule) return (
    <div className="not-found-container">
      <div className="error-card">
        <span>⚠️</span>
        <h2>Ma'lumot topilmadi</h2>
        <p>{className} sinf jadvali hali yuklanmagan.</p>
      </div>
    </div>
  );

  return (
    <div className="class-page-wrapper">
      <header className="premium-header">
        <div className="header-content">
          <h1 className="main-title">Dars Jadvali</h1>
          <div className="live-status">
            <div className="pulse-dot"></div>
            <span>Bugun: <b>{currentDayName}</b></span>
          </div>
        </div>
      </header>

      <main className="schedule-container">
        <div className="bento-grid">
          {schedule.map((day, idx) => (
            <section 
              key={idx} 
              className={`day-section ${day.day === activeDayName ? "is-active" : ""}`}
            >
              <div className="day-header">
                <div className="day-info">
                  <h2>{day.day}</h2>
                  <span className="lesson-count">{day.subjects.length} ta dars</span>
                </div>
                {day.day === activeDayName && <div className="status-label">Ayni vaqtda</div>}
              </div>

              <div className="lessons-container">
                {day.subjects.map((lesson, i) => (
                  <LessonItem key={i} lesson={lesson} index={i} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <footer className="page-footer">
        <button className="glass-update-btn" onClick={() => setShowUpdate(true)}>
          <span className="btn-icon">🚀</span>
          <span className="btn-text">v{beta.split(' — ')[0]}</span>
        </button>
      </footer>

      <UpdateModal 
        isOpen={showUpdate} 
        onClose={() => setShowUpdate(false)} 
        betaVersion={beta} 
      />
    </div>
  );
}