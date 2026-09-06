// Vite build vaqtida __SCHEDULE_UPDATED_AT__ orqali "quyilgan" ISO sanani
// ilova ko'rsatib kelgan "YYYY.MM.DD — HH:MM" formatiga o'giradi.
export function formatUpdatedAt(isoString) {
  const date = new Date(isoString);

  const parts = new Intl.DateTimeFormat("uz-UZ", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const map = {};
  parts.forEach((p) => (map[p.type] = p.value));

  return `${map.year}.${map.month}.${map.day} — ${map.hour}:${map.minute}`;
}
