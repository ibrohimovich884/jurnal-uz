// Kun boshlanishidan (00:00) beri o'tgan soniyalarni hisoblaydi
export function secondsSinceMidnight(date = new Date()) {
  return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
}

// "08:00" -> 28800 (soniyalarda)
export function timeStrToSeconds(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 3600 + m * 60;
}

// 754 -> "12:34", 65 -> "01:05", 4000 -> "1:06:40"
export function formatCountdown(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}
