import { useParams, useNavigate, Link } from "react-router";
import { useState, useEffect, useRef, useMemo } from "react";
import schedules from "../data/schedules";
import { CLASSES } from "../data/classes";
import { LESSON_TIMES } from "../data/lessonTimes";
import { secondsSinceMidnight, timeStrToSeconds, formatCountdown } from "../utils/time";
import { formatUpdatedAt } from "../utils/formatDate";
import UpdateModal from "../components/UpdateModal";
import LessonItem from "../components/LessonItem";
import { ChevronLeft, ChevronRight, Share2, Sparkles, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import "./ClassPage.css";

const SWIPE_THRESHOLD = 60;
const SWIPE_MAX_VERTICAL = 60;

export default function ClassPage() {
  const { className } = useParams();
  const navigate = useNavigate();
  const schedule = schedules[className];
  const [showUpdate, setShowUpdate] = useState(false);
  const [now, setNow] = useState(new Date());
  const [toastMessage, setToastMessage] = useState(null);

  const uzbekDays = ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];

  // Real-time second clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const realTodayName = uzbekDays[now.getDay()];

  // After 14:00, show tomorrow as default active day
  let targetIndex = now.getDay();
  if (now.getHours() >= 14) {
    targetIndex = targetIndex === 6 ? 1 : targetIndex + 1;
  }
  const activeDayName = uzbekDays[targetIndex];
  const beta = formatUpdatedAt(__SCHEDULE_UPDATED_AT__);

  /* ----------------- Class switcher (Swipe & Buttons) ----------------- */
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

    if (Math.abs(deltaY) > SWIPE_MAX_VERTICAL) return;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;

    if (deltaX < 0) {
      goToClass(nextClass);
    } else {
      goToClass(prevClass);
    }
  };

  /* ----------------- Auto-scroll & Day refs ----------------- */
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
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [schedule, activeDayName]);

  /* ----------------- Live Lesson State ----------------- */
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
        return {
          state: "lesson",
          index: i,
          remaining: endSec - nowSec,
          lesson: subjects[i],
          duration: endSec - startSec,
          elapsed: nowSec - startSec,
        };
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

  const isLessonPast = (dayName, lessonIndex) => {
    if (dayName !== realTodayName || !liveStatus) return false;
    if (liveStatus.state === "done") return true;
    if (liveStatus.state === "lesson" && lessonIndex < liveStatus.index) return true;
    if ((liveStatus.state === "break" || liveStatus.state === "before") && lessonIndex < liveStatus.index) return true;
    return false;
  };

  // Telegram / Clipboard share
  const handleShareDay = async (dayObj, e) => {
    e.stopPropagation();
    const classTitle = `${className.toUpperCase()}-sinf`;
    const header = `📅 ${classTitle} | ${dayObj.day} dars jadvali:\n\n`;
    const list = dayObj.subjects
      .map((s, idx) => `${idx + 1}. ${s.name} (№${s.room}${s.teacher ? ` — ${s.teacher}` : ""})`)
      .join("\n");
    const footer = `\n\n📌 Jurnal.uz orqali yuborildi`;
    const shareText = `${header}${list}${footer}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${classTitle} — ${dayObj.day} jadvali`,
          text: shareText,
        });
        return;
      } catch (err) {
        if (err.name === "AbortError") return;
      }
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = shareText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      if (navigator.vibrate) navigator.vibrate(15);
      setToastMessage("📋 Jadval nusxalandi! Telegramga yuborishingiz mumkin.");
      setTimeout(() => setToastMessage(null), 3000);
    } catch {
      setToastMessage("Nusxalab bo'lmadi");
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  if (!schedule) {
    return (
      <div className="ios-not-found">
        <div className="ios-not-found-card">
          <AlertCircle size={44} className="error-icon" />
          <h2>Ma'lumot topilmadi</h2>
          <p><b>{className.toUpperCase()}</b> sinf jadvali hali yuklanmagan.</p>
          <Link to="/" className="ios-return-btn">
            Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="ios-class-page"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Toast */}
      {toastMessage && (
        <div className="ios-share-toast" role="status">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <header className="ios-class-header">
        <div className="header-meta-row">
          <div className="header-live-tag">
            <span className="live-pulsar"></span>
            <span>Bugun: <b>{realTodayName}</b></span>
          </div>
        </div>

        <div className="header-title-row">
          <h1 className="class-main-title">
            <span className="title-bold">{className.toUpperCase()}</span> Sinf Jadvali
          </h1>
        </div>

        {/* Live Activity / Dynamic Island Bar */}
        {liveStatus && liveStatus.state !== "done" && (
          <div className={`ios-live-activity-bar activity-${liveStatus.state}`}>
            {liveStatus.state === "lesson" && (
              <>
                <div className="activity-icon-wrap green">
                  <span className="pulse-indicator"></span>
                </div>
                <div className="activity-content">
                  <span className="activity-label">Hozirgi dars</span>
                  <span className="activity-title">
                    <b>{liveStatus.lesson.name}</b> (№{liveStatus.lesson.room})
                  </span>
                </div>
                <div className="activity-timer">
                  <span className="timer-label">Tanaffusgacha</span>
                  <span className="timer-val tabular-nums">
                    {formatCountdown(liveStatus.remaining)}
                  </span>
                </div>
              </>
            )}

            {liveStatus.state === "break" && (
              <>
                <div className="activity-icon-wrap amber">
                  <Clock size={16} />
                </div>
                <div className="activity-content">
                  <span className="activity-label">Katta tanaffus</span>
                  <span className="activity-title">
                    Keyingi: <b>{liveStatus.lesson.name}</b>
                  </span>
                </div>
                <div className="activity-timer">
                  <span className="timer-label">Boshlanishiga</span>
                  <span className="timer-val tabular-nums">
                    {formatCountdown(liveStatus.remaining)}
                  </span>
                </div>
              </>
            )}

            {liveStatus.state === "before" && (
              <>
                <div className="activity-icon-wrap blue">
                  <Clock size={16} />
                </div>
                <div className="activity-content">
                  <span className="activity-label">Darslar boshlanishi</span>
                  <span className="activity-title">
                    1-dars: <b>{liveStatus.lesson.name}</b>
                  </span>
                </div>
                <div className="activity-timer">
                  <span className="timer-label">Qolgan vaqt</span>
                  <span className="timer-val tabular-nums">
                    {formatCountdown(liveStatus.remaining)}
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Class Switcher Segmented Control */}
        <div className="ios-class-switcher-bar">
          <button
            type="button"
            className="switcher-nav-btn"
            onClick={() => goToClass(prevClass)}
            aria-label="Oldingi sinf"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="switcher-pills-row">
            {CLASSES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => goToClass(c)}
                className={`switcher-pill ${c === className ? "active" : ""}`}
              >
                {c.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="switcher-nav-btn"
            onClick={() => goToClass(nextClass)}
            aria-label="Keyingi sinf"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </header>


      {/* Days Schedule List */}
      <main className="ios-schedule-feed">
        {schedule.map((day, idx) => {
          const isToday = day.day === realTodayName;
          const isActiveFocus = day.day === activeDayName;

          return (
            <section
              key={idx}
              ref={(el) => (dayRefs.current[day.day] = el)}
              className={`ios-day-card ${isActiveFocus ? "is-focused" : ""}`}
            >
              {/* Card specular shine */}
              <div className="card-top-shine"></div>

              <div className="day-card-header">
                <div className="day-heading-group">
                  <h2 className="day-name">{day.day}</h2>
                  <span className="day-lesson-count">{day.subjects.length} ta dars</span>
                </div>

                <div className="day-actions-group">
                  {isToday && (
                    <div className="day-live-tag">
                      <span className="live-dot"></span>
                      <span>Hozir</span>
                    </div>
                  )}

                  <button
                    type="button"
                    className="day-share-button"
                    onClick={(e) => handleShareDay(day, e)}
                    title={`${day.day} jadvalini ulashish`}
                  >
                    <Share2 size={13} />
                    <span>Ulashish</span>
                  </button>
                </div>
              </div>

              {/* List of lessons */}
              <div className="day-lessons-list">
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
                    isPast={isLessonPast(day.day, i)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* Footer Update info trigger */}
      <footer className="ios-class-footer">
        <button
          type="button"
          className="ios-version-pill"
          onClick={() => setShowUpdate(true)}
        >
          <Sparkles size={13} />
          <span>Yangilanish: v{beta.split(" — ")[0]}</span>
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