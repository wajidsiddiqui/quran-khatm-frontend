// Thin client for the AlQuran Cloud API (https://alquran.cloud/api)
// Keeps Quran data fully separate from the Khatm mock-data layer.

const BASE_URL = "https://api.alquran.cloud/v1";

const ARABIC_EDITION = "quran-uthmani";

const TRANSLATION_EDITION = "en.sahih";

// Simple in-memory cache so navigating back and forth doesn't re-fetch.
const cache = new Map();

// Surah metadata cache.
let surahMetadataCache = null;

/* =========================
   GET JSON
========================= */

async function getJSON(path) {
  if (cache.has(path)) {
    return cache.get(path);
  }

  const res = await fetch(`${BASE_URL}${path}`);

  if (!res.ok) {
    throw new Error(`Quran API error (${res.status})`);
  }

  const json = await res.json();

  if (json.code !== 200) {
    throw new Error(json.data || "Quran API error");
  }

  cache.set(path, json.data);

  return json.data;
}

/* =========================
   REVELATION TYPE
========================= */

function getArabicRevelationType(revelationType) {
  if (revelationType === "Meccan") {
    return "مَكِّيَّة";
  }

  if (revelationType === "Medinan") {
    return "مَدَنِيَّة";
  }

  return "";
}

/* =========================
   SURAH METADATA
========================= */

async function getSurahMetadata() {
  if (surahMetadataCache) {
    return surahMetadataCache;
  }

  const data = await getJSON("/surah");

  surahMetadataCache = new Map(
    data.map((s) => [
      s.number,
      {
        number: s.number,

        name: s.englishName,

        translation: s.englishNameTranslation,

        arabicName: s.name,

        verses: s.numberOfAyahs,

        revelationType: s.revelationType,

        revelationTypeArabic: getArabicRevelationType(
          s.revelationType,
        ),
      },
    ]),
  );

  return surahMetadataCache;
}

/* =========================
   GET ALL 114 SURAHS
========================= */

export async function fetchSurahList() {
  const metadata = await getSurahMetadata();

  return Array.from(metadata.values()).map((surah) => ({
    number: surah.number,

    name: surah.name,

    translation: surah.translation,

    arabic: surah.arabicName,

    verses: surah.verses,

    revelationType: surah.revelationType,

    revelationTypeArabic: surah.revelationTypeArabic,
  }));
}

/* =========================
   GET FULL SURAH

   Arabic and translation
   are fetched separately.
========================= */

export async function fetchSurah(surahNumber) {
  const [arabicEdition, translationEdition, metadata] =
    await Promise.all([
      getJSON(
        `/surah/${surahNumber}/${ARABIC_EDITION}`,
      ),

      getJSON(
        `/surah/${surahNumber}/${TRANSLATION_EDITION}`,
      ),

      getSurahMetadata(),
    ]);

  const surahInfo = metadata.get(surahNumber);

  const ayahs = arabicEdition.ayahs.map(
    (ayah, index) => ({
      // Ayah number inside the Surah.
      number: ayah.numberInSurah,

      // Global Quran ayah number.
      globalNumber: ayah.number,

      // Arabic text.
      arabic: ayah.text,

      // English translation.
      translation:
        translationEdition.ayahs[index]?.text ?? "",
    }),
  );

  return {
    number: arabicEdition.number,

    name: arabicEdition.englishName,

    arabicName: arabicEdition.name,

    // Full Surah ayah count.
    verses:
      surahInfo?.verses ??
      arabicEdition.numberOfAyahs,

    revelationType:
      surahInfo?.revelationType ??
      arabicEdition.revelationType ??
      "",

    revelationTypeArabic:
      surahInfo?.revelationTypeArabic ??
      getArabicRevelationType(
        arabicEdition.revelationType,
      ),

    // ALL ayahs of the Surah.
    ayahs,
  };
}

/* =========================
   GET ONE JUZ / PARA

   Arabic + translation,
   grouped by Surah.
========================= */

export async function fetchJuz(juzNumber) {
  const [
    arabicEdition,
    translationEdition,
    metadata,
  ] = await Promise.all([
    getJSON(
      `/juz/${juzNumber}/${ARABIC_EDITION}`,
    ),

    getJSON(
      `/juz/${juzNumber}/${TRANSLATION_EDITION}`,
    ),

    getSurahMetadata(),
  ]);

  const groups = [];

  arabicEdition.ayahs.forEach(
    (a, i) => {
      const translationText =
        translationEdition.ayahs[i]?.text ?? "";

      let group =
        groups[groups.length - 1];

      if (
        !group ||
        group.surahNumber !== a.surah.number
      ) {
        const surahInfo = metadata.get(
          a.surah.number,
        );

        group = {
          surahNumber: a.surah.number,

          surahName:
            a.surah.englishName,

          surahArabicName:
            a.surah.name,

          // Full Surah ayah count.
          totalVerses:
            surahInfo?.verses ?? 0,

          revelationType:
            surahInfo?.revelationType ?? "",

          revelationTypeArabic:
            surahInfo?.revelationTypeArabic ??
            "",

          ayahs: [],
        };

        groups.push(group);
      }

      group.ayahs.push({
        // Actual ayah number inside Surah.
        number: a.numberInSurah,

        // Global ayah number.
        globalNumber: a.number,

        arabic: a.text,

        translation: translationText,
      });
    },
  );

  return {
    number: juzNumber,

    surahGroups: groups,

    totalAyahs:
      arabicEdition.ayahs.length,
  };
}

/* =========================
   AYAH AUDIO
========================= */

export function getAyahAudioUrl(
  globalNumber,
  edition = "ar.alafasy",
  bitrate = 128,
) {
  return `https://cdn.islamic.network/quran/audio/${bitrate}/${edition}/${globalNumber}.mp3`;
}