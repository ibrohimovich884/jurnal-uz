import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { CLASSES } from "../data/classes";
import schedules from "../data/schedules";
import { calculateMeetups, WEEK_DAYS } from "../utils/meetupCalculator";
import "./CalculatorPage.css";

const STORAGE_DISMISSED_KEY = "dars_jadval_dismissed_meetups";

const PRESET_PAIRS = [
  { c1: "10b", c2: "9a", label: "10B & 9A" },
  { c1: "10a", c2: "10b", label: "10A & 10B" },
  { c1: "9a", c2: "9b", label: "9A & 9B" },
  { c1: "7a", c2: "7b", label: "7A & 7B" },
  { c1: "8a", c2: "8b", label: "8A & 8B" },
  { c1: "11a", c2: "11b", label: "11A & 11B" },
];

export default function CalculatorPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialC1 = searchParams.get("c1") || "10b";
  const initialC2 = searchParams.get("c2") || "9a";

  const [class1, setClass1] = useState(
    CLASSES.includes(initialC1) ? initialC1 : "10b"
  );
  const [class2, setClass2] = useState(
    CLASSES.includes(initialC2) && initialC2 !== initialC1 ? initialC2 : "9a"
  );

  const [selectedDay, setSelectedDay] = useState("all");

  const [dismissedIds, setDismissedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DISMISSED_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toast, setToast] = useState(null);

  const updateClasses = (newC1, newC2) => {
    setClass1(newC1);
    setClass2(newC2);
    setSearchParams({ c1: newC1, c2: newC2 });
  };

  const handleSwap = () => {
    updateClasses(class2, class1);
    showToast(`${class2.toUpperCase()} ⇄ ${class1.toUpperCase()} o'rni almashtirildi`);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleDismiss = (id) => {
    const updated = [...dismissedIds, id];
    setDismissedIds(updated);
    try {
      localStorage.setItem(STORAGE_DISMISSED_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    showToast("Uchrashuv yopildi");
    if (navigator.vibrate) navigator.vibrate(15);
  };

  const handleRestoreAll = () => {
    setDismissedIds([]);
    try {
      localStorage.removeItem(STORAGE_DISMISSED_KEY);
    } catch {
      // ignore
    }
    showToast("Barcha yopilgan uchrashuvlar ochildi");
  };

  // Hisoblash: barcha uchrashuvlar bitta ro'yxatda
  const { allMeetups } = useMemo(() => {
    return calculateMeetups(class1, class2, schedules);
  }, [class1, class2]);

  // Filtrlash (kun va yopilganlik bo'yicha)
  const visibleMeetups = useMemo(() => {
    return allMeetups.filter((m) => {
      if (dismissedIds.includes(m.id)) return false;
      if (selectedDay !== "all" && m.day !== selectedDay) return false;
      return true;
    });
  }, [allMeetups, dismissedIds, selectedDay]);

  const dismissedCount = allMeetups.filter((m) =>
    dismissedIds.includes(m.id)
  ).length;

  const isSame = class1 === class2;

  return (
    <div className="calc-page-wrapper">
      {/* Dynamic Background Blur Blobs (Avvalgi sahifadagi uslub) */}
      <div className="calc-blob-blur blob-left"></div>
      <div className="calc-blob-blur blob-right"></div>

      {/* Toast */}
      {toast && (
        <div className="calc-toast" role="status" aria-live="polite">
          <span>{toast}</span>
        </div>
      )}

      {/* Sarlavha (Klassik Horizon UI uslubida) */}
      <header className="calc-header">
        <div className="header-badge">2025-2026 O'quv yili</div>
        <h1 className="main-title">
          Uchrashuvlar <span className="text-gradient">Hisoblagichi</span>
        </h1>
        <div className="live-status-tag">
          <div className="pulse-dot"></div>
          <span>
            <b>{class1.toUpperCase()}</b> va <b>{class2.toUpperCase()}</b> sinflari
          </span>
        </div>
      </header>

      {/* Sinf tanlash paneli (Avvalgi sahifaga o'xshash, ko'k blur elementlar bilan) */}
      <section className="class-compare-bar">
        <div className="compare-class-box left-box">
          <span className="box-role-tag">Chap tomon</span>
          <select
            value={class1}
            onChange={(e) => updateClasses(e.target.value, class2)}
            className="class-native-select"
            aria-label="Birinchi sinf"
          >
            {CLASSES.map((c) => (
              <option key={c} value={c}>
                {c.toUpperCase()}-sinf
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="compare-swap-btn"
          onClick={handleSwap}
          title="Sinflar o'rnini almashtirish"
          aria-label="Almashtirish"
        >
          ⇄
        </button>

        <div className="compare-class-box right-box">
          <span className="box-role-tag">O'ng tomon</span>
          <select
            value={class2}
            onChange={(e) => updateClasses(class1, e.target.value)}
            className="class-native-select"
            aria-label="Ikkinchi sinf"
          >
            {CLASSES.map((c) => (
              <option key={c} value={c}>
                {c.toUpperCase()}-sinf
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Tezkor sinf juftliklari */}
      <div className="quick-presets-row">
        {PRESET_PAIRS.map((p) => {
          const isActive =
            (class1 === p.c1 && class2 === p.c2) ||
            (class1 === p.c2 && class2 === p.c1);
          return (
            <button
              key={p.label}
              type="button"
              className={`preset-btn ${isActive ? "active" : ""}`}
              onClick={() => updateClasses(p.c1, p.c2)}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {isSame ? (
        <div className="empty-warning-card">
          <span className="warning-icon">⚠️</span>
          <h3>Ikkita bir xil sinf tanlandi</h3>
          <p>Uchrashuvlarni solishtirish uchun ikkita turli sinfni tanlang.</p>
        </div>
      ) : (
        <>
          {/* Kunlar filtri va Statistika */}
          <div className="filters-strip">
            <div className="day-chips-scroll">
              <button
                type="button"
                className={`day-chip ${selectedDay === "all" ? "active" : ""}`}
                onClick={() => setSelectedDay("all")}
              >
                Barchasi ({visibleMeetups.length})
              </button>
              {WEEK_DAYS.map((d) => {
                const count = allMeetups.filter(
                  (m) => m.day === d && !dismissedIds.includes(m.id)
                ).length;
                return (
                  <button
                    key={d}
                    type="button"
                    className={`day-chip ${selectedDay === d ? "active" : ""} ${count === 0 ? "is-empty" : ""}`}
                    onClick={() => setSelectedDay(d)}
                  >
                    {d} {count > 0 ? `(${count})` : ""}
                  </button>
                );
              })}
            </div>

            {dismissedCount > 0 && (
              <div className="restore-bar">
                <span>{dismissedCount} ta uchrashuv yopildi</span>
                <button
                  type="button"
                  className="restore-btn"
                  onClick={handleRestoreAll}
                >
                  ↺ Qayta ko'rsatish
                </button>
              </div>
            )}
          </div>

          {/* ASOSIY BITTA RO'YXAT (50% Chapda 10b, 50% O'ngda 9a, Yashil chiziq) */}
          <main className="meetups-feed">
            {visibleMeetups.length === 0 ? (
              <div className="empty-feed-card">
                <span className="empty-icon">🗓️</span>
                <h3>Uchrashuv topilmadi</h3>
                <p>
                  {selectedDay === "all"
                    ? `${class1.toUpperCase()} va ${class2.toUpperCase()} sinflarida ketma-ket bir xonada darslar mavjud emas.`
                    : `${selectedDay} kunida bu sinflar o'rtasida uchrashuv yo'q.`}
                </p>
                {dismissedCount > 0 && (
                  <button
                    type="button"
                    className="action-btn"
                    onClick={handleRestoreAll}
                  >
                    Yopilgan {dismissedCount} ta uchrashuvni ochish
                  </button>
                )}
              </div>
            ) : (
              visibleMeetups.map((meetup) => (
                <TwoColumnMeetupCard
                  key={meetup.id}
                  meetup={meetup}
                  onDismiss={handleDismiss}
                />
              ))
            )}
          </main>
        </>
      )}

      {/* Sahifa pasti */}
      <footer className="calc-footer">
        <Link to="/" className="home-back-btn">
          <span>🏠</span> Bosh sahifaga qaytish
        </Link>
      </footer>
    </div>
  );
}

/**
 * 2 USTUNLI UCHRASHUV KARTASI:
 * - Chap yarmi (50%): 1-sinf (masalan 10B)
 * - O'ng yarmi (50%): 2-sinf (masalan 9A)
 * - Yashil chiziq (Green Line): Uchrashuv vaqti va holati
 */
function TwoColumnMeetupCard({ meetup, onDismiss }) {
  const { id, day, room, meetTimeFormatted, leftSide, rightSide } =
    meetup;

  return (
    <article className="split-meetup-card" id={id}>
      {/* Karta tepasi: Kuni, Xonasi va Yopish tugmasi */}
      <div className="card-top-bar">
        <div className="top-meta-left">
          <span className="meta-day">{day}</span>
          <span className="meta-room-badge">№{room} xona</span>
        </div>

        <button
          type="button"
          className="card-dismiss-btn"
          onClick={() => onDismiss(id)}
          title="Ushbu uchrashuvni yopish"
          aria-label="Uchrashuvni yopish"
        >
          <span>Yopish</span>
          <span className="close-x">✕</span>
        </button>
      </div>

      {/* Ikki ustunli kontent (Ekranning 50% chapda, 50% o'ngda) */}
      <div className="split-columns-body">
        {/* CHAP TOMON: 1-sinf (masalan 10B) */}
        <div
          className={`split-col col-left ${
            leftSide.action === "out" ? "is-leaving" : "is-entering"
          }`}
        >
          <div className="col-header-line">
            <span className="class-tag-pill left-tag">
              {leftSide.className.toUpperCase()}
            </span>
            <span className="hour-badge">{leftSide.period}-soat</span>
          </div>

          <div className="col-subject" title={leftSide.subject}>
            {leftSide.subject}
          </div>

          <div className="col-time-info">
            <span className="time-clock">🕒</span>
            <span>{leftSide.time}</span>
          </div>

          <div
            className={`col-action-pill ${
              leftSide.action === "out" ? "action-out" : "action-in"
            }`}
          >
            {leftSide.actionText}
          </div>
        </div>

        {/* O'rta ajratgich ustun */}
        <div className="split-center-divider">
          <div className="divider-line"></div>
          <span className="center-icon">🤝</span>
          <div className="divider-line"></div>
        </div>

        {/* O'NG TOMON: 2-sinf (masalan 9A) */}
        <div
          className={`split-col col-right ${
            rightSide.action === "out" ? "is-leaving" : "is-entering"
          }`}
        >
          <div className="col-header-line">
            <span className="class-tag-pill right-tag">
              {rightSide.className.toUpperCase()}
            </span>
            <span className="hour-badge">{rightSide.period}-soat</span>
          </div>

          <div className="col-subject" title={rightSide.subject}>
            {rightSide.subject}
          </div>

          <div className="col-time-info">
            <span className="time-clock">🕒</span>
            <span>{rightSide.time}</span>
          </div>

          <div
            className={`col-action-pill ${
              rightSide.action === "out" ? "action-out" : "action-in"
            }`}
          >
            {rightSide.actionText}
          </div>
        </div>
      </div>

      {/* YASHIL LINE (Green line uchrashadigan vaqt bilan) */}
      <div className="green-meeting-line-bar">
        <div className="green-line-glow"></div>
        <div className="green-line-content">
          <span className="green-dot"></span>
          <span className="green-time-text">
            Uchrashuv vaqti: <b>{meetTimeFormatted}</b>
          </span>
          <span className="green-room-pill">№{room} oldida</span>
        </div>
      </div>
    </article>
  );
}
