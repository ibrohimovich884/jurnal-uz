import { useState, useEffect } from "react";
import { formatLessonTime } from "../data/lessonTimes";
import { User, Clock, ChevronDown, Check } from "lucide-react";
import "./LessonItem.css";

export default function LessonItem({ lesson, index, isCurrent, isPast }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })
      );
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`ios-lesson-item ${isOpen ? "is-expanded" : ""} ${isCurrent ? "is-current" : ""} ${isPast ? "is-past" : ""}`}
      onClick={() => setIsOpen(!isOpen)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsOpen(!isOpen);
        }
      }}
    >
      <div className="lesson-main-row">
        {/* Left Indicator & Period Number */}
        <div className="lesson-left-group">
          {isCurrent && <span className="lesson-live-pulsar" aria-hidden="true"></span>}
          {isPast && (
            <span className="lesson-past-check" aria-hidden="true" title="Tugagan dars">
              <Check size={12} strokeWidth={3} />
            </span>
          )}
          <span className="lesson-period-num tabular-nums">{index + 1}</span>
        </div>

        {/* Subject Name */}
        <div className="lesson-info-group">
          <span className="lesson-title">{lesson.name}</span>
          {lesson.teacher && (
            <span className="lesson-teacher-subtext">{lesson.teacher}</span>
          )}
        </div>

        {/* Room Pill & Chevron */}
        <div className="lesson-right-group">
          <span className="lesson-room-pill">№{lesson.room}</span>
          <ChevronDown
            size={16}
            className={`lesson-chevron ${isOpen ? "rotated" : ""}`}
          />
        </div>
      </div>

      {/* Expanded Cupertino Drawer */}
      {isOpen && (
        <div className="lesson-drawer-panel" onClick={(e) => e.stopPropagation()}>
          <div className="drawer-item">
            <div className="drawer-icon-bubble">
              <User size={14} />
            </div>
            <div className="drawer-item-text">
              <span className="drawer-item-label">Ustoz</span>
              <span className="drawer-item-val">{lesson.teacher || "Belgilanmagan"}</span>
            </div>
          </div>

          <div className="drawer-item">
            <div className="drawer-icon-bubble">
              <Clock size={14} />
            </div>
            <div className="drawer-item-text">
              <span className="drawer-item-label">Dars vaqti</span>
              <span className="drawer-item-val tabular-nums">{formatLessonTime(index)}</span>
            </div>
          </div>

          <div className="drawer-item">
            <div className="drawer-icon-bubble blue">
              <Clock size={14} />
            </div>
            <div className="drawer-item-text">
              <span className="drawer-item-label">Hozirgi soat</span>
              <span className="drawer-item-val tabular-nums">{currentTime}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}