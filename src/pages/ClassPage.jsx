import { useParams } from "react-router";
import schedules from "../data/schedules";
import { useState } from "react";
import "./ClassPage.css";

export default function ClassPage() {
    const { className } = useParams();
    const schedule = schedules[className];
    const [selectedLessonIndex, setSelectedLessonIndex] = useState(null);

    // --- YANGI QO'SHILGAN QISM BOSHLANDI ---
    // 1. Bugungi kunni aniqlash uchun massiv (JS da Yakshanba = 0, Shanba = 6)
    const uzbekDays = [
        "Yakshanba", // 0
        "Dushanba",  // 1
        "Seshanba",  // 2
        "Chorshanba",// 3
        "Payshanba", // 4
        "Juma",      // 5
        "Shanba"     // 6
    ];
    // Hozirgi vaqtni olamiz va kun indeksini topamiz
    const currentDayIndex = new Date().getDay();
    // Bugungi kun nomini olamiz (masalan: "Shanba")
    const todayName = uzbekDays[currentDayIndex];
    // --- YANGI QO'SHILGAN QISM TUGADI ---


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

    return (
        <div className="class-page">
            <h1 className="title">{className.toUpperCase()} sinf jadvali</h1>

            <div className="schedule-container">
                {schedule.map((day, idx) => {
                    // --- YANGI QO'SHILGAN TEKSHIRUV ---
                    // Jadvaldagi kun nomi bugungi kunga tengmi?
                    // Eslatma: data/schedules faylida kun nomlari (Dushanba, Shanba...)
                    // yuqoridagi 'uzbekDays' massividagi kabi yozilgan bo'lishi shart.
                    const isToday = day.day === todayName;

                    return (
                        // Agar bugun bo'lsa, 'today-highlight' klassini qo'shamiz
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
                                           {/* ... (dars itemlari ichki qismi o'zgarishsiz qoladi) ... */}
                                            <div className="lesson-main">
                                                <span className="lesson-hour">{i + 1}.</span>
                                                <span className="lesson-name">{lesson.name}</span>
                                                <span className="lesson-room">( {lesson.room} )</span>
                                            </div>

                                            {isOpen && (
                                                <div className="lesson-details">
                                                    <p><b>Ustoz:</b> {lesson.teacher}</p>
                                                    <p><b>Dars vaqti:</b> {getLessonTime(i)}</p>
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )
                })}
                <p className="beta"><span>Update: 2025.11.18 - 20:28</span></p>
            </div>
        </div>
    );
}