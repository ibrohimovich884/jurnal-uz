// Har bir dars soatining boshlanish/tugash vaqti.
// Index tartibi kundagi darslar tartibiga mos keladi (0 - birinchi dars, ...).
export const LESSON_TIMES = [
  { start: "08:00", end: "08:45" },
  { start: "08:50", end: "09:35" },
  { start: "09:40", end: "10:25" },
  { start: "10:30", end: "11:15" },
  { start: "11:20", end: "12:05" },
  { start: "12:10", end: "12:55" },
];

export function formatLessonTime(index) {
  const t = LESSON_TIMES[index];
  return t ? `${t.start} - ${t.end}` : "Noma'lum";
}
