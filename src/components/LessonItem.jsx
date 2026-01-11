import { useState } from "react";

export default function LessonItem({ lesson, index }) {
  const [isOpen, setIsOpen] = useState(false);

  // Dars vaqtlari (Buni keyinchalik props orqali ham berish mumkin)
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
            <p>Ustoz: <span>{lesson.teacher}</span></p>
          </div>
          <div className="detail-item">
            <span className="icon">🕒</span> 
            <p>Vaqt: <span>{lessonTimes[index] || "Noma'lum"}</span></p>
          </div>
        </div>
      )}
    </div>
  );
}