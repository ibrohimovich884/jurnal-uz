import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { CLASSES } from "../data/classes";
import schedules from "../data/schedules";
import { calculateMeetups, WEEK_DAYS } from "../utils/meetupCalculator";
import { ArrowLeftRight, ChevronRight, X, RotateCcw, Clock, CheckCircle2, Home, Users } from "lucide-react";
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
    if (navigator.vibrate) navigator.vibrate(15);
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
    showToast("Barcha yopilgan uchrashuvlar qayta ko'rsatildi");
  };

  // Calculate meetups
  const { allMeetups } = useMemo(() => {
    return calculateMeetups(class1, class2, schedules);
  }, [class1, class2]);

  // Filtered by day and dismissed list
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
    <div className="ios-calc-page">
      {/* Toast */}
      {toast && (
        <div className="ios-calc-toast" role="status">
          <CheckCircle2 size={16} />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <header className="ios-calc-header">
        <div className="calc-eyebrow-row">
          <div className="calc-status-badge">
            <span className="status-dot"></span>
            <span>
              <b>{class1.toUpperCase()}</b> va <b>{class2.toUpperCase()}</b>
            </span>
          </div>
        </div>


        <h1 className="calc-main-title">
          Uchrashuvlar <span className="blue-gradient-text">Hisoblagichi</span>
        </h1>
        <p className="calc-subtitle">
          Bir xonada ketma-ket dars o'tib, tanaffusda ko'rishadigan vaqtlarni aniqlang.
        </p>
      </header>

      {/* Dual Glass Comparison Selector Bar */}
      <section className="ios-compare-box-grid">
        <div className="compare-glass-slot left">
          <span className="slot-label">1-Sinf (Chap)</span>
          <select
            value={class1}
            onChange={(e) => updateClasses(e.target.value, class2)}
            className="ios-native-select"
            aria-label="Birinchi sinf"
          >
            {CLASSES.map((c) => (
              <option key={c} value={c}>
                {c.toUpperCase()}-Sinf
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="ios-swap-button"
          onClick={handleSwap}
          title="Sinflar o'rnini almashtirish"
          aria-label="Almashtirish"
        >
          <ArrowLeftRight size={18} strokeWidth={2.5} />
        </button>

        <div className="compare-glass-slot right">
          <span className="slot-label">2-Sinf (O'ng)</span>
          <select
            value={class2}
            onChange={(e) => updateClasses(class1, e.target.value)}
            className="ios-native-select"
            aria-label="Ikkinchi sinf"
          >
            {CLASSES.map((c) => (
              <option key={c} value={c}>
                {c.toUpperCase()}-Sinf
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Quick preset pills */}
      <div className="ios-presets-strip">
        {PRESET_PAIRS.map((p) => {
          const isActive =
            (class1 === p.c1 && class2 === p.c2) ||
            (class1 === p.c2 && class2 === p.c1);
          return (
            <button
              key={p.label}
              type="button"
              className={`preset-pill ${isActive ? "active" : ""}`}
              onClick={() => updateClasses(p.c1, p.c2)}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {isSame ? (
        <div className="ios-same-class-card">
          <span className="warning-emoji">⚠️</span>
          <h3>Ikkita bir xil sinf tanlandi</h3>
          <p>Uchrashuvlarni solishtirish uchun ikkita turli sinfni tanlang.</p>
        </div>
      ) : (
        <>
          {/* Day Filters Strip */}
          <div className="ios-calc-filter-strip">
            <div className="calc-days-scroller">
              <button
                type="button"
                className={`filter-day-pill ${selectedDay === "all" ? "active" : ""}`}
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
                    className={`filter-day-pill ${selectedDay === d ? "active" : ""} ${count === 0 ? "empty" : ""}`}
                    onClick={() => setSelectedDay(d)}
                  >
                    {d} {count > 0 ? `(${count})` : ""}
                  </button>
                );
              })}
            </div>

            {dismissedCount > 0 && (
              <div className="restore-strip">
                <span>{dismissedCount} ta uchrashuv yopildi</span>
                <button
                  type="button"
                  className="restore-trigger-btn"
                  onClick={handleRestoreAll}
                >
                  <RotateCcw size={13} />
                  <span>Qayta ochish</span>
                </button>
              </div>
            )}
          </div>

          {/* Dual Column Meetups Feed */}
          <main className="ios-meetups-feed">
            {visibleMeetups.length === 0 ? (
              <div className="ios-empty-meetups-card">
                <Users size={40} className="empty-icon" />
                <h3>Uchrashuv topilmadi</h3>
                <p>
                  {selectedDay === "all"
                    ? `${class1.toUpperCase()} va ${class2.toUpperCase()} sinflarida ketma-ket bir xonada darslar mavjud emas.`
                    : `${selectedDay} kunida bu sinflar o'rtasida uchrashuv yo'q.`}
                </p>
                {dismissedCount > 0 && (
                  <button
                    type="button"
                    className="restore-all-primary-btn"
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

      {/* Footer Return Button */}
      <footer className="ios-calc-footer">
        <Link to="/" className="ios-back-home-pill">
          <Home size={15} />
          <span>Bosh sahifaga qaytish</span>
        </Link>
      </footer>
    </div>
  );
}

/**
 * 2 COLUMN SPLIT MEETUP CARD:
 * - 50% Left side: Class 1
 * - 50% Right side: Class 2
 * - Center separator
 * - Glowing green meeting status line
 */
function TwoColumnMeetupCard({ meetup, onDismiss }) {
  const { id, day, room, meetTimeFormatted, leftSide, rightSide } = meetup;

  return (
    <article className="ios-split-card" id={id}>
      {/* Specular shine */}
      <div className="card-top-shine"></div>

      {/* Top Bar: Day, Room, Dismiss button */}
      <div className="split-card-header">
        <div className="header-meta-group">
          <span className="card-day-name">{day}</span>
          <span className="card-room-badge">№{room} xona</span>
        </div>

        <button
          type="button"
          className="card-close-btn"
          onClick={() => onDismiss(id)}
          title="Ushbu uchrashuvni yopish"
          aria-label="Uchrashuvni yopish"
        >
          <span>Yopish</span>
          <X size={14} />
        </button>
      </div>

      {/* 50/50 Columns Body */}
      <div className="split-card-body">
        {/* Left Column (50%) */}
        <div className={`col-half left-col ${leftSide.action === "out" ? "leaving" : "entering"}`}>
          <div className="col-top-row">
            <span className="col-class-tag left">{leftSide.className.toUpperCase()}</span>
            <span className="col-hour-tag">{leftSide.period}-soat</span>
          </div>

          <div className="col-subject-name" title={leftSide.subject}>
            {leftSide.subject}
          </div>

          <div className="col-time-row">
            <Clock size={12} />
            <span className="tabular-nums">{leftSide.time}</span>
          </div>

          <span className={`col-status-pill ${leftSide.action === "out" ? "out" : "in"}`}>
            {leftSide.actionText}
          </span>
        </div>

        {/* Center Divider */}
        <div className="col-center-separator">
          <div className="separator-line"></div>
          <span className="separator-badge">🤝</span>
          <div className="separator-line"></div>
        </div>

        {/* Right Column (50%) */}
        <div className={`col-half right-col ${rightSide.action === "out" ? "leaving" : "entering"}`}>
          <div className="col-top-row">
            <span className="col-class-tag right">{rightSide.className.toUpperCase()}</span>
            <span className="col-hour-tag">{rightSide.period}-soat</span>
          </div>

          <div className="col-subject-name" title={rightSide.subject}>
            {rightSide.subject}
          </div>

          <div className="col-time-row">
            <Clock size={12} />
            <span className="tabular-nums">{rightSide.time}</span>
          </div>

          <span className={`col-status-pill ${rightSide.action === "out" ? "out" : "in"}`}>
            {rightSide.actionText}
          </span>
        </div>
      </div>

      {/* Glowing Green Meeting Line Bar */}
      <div className="ios-green-meeting-line">
        <div className="meeting-line-glow"></div>
        <div className="meeting-line-content">
          <span className="meeting-dot"></span>
          <span className="meeting-time-text">
            Uchrashuv vaqti: <b>{meetTimeFormatted}</b>
          </span>
          <span className="meeting-location-tag">№{room} oldida</span>
        </div>
      </div>
    </article>
  );
}
