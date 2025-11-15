import { useParams } from "react-router";
import schedules from "../data/schedules";
import { useState } from "react";
import "./ClassPage.css";

export default function ClassPage() {
	const { className } = useParams();
	const schedule = schedules[className];
	const [selectedLessonIndex, setSelectedLessonIndex] = useState(null); // faqat bitta ochiladi

	if (!schedule) {
		return <h2 className="not-found">Bu qism tayyor emas...</h2>;
	}

	// Aniq soatlarni saqlaymiz (foydalanuvchi bergan jadvalga mos)
	const LESSON_TIMES = [
		{ start: "08:00", end: "08:45" }, // 1-soat
		{ start: "08:50", end: "09:35" }, // 2-soat
		{ start: "09:40", end: "10:25" }, // 3-soat
		{ start: "10:30", end: "11:20" }, // 4-soat
		{ start: "11:25", end: "12:10" }, // 5-soat
		{ start: "12:15", end: "13:00" }  // 6-soat
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
											</div>
										)}
									</li>
								);
							})}
						</ul>
					</div>
				))}
				<p className="beta"><span>Update: 2025.11.15 - 10:08</span></p>
			</div>
		</div>
	);
}
