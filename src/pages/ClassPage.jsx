import { useParams, useNavigate, Link } from "react-router";
import { useState, useEffect, useRef, useMemo } from "react";
import schedules from "../data/schedules";
import { CLASSES } from "../data/classes";
import { LESSON_TIMES } from "../data/lessonTimes";
import { secondsSinceMidnight, timeStrToSeconds, formatCountdown } from "../utils/time";
import { formatUpdatedAt } from "../utils/formatDate";
import UpdateModal from "../components/UpdateModal";
import LessonItem from "../components/LessonItem";
import "./ClassPage.css";

const SWIPE_THRESHOLD = 60; // shu masofadan (px) ko'p surilsa - sinf almashadi
const SWIPE_MAX_VERTICAL = 60; // vertikal scrollga xalaqit bermaslik uchun

export default function ClassPage() {
  const { className } = useParams();
  const navigate = useNavigate();
  const schedule = schedules[className];
  const [showUpdate, setShowUpdate] = useState(false);
  const [now, setNow] = useState(new Date());

  const uzbekDays = ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];

  // Har soniyada vaqtni yangilab turamiz — jonli hisoblagich shu asosda ishlaydi
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const realTodayName = uzbekDays[now.getDay()];

  // 14:00 dan keyin ertangi kunni "Hozir" deb ko'rsatish mantiqi
  // (bu — rejalashtirish uchun, jonli dars hisoblagichi esa haqiqiy bugungi kunga qarab ishlaydi)
  let targetIndex = now.getDay();
  if (now.getHours() >= 14) {
    targetIndex = targetIndex === 6 ? 1 : targetIndex + 1;
  }
  const activeDayName = uzbekDays[targetIndex];
  // Bu sana endi qo'lda yozilmaydi — vite.config.js build paytida schedules.jsx
  // faylining oxirgi git commit sanasini (yoki topilmasa build vaqtini) avtomatik yozadi.
  const beta = formatUpdatedAt(__SCHEDULE_UPDATED_AT__);

  /* ----------------- SINFLAR ARO SWIPE / TUGMA BILAN O'TISH ----------------- */
  const classIndex = CLASSES.indexOf(className);
  const prevClass = classIndex > -1 ? CLASSES[(classIndex - 1 + CLASSES.length) % CLASSES.length] : null;
  const nextClass = classIndex > -1 ? CLASSES[(classIndex + 1) % CLASSES.length] : null;

  const goToClass = (targetClassName) => {
    if (!targetClassName || targetClassName === className) return;
    if (navigator.vibrate) navigator.vibrate(15);
    navigate(`/class/${targetClassName}`);
  };

  const touchStartRef = useRef(null);

  const handleTouchStart = (e) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e) => {
    if (!touchStartRef.current) return;
    const t = e.changedTouches[0];
    const deltaX = t.clientX - touchStartRef.current.x;
    const deltaY = t.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(deltaY) > SWIPE_MAX_VERTICAL) return; // vertikal scroll bo'lsa e'tibor bermaymiz
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;

    if (deltaX < 0) {
      goToClass(nextClass); // chapga surish -> keyingi sinf
    } else {
      goToClass(prevClass); // o'ngga surish -> oldingi sinf
    }
  };

  /* ----------------- BUGUNGI KUNGA AVTOMATIK SCROLL ----------------- */
  const dayRefs = useRef({});
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    hasScrolledRef.current = false;
  }, [className]);

  useEffect(() => {
    if (hasScrolledRef.current) return;
    const el = dayRefs.current[activeDayName];
    if (el) {
      hasScrolledRef.current = true;
      const timer = setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [schedule, activeDayName]);

  /* ----------------- "HOZIRGI DARS" JONLI HOLATI ----------------- */
  const liveStatus = useMemo(() => {
    if (!schedule) return null;
    const todaySchedule = schedule.find((d) => d.day === realTodayName);
    if (!todaySchedule) return null;

    const nowSec = secondsSinceMidnight(now);
    const subjects = todaySchedule.subjects;

    for (let i = 0; i < subjects.length; i++) {
      const t = LESSON_TIMES[i];
      if (!t) continue;
      const startSec = timeStrToSeconds(t.start);
      const endSec = timeStrToSeconds(t.end);

      if (nowSec >= startSec && nowSec < endSec) {
        return { state: "lesson", index: i, remaining: endSec - nowSec, lesson: subjects[i] };
      }
      if (nowSec < startSec) {
        return {
          state: i === 0 ? "before" : "break",
          index: i,
          remaining: startSec - nowSec,
          lesson: subjects[i],
        };
      }
    }
    return { state: "done" };
  }, [schedule, realTodayName, now]);

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
    <div
      className="class-page-wrapper"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <header className="premium-header">
        <div className="header-content">
          <h1 className="main-title">Dars Jadvali</h1>
          <div className="live-status">
            <div className="pulse-dot"></div>
            <span>Bugun: <b>{realTodayName}</b></span>
          </div>
        </div>
      </header>

      {liveStatus && liveStatus.state !== "done" && (
        <div className={`live-lesson-bar live-${liveStatus.state}`}>
          {liveStatus.state === "lesson" && (
            <>
              <span className="live-bar-dot"></span>
              <span className="live-bar-text">
                Hozir: <b>{liveStatus.lesson.name}</b> — tanaffusgacha{" "}
                <b>{formatCountdown(liveStatus.remaining)}</b> qoldi
              </span>
            </>
          )}
          {liveStatus.state === "break" && (
            <span className="live-bar-text">
              ☕ Tanaffus — <b>{liveStatus.lesson.name}</b> darsi{" "}
              <b>{formatCountdown(liveStatus.remaining)}</b> dan keyin boshlanadi
            </span>
          )}
          {liveStatus.state === "before" && (
            <span className="live-bar-text">
              ⏳ Darslar boshlanishiga <b>{formatCountdown(liveStatus.remaining)}</b> qoldi
            </span>
          )}
        </div>
      )}

      {classIndex > -1 && (
        <nav className="class-switcher" aria-label="Sinflar orasida almashish">
          <button className="switcher-arrow" onClick={() => goToClass(prevClass)} aria-label="Oldingi sinf">
            <span>‹</span>
          </button>
          <div className="switcher-current">
            <span className="switcher-current-label">{className.toUpperCase()}</span>
            <div className="switcher-dots">
              {CLASSES.map((c) => (
                <Link
                  key={c}
                  to={`/class/${c}`}
                  className={`switcher-dot ${c === className ? "active" : ""}`}
                  aria-label={`${c.toUpperCase()} sinfga o'tish`}
                />
              ))}
            </div>
          </div>
          <button className="switcher-arrow" onClick={() => goToClass(nextClass)} aria-label="Keyingi sinf">
            <span>›</span>
          </button>
        </nav>
      )}

      <main className="schedule-container">
        <div className="bento-grid">
          {schedule.map((day, idx) => (
            <section
              key={idx}
              ref={(el) => (dayRefs.current[day.day] = el)}
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
                  <LessonItem
                    key={i}
                    lesson={lesson}
                    index={i}
                    isCurrent={
                      liveStatus?.state === "lesson" &&
                      day.day === realTodayName &&
                      i === liveStatus.index
                    }
                  />
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