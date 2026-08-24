// Thin client for the AlQuran Cloud API.
// Keeps Quran data fully separate from the Khatm mock-data layer.

const BASE_URL =
  "https://api.alquran.cloud/v1";

const ARABIC_EDITION =
  "quran-uthmani";

const TRANSLATION_EDITION =
  "en.sahih";


// Simple in-memory cache so navigating back and forth doesn't re-fetch.
const cache = new Map();

// Surah metadata cache.
let surahMetadataCache = null;


/* =========================================================
   TRADITIONAL REVELATION ORDER

   Source:
   Tanzil - Traditional chronological order of Surahs.

   KEY:
   Quran Surah Number -> Revelation Order

   Example:
   Surah 96 Al-Alaq    -> 1
   Surah 68 Al-Qalam   -> 2
   Surah 73 Al-Muzzammil -> 3
   Surah 74 Al-Muddaththir -> 4
   Surah 1  Al-Fatiha  -> 5
   Surah 2  Al-Baqarah -> 87
========================================================= */

const REVELATION_ORDER = {
  96: 1,
  68: 2,
  73: 3,
  74: 4,
  1: 5,
  111: 6,
  81: 7,
  87: 8,
  92: 9,
  89: 10,
  93: 11,
  94: 12,
  103: 13,
  100: 14,
  108: 15,
  102: 16,
  107: 17,
  109: 18,
  105: 19,
  113: 20,
  114: 21,
  112: 22,
  53: 23,
  80: 24,
  97: 25,
  91: 26,
  85: 27,
  95: 28,
  106: 29,
  101: 30,
  75: 31,
  104: 32,
  77: 33,
  50: 34,
  90: 35,
  86: 36,
  54: 37,
  38: 38,
  7: 39,
  72: 40,
  36: 41,
  25: 42,
  35: 43,
  19: 44,
  20: 45,
  56: 46,
  26: 47,
  27: 48,
  28: 49,
  17: 50,
  10: 51,
  11: 52,
  12: 53,
  15: 54,
  6: 55,
  37: 56,
  31: 57,
  34: 58,
  39: 59,
  40: 60,
  41: 61,
  42: 62,
  43: 63,
  44: 64,
  45: 65,
  46: 66,
  51: 67,
  88: 68,
  18: 69,
  16: 70,
  71: 71,
  14: 72,
  21: 73,
  23: 74,
  32: 75,
  52: 76,
  67: 77,
  69: 78,
  70: 79,
  78: 80,
  79: 81,
  82: 82,
  84: 83,
  30: 84,
  29: 85,
  83: 86,
  2: 87,
  8: 88,
  3: 89,
  33: 90,
  60: 91,
  4: 92,
  99: 93,
  57: 94,
  47: 95,
  13: 96,
  55: 97,
  76: 98,
  65: 99,
  98: 100,
  59: 101,
  24: 102,
  22: 103,
  63: 104,
  58: 105,
  49: 106,
  66: 107,
  64: 108,
  61: 109,
  62: 110,
  48: 111,
  5: 112,
  9: 113,
  110: 114,
};


/* =========================================================
   GET JSON
========================================================= */

async function getJSON(path) {
  if (cache.has(path)) {
    return cache.get(path);
  }

  const res = await fetch(
    `${BASE_URL}${path}`,
  );

  if (!res.ok) {
    throw new Error(
      `Quran API error (${res.status})`,
    );
  }

  const json =
    await res.json();

  if (json.code !== 200) {
    throw new Error(
      json.data ||
        "Quran API error",
    );
  }

  cache.set(
    path,
    json.data,
  );

  return json.data;
}


/* =========================================================
   REVELATION TYPE
========================================================= */

function getArabicRevelationType(
  revelationType,
) {
  if (
    revelationType ===
    "Meccan"
  ) {
    return "مَكِّيَّة";
  }

  if (
    revelationType ===
    "Medinan"
  ) {
    return "مَدَنِيَّة";
  }

  return "";
}


/* =========================================================
   SURAH METADATA
========================================================= */

async function getSurahMetadata() {
  if (surahMetadataCache) {
    return surahMetadataCache;
  }

  const data =
    await getJSON("/surah");

  surahMetadataCache =
    new Map(
      data.map((s) => [
        s.number,
        {
          number:
            s.number,

          name:
            s.englishName,

          translation:
            s.englishNameTranslation,

          arabicName:
            s.name,

          verses:
            s.numberOfAyahs,

          revelationType:
            s.revelationType,

          revelationTypeArabic:
            getArabicRevelationType(
              s.revelationType,
            ),

          /*
           * Traditional revelation order.
           *
           * This is our single source of truth
           * for the Surah Header.
           */
          revelationOrder:
            REVELATION_ORDER[
              s.number
            ] ?? null,
        },
      ]),
    );

  return surahMetadataCache;
}


/* =========================================================
   GET ALL 114 SURAHS
========================================================= */

export async function fetchSurahList() {
  const metadata =
    await getSurahMetadata();

  return Array.from(
    metadata.values(),
  ).map((surah) => ({
    number:
      surah.number,

    name:
      surah.name,

    translation:
      surah.translation,

    arabic:
      surah.arabicName,

    verses:
      surah.verses,

    revelationType:
      surah.revelationType,

    revelationTypeArabic:
      surah.revelationTypeArabic,

    revelationOrder:
      surah.revelationOrder,
  }));
}


/* =========================================================
   GET FULL SURAH
========================================================= */

export async function fetchSurah(
  surahNumber,
) {
  const [
    arabicEdition,
    translationEdition,
    metadata,
  ] = await Promise.all([
    getJSON(
      `/surah/${surahNumber}/${ARABIC_EDITION}`,
    ),

    getJSON(
      `/surah/${surahNumber}/${TRANSLATION_EDITION}`,
    ),

    getSurahMetadata(),
  ]);

  const surahInfo =
    metadata.get(
      Number(surahNumber),
    );


  /* =======================================================
     BUILD ALL AYAHS
  ======================================================== */

  const ayahs =
    arabicEdition.ayahs.map(
      (ayah, index) => ({
        // Ayah number inside the Surah.
        number:
          ayah.numberInSurah,

        // Global Quran Ayah number.
        globalNumber:
          ayah.number,

        // API Juz number.
        juzNumber:
          ayah.juz,

        // Ruku number from Quran API.
        rukuNumber:
          ayah.ruku ?? null,

        // Arabic text.
        arabic:
          ayah.text,

        // English translation.
        translation:
          translationEdition
            .ayahs[index]
            ?.text ?? "",
      }),
    );


  /* =======================================================
     COUNT UNIQUE RUKUS
  ======================================================== */

  const uniqueRukus =
    new Set(
      ayahs
        .map(
          (ayah) =>
            ayah.rukuNumber,
        )
        .filter(
          (rukuNumber) =>
            rukuNumber !== null &&
            rukuNumber !==
              undefined,
        ),
    );

  const totalRukus =
    uniqueRukus.size;


  /* =======================================================
     RETURN COMPLETE SURAH
  ======================================================== */

  return {
    number:
      arabicEdition.number,

    name:
      arabicEdition.englishName,

    arabicName:
      arabicEdition.name,

    // Full Surah Ayah count.
    verses:
      surahInfo?.verses ??
      arabicEdition.numberOfAyahs,

    // Total Rukus in the COMPLETE Surah.
    totalRukus,

    // Traditional revelation order.
    revelationOrder:
      surahInfo?.revelationOrder ??
      null,

    revelationType:
      surahInfo?.revelationType ??
      arabicEdition.revelationType ??
      "",

    revelationTypeArabic:
      surahInfo?.revelationTypeArabic ??
      getArabicRevelationType(
        arabicEdition.revelationType,
      ),

    ayahs,
  };
}


/* =========================================================
   FIXED PARA BOUNDARIES
========================================================= */

const PARA_BOUNDARIES = {
  1: {
    start: {
      surahNumber: 1,
      ayahNumber: 1,
    },
    end: {
      surahNumber: 2,
      ayahNumber: 141,
    },
  },

  2: {
    start: {
      surahNumber: 2,
      ayahNumber: 142,
    },
    end: {
      surahNumber: 2,
      ayahNumber: 252,
    },
  },

  3: {
    start: {
      surahNumber: 2,
      ayahNumber: 253,
    },
    end: {
      surahNumber: 3,
      ayahNumber: 91,
    },
  },

  4: {
    start: {
      surahNumber: 3,
      ayahNumber: 92,
    },
    end: {
      surahNumber: 4,
      ayahNumber: 23,
    },
  },

  5: {
    start: {
      surahNumber: 4,
      ayahNumber: 24,
    },
    end: {
      surahNumber: 4,
      ayahNumber: 147,
    },
  },

  6: {
    start: {
      surahNumber: 4,
      ayahNumber: 148,
    },
    end: {
      surahNumber: 5,
      ayahNumber: 82,
    },
  },

  7: {
    start: {
      surahNumber: 5,
      ayahNumber: 83,
    },
    end: {
      surahNumber: 6,
      ayahNumber: 110,
    },
  },

  8: {
    start: {
      surahNumber: 6,
      ayahNumber: 111,
    },
    end: {
      surahNumber: 7,
      ayahNumber: 87,
    },
  },

  9: {
    start: {
      surahNumber: 7,
      ayahNumber: 88,
    },
    end: {
      surahNumber: 8,
      ayahNumber: 40,
    },
  },

  10: {
    start: {
      surahNumber: 8,
      ayahNumber: 41,
    },
    end: {
      surahNumber: 9,
      ayahNumber: 93,
    },
  },

  11: {
    start: {
      surahNumber: 9,
      ayahNumber: 94,
    },
    end: {
      surahNumber: 11,
      ayahNumber: 5,
    },
  },

  12: {
    start: {
      surahNumber: 11,
      ayahNumber: 6,
    },
    end: {
      surahNumber: 12,
      ayahNumber: 52,
    },
  },

  13: {
    start: {
      surahNumber: 12,
      ayahNumber: 53,
    },
    end: {
      surahNumber: 15,
      ayahNumber: 1,
    },
  },

  14: {
    start: {
      surahNumber: 15,
      ayahNumber: 2,
    },
    end: {
      surahNumber: 16,
      ayahNumber: 128,
    },
  },

  15: {
    start: {
      surahNumber: 17,
      ayahNumber: 1,
    },
    end: {
      surahNumber: 18,
      ayahNumber: 74,
    },
  },

  16: {
    start: {
      surahNumber: 18,
      ayahNumber: 75,
    },
    end: {
      surahNumber: 20,
      ayahNumber: 135,
    },
  },

  17: {
    start: {
      surahNumber: 21,
      ayahNumber: 1,
    },
    end: {
      surahNumber: 22,
      ayahNumber: 78,
    },
  },

  18: {
    start: {
      surahNumber: 23,
      ayahNumber: 1,
    },
    end: {
      surahNumber: 25,
      ayahNumber: 20,
    },
  },

  19: {
    start: {
      surahNumber: 25,
      ayahNumber: 21,
    },
    end: {
      surahNumber: 27,
      ayahNumber: 59,
    },
  },

  20: {
    start: {
      surahNumber: 27,
      ayahNumber: 60,
    },
    end: {
      surahNumber: 29,
      ayahNumber: 44,
    },
  },

  21: {
    start: {
      surahNumber: 29,
      ayahNumber: 45,
    },
    end: {
      surahNumber: 33,
      ayahNumber: 30,
    },
  },

  22: {
    start: {
      surahNumber: 33,
      ayahNumber: 31,
    },
    end: {
      surahNumber: 36,
      ayahNumber: 21,
    },
  },

  23: {
    start: {
      surahNumber: 36,
      ayahNumber: 22,
    },
    end: {
      surahNumber: 39,
      ayahNumber: 31,
    },
  },

  24: {
    start: {
      surahNumber: 39,
      ayahNumber: 32,
    },
    end: {
      surahNumber: 41,
      ayahNumber: 46,
    },
  },

  25: {
    start: {
      surahNumber: 41,
      ayahNumber: 47,
    },
    end: {
      surahNumber: 45,
      ayahNumber: 37,
    },
  },

  26: {
    start: {
      surahNumber: 46,
      ayahNumber: 1,
    },
    end: {
      surahNumber: 51,
      ayahNumber: 30,
    },
  },

  27: {
    start: {
      surahNumber: 51,
      ayahNumber: 31,
    },
    end: {
      surahNumber: 57,
      ayahNumber: 29,
    },
  },

  28: {
    start: {
      surahNumber: 58,
      ayahNumber: 1,
    },
    end: {
      surahNumber: 66,
      ayahNumber: 12,
    },
  },

  29: {
    start: {
      surahNumber: 67,
      ayahNumber: 1,
    },
    end: {
      surahNumber: 77,
      ayahNumber: 50,
    },
  },

  30: {
    start: {
      surahNumber: 78,
      ayahNumber: 1,
    },
    end: {
      surahNumber: 114,
      ayahNumber: 6,
    },
  },
};


/* =========================================================
   COMPARE QURAN POSITION
========================================================= */

function comparePosition(
  a,
  b,
) {
  const aSurah =
    Number(a.surahNumber);

  const bSurah =
    Number(b.surahNumber);

  if (aSurah < bSurah) {
    return -1;
  }

  if (aSurah > bSurah) {
    return 1;
  }

  const aAyah =
    Number(a.ayahNumber);

  const bAyah =
    Number(b.ayahNumber);

  if (aAyah < bAyah) {
    return -1;
  }

  if (aAyah > bAyah) {
    return 1;
  }

  return 0;
}


/* =========================================================
   CHECK AYAH INSIDE PARA RANGE
========================================================= */

function isAyahInsideBoundary(
  surahNumber,
  ayahNumber,
  boundary,
) {
  const position = {
    surahNumber,
    ayahNumber,
  };

  const startComparison =
    comparePosition(
      position,
      boundary.start,
    );

  const endComparison =
    comparePosition(
      position,
      boundary.end,
    );

  return (
    startComparison >= 0 &&
    endComparison <= 0
  );
}


/* =========================================================
   GET SURAH NUMBERS REQUIRED FOR PARA
========================================================= */

function getSurahNumbersForPara(
  boundary,
) {
  const numbers = [];

  for (
    let surahNumber =
      boundary.start.surahNumber;
    surahNumber <=
    boundary.end.surahNumber;
    surahNumber += 1
  ) {
    numbers.push(
      surahNumber,
    );
  }

  return numbers;
}


/* =========================================================
   BUILD GROUPS FROM CUSTOM PARA RANGE
========================================================= */

async function buildParaGroups(
  paraNumber,
  boundary,
) {
  const metadata =
    await getSurahMetadata();

  const surahNumbers =
    getSurahNumbersForPara(
      boundary,
    );

  const fetchedSurahs =
    await Promise.all(
      surahNumbers.map(
        (surahNumber) =>
          fetchSurah(
            surahNumber,
          ),
      ),
    );

  const groups = [];

  fetchedSurahs.forEach(
    (surah) => {
      const filteredAyahs =
        surah.ayahs.filter(
          (ayah) =>
            isAyahInsideBoundary(
              surah.number,
              ayah.number,
              boundary,
            ),
        );

      if (
        filteredAyahs.length ===
        0
      ) {
        return;
      }

      const surahInfo =
        metadata.get(
          surah.number,
        );

      groups.push({
        surahNumber:
          surah.number,

        surahName:
          surah.name,

        surahArabicName:
          surah.arabicName,

        // Total Ayahs in the COMPLETE Surah.
        totalVerses:
          surahInfo?.verses ??
          surah.verses ??
          0,

        // Total Rukus in the COMPLETE Surah.
        totalRukus:
          surah.totalRukus ??
          0,

        // Traditional revelation order.
        revelationOrder:
          surahInfo
            ?.revelationOrder ??
          surah.revelationOrder ??
          null,

        revelationType:
          surahInfo?.revelationType ??
          surah.revelationType ??
          "",

        revelationTypeArabic:
          surahInfo
            ?.revelationTypeArabic ??
          surah.revelationTypeArabic ??
          "",

        ayahs:
          filteredAyahs.map(
            (ayah) => ({
              ...ayah,

              /*
               * The Ayah belongs to the
               * application's custom Para,
               * regardless of the API's
               * own juzNumber.
               */

              juzNumber:
                paraNumber,
            }),
          ),
      });
    },
  );

  return groups;
}


/* =========================================================
   GET ONE CUSTOM PARA / JUZ
========================================================= */

export async function fetchJuz(
  juzNumber,
) {
  const paraNumber =
    Number(juzNumber);

  if (
    !Number.isInteger(
      paraNumber,
    ) ||
    paraNumber < 1 ||
    paraNumber > 30
  ) {
    throw new Error(
      "Para number must be an integer between 1 and 30.",
    );
  }

  const boundary =
    PARA_BOUNDARIES[
      paraNumber
    ];

  if (!boundary) {
    throw new Error(
      `No boundary configured for Para ${paraNumber}.`,
    );
  }

  /*
   * Fetch only the Surahs required
   * to build this custom Para.
   */

  const groups =
    await buildParaGroups(
      paraNumber,
      boundary,
    );

  /*
   * Flatten to calculate exact
   * number of Ayahs returned.
   */

  const totalAyahs =
    groups.reduce(
      (
        total,
        group,
      ) =>
        total +
        group.ayahs.length,
      0,
    );

  return {
    number:
      paraNumber,

    surahGroups:
      groups,

    totalAyahs,

    /*
     * Keep the fixed boundaries
     * available to future validation
     * logic without changing the
     * existing consumers.
     */

    startBoundary:
      boundary.start,

    endBoundary:
      boundary.end,
  };
}


/* =========================================================
   GET FIXED PARA BOUNDARY
========================================================= */

export function getParaBoundary(
  paraNumber,
) {
  return (
    PARA_BOUNDARIES[
      Number(paraNumber)
    ] || null
  );
}


/* =========================================================
   AYAH AUDIO
========================================================= */

export function getAyahAudioUrl(
  globalNumber,
  edition = "ar.alafasy",
  bitrate = 128,
) {
  return `https://cdn.islamic.network/quran/audio/${bitrate}/${edition}/${globalNumber}.mp3`;
}