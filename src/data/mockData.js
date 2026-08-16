// Mock data for the Quran Khatm frontend prototype (Phase 1 — no backend yet)

export const currentUser = {
  id: "u1",
  name: "Mohammed Rahman",
  email: "mohammed@example.com",
  avatar: "MR",
};

const names = [
  "Mohammed", "Ali", "Fatima", "Ahmed", "Yusuf", "Aisha", "Bilal", "Zainab",
  "Omar", "Layla", "Hamza", "Maryam", "Imran", "Sara", "Khalid",
];

function makeParas(seedStatuses) {
  return Array.from({ length: 30 }, (_, i) => {
    const num = i + 1;
    const preset = seedStatuses[num];
    if (preset === "completed") {
      return {
        number: num,
        status: "completed",
        assignedTo: names[num % names.length],
        assignedToId: preset === "completed" && num === 17 ? "u1" : `m${num}`,
        completedAt: "2026-08-10T21:45:00Z",
      };
    }
    if (preset === "claimed") {
      return {
        number: num,
        status: "claimed",
        assignedTo: num === 17 ? "You" : names[num % names.length],
        assignedToId: num === 17 ? "u1" : `m${num}`,
        claimedAt: "2026-08-11T10:00:00Z",
      };
    }
    return { number: num, status: "available", assignedTo: null, assignedToId: null };
  });
}

// Build a deterministic status map: paras 1-16 completed, 17 claimed by current user, 18 claimed, rest available
const statusMap = {};
for (let i = 1; i <= 16; i++) statusMap[i] = "completed";
statusMap[17] = "claimed";
statusMap[18] = "claimed";
statusMap[19] = "claimed";

export const khatms = [
  {
    id: "k1",
    title: "Quran Khatm for Ahmed Khan",
    dedicatedTo: "Ahmed Khan",
    intentionType: "In memory of",
    message: "May Allah grant him mercy and peace.",
    memberCount: 12,
    status: "active",
    createdBy: "u1",
    inviteCode: "AHMEDKHAN17",
    createdAt: "2026-07-20T08:00:00Z",
    paras: makeParas(statusMap),
  },
  {
    id: "k2",
    title: "Family Quran Khatm",
    dedicatedTo: "Our family's collective intention",
    intentionType: "For",
    message: "May Allah accept this effort from all of us.",
    memberCount: 15,
    status: "completed",
    createdBy: "u2",
    inviteCode: "FAMILYQ30",
    createdAt: "2026-05-01T08:00:00Z",
    completedAt: "2026-06-15T18:20:00Z",
    paras: makeParas(
      Object.fromEntries(Array.from({ length: 30 }, (_, i) => [i + 1, "completed"]))
    ),
  },
  {
    id: "k3",
    title: "Khatm for Grandmother Amina",
    dedicatedTo: "Amina Begum",
    intentionType: "In memory of",
    message: "For the raising of her status in Jannah.",
    memberCount: 6,
    status: "active",
    createdBy: "u1",
    inviteCode: "AMINABEGUM",
    createdAt: "2026-08-01T08:00:00Z",
    paras: makeParas({ 1: "completed", 2: "completed", 3: "claimed" }),
  },
];

export function paraProgress(khatm) {
  const completed = khatm.paras.filter((p) => p.status === "completed").length;
  const claimed = khatm.paras.filter((p) => p.status === "claimed").length;
  const available = 30 - completed - claimed;
  return { completed, claimed, available, percent: Math.round((completed / 30) * 100) };
}

export const members = [
  { id: "u1", name: "Mohammed Rahman", avatar: "MR", para: 17, status: "claimed" },
  { id: "m2", name: "Ali Hassan", avatar: "AH", para: 4, status: "claimed" },
  { id: "m3", name: "Fatima Noor", avatar: "FN", para: 8, status: "completed" },
  { id: "m4", name: "Ahmed Siddiqui", avatar: "AS", para: null, status: "none" },
  { id: "m5", name: "Yusuf Karim", avatar: "YK", para: 2, status: "completed" },
  { id: "m6", name: "Aisha Malik", avatar: "AM", para: 5, status: "completed" },
  { id: "m7", name: "Bilal Farooq", avatar: "BF", para: 11, status: "completed" },
  { id: "m8", name: "Zainab Iqbal", avatar: "ZI", para: 14, status: "completed" },
  { id: "m9", name: "Omar Sheikh", avatar: "OS", para: 3, status: "completed" },
  { id: "m10", name: "Layla Ahmad", avatar: "LA", para: 9, status: "completed" },
  { id: "m11", name: "Hamza Yousaf", avatar: "HY", para: null, status: "none" },
  { id: "m12", name: "Maryam Sultan", avatar: "MS", para: 18, status: "claimed" },
];

export const activity = [
  { id: "a1", user: "Mohammed Rahman", action: "claimed", para: 17, time: "Today, 9:45 PM" },
  { id: "a2", user: "Ali Hassan", action: "claimed", para: 4, time: "Today, 7:30 PM" },
  { id: "a3", user: "Fatima Noor", action: "completed", para: 8, time: "Yesterday" },
  { id: "a4", user: "Yusuf Karim", action: "completed", para: 2, time: "Yesterday" },
  { id: "a5", user: "Maryam Sultan", action: "claimed", para: 18, time: "2 days ago" },
  { id: "a6", user: "Bilal Farooq", action: "completed", para: 11, time: "3 days ago" },
  { id: "a7", user: "Omar Sheikh", action: "joined the Khatm", para: null, time: "5 days ago" },
];

// Note: Surah list, Surah text, and Juz/Para text are now fetched live from the
// AlQuran Cloud API (see src/services/quranApi.js). The mock arrays that used to
// live here (surahs, sampleAyahs) have been removed — Khatm data below stays mocked
// until the backend (Phase 2/3) is built.

export const duaForKhatm = {
  arabic: "اللَّهُمَّ ارْحَمْهُ وَاغْفِرْ لَهُ وَأَدْخِلْهُ الْجَنَّةَ",
  transliteration: "Allahummar-hamhu waghfir lahu wa adkhilhul-jannah",
  meaning: "O Allah, have mercy on him, forgive him, and admit him into Paradise.",
};
