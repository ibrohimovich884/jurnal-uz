import { useParams } from "react-router-dom";
import schedules from "../data/schedules";
import "./ClassPage.css";

export default function ClassPage() {
  const { className } = useParams();
  const schedule = schedules[className];

  if (!schedule) {
    return <h2 className="not-found">Bu sinf uchun jadval topilmadi.</h2>;
  }

  return (
    <div className="class-page">
      <h1 className="title">{className.toUpperCase()} sinf jadvali</h1>

      <div className="schedule-container">
        {schedule.map((day, idx) => (
          <div className="day-card" key={idx}>
            <h2 className="day-name">{day.day}</h2>
            <ul className="lessons-list">
              {day.subjects.map((subject, i) => (
                <li key={i}>
                  <span className="lesson-hour">{i + 1}-soat:</span> {subject}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
