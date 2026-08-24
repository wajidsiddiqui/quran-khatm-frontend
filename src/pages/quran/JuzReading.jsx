import { useParams, useNavigate } from "react-router-dom";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Loader2,
} from "lucide-react";

import {
  fetchJuz,
  fetchSurah,
} from "../../services/quranApi";

import {
  useAyahAudio,
} from "../../hooks/useAyahAudio";

import {
  useKhatms,
} from "../../context/KhatmContext";

import {
  QuranLoading,
  QuranError,
} from "../../components/quran/QuranStateNotice";

import MushafFrame from "../../components/quran/MushafFrame";

import Sheet from "../../components/common/Sheet";

import Button from "../../components/common/Button";

import SurahHeader from "../../components/quran/SurahHeader";

import {
  isSurahStart,
} from "../../utils/quranSurah";

const TOTAL_JUZ = 30;

function toArabicNumber(number) {
  return String(number)
    .split("")
    .map(
      (digit) =>
        "٠١٢٣٤٥٦٧٨٩"[digit],
    )
    .join("");
}

export default function JuzReading() {
  const { num } = useParams();

  const navigate = useNavigate();

  const juzNumber = Number(num);

  /*
   * ========================================
   * KHATM CONTEXT
   * ========================================
   */

  const {
    getQuranBookmarks,
    saveQuranBookmark,
    deleteReadingProgress,
  } = useKhatms();

  /*
   * ========================================
   * STATE
   * ========================================
   */

  const [juz, setJuz] = useState(null);

  const [error, setError] = useState(null);

  const [tab, setTab] = useState("quran");

  const [fontSize, setFontSize] = useState(23);

  const [selectedAyah, setSelectedAyah] = useState(null);

  const [savedAyah, setSavedAyah] = useState(null);

  const [loadingBookmark, setLoadingBookmark] = useState(false);

  const [savingBookmark, setSavingBookmark] = useState(false);

  const [deletingBookmark, setDeletingBookmark] = useState(false);

  /*
   * Prevent repeated auto-scroll.
   */

  const hasAutoScrolledRef = useRef(false);

  /*
   * ========================================
   * AUDIO
   * ========================================
   */

  const {
    playingAyah,
    playingSurah,
    toggle: toggleAyahAudio,
    toggleSurah,
    reset: resetAudio,
  } = useAyahAudio();

  /*
   * ========================================
   * LOAD JUZ
   * ========================================
   */

  const load = useCallback(() => {
    if (
      !Number.isInteger(juzNumber) ||
      juzNumber < 1 ||
      juzNumber > TOTAL_JUZ
    ) {
      setJuz(null);

      setError("Invalid Para number.");

      return;
    }

    setError(null);

    setJuz(null);

    fetchJuz(juzNumber)
      .then(setJuz)
      .catch((e) => {
        setError(
          e.message ||
            "Failed to load Para.",
        );
      });
  }, [juzNumber]);

  /*
   * ========================================
   * RESET WHEN JUZ CHANGES
   * ========================================
   */

  useEffect(() => {
    hasAutoScrolledRef.current = false;

    window.scrollTo({
      top: 0,
      behavior: "auto",
    });

    resetAudio();

    setSelectedAyah(null);

    setSavedAyah(null);

    load();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  /*
   * ========================================
   * LOAD SAVED QURAN BOOKMARK
   * ========================================
   */

  useEffect(() => {
    if (!juzNumber || !juz) {
      return;
    }

    let cancelled = false;

    async function loadBookmark() {
      try {
        setLoadingBookmark(true);

        const bookmarks =
          await getQuranBookmarks();

        if (cancelled) {
          return;
        }

        const juzAyahs =
          juz.surahGroups.flatMap(
            (group) => group.ayahs,
          );

        const currentBookmark =
          bookmarks.find(
            (bookmark) =>
              juzAyahs.some(
                (ayah) =>
                  Number(
                    ayah.globalNumber,
                  ) ===
                  Number(
                    bookmark.globalAyahNumber,
                  ),
              ),
          );

        setSavedAyah(
          currentBookmark || null,
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load Juz bookmark:",
          error.message,
        );

        setSavedAyah(null);
      } finally {
        if (!cancelled) {
          setLoadingBookmark(false);
        }
      }
    }

    loadBookmark();

    return () => {
      cancelled = true;
    };
  }, [
    juz,
    juzNumber,
    getQuranBookmarks,
  ]);

  /*
   * ========================================
   * AUTO SCROLL TO SAVED AYAH
   * ========================================
   */

  useEffect(() => {
    if (
      !juz ||
      !savedAyah ||
      loadingBookmark ||
      tab !== "quran" ||
      hasAutoScrolledRef.current
    ) {
      return;
    }

    const targetId =
      `juz-ayah-${juzNumber}-${savedAyah.surahNumber}-${savedAyah.ayahNumber}`;

    const timer =
      window.setTimeout(() => {
        const element =
          document.getElementById(
            targetId,
          );

        if (!element) {
          console.warn(
            "Saved Juz bookmark element not found:",
            targetId,
          );

          return;
        }

        const headerOffset = 120;

        const elementPosition =
          element.getBoundingClientRect()
            .top;

        const offsetPosition =
          elementPosition +
          window.scrollY -
          headerOffset;

        window.scrollTo({
          top: Math.max(
            0,
            offsetPosition,
          ),
          behavior: "smooth",
        });

        hasAutoScrolledRef.current =
          true;
      }, 500);

    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, [
    juz,
    savedAyah,
    loadingBookmark,
    tab,
    juzNumber,
  ]);

  /*
   * ========================================
   * PLAY COMPLETE SURAH FROM HEADER
   * ========================================
   */

  const handleSurahHeaderAudio =
    async (group) => {
      /*
       * If this Surah is already playing,
       * clicking the header stops it.
       */

      if (
        playingSurah ===
        group.surahNumber
      ) {
        toggleSurah(
          group.surahNumber,
          group.ayahs,
        );

        return;
      }

      try {
        /*
         * A Juz can contain only part
         * of a Surah.
         *
         * Therefore fetch the complete
         * Surah before starting audio.
         */

        const fullSurah =
          await fetchSurah(
            group.surahNumber,
          );

        toggleSurah(
          group.surahNumber,
          fullSurah.ayahs,
        );
      } catch (error) {
        console.error(
          "Failed to load full Surah audio:",
          error.message,
        );
      }
    };

  /*
   * ========================================
   * SELECT AYAH
   * ========================================
   */

  const handleAyahClick =
    (ayah, group) => {
      setSelectedAyah({
        number: ayah.number,

        globalNumber:
          ayah.globalNumber,

        surahNumber:
          group.surahNumber,
      });
    };

  /*
   * ========================================
   * SAVE QURAN BOOKMARK
   * ========================================
   */

  const handleSetReadingProgress =
    async () => {
      if (!selectedAyah) {
        return;
      }

      try {
        setSavingBookmark(true);

        const progress =
          await saveQuranBookmark({
            surahNumber:
              selectedAyah.surahNumber,

            ayahNumber:
              selectedAyah.number,

            globalAyahNumber:
              selectedAyah.globalNumber,
          });

        setSavedAyah(progress);

        setSelectedAyah(null);
      } catch (error) {
        console.error(
          "Failed to save Juz bookmark:",
          error.message,
        );
      } finally {
        setSavingBookmark(false);
      }
    };

  /*
   * ========================================
   * DELETE BOOKMARK
   * ========================================
   */

  const handleClearReadingProgress =
    async () => {
      if (!savedAyah?._id) {
        setSavedAyah(null);

        setSelectedAyah(null);

        return;
      }

      try {
        setDeletingBookmark(true);

        await deleteReadingProgress(
          savedAyah._id,
        );

        setSavedAyah(null);

        setSelectedAyah(null);
      } catch (error) {
        console.error(
          "Failed to delete Juz bookmark:",
          error.message,
        );
      } finally {
        setDeletingBookmark(false);
      }
    };

  /*
   * ========================================
   * JUZ NAVIGATION
   * ========================================
   */

  const goTo = (delta) => {
    const target =
      juzNumber + delta;

    if (
      target >= 1 &&
      target <= TOTAL_JUZ
    ) {
      navigate(
        `/quran/juz/${target}/read`,
      );
    }
  };

  /*
   * ========================================
   * BACK NAVIGATION
   * ========================================
   */

  const handleBack = () => {
    navigate("/quran", {
      state: {
        activeTab: "juz",
      },
    });
  };

  /*
   * ========================================
   * RENDER
   * ========================================
   */

  return (
    <div className="min-h-screen bg-cream flex flex-col">

      {/* =========================
          TOP HEADER
      ========================= */}

      <div className="sticky top-0 z-20 bg-cream/90 backdrop-blur px-5 pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">

          {/* BACK */}

          <button
            onClick={handleBack}
            aria-label="Back to Quran"
            className="w-10 h-10 rounded-full bg-emerald-soft flex items-center justify-center transition-opacity hover:opacity-80"
          >
            <ChevronLeft
              size={20}
              className="text-emerald-deep"
            />
          </button>

          {/* TITLE */}

          <div className="text-center">
            <h1 className="font-display text-lg font-medium text-ink">
              Para {juzNumber}
            </h1>

            <p className="text-xs text-ink-soft">
              {juz
                ? `${juz.totalAyahs} Ayahs`
                : "\u00A0"}
            </p>
          </div>

          {/* BOOKMARK INDICATOR */}

          <div className="w-10 h-10 rounded-full bg-emerald-soft flex items-center justify-center">
            <Bookmark
              size={18}
              className={
                savedAyah
                  ? "text-gold fill-gold"
                  : "text-emerald-deep"
              }
            />
          </div>
        </div>

        {/* QURAN / TRANSLATION */}

        <div className="flex items-center gap-1.5 bg-emerald-soft/60 p-1 rounded-full mb-1">

          <button
            onClick={() =>
              setTab("quran")
            }
            className={`flex-1 text-[13px] font-semibold py-2 rounded-full capitalize transition-colors ${
              tab === "quran"
                ? "bg-emerald text-cream shadow-soft"
                : "text-emerald-deep/70"
            }`}
          >
            Quran
          </button>

          <button
            onClick={() =>
              setTab("translation")
            }
            className={`flex-1 text-[13px] font-semibold py-2 rounded-full capitalize transition-colors ${
              tab === "translation"
                ? "bg-emerald text-cream shadow-soft"
                : "text-emerald-deep/70"
            }`}
          >
            Translation
          </button>

        </div>
      </div>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <div className="flex-1 px-5 pt-3 pb-6">

        {error ? (
          <QuranError
            onRetry={load}
          />
        ) : !juz ? (
          <QuranLoading
            label={`Loading Para ${juzNumber}...`}
          />
        ) : tab === "quran" ? (

          <MushafFrame>

            {/* =========================
                PARA HEADER
            ========================= */}

            <div className="relative border border-gold/60 rounded-[10px] bg-[#FFFDF8] px-4 pt-6 pb-4 mb-5">

              <div className="absolute left-1/2 -translate-x-1/2 -top-3 whitespace-nowrap bg-[#FFFDF8] border border-gold/50 rounded-full px-4 py-1">
                <span className="text-[11px] font-bold text-emerald-deep">
                  PARA {juzNumber}
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 mt-1">

                <span className="text-[11px] text-ink-soft">
                  {juz.totalAyahs} Ayahs
                </span>

                <span className="w-1 h-1 rounded-full bg-gold" />

                <span className="text-[11px] text-ink-soft">
                  {juz.surahGroups.length} Surahs
                </span>

              </div>
            </div>

            {/* =========================
                AYAH FLOW
            ========================= */}

            {juz.surahGroups.map(
              (group) => {

                const isSurahBeginning =
                  isSurahStart(
                    group,
                  );

                const isThisSurahPlaying =
                  playingSurah ===
                  group.surahNumber;

                return (
                  <section
                    key={
                      group.surahNumber
                    }
                    className="mb-7 last:mb-0"
                  >

                    {/* =========================
                        SURAH HEADER
                    ========================= */}

                    {isSurahBeginning && (
                      <div className="mb-4">

                        <SurahHeader
                          number={
                            group.surahNumber
                          }

                          arabicName={
                            group.surahArabicName
                          }

                          revelationTypeArabic={
                            group.revelationTypeArabic
                          }

                          ayahCount={
                            group.totalVerses
                          }

                          rukuCount={
                            group.totalRukus
                          }

                          revelationOrder={
                            group.revelationOrder
                          }

                          isPlaying={
                            isThisSurahPlaying
                          }

                          onClick={() =>
                            handleSurahHeaderAudio(
                              group,
                            )
                          }
                        />

                      </div>
                    )}

                    {/* =========================
                        ARABIC FLOW
                    ========================= */}

                    <div
                      dir="rtl"
                      className="font-quran font-bold text-[#141414]"
                      style={{
                        fontSize,
                        lineHeight: 2.5,
                        textAlign:
                          "justify",
                        textAlignLast:
                          "right",
                      }}
                    >

                      {group.ayahs.map(
                        (ayah) => {

                          const isPlaying =
                            playingAyah ===
                            ayah.globalNumber;

                          const isSavedAyah =
                            savedAyah &&
                            Number(
                              savedAyah.surahNumber,
                            ) ===
                              Number(
                                group.surahNumber,
                              ) &&
                            Number(
                              savedAyah.ayahNumber,
                            ) ===
                              Number(
                                ayah.number,
                              );

                          return (
                            <span
                              key={`${group.surahNumber}-${ayah.number}`}
                              id={`juz-ayah-${juzNumber}-${group.surahNumber}-${ayah.number}`}
                              className="inline"
                            >

                              {/* AYAH TEXT */}

                              <span
                                role="button"
                                tabIndex={0}
                                onClick={() =>
                                  handleAyahClick(
                                    ayah,
                                    group,
                                  )
                                }
                                onKeyDown={(
                                  event,
                                ) => {
                                  if (
                                    event.key ===
                                      "Enter" ||
                                    event.key ===
                                      " "
                                  ) {
                                    event.preventDefault();

                                    handleAyahClick(
                                      ayah,
                                      group,
                                    );
                                  }
                                }}
                                className={`inline cursor-pointer rounded-md transition-colors ${
                                  isSavedAyah
                                    ? "bg-emerald-soft/80 text-emerald-deep"
                                    : "hover:bg-emerald-soft/40"
                                }`}
                                aria-label={`Set reading progress at ayah ${ayah.number}`}
                              >
                                {
                                  ayah.arabic
                                }
                              </span>

                              {/* SAVED BOOKMARK ICON */}

                              {isSavedAyah && (
                                <span
                                  dir="ltr"
                                  className="inline-flex items-center justify-center align-middle mx-1"
                                >
                                  <Bookmark
                                    size={
                                      14
                                    }
                                    className="text-gold fill-gold"
                                  />
                                </span>
                              )}

                              {/* AYAH AUDIO */}

                              <button
                                type="button"
                                onClick={() =>
                                  toggleAyahAudio(
                                    ayah.globalNumber,
                                  )
                                }
                                className="inline-flex items-center justify-center align-middle mx-1 text-gold hover:opacity-70 transition-opacity"
                                aria-label={`Play recitation for ayah ${ayah.number}`}
                              >

                                {isPlaying ? (
                                  <Volume2
                                    size={
                                      16
                                    }
                                    className="text-gold"
                                  />
                                ) : (
                                  <span
                                    className="text-gold font-quran"
                                    style={{
                                      fontSize:
                                        Math.max(
                                          fontSize -
                                            7,
                                          15,
                                        ),
                                    }}
                                  >
                                    ﴿
                                    {toArabicNumber(
                                      ayah.number,
                                    )}
                                    ﴾
                                  </span>
                                )}

                              </button>{" "}

                            </span>
                          );
                        },
                      )}

                    </div>

                  </section>
                );
              },
            )}

          </MushafFrame>

        ) : (

          /* =========================
              TRANSLATION
          ========================= */

          <div className="space-y-8">

            {juz.surahGroups.map(
              (group) => {

                const isSurahBeginning =
                  isSurahStart(
                    group,
                  );

                const isThisSurahPlaying =
                  playingSurah ===
                  group.surahNumber;

                return (
                  <section
                    key={
                      group.surahNumber
                    }
                  >

                    {isSurahBeginning && (
                      <div className="mb-4">

                        <SurahHeader
                          number={
                            group.surahNumber
                          }

                          arabicName={
                            group.surahArabicName
                          }

                          revelationTypeArabic={
                            group.revelationTypeArabic
                          }

                          ayahCount={
                            group.totalVerses
                          }

                          rukuCount={
                            group.totalRukus
                          }

                          revelationOrder={
                            group.revelationOrder
                          }

                          isPlaying={
                            isThisSurahPlaying
                          }

                          onClick={() =>
                            handleSurahHeaderAudio(
                              group,
                            )
                          }
                        />

                      </div>
                    )}

                    <div className="space-y-5">

                      {group.ayahs.map(
                        (ayah) => (
                          <div
                            key={`${group.surahNumber}-${ayah.number}`}
                            className="flex gap-3"
                          >

                            <span className="text-xs text-gold border border-gold/40 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                              {
                                ayah.number
                              }
                            </span>

                            <p className="text-[15px] text-ink leading-relaxed">
                              {
                                ayah.translation
                              }
                            </p>

                          </div>
                        ),
                      )}

                    </div>

                  </section>
                );
              },
            )}

          </div>
        )}

        {/* =========================
            FONT SIZE
        ========================= */}

        {juz &&
          tab === "quran" && (
            <div className="flex items-center justify-center gap-3 mt-6">

              <span className="text-xs text-ink-faint">
                Font Size
              </span>

              <button
                onClick={() =>
                  setFontSize(
                    (f) =>
                      Math.max(
                        18,
                        f - 2,
                      ),
                  )
                }
                aria-label="Decrease font size"
                className="w-8 h-8 rounded-full bg-emerald-soft text-emerald-deep text-xs font-bold flex items-center justify-center"
              >
                A-
              </button>

              <button
                onClick={() =>
                  setFontSize(
                    (f) =>
                      Math.min(
                        34,
                        f + 2,
                      ),
                  )
                }
                aria-label="Increase font size"
                className="w-8 h-8 rounded-full bg-emerald-soft text-emerald-deep text-xs font-bold flex items-center justify-center"
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
          onClick={() =>
            goTo(-1)
          }
          disabled={
            juzNumber <= 1
          }
          className="flex items-center gap-1 text-sm font-semibold text-emerald-deep disabled:opacity-30 transition-opacity"
        >
          <ChevronLeft
            size={16}
          />

          Previous
        </button>

        <span className="text-xs text-ink-faint">
          {juzNumber} /{" "}
          {TOTAL_JUZ}
        </span>

        <button
          onClick={() =>
            goTo(1)
          }
          disabled={
            juzNumber >=
            TOTAL_JUZ
          }
          className="flex items-center gap-1 text-sm font-semibold text-emerald-deep disabled:opacity-30 transition-opacity"
        >
          Next

          <ChevronRight
            size={16}
          />
        </button>

      </div>

      {/* =========================
          CONTINUE FROM HERE SHEET
      ========================= */}

      <Sheet
        open={Boolean(
          selectedAyah,
        )}
        onClose={() =>
          !savingBookmark &&
          !deletingBookmark &&
          setSelectedAyah(
            null,
          )
        }
      >

        {selectedAyah && (
          <div className="text-center">

            <div className="w-12 h-12 rounded-full bg-emerald-soft flex items-center justify-center mx-auto mb-4">

              <Bookmark
                size={21}
                className="text-gold"
              />

            </div>

            <h3 className="font-display text-xl font-semibold text-ink mb-1">
              Ayah{" "}
              {selectedAyah.number}
            </h3>

            <p className="text-sm text-ink-soft mb-6">
              Continue your Quran
              reading from this Ayah?
            </p>

            <div className="space-y-3">

              <Button
                className="w-full"
                onClick={
                  handleSetReadingProgress
                }
                disabled={
                  savingBookmark ||
                  deletingBookmark
                }
              >

                {savingBookmark ? (
                  <span className="flex items-center justify-center gap-2">

                    <Loader2
                      size={16}
                      className="animate-spin"
                    />

                    Saving...

                  </span>
                ) : (
                  "✓ Continue From Here"
                )}

              </Button>

              {savedAyah && (
                <Button
                  variant="ghost"
                  className="w-full text-red-500"
                  onClick={
                    handleClearReadingProgress
                  }
                  disabled={
                    savingBookmark ||
                    deletingBookmark
                  }
                >

                  {deletingBookmark ? (
                    <span className="flex items-center justify-center gap-2">

                      <Loader2
                        size={16}
                        className="animate-spin"
                      />

                      Removing...

                    </span>
                  ) : (
                    "Remove Saved Position"
                  )}

                </Button>
              )}

              <Button
                variant="ghost"
                className="w-full"
                onClick={() =>
                  setSelectedAyah(
                    null,
                  )
                }
                disabled={
                  savingBookmark ||
                  deletingBookmark
                }
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