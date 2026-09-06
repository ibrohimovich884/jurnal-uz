import { useState, useEffect } from "react";
import "./LessonItem.css";

export default function LessonItem({ lesson, index }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString("uz-UZ", { hour: '2-digit', minute: '2-digit' }));

  // Har daqiqada vaqtni yangilab turish
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("uz-UZ", { hour: '2-digit', minute: '2-digit' }));
    }, 60000); // 60 soniyada bir yangilanadi

    return () => clearInterval(timer); // Komponent o'chganda taymerni to'xtatish
  }, []);

  const lessonTimes = [
    "08:00 - 08:45", "08:50 - 09:35", "09:40 - 10:25", 
    "10:30 - 11:15", "11:20 - 12:05", "12:10 - 12:55"
  ];

  return (
    <div 
      className={`lesson-box ${isOpen ? "expanded" : ""}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="lesson-main-info">
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
            <p>Dars vaqti: <span>{lessonTimes[index] || "Noma'lum"}</span></p>
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