import { useParams } from "react-router";
import schedules from "../data/schedules";
import { useState } from "react";
import "./ClassPage.css";

export default function ClassPage() {
    const { className } = useParams();
    const schedule = schedules[className];
    const [selectedLessonIndex, setSelectedLessonIndex] = useState(null);

    // --- YANGI QO‘SHILGAN QISM BOSHLANDI ---
    const uzbekDays = [
        "Yakshanba", // 0
        "Dushanba",  // 1
        "Seshanba",  // 2
        "Chorshanba",// 3
        "Payshanba", // 4
        "Juma",      // 5
        "Shanba"     // 6
    ];

    const now = new Date();
    let currentIndex = now.getDay(); // 0–6

    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Kun 14:00 da yangilanadi (har kuni)
    if (hours > 14 || (hours === 14 && minutes >= 0)) {
        currentIndex = currentIndex + 1;

        // Agar Shanbadan keyin bo'lsa → Dushanbaga o'tkazamiz
        if (currentIndex === 7) {
            currentIndex = 1; // 1 = Dushanba
        }
    }

    const todayName = uzbekDays[currentIndex];
    // --- YANGI QO‘SHILGAN QISM TUGADI ---


    if (!schedule) {
        return <h2 className="not-found">Bu qism tayyor emas...</h2>;
    }

    const LESSON_TIMES = [
        { start: "08:00", end: "08:45" },
        { start: "08:50", end: "09:35" },
        { start: "09:40", end: "10:25" },
        { start: "10:30", end: "11:20" },
        { start: "11:25", end: "12:10" },
        { start: "12:15", end: "13:00" }
    ];

    const getLessonTime = (index) => {
        const t = LESSON_TIMES[index];
        if (!t) return "";
        return `${t.start} - ${t.end}`;
    };

    const getTimeLeft = (startTime) => {
        const now = new Date();
        const [h, m] = startTime.split(":").map(Number);

        const lessonStart = new Date();
        lessonStart.setHours(h, m, 0, 0);

        const diff = lessonStart - now; // ms

        if (diff <= 0) return "Dars boshlangan";

        const minutes = Math.floor(diff / 60000);
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hrs > 0) {
            return `${hrs} soat ${mins} daqiqa qoldi`;
        } else {
            return `${mins} daqiqa qoldi`;
        }
    };


    return (
        <div className="class-page">
            <h1 className="title">{className.toUpperCase()} sinf jadvali</h1>

            <div className="schedule-container">
                {schedule.map((day, idx) => {

                    const isToday = day.day === todayName;

                    return (
                        <div className={`day-card ${isToday ? "today-highlight" : ""}`} key={idx}>
                            <h2 className="day-name">{day.day}</h2>

                            <ul className="lessons-list">
                                {day.subjects.map((lesson, i) => {
                                    const id = `${idx}-${i}`;
                                    const isOpen = selectedLessonIndex === id;
                                    return (
                                        <li
                                            key={i}
                                            className={`lesson-item ${isOpen ? "expanded" : ""}`}
                                            onClick={() => setSelectedLessonIndex(isOpen ? null : id)}
                                        >
                                            <div className="lesson-main">
                                                <span className="lesson-hour">{i + 1}.</span>
                                                <span className="lesson-name">{lesson.name}</span>
                                                <span className="lesson-room">( {lesson.room} )</span>
                                            </div>

                                            {isOpen && (
                                                <div className="lesson-details">
                                                    <p><b>Ustoz:</b> {lesson.teacher}</p>
                                                    <p><b>Dars vaqti:</b> {getLessonTime(i)}</p>
                                                    <p><b>Boshlanishiga:</b> {getTimeLeft(LESSON_TIMES[i].start)}</p>
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )
                })}
                <p className="beta"><span>Update: 2025.11.29 - 22:50</span></p>
            </div>
        </div>
    );
}
