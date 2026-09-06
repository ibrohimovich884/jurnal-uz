import { useState, useEffect } from "react";
import { formatLessonTime } from "../data/lessonTimes";
import "./LessonItem.css";

export default function LessonItem({ lesson, index, isCurrent }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString("uz-UZ", { hour: '2-digit', minute: '2-digit' }));

  // Har daqiqada vaqtni yangilab turish
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("uz-UZ", { hour: '2-digit', minute: '2-digit' }));
    }, 60000); // 60 soniyada bir yangilanadi

    return () => clearInterval(timer); // Komponent o'chganda taymerni to'xtatish
  }, []);

  return (
    <div
      className={`lesson-box ${isOpen ? "expanded" : ""} ${isCurrent ? "is-current" : ""}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="lesson-main-info">
        {isCurrent && <span className="current-pulse" aria-hidden="true"></span>}
        <span className="lesson-number">{index + 1}</span>
        <span className="lesson-name">{lesson.name}</span>
        <span className="lesson-room">№{lesson.room}</span>
      </div>
      
      {isOpen && (
        <div className="lesson-details-panel">
          <div className="detail-item">
            <span className="icon">👤</span> 
            <p>Ustoz: <span>{lesson.teacher || "Belgilanmagan"}</span></p>
          </div>
          <div className="detail-item">
            <span className="icon">🕒</span> 
            <p>Dars vaqti: <span>{formatLessonTime(index)}</span></p>
          </div>
          {/* Hozirgi soat qo'shildi */}
          <div className="detail-item current-time-item">
            <span className="icon">⏰</span> 
            <p>Hozirgi soat: <span>{currentTime}</span></p>
          </div>
        </div>
      )}
    </div>
  );
}