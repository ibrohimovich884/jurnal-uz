import { LESSON_TIMES, formatLessonTime } from "../data/lessonTimes";

// Xona nomidan alohida xonalarni ajratib olish (masalan, "3/9 - 3/3" => ["3/9", "3/3"])
export function extractRooms(roomStr) {
  if (!roomStr || typeof roomStr !== "string") return [];
  const clean = roomStr.trim();
  if (
    clean.toLowerCase().includes("yo'q") ||
    clean.toLowerCase().includes("yoq") ||
    clean === "-" ||
    clean === ""
  ) {
    return [];
  }
  return clean
    .split(/\s*[-–—,]\s*/)
    .map((r) => r.trim())
    .filter((r) => r.length > 0 && !r.toLowerCase().includes("yo'q"));
}

// Ikki xona o'rtasida umumiy xona bor-yo'qligini tekshirish
export function roomsOverlap(roomA, roomB) {
  const listA = extractRooms(roomA);
  const listB = extractRooms(roomB);
  if (listA.length === 0 || listB.length === 0) {
    return { match: false, commonRooms: [] };
  }
  const common = listA.filter((rA) =>
    listB.some((rB) => rA.toLowerCase() === rB.toLowerCase())
  );
  return {
    match: common.length > 0,
    commonRooms: common,
  };
}

export const WEEK_DAYS = [
  "Dushanba",
  "Seshanba",
  "Chorshanba",
  "Payshanba",
  "Juma",
  "Shanba",
];

/**
 * Ikki sinf (class1 va class2) o'rtasidagi barcha uchrashuvlarni bitta umumiy
 * ro'yxatga birlashtiruvchi hisoblagich.
 * Chap tomon (class1) va O'ng tomon (class2) ma'lumotlari aniq ajratilgan.
 */
export function calculateMeetups(class1, class2, schedulesData) {
  if (!class1 || !class2 || class1 === class2 || !schedulesData) {
    return {
      allMeetups: [],
      totalCount: 0,
    };
  }

  const schedule1 = schedulesData[class1] || [];
  const schedule2 = schedulesData[class2] || [];

  const meetups = [];

  for (let dayIndex = 0; dayIndex < WEEK_DAYS.length; dayIndex++) {
    const day = WEEK_DAYS[dayIndex];
    const dayObj1 = schedule1.find((d) => d.day === day);
    const dayObj2 = schedule2.find((d) => d.day === day);

    const subs1 = dayObj1?.subjects || [];
    const subs2 = dayObj2?.subjects || [];

    // 1. class1 i-soatda chiqadi ➔ class2 (i+1)-soatda shu xonaga kiradi
    for (let i = 0; i < subs1.length; i++) {
      if (i + 1 < subs2.length) {
        const l1 = subs1[i];
        const l2 = subs2[i + 1];
        const { match, commonRooms } = roomsOverlap(l1.room, l2.room);

        if (match) {
          const t1 = LESSON_TIMES[i] || { start: "Noma'lum", end: "Noma'lum" };
          const t2 = LESSON_TIMES[i + 1] || { start: "Noma'lum", end: "Noma'lum" };
          const breakTime =
            t1.end !== "Noma'lum" && t2.start !== "Noma'lum"
              ? `${t1.end} — ${t2.start}`
              : "Tanaffus vaqti";

          meetups.push({
            id: `c1_out_${class1}_${class2}_${day}_${i}_${commonRooms.join("-")}`,
            day,
            dayIndex,
            sortPeriod: i,
            room: commonRooms.join(", "),
            breakTime,
            meetPeriodText: `${i + 1}-soatdan keyin`,
            meetTimeFormatted: `${i + 1}-soat tugaganda (${breakTime})`,
            whoLeavesFirst: class1,
            whoEntersNext: class2,
            type: "consecutive",
            // Chap tomon (class1)
            leftSide: {
              className: class1,
              period: i + 1,
              subject: l1.name,
              room: l1.room,
              teacher: l1.teacher,
              time: formatLessonTime(i),
              action: "out", // Xonadan chiqadi
              actionText: "Xonadan chiqadi ↗",
            },
            // O'ng tomon (class2)
            rightSide: {
              className: class2,
              period: i + 2,
              subject: l2.name,
              room: l2.room,
              teacher: l2.teacher,
              time: formatLessonTime(i + 1),
              action: "in", // Xonaga kiradi
              actionText: "Xonaga kiradi ↘",
            },
          });
        }
      }
    }

    // 2. class2 j-soatda chiqadi ➔ class1 (j+1)-soatda shu xonaga kiradi
    for (let j = 0; j < subs2.length; j++) {
      if (j + 1 < subs1.length) {
        const l2 = subs2[j];
        const l1 = subs1[j + 1];
        const { match, commonRooms } = roomsOverlap(l2.room, l1.room);

        if (match) {
          const t2 = LESSON_TIMES[j] || { start: "Noma'lum", end: "Noma'lum" };
          const t1 = LESSON_TIMES[j + 1] || { start: "Noma'lum", end: "Noma'lum" };
          const breakTime =
            t2.end !== "Noma'lum" && t1.start !== "Noma'lum"
              ? `${t2.end} — ${t1.start}`
              : "Tanaffus vaqti";

          meetups.push({
            id: `c2_out_${class2}_${class1}_${day}_${j}_${commonRooms.join("-")}`,
            day,
            dayIndex,
            sortPeriod: j,
            room: commonRooms.join(", "),
            breakTime,
            meetPeriodText: `${j + 1}-soatdan keyin`,
            meetTimeFormatted: `${j + 1}-soat tugaganda (${breakTime})`,
            whoLeavesFirst: class2,
            whoEntersNext: class1,
            type: "consecutive",
            // Chap tomon (class1) - kiradi
            leftSide: {
              className: class1,
              period: j + 2,
              subject: l1.name,
              room: l1.room,
              teacher: l1.teacher,
              time: formatLessonTime(j + 1),
              action: "in", // Xonaga kiradi
              actionText: "Xonaga kiradi ↘",
            },
            // O'ng tomon (class2) - chiqadi
            rightSide: {
              className: class2,
              period: j + 1,
              subject: l2.name,
              room: l2.room,
              teacher: l2.teacher,
              time: formatLessonTime(j),
              action: "out", // Xonadan chiqadi
              actionText: "Xonadan chiqadi ↗",
            },
          });
        }
      }
    }

    // 3. Bir vaqtda bir xonada (qo'shma dars k-soat)
    const maxShared = Math.min(subs1.length, subs2.length);
    for (let k = 0; k < maxShared; k++) {
      const l1 = subs1[k];
      const l2 = subs2[k];
      const { match, commonRooms } = roomsOverlap(l1.room, l2.room);

      if (match) {
        meetups.push({
          id: `shared_${class1}_${class2}_${day}_${k}_${commonRooms.join("-")}`,
          day,
          dayIndex,
          sortPeriod: k,
          room: commonRooms.join(", "),
          breakTime: formatLessonTime(k),
          meetPeriodText: `${k + 1}-soat davomida`,
          meetTimeFormatted: `${k + 1}-soatda (${formatLessonTime(k)})`,
          whoLeavesFirst: null,
          whoEntersNext: null,
          type: "shared",
          leftSide: {
            className: class1,
            period: k + 1,
            subject: l1.name,
            room: l1.room,
            teacher: l1.teacher,
            time: formatLessonTime(k),
            action: "shared",
            actionText: "Bir vaqtda xonada 🤝",
          },
          rightSide: {
            className: class2,
            period: k + 1,
            subject: l2.name,
            room: l2.room,
            teacher: l2.teacher,
            time: formatLessonTime(k),
            action: "shared",
            actionText: "Bir vaqtda xonada 🤝",
          },
        });
      }
    }
  }

  // Kun tartibi va soati bo'yicha ketma-ket saralash
  meetups.sort((a, b) => {
    if (a.dayIndex !== b.dayIndex) return a.dayIndex - b.dayIndex;
    return a.sortPeriod - b.sortPeriod;
  });

  return {
    allMeetups: meetups,
    totalCount: meetups.length,
  };
}
