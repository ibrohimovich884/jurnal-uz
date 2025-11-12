import { useParams } from "react-router";
import schedules from "../data/schedules";
import { useState } from "react";
import "./ClassPage.css";

export default function ClassPage() {
  const { className } = useParams();
  const schedule = schedules[className];
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(null); // faqat bitta ochiladi

  if (!schedule) {
    return <h2 className="not-found">Bu sinf uchun jadval topilmadi.</h2>;
  }

  // Dars vaqtlarini avtomatik hisoblash
  const getLessonTime = (index) => {
    const startHour = 8;
    const lessonMinutes = 45;
    const breakMinutes = 10;
    const totalMinutes = index * (lessonMinutes + breakMinutes);
    const start = new Date(0, 0, 0, startHour, totalMinutes);
    const end = new Date(start.getTime() + lessonMinutes * 60000);

    const format = (d) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return `${format(start)} - ${format(end)}`;
  };

  return (
    <div className="class-page">
      <h1 className="title">{className.toUpperCase()} sinf jadvali</h1>

      <div className="schedule-container">
        {schedule.map((day, idx) => (
          <div className="day-card" key={idx}>
            <h2 className="day-name">{day.day}</h2>

            <ul className="lessons-list">
              {day.subjects.map((lesson, i) => {
                const id = `${idx}-${i}`;
                const isOpen = selectedLessonIndex === id;
                return (
                  <li
                    key={i}
                    className={`lesson-item ${isOpen ? "expanded" : ""}`}
                    onClick={() =>
                      setSelectedLessonIndex(isOpen ? null : id)
                    }
                  >
                    <div className="lesson-main">
                      <span className="lesson-hour">{i + 1}-soat:</span>
                      <span className="lesson-name">{lesson.name}</span>
                      <span className="lesson-room">({lesson.room}-xona)</span>
                    </div>

                    {isOpen && (
                      <div className="lesson-details">
                        <p><b>Ustoz:</b> {lesson.teacher}</p>
                        <p><b>Vaqt:</b> {getLessonTime(i)}</p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
