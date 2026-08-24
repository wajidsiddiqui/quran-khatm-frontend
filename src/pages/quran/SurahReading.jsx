import {
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";

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

const TOTAL_SURAHS = 114;

const BISMILLAH =
  "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";


/* =========================================================
   REMOVE BISMILLAH FROM FIRST AYAH
========================================================= */

function removeBismillah(text = "") {
  return text
    .replace(
      /^(?:بِسْمِ|بِسْمِ)\s+(?:ٱ|ا)?للَّ?هِ\s+(?:ٱ|ا)?لرَّحْمَٰنِ\s+(?:ٱ|ا)?لرَّحِيمِ[\s\uFEFF]*/,
      "",
    )
    .trim();
}


/* =========================================================
   ARABIC AYAH NUMBER
========================================================= */

function toArabicNumber(number) {
  return String(number)
    .split("")
    .map(
      (digit) =>
        "٠١٢٣٤٥٦٧٨٩"[digit],
    )
    .join("");
}


/* =========================================================
   SURAH READING
========================================================= */

export default function SurahReading() {
  const { id } = useParams();

  const navigate = useNavigate();

  const location = useLocation();

  const surahNumber = Number(id);


  /* =========================================================
     SAVED PAGE NAVIGATION STATE
  ========================================================= */

  const navigationSavedAyah =
    location.state?.savedAyah ||
    null;


  /* =========================================================
     KHATM CONTEXT
  ========================================================= */

  const {
    getQuranBookmarks,
    saveQuranBookmark,
    deleteReadingProgress,
  } = useKhatms();


  /* =========================================================
     STATE
  ========================================================= */

  const [
    surah,
    setSurah,
  ] = useState(null);

  const [
    error,
    setError,
  ] = useState(null);

  const [
    tab,
    setTab,
  ] = useState("quran");


  /*
   * Existing top-right bookmark.
   * Kept unchanged.
   */

  const [
    bookmarked,
    setBookmarked,
  ] = useState(false);


  const [
    fontSize,
    setFontSize,
  ] = useState(23);


  const [
    selectedAyah,
    setSelectedAyah,
  ] = useState(null);


  /*
   * Backend saved Quran bookmark
   * for the current Surah.
   */

  const [
    savedAyah,
    setSavedAyah,
  ] = useState(null);


  const [
    loadingBookmark,
    setLoadingBookmark,
  ] = useState(false);


  const [
    savingBookmark,
    setSavingBookmark,
  ] = useState(false);


  const [
    deletingBookmark,
    setDeletingBookmark,
  ] = useState(false);


  /*
   * ========================================
   * AUTO SCROLL REF
   * ========================================
   */

  const hasAutoScrolledRef =
    useRef(false);


  /* =========================================================
     AUDIO
  ========================================================= */

  const {
    playingAyah,
    playingSurah,
    toggle: toggleAyahAudio,
    toggleSurah,
    reset: resetAudio,
  } = useAyahAudio();


  /* =========================================================
     LOAD SURAH
  ========================================================= */

  const load =
    useCallback(() => {
      if (
        !Number.isInteger(
          surahNumber,
        ) ||
        surahNumber < 1 ||
        surahNumber >
          TOTAL_SURAHS
      ) {
        setSurah(null);

        setError(
          "Invalid Surah number.",
        );

        return;
      }

      setError(null);

      setSurah(null);

      fetchSurah(
        surahNumber,
      )
        .then(setSurah)
        .catch((e) => {
          setError(
            e.message ||
              "Failed to load Surah.",
          );
        });
    }, [
      surahNumber,
    ]);


  /* =========================================================
     RESET WHEN SURAH CHANGES
  ========================================================= */

  useEffect(() => {
    hasAutoScrolledRef.current =
      false;

    window.scrollTo(
      0,
      0,
    );

    resetAudio();

    setSelectedAyah(null);

    setSavedAyah(null);

    load();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);


  /* =========================================================
     LOAD QURAN BOOKMARK
  ========================================================= */

  useEffect(() => {
    if (!surahNumber) {
      return;
    }

    let cancelled =
      false;

    async function loadBookmark() {
      try {
        setLoadingBookmark(
          true,
        );

        const bookmarks =
          await getQuranBookmarks();

        if (cancelled) {
          return;
        }

        const currentBookmark =
          bookmarks.find(
            (bookmark) =>
              Number(
                bookmark.surahNumber,
              ) ===
              surahNumber,
          );

        if (currentBookmark) {
          setSavedAyah(
            currentBookmark,
          );

          localStorage.removeItem(
            `quran-reading-progress-surah-${surahNumber}`,
          );

          return;
        }


        /*
         * ====================================
         * LEGACY LOCALSTORAGE FALLBACK
         * ====================================
         */

        const storageKey =
          `quran-reading-progress-surah-${surahNumber}`;

        const saved =
          localStorage.getItem(
            storageKey,
          );

        if (!saved) {
          setSavedAyah(
            null,
          );

          return;
        }

        try {
          const parsed =
            JSON.parse(
              saved,
            );

          setSavedAyah(
            parsed,
          );
        } catch (
          storageError
        ) {
          console.error(
            "Failed to load old reading progress:",
            storageError,
          );

          setSavedAyah(
            null,
          );
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load Quran bookmark:",
          error.message,
        );


        /*
         * Preserve old localStorage
         * behavior if backend fails.
         */

        const storageKey =
          `quran-reading-progress-surah-${surahNumber}`;

        const saved =
          localStorage.getItem(
            storageKey,
          );

        if (!saved) {
          setSavedAyah(
            null,
          );

          return;
        }

        try {
          const parsed =
            JSON.parse(
              saved,
            );

          setSavedAyah(
            parsed,
          );
        } catch (
          storageError
        ) {
          console.error(
            "Failed to load local reading progress:",
            storageError,
          );

          setSavedAyah(
            null,
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingBookmark(
            false,
          );
        }
      }
    }

    loadBookmark();

    return () => {
      cancelled = true;
    };
  }, [
    surahNumber,
    getQuranBookmarks,
  ]);


  /* =========================================================
     AUTO SCROLL TO SAVED AYAH
  ========================================================= */

  useEffect(() => {
    if (
      !surah ||
      loadingBookmark ||
      tab !== "quran" ||
      hasAutoScrolledRef.current
    ) {
      return;
    }

    /*
     * Priority:
     *
     * 1. Saved page navigation
     * 2. Current Surah saved bookmark
     */

    const ayahToScroll =
      navigationSavedAyah ||
      savedAyah;

    if (
      !ayahToScroll?.ayahNumber
    ) {
      return;
    }

    const targetId =
      `surah-ayah-${surahNumber}-${ayahToScroll.ayahNumber}`;

    const timer =
      window.setTimeout(() => {
        const element =
          document.getElementById(
            targetId,
          );

        if (!element) {
          console.warn(
            "Saved Surah bookmark element not found:",
            targetId,
          );

          return;
        }

        const headerOffset =
          120;

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
          behavior:
            "smooth",
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
    surah,
    savedAyah,
    navigationSavedAyah,
    loadingBookmark,
    tab,
    surahNumber,
  ]);


  /* =========================================================
     SURAH HEADER AUDIO
  ========================================================= */

  const handleSurahHeaderAudio =
    () => {
      if (!surah) {
        return;
      }

      /*
       * This page already has the
       * COMPLETE Surah loaded.
       *
       * So the header plays the
       * complete Surah directly.
       */

      const currentSurahNumber =
        surah.number ??
        surahNumber;

      toggleSurah(
        currentSurahNumber,
        surah.ayahs,
      );
    };


  /* =========================================================
     BACK NAVIGATION
  ========================================================= */

  const handleBack = () => {
    navigate(
      "/quran",
      {
        state: {
          activeTab:
            "surah",
        },
      },
    );
  };


  /* =========================================================
     SURAH NAVIGATION
  ========================================================= */

  const goTo =
    (delta) => {
      const target =
        surahNumber +
        delta;

      if (
        target >= 1 &&
        target <=
          TOTAL_SURAHS
      ) {
        navigate(
          `/quran/surah/${target}`,
        );
      }
    };


  /* =========================================================
     SELECT AYAH
  ========================================================= */

  const handleAyahClick =
    (ayah) => {
      setSelectedAyah({
        number:
          ayah.number,

        globalNumber:
          ayah.globalNumber,
      });
    };


  /* =========================================================
     SAVE QURAN BOOKMARK
  ========================================================= */

  const handleSetReadingProgress =
    async () => {
      if (!selectedAyah) {
        return;
      }

      try {
        setSavingBookmark(
          true,
        );

        const progress =
          await saveQuranBookmark({
            surahNumber,

            ayahNumber:
              selectedAyah.number,

            globalAyahNumber:
              selectedAyah.globalNumber,
          });

        setSavedAyah(
          progress,
        );

        localStorage.removeItem(
          `quran-reading-progress-surah-${surahNumber}`,
        );

        setSelectedAyah(
          null,
        );
      } catch (error) {
        console.error(
          "Failed to save Quran bookmark:",
          error.message,
        );
      } finally {
        setSavingBookmark(
          false,
        );
      }
    };


  /* =========================================================
     DELETE QURAN BOOKMARK
  ========================================================= */

  const handleClearReadingProgress =
    async () => {
      /*
       * Legacy localStorage bookmark.
       */

      if (!savedAyah?._id) {
        const storageKey =
          `quran-reading-progress-surah-${surahNumber}`;

        localStorage.removeItem(
          storageKey,
        );

        setSavedAyah(
          null,
        );

        setSelectedAyah(
          null,
        );

        return;
      }

      try {
        setDeletingBookmark(
          true,
        );

        await deleteReadingProgress(
          savedAyah._id,
        );

        setSavedAyah(
          null,
        );

        setSelectedAyah(
          null,
        );
      } catch (error) {
        console.error(
          "Failed to delete Quran bookmark:",
          error.message,
        );
      } finally {
        setDeletingBookmark(
          false,
        );
      }
    };


  /* =========================================================
     SURAH INFORMATION
  ========================================================= */

  const revelationArabic =
    surah?.revelationType ===
    "Meccan"
      ? "مَكِّيَّة"
      : "مَدَنِيَّة";


  const shouldShowBismillah =
    surah &&
    surah.number !== 1 &&
    surah.number !== 9;


  const isThisSurahPlaying =
    playingSurah ===
    (
      surah?.number ??
      surahNumber
    );


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-cream flex flex-col">

      {/* =========================
          TOP HEADER
      ========================= */}

      <div className="sticky top-0 z-20 bg-cream/90 backdrop-blur px-5 pt-4 pb-2">

        <div className="flex items-center justify-between mb-4">

          {/* BACK */}

          <button
            onClick={
              handleBack
            }
            className="w-10 h-10 rounded-full bg-emerald-soft flex items-center justify-center"
          >
            <ChevronLeft
              size={20}
              className="text-emerald-deep"
            />
          </button>


          {/* TITLE */}

          <div className="text-center">

            <h1 className="font-display text-lg font-medium text-ink">
              {
                surah?.name ||
                `Surah ${surahNumber}`
              }
            </h1>

            <p className="text-xs text-ink-soft">
              {surah
                ? `${surah.verses} Ayahs`
                : "\u00A0"}
            </p>

          </div>


          {/* TOP RIGHT BOOKMARK */}

          <button
            onClick={() =>
              setBookmarked(
                (b) => !b,
              )
            }
            className="w-10 h-10 rounded-full bg-emerald-soft flex items-center justify-center"
          >
            <Bookmark
              size={18}
              className={
                bookmarked
                  ? "text-gold fill-gold"
                  : "text-emerald-deep"
              }
            />
          </button>

        </div>


        {/* QURAN / TRANSLATION */}

        <div className="flex items-center gap-1.5 bg-emerald-soft/60 p-1 rounded-full mb-1">

          {[
            "quran",
            "translation",
          ].map(
            (t) => (
              <button
                key={t}
                onClick={() =>
                  setTab(t)
                }
                className={`flex-1 text-[13px] font-semibold py-2 rounded-full capitalize transition-colors ${
                  tab === t
                    ? "bg-emerald text-cream shadow-soft"
                    : "text-emerald-deep/70"
                }`}
              >
                {t}
              </button>
            ),
          )}

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
        ) : !surah ? (
          <QuranLoading
            label={`Loading Surah ${surahNumber}...`}
          />
        ) : tab === "quran" ? (

          <MushafFrame>

            {/* =============================================
                REUSABLE SURAH HEADER
            ============================================== */}

            <div className="mb-4">
              <SurahHeader
                number={
                  surah.number
                }

                arabicName={
                  surah.arabicName
                }

                revelationTypeArabic={
                  revelationArabic
                }

                ayahCount={
                  surah.verses
                }

                rukuCount={
                  surah.totalRukus
                }

                revelationOrder={
                  surah.revelationOrder
                }

                isPlaying={
                  isThisSurahPlaying
                }

                onClick={
                  handleSurahHeaderAudio
                }
              />
            </div>


            {/* =============================================
                BISMILLAH
            ============================================== */}

            {shouldShowBismillah && (
              <p className="font-quran font-bold text-[24px] leading-relaxed text-center text-emerald-deep mb-5">
                {BISMILLAH}
              </p>
            )}


            {/* =============================================
                CONTINUOUS AYAH FLOW
            ============================================== */}

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

              {surah.ayahs.map(
                (ayah) => {

                  const isSavedAyah =
                    savedAyah &&
                    Number(
                      savedAyah.ayahNumber,
                    ) ===
                      Number(
                        ayah.number,
                      );


                  const isPlaying =
                    playingAyah ===
                    ayah.globalNumber;


                  const isFirstAyah =
                    ayah.number === 1;


                  const displayAyahText =
                    shouldShowBismillah &&
                    isFirstAyah
                      ? removeBismillah(
                          ayah.arabic,
                        )
                      : ayah.arabic;


                  return (
                    <span
                      key={
                        ayah.number
                      }
                      id={`surah-ayah-${surahNumber}-${ayah.number}`}
                      className="inline"
                    >

                      {/* AYAH TEXT */}

                      <span
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          handleAyahClick(
                            ayah,
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
                          displayAyahText
                        }
                      </span>


                      {/* SAVED BOOKMARK */}

                      {isSavedAyah && (
                        <span
                          dir="ltr"
                          className="inline-flex items-center justify-center align-middle mx-1"
                        >
                          <Bookmark
                            size={14}
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
                            size={16}
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

          </MushafFrame>

        ) : (

          /* =========================
              TRANSLATION
          ========================= */

          <div className="space-y-5">

            {/* SAME SURAH HEADER */}

            <SurahHeader
              number={
                surah.number
              }

              arabicName={
                surah.arabicName
              }

              revelationTypeArabic={
                revelationArabic
              }

              ayahCount={
                surah.verses
              }

              rukuCount={
                surah.totalRukus
              }

              revelationOrder={
                surah.revelationOrder
              }

              isPlaying={
                isThisSurahPlaying
              }

              onClick={
                handleSurahHeaderAudio
              }
            />


            <div className="space-y-5">
              {surah.ayahs.map(
                (ayah) => (
                  <div
                    key={
                      ayah.number
                    }
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

          </div>
        )}


        {/* =========================
            FONT SIZE
        ========================= */}

        {surah &&
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
                className="w-7 h-7 rounded-full bg-emerald-soft text-emerald-deep text-xs font-bold flex items-center justify-center"
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
          onClick={() =>
            goTo(-1)
          }
          disabled={
            surahNumber <= 1
          }
          className="flex items-center gap-1 text-sm font-semibold text-emerald-deep disabled:opacity-30"
        >
          <ChevronLeft
            size={16}
          />

          Previous
        </button>


        <span className="text-xs text-ink-faint">
          {surahNumber} /{" "}
          {TOTAL_SURAHS}
        </span>


        <button
          onClick={() =>
            goTo(1)
          }
          disabled={
            surahNumber >=
            TOTAL_SURAHS
          }
          className="flex items-center gap-1 text-sm font-semibold text-emerald-deep disabled:opacity-30"
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