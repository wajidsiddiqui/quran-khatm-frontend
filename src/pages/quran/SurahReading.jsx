import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ChevronLeft as Back,
  Volume2,
} from "lucide-react";

import { fetchSurah } from "../../services/quranApi";
import { useAyahAudio } from "../../hooks/useAyahAudio";

import {
  QuranLoading,
  QuranError,
} from "../../components/quran/QuranStateNotice";

import MushafFrame from "../../components/quran/MushafFrame";
import Sheet from "../../components/common/Sheet";
import Button from "../../components/common/Button";

const TOTAL_SURAHS = 114;

const BISMILLAH = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

function toArabicNumber(number) {
  return String(number)
    .split("")
    .map((digit) => "٠١٢٣٤٥٦٧٨٩"[digit])
    .join("");
}

export default function SurahReading() {
  const { id } = useParams();

  const navigate = useNavigate();

  const surahNumber = Number(id);

  const [surah, setSurah] = useState(null);

  const [error, setError] = useState(null);

  const [tab, setTab] = useState("quran");

  const [bookmarked, setBookmarked] = useState(false);

  const [fontSize, setFontSize] = useState(23);

  const [selectedAyah, setSelectedAyah] = useState(null);

  const [savedAyah, setSavedAyah] = useState(null);

  const {
    playingAyah,
    toggle: toggleAyahAudio,
    reset: resetAudio,
  } = useAyahAudio();

  /*
   * Load Surah
   */

  const load = useCallback(() => {
    setError(null);

    setSurah(null);

    fetchSurah(surahNumber)
      .then(setSurah)
      .catch((e) => {
        setError(e.message);
      });
  }, [surahNumber]);

  useEffect(() => {
    load();

    window.scrollTo(0, 0);

    resetAudio();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  /*
   * Load saved reading position
   *
   * Each Surah has its own saved Ayah.
   */

  useEffect(() => {
    const storageKey = `quran-reading-progress-surah-${surahNumber}`;

    const saved = localStorage.getItem(storageKey);

    if (!saved) {
      setSavedAyah(null);

      return;
    }

    try {
      const parsed = JSON.parse(saved);

      setSavedAyah(parsed);
    } catch (error) {
      console.error("Failed to load reading progress:", error);

      setSavedAyah(null);
    }
  }, [surahNumber]);

  /*
   * Navigation
   */

  const goTo = (delta) => {
    const target = surahNumber + delta;

    if (target >= 1 && target <= TOTAL_SURAHS) {
      navigate(`/quran/surah/${target}`);
    }
  };

  /*
   * Select Ayah
   *
   * Clicking anywhere on Quran text
   * opens the Continue From Here option.
   */

  const handleAyahClick = (ayah) => {
    setSelectedAyah({
      number: ayah.number,

      globalNumber: ayah.globalNumber,
    });
  };

  /*
   * Save reading position
   */

  const handleSetReadingProgress = () => {
    if (!selectedAyah) {
      return;
    }

    const progress = {
      surahNumber,

      ayahNumber: selectedAyah.number,

      globalAyahNumber: selectedAyah.globalNumber,

      savedAt: new Date().toISOString(),
    };

    const storageKey = `quran-reading-progress-surah-${surahNumber}`;

    localStorage.setItem(storageKey, JSON.stringify(progress));

    setSavedAyah(progress);

    setSelectedAyah(null);
  };

  /*
   * Clear current reading position
   */

  const handleClearReadingProgress = () => {
    const storageKey = `quran-reading-progress-surah-${surahNumber}`;

    localStorage.removeItem(storageKey);

    setSavedAyah(null);

    setSelectedAyah(null);
  };

  /*
   * Surah information
   */

  const revelationArabic =
    surah?.revelationType === "Meccan" ? "مَكِّيَّة" : "مَدَنِيَّة";

  const shouldShowBismillah = surah && surah.number !== 1 && surah.number !== 9;

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* =========================
          TOP HEADER
      ========================= */}

      <div className="sticky top-0 z-20 bg-cream/90 backdrop-blur px-5 pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          {/* BACK */}

          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-emerald-soft flex items-center justify-center"
          >
            <Back size={20} className="text-emerald-deep" />
          </button>

          {/* TITLE */}

          <div className="text-center">
            <h1 className="font-display text-lg font-medium text-ink">
              {surah?.name || `Surah ${surahNumber}`}
            </h1>

            <p className="text-xs text-ink-soft">
              {surah ? `${surah.verses} Ayahs` : "\u00A0"}
            </p>
          </div>

          {/* BOOKMARK */}

          <button
            onClick={() => setBookmarked((b) => !b)}
            className="w-10 h-10 rounded-full bg-emerald-soft flex items-center justify-center"
          >
            <Bookmark
              size={18}
              className={
                bookmarked ? "text-gold fill-gold" : "text-emerald-deep"
              }
            />
          </button>
        </div>

        {/* QURAN / TRANSLATION */}

        <div className="flex items-center gap-1.5 bg-emerald-soft/60 p-1 rounded-full mb-1">
          {["quran", "translation"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 text-[13px] font-semibold py-2 rounded-full capitalize transition-colors ${
                tab === t
                  ? "bg-emerald text-cream shadow-soft"
                  : "text-emerald-deep/70"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <div className="flex-1 px-5 pt-3 pb-6">
        {error ? (
          <QuranError onRetry={load} />
        ) : !surah ? (
          <QuranLoading label={`Loading Surah ${surahNumber}...`} />
        ) : tab === "quran" ? (
          <MushafFrame>
            {/* =========================
                SURAH HEADER
            ========================= */}

            <div className="relative border border-gold/60 rounded-[10px] bg-[#FFFDF8] px-4 pt-6 pb-4 mb-5">
              {/* FLOATING SURAH PILL */}

              <div className="absolute left-1/2 -translate-x-1/2 -top-3 whitespace-nowrap bg-[#FFFDF8] border border-gold/50 rounded-full px-4 py-1">
                <span className="text-[11px] font-bold text-emerald-deep">
                  SURAH {surah.number}
                </span>

                <span className="text-gold mx-1.5">·</span>

                <span className="font-arabic-indopak text-sm font-bold text-emerald-deep">
                  {surah.arabicName}
                </span>
              </div>

              {/* SURAH INFORMATION */}

              <div className="flex items-center justify-center gap-3 mt-1 text-[11px]">
                <span className="font-arabic-indopak font-semibold text-emerald-deep">
                  {revelationArabic}
                </span>

                <span className="w-1 h-1 rounded-full bg-gold" />

                <span className="text-ink-soft">{surah.verses} Ayahs</span>
              </div>

              {/* BISMILLAH */}

              {shouldShowBismillah && (
                <p className="font-arabic-indopak font-bold text-[24px] leading-relaxed text-center text-emerald-deep mt-3">
                  {BISMILLAH}
                </p>
              )}
            </div>

            {/* =========================
                CONTINUOUS AYAH FLOW
            ========================= */}

            <div
              dir="rtl"
              className="font-arabic-indopak font-bold text-[#141414]"
              style={{
                fontSize,
                lineHeight: 2.5,
                textAlign: "justify",
                textAlignLast: "right",
              }}
            >
              {surah.ayahs.map((ayah) => {
                const isSavedAyah =
                  savedAyah &&
                  Number(savedAyah.ayahNumber) === Number(ayah.number);

                const isPlaying = playingAyah === ayah.globalNumber;

                return (
                  <span
                    key={ayah.number}
                    id={`surah-ayah-${surahNumber}-${ayah.number}`}
                    className="inline"
                  >
                    {/* =========================
                          AYAH TEXT
                          
                          Plain span is intentional.
                          Do NOT use a button around
                          the full Arabic text because
                          it can break Quran line flow.
                      ========================= */}
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={() => handleAyahClick(ayah)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();

                          handleAyahClick(ayah);
                        }
                      }}
                      className={`inline cursor-pointer rounded-md transition-colors ${
                        isSavedAyah
                          ? "bg-emerald-soft/80 text-emerald-deep"
                          : "hover:bg-emerald-soft/40"
                      }`}
                      aria-label={`Set reading progress at ayah ${ayah.number}`}
                    >
                      {ayah.arabic}
                    </span>
                    {/* =========================
                          SAVED BOOKMARK INDICATOR
                          
                          Small symbol only.
                          No large text inside Quran.
                      ========================= */}
                    {isSavedAyah && (
                      <span
                        dir="ltr"
                        className="inline-flex items-center justify-center align-middle mx-1"
                      >
                        <Bookmark size={14} className="text-gold fill-gold" />
                      </span>
                    )}
                    {/* =========================
                          AYAH NUMBER / AUDIO BUTTON
                      ========================= */}
                    <button
                      type="button"
                      onClick={() => toggleAyahAudio(ayah.globalNumber)}
                      className="inline-flex items-center justify-center align-middle mx-1 text-gold hover:opacity-70 transition-opacity"
                      aria-label={`Play recitation for ayah ${ayah.number}`}
                    >
                      {isPlaying ? (
                        <Volume2 size={16} className="text-gold" />
                      ) : (
                        <span
                          className="text-gold font-arabic-indopak"
                          style={{
                            fontSize: Math.max(fontSize - 7, 15),
                          }}
                        >
                          ﴿{toArabicNumber(ayah.number)}﴾
                        </span>
                      )}
                    </button>{" "}
                  </span>
                );
              })}
            </div>
          </MushafFrame>
        ) : (
          /* =========================
              TRANSLATION
          ========================= */

          <div className="space-y-5">
            {surah.ayahs.map((ayah) => (
              <div key={ayah.number} className="flex gap-3">
                <span className="text-xs text-gold border border-gold/40 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                  {ayah.number}
                </span>

                <p className="text-[15px] text-ink leading-relaxed">
                  {ayah.translation}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* =========================
            FONT SIZE
        ========================= */}

        {surah && tab === "quran" && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className="text-xs text-ink-faint">Font Size</span>

            <button
              onClick={() => setFontSize((f) => Math.max(18, f - 2))}
              className="w-7 h-7 rounded-full bg-emerald-soft text-emerald-deep text-xs font-bold flex items-center justify-center"
            >
              A-
            </button>

            <button
              onClick={() => setFontSize((f) => Math.min(34, f + 2))}
              className="w-7 h-7 rounded-full bg-emerald-soft text-emerald-deep text-xs font-bold flex items-center justify-center"
            >
              A+
            </button>
          </div>
        )}
      </div>

      {/* =========================
          BOTTOM NAVIGATION
      ========================= */}

      <div className="sticky bottom-0 bg-cream/95 backdrop-blur border-t border-emerald-deep/8 px-5 py-4 flex items-center justify-between">
        <button
          onClick={() => goTo(-1)}
          disabled={surahNumber <= 1}
          className="flex items-center gap-1 text-sm font-semibold text-emerald-deep disabled:opacity-30"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <span className="text-xs text-ink-faint">
          {surahNumber} / {TOTAL_SURAHS}
        </span>

        <button
          onClick={() => goTo(1)}
          disabled={surahNumber >= TOTAL_SURAHS}
          className="flex items-center gap-1 text-sm font-semibold text-emerald-deep disabled:opacity-30"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>

      {/* =========================
          CONTINUE FROM HERE SHEET
      ========================= */}

      <Sheet open={Boolean(selectedAyah)} onClose={() => setSelectedAyah(null)}>
        {selectedAyah && (
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-soft flex items-center justify-center mx-auto mb-4">
              <Bookmark size={21} className="text-gold" />
            </div>

            <h3 className="font-display text-xl font-semibold text-ink mb-1">
              Ayah {selectedAyah.number}
            </h3>

            <p className="text-sm text-ink-soft mb-6">
              Continue your Quran reading from this Ayah?
            </p>

            <div className="space-y-3">
              <Button className="w-full" onClick={handleSetReadingProgress}>
                ✓ Continue From Here
              </Button>

              {savedAyah && (
                <Button
                  variant="ghost"
                  className="w-full text-red-500"
                  onClick={handleClearReadingProgress}
                >
                  Remove Saved Position
                </Button>
              )}

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setSelectedAyah(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
