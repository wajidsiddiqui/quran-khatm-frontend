// Thin client for the AlQuran Cloud API (https://alquran.cloud/api) — free, no API key.
// Keeps Quran data fully separate from the Khatm mock-data layer, per the app's architecture.

const BASE_URL = "https://api.alquran.cloud/v1";
const ARABIC_EDITION = "quran-uthmani";
const TRANSLATION_EDITION = "en.sahih";

// Simple in-memory cache so navigating back and forth doesn't re-fetch.
const cache = new Map();

async function getJSON(path) {
  if (cache.has(path)) return cache.get(path);
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`Quran API error (${res.status})`);
  const json = await res.json();
  if (json.code !== 200) throw new Error(json.data || "Quran API error");
  cache.set(path, json.data);
  return json.data;
}

// GET all 114 Surahs — number, names, ayah count, revelation type.
export async function fetchSurahList() {
  const data = await getJSON("/surah");
  return data.map((s) => ({
    number: s.number,
    name: s.englishName,
    translation: s.englishNameTranslation,
    arabic: s.name,
    verses: s.numberOfAyahs,
    revelationType: s.revelationType,
  }));
}

// GET one Surah with Arabic text + English translation combined.
export async function fetchSurah(surahNumber) {
  const data = await getJSON(`/surah/${surahNumber}/editions/${ARABIC_EDITION},${TRANSLATION_EDITION}`);
  const [arabicEdition, translationEdition] = data;
  const ayahs = arabicEdition.ayahs.map((a, i) => ({
    number: a.numberInSurah,
    // Global ayah number (1-6236) — additive field, used only for the optional
    // per-ayah audio player. Existing consumers of `number` are unaffected.
    globalNumber: a.number,
    arabic: a.text,
    translation: translationEdition.ayahs[i]?.text ?? "",
  }));
  return {
    number: arabicEdition.number,
    name: arabicEdition.englishName,
    arabicName: arabicEdition.name,
    verses: arabicEdition.numberOfAyahs,
    ayahs,
  };
}

// GET one Juz / Para with Arabic text + English translation, grouped by Surah
// so the reader can see which Surahs make up this Para.
//
// NOTE: unlike /surah/{n}, the documented /juz/{n} route only accepts a single
// edition per request (no combined "/editions/a,b" form is guaranteed to work
// for Juz). So we fetch the Arabic and translation editions as two separate
// requests and zip them together ourselves — this is the fix for the
// "Juz/Para reading fails while Surah works" bug.
export async function fetchJuz(juzNumber) {
  const [arabicEdition, translationEdition] = await Promise.all([
    getJSON(`/juz/${juzNumber}/${ARABIC_EDITION}`),
    getJSON(`/juz/${juzNumber}/${TRANSLATION_EDITION}`),
  ]);

  const groups = [];
  arabicEdition.ayahs.forEach((a, i) => {
    const translationText = translationEdition.ayahs[i]?.text ?? "";
    let group = groups[groups.length - 1];
    if (!group || group.surahNumber !== a.surah.number) {
      group = {
        surahNumber: a.surah.number,
        surahName: a.surah.englishName,
        surahArabicName: a.surah.name,
        ayahs: [],
      };
      groups.push(group);
    }
    group.ayahs.push({
      number: a.numberInSurah,
      // Global ayah number (1-6236) — additive field, used only for the optional
      // per-ayah audio player. Existing consumers of `number` are unaffected.
      globalNumber: a.number,
      arabic: a.text,
      translation: translationText,
    });
  });

  return {
    number: juzNumber,
    surahGroups: groups,
    totalAyahs: arabicEdition.ayahs.length,
  };
}

// Verified CDN pattern for per-ayah recitation audio (Islamic Network CDN, same
// provider as AlQuran Cloud): https://cdn.islamic.network/quran/audio/{bitrate}/{edition}/{globalAyahNumber}.mp3
// Optional feature — if a browser can't load/play it, it simply fails silently
// and doesn't affect the rest of the reading screen.
export function getAyahAudioUrl(globalNumber, edition = "ar.alafasy", bitrate = 128) {
  return `https://cdn.islamic.network/quran/audio/${bitrate}/${edition}/${globalNumber}.mp3`;
}
