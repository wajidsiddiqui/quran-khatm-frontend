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
  Play,
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

function removeBismillah(
  text = "",
) {
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

function toArabicNumber(
  number,
) {
  return String(number)
    .split("")
    .map(
      (digit) =>
        "٠١٢٣٤٥٦٧٨٩"[digit],
    )
    .join("");
}


/* =========================================================
   MOBILE SURAH HEADER
========================================================= */

function MobileSurahHeader({
  surah,
  revelationArabic,
  isPlaying,
  onAudio,
}) {
  return (
    <div
      className="
        sm:hidden
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-gold/35
        bg-[#FFFDF8]
        shadow-card
      "
    >

      {/* =====================================================
          FIVE BOX HEADER

          Ruku
          Revelation Order
          Surah Name
          Revelation Type
          Ayahs
      ====================================================== */}

      <div
        className="
          grid
          w-full
          grid-cols-[0.9fr_0.9fr_1.55fr_0.9fr_0.9fr]
        "
      >

        {/* =================================================
            1. RUKU
        ================================================== */}

        <div
          className="
            min-w-0
            border-r
            border-gold/25
            px-1.5
            py-3
            text-center
          "
        >

          <p
            className="
              text-[7px]
              leading-3
              uppercase
              tracking-[0.08em]
              text-ink-faint
            "
          >
            Ruku
          </p>


          <div
            className="
              mx-auto
              mt-1
              flex
              h-5
              w-5
              items-center
              justify-center
              rounded-full
              border
              border-gold/60
              text-[10px]
              font-medium
              text-gold
            "
          >
            ع
          </div>


          <p
            className="
              mt-1
              text-[12px]
              font-semibold
              leading-4
              text-emerald-deep
            "
          >
            {
              surah.totalRukus ??
              "—"
            }
          </p>

        </div>


        {/* =================================================
            2. REVELATION ORDER
        ================================================== */}

        <div
          className="
            min-w-0
            border-r
            border-gold/25
            px-1.5
            py-3
            text-center
          "
        >

          <p
            className="
              text-[7px]
              leading-3
              text-ink-faint
            "
          >
            Revelation
          </p>

          <p
            className="
              text-[7px]
              leading-3
              text-ink-faint
            "
          >
            Order
          </p>


          <p
            className="
              mt-2
              text-[13px]
              font-semibold
              leading-4
              text-emerald-deep
            "
          >
            {
              surah.revelationOrder ??
              "—"
            }
          </p>

        </div>


        {/* =================================================
            3. SURAH NAME
        ================================================== */}

        <div
          className="
            relative
            min-w-0
            border-r
            border-gold/25
            bg-[#FBF9F1]
            px-1.5
            py-2.5
            text-center
          "
        >

          {/* PLAY BUTTON */}

          <button
            type="button"
            onClick={
              onAudio
            }
            className="
              absolute
              right-1.5
              top-1.5
              flex
              h-6
              w-6
              items-center
              justify-center
              rounded-full
              bg-emerald-soft
              text-emerald-deep
            "
            aria-label={
              isPlaying
                ? "Stop Surah audio"
                : "Play Surah audio"
            }
          >

            {isPlaying ? (
              <Volume2
                size={12}
              />
            ) : (
              <Play
                size={11}
                fill="currentColor"
                className="ml-0.5"
              />
            )}

          </button>


          {/* ARABIC NAME */}

          <p
            dir="rtl"
            className="
              mt-4
              font-quran
              text-[16px]
              font-bold
              leading-7
              text-emerald-deep
              break-words
            "
          >
            {
              surah.arabicName
            }
          </p>


          {/* ENGLISH NAME */}

          <p
            className="
              mt-1
              truncate
              text-[8px]
              font-medium
              text-ink-soft
            "
          >
            {
              surah.name
            }
          </p>

        </div>


        {/* =================================================
            4. REVELATION TYPE
        ================================================== */}

        <div
          className="
            min-w-0
            border-r
            border-gold/25
            px-1
            py-3
            text-center
          "
        >

          <p
            className="
              text-[7px]
              uppercase
              tracking-[0.05em]
              text-ink-faint
            "
          >
            Revelation
          </p>


          <p
            dir="rtl"
            className="
              mt-2
              font-quran
              text-[12px]
              font-bold
              leading-5
              text-emerald-deep
            "
          >
            {
              revelationArabic
            }
          </p>

        </div>


        {/* =================================================
            5. AYAHS
        ================================================== */}

        <div
          className="
            min-w-0
            px-1.5
            py-3
            text-center
          "
        >

          <p
            className="
              text-[7px]
              leading-3
              text-ink-faint
            "
          >
            Number of
          </p>

          <p
            className="
              text-[7px]
              leading-3
              text-ink-faint
            "
          >
            Ayahs
          </p>


          <p
            className="
              mt-2
              text-[14px]
              font-semibold
              leading-4
              text-emerald-deep
            "
          >
            {
              surah.verses
            }
          </p>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   SURAH READING
========================================================= */

export default function SurahReading() {
  const {
    id,
  } = useParams();


  const navigate =
    useNavigate();


  const location =
    useLocation();


  const surahNumber =
    Number(id);


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


  const [
    bookmarked,
    setBookmarked,
  ] = useState(false);


  /*
   * Existing font size feature.
   *
   * Starts slightly smaller for comfortable
   * mobile reading but A-/A+ still works.
   */

  const [
    fontSize,
    setFontSize,
  ] = useState(22);


  const [
    selectedAyah,
    setSelectedAyah,
  ] = useState(null);


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


  /* =========================================================
     AUTO SCROLL REF
  ========================================================= */

  const hasAutoScrolledRef =
    useRef(false);


  /* =========================================================
     AUDIO
  ========================================================= */

  const {
    playingAyah,
    playingSurah,
    toggle:
      toggleAyahAudio,
    toggleSurah,
    reset:
      resetAudio,
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


        /* ================================================
           LEGACY LOCALSTORAGE FALLBACK
        ================================================= */

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

      } catch (
        error
      ) {
        if (cancelled) {
          return;
        }


        console.error(
          "Failed to load Quran bookmark:",
          error.message,
        );


        /* ================================================
           PRESERVE LOCALSTORAGE FALLBACK
        ================================================= */

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
     * 1. Saved navigation state
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


        const isMobile =
          window.innerWidth <
          640;


        const headerOffset =
          isMobile
            ? 100
            : 120;


        const elementPosition =
          element
            .getBoundingClientRect()
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

  const handleBack =
    () => {
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
    (
      ayah,
    ) => {
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

      } catch (
        error
      ) {
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

      } catch (
        error
      ) {
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
    <div
      className="
        flex
        min-h-screen
        flex-col
        bg-cream
      "
    >

      {/* =====================================================
          TOP HEADER
          
          UNCHANGED DESIGN
      ====================================================== */}

      <div
        className="
          sticky
          top-0
          z-20
          bg-cream/95
          px-3
          pb-2
          pt-3
          backdrop-blur
          sm:px-5
          sm:pt-4
        "
      >

        <div
          className="
            mb-3
            flex
            items-center
            justify-between
            sm:mb-4
          "
        >

          {/* BACK */}

          <button
            type="button"
            onClick={
              handleBack
            }
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-emerald-soft
              text-emerald-deep
              sm:h-10
              sm:w-10
            "
            aria-label="Back to Quran"
          >

            <ChevronLeft
              size={20}
            />

          </button>


          {/* TITLE */}

          <div
            className="
              min-w-0
              flex-1
              px-3
              text-center
            "
          >

            <h1
              className="
                truncate
                font-display
                text-base
                font-medium
                text-ink
                sm:text-lg
              "
            >
              {
                surah?.name ||
                `Surah ${surahNumber}`
              }
            </h1>


            <p
              className="
                text-[11px]
                text-ink-soft
                sm:text-xs
              "
            >
              {surah
                ? `${surah.verses} Ayahs`
                : "\u00A0"}
            </p>

          </div>


          {/* TOP RIGHT BOOKMARK */}

          <button
            type="button"
            onClick={() =>
              setBookmarked(
                (b) => !b,
              )
            }
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-emerald-soft
              sm:h-10
              sm:w-10
            "
            aria-label="Bookmark Surah"
          >

            <Bookmark
              size={18}
              className={
                bookmarked
                  ? "fill-gold text-gold"
                  : "text-emerald-deep"
              }
            />

          </button>

        </div>


        {/* =================================================
            QURAN / TRANSLATION

            UNCHANGED DESIGN
        ================================================== */}

        <div
          className="
            mb-1
            flex
            w-full
            items-center
            gap-1
            rounded-full
            bg-emerald-soft/60
            p-1
          "
        >

          {[
            "quran",
            "translation",
          ].map(
            (t) => (
              <button
                key={t}
                type="button"
                onClick={() =>
                  setTab(t)
                }
                className={`
                  min-w-0
                  flex-1
                  rounded-full
                  py-2
                  text-[12px]
                  font-semibold
                  capitalize
                  transition-colors
                  sm:text-[13px]
                  ${
                    tab === t
                      ? "bg-emerald text-cream shadow-soft"
                      : "text-emerald-deep/70"
                  }
                `}
              >
                {
                  t
                }
              </button>
            ),
          )}

        </div>

      </div>


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div
        className="
          min-w-0
          flex-1
          overflow-x-hidden
          px-3
          pb-6
          pt-3
          sm:px-5
        "
      >

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

            {/* =================================================
                SURAH INFORMATION HEADER
            ================================================== */}

            <div className="mb-4">

              {/* =================================================
                  DESKTOP / TABLET
                  
                  EXISTING CURRENT DESIGN
                  
                  >= 640px
              ================================================== */}

              <div className="hidden sm:block">

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


              {/* =================================================
                  MOBILE
                  
                  < 640px
                  
                  5 BOX DESIGN
              ================================================== */}

              <MobileSurahHeader
                surah={
                  surah
                }

                revelationArabic={
                  revelationArabic
                }

                isPlaying={
                  isThisSurahPlaying
                }

                onAudio={
                  handleSurahHeaderAudio
                }
              />

            </div>


            {/* =================================================
                BISMILLAH
            ================================================== */}

            {shouldShowBismillah && (
              <p
                dir="rtl"
                className="
                  mb-5
                  px-2
                  text-center
                  font-quran
                  text-[20px]
                  font-bold
                  leading-relaxed
                  text-emerald-deep
                  sm:text-[24px]
                "
              >
                {
                  BISMILLAH
                }
              </p>
            )}


            {/* =================================================
                CONTINUOUS AYAH FLOW
            ================================================== */}

            <div
              dir="rtl"
              className="
                w-full
                min-w-0
                font-quran
                font-bold
                text-[#141414]
              "
              style={{
                fontSize:
                  `${fontSize}px`,

                lineHeight:
                  2.35,

                textAlign:
                  "justify",

                textAlignLast:
                  "right",

                overflowWrap:
                  "anywhere",

                wordBreak:
                  "normal",
              }}
            >

              {surah.ayahs.map(
                (
                  ayah,
                ) => {

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

                      {/* =====================================
                          AYAH TEXT
                      ====================================== */}

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
                        className={`
                          inline
                          cursor-pointer
                          rounded-md
                          transition-colors
                          ${
                            isSavedAyah
                              ? "bg-emerald-soft/80 text-emerald-deep"
                              : "hover:bg-emerald-soft/40"
                          }
                        `}
                        aria-label={`Set reading progress at ayah ${ayah.number}`}
                      >
                        {
                          displayAyahText
                        }
                      </span>


                      {/* =====================================
                          SAVED BOOKMARK
                      ====================================== */}

                      {isSavedAyah && (
                        <span
                          dir="ltr"
                          className="
                            mx-1
                            inline-flex
                            items-center
                            justify-center
                            align-middle
                          "
                        >

                          <Bookmark
                            size={14}
                            className="
                              fill-gold
                              text-gold
                            "
                          />

                        </span>
                      )}


                      {/* =====================================
                          AYAH AUDIO / NUMBER
                      ====================================== */}

                      <button
                        type="button"
                        onClick={() =>
                          toggleAyahAudio(
                            ayah.globalNumber,
                          )
                        }
                        className="
                          mx-1
                          inline-flex
                          items-center
                          justify-center
                          align-middle
                          text-gold
                          transition-opacity
                          hover:opacity-70
                        "
                        aria-label={`Play recitation for ayah ${ayah.number}`}
                      >

                        {isPlaying ? (
                          <Volume2
                            size={
                              Math.max(
                                fontSize -
                                  7,
                                15,
                              )
                            }
                            className="text-gold"
                          />
                        ) : (
                          <span
                            className="
                              font-quran
                              text-gold
                            "
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
                            {
                              toArabicNumber(
                                ayah.number,
                              )
                            }
                            ﴾
                          </span>
                        )}

                      </button>


                      {" "}

                    </span>
                  );
                },
              )}

            </div>

          </MushafFrame>

        ) : (

          /* =================================================
              TRANSLATION
          ================================================== */

          <div className="space-y-5">

            {/* DESKTOP/TABLET HEADER */}

            <div className="hidden sm:block">

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


            {/* MOBILE HEADER */}

            <div className="sm:hidden">

              <MobileSurahHeader
                surah={
                  surah
                }

                revelationArabic={
                  revelationArabic
                }

                isPlaying={
                  isThisSurahPlaying
                }

                onAudio={
                  handleSurahHeaderAudio
                }
              />

            </div>


            {/* TRANSLATION CONTENT */}

            <div className="space-y-5">

              {surah.ayahs.map(
                (
                  ayah,
                ) => (
                  <div
                    key={
                      ayah.number
                    }
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >

                    <span
                      className="
                        mt-0.5
                        flex
                        h-6
                        w-6
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-gold/40
                        text-xs
                        text-gold
                      "
                    >
                      {
                        ayah.number
                      }
                    </span>


                    <p
                      className="
                        min-w-0
                        text-[14px]
                        leading-relaxed
                        text-ink
                        sm:text-[15px]
                      "
                    >
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


        {/* =================================================
            FONT SIZE
        ================================================== */}

        {surah &&
          tab === "quran" && (
            <div
              className="
                mt-6
                flex
                items-center
                justify-center
                gap-3
                pb-2
              "
            >

              <span className="text-xs text-ink-faint">
                Font Size
              </span>


              <button
                type="button"
                onClick={() =>
                  setFontSize(
                    (f) =>
                      Math.max(
                        18,
                        f - 2,
                      ),
                  )
                }
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-emerald-soft
                  text-xs
                  font-bold
                  text-emerald-deep
                "
              >
                A-
              </button>


              <span
                className="
                  min-w-7
                  text-center
                  text-[11px]
                  text-ink-faint
                "
              >
                {
                  fontSize
                }
              </span>


              <button
                type="button"
                onClick={() =>
                  setFontSize(
                    (f) =>
                      Math.min(
                        34,
                        f + 2,
                      ),
                  )
                }
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-emerald-soft
                  text-xs
                  font-bold
                  text-emerald-deep
                "
              >
                A+
              </button>

            </div>
          )}

      </div>


      {/* =====================================================
          BOTTOM NAVIGATION
      ====================================================== */}

      <div
        className="
          sticky
          bottom-0
          z-20
          flex
          items-center
          justify-between
          border-t
          border-emerald-deep/8
          bg-cream/95
          px-3
          py-3.5
          backdrop-blur
          sm:px-5
          sm:py-4
        "
      >

        {/* PREVIOUS */}

        <button
          type="button"
          onClick={() =>
            goTo(-1)
          }
          disabled={
            surahNumber <= 1
          }
          className="
            flex
            items-center
            gap-1
            text-sm
            font-semibold
            text-emerald-deep
            disabled:opacity-30
          "
        >

          <ChevronLeft
            size={16}
          />

          <span className="hidden sm:inline">
            Previous
          </span>

          <span className="sm:hidden">
            Prev
          </span>

        </button>


        {/* POSITION */}

        <span
          className="
            px-3
            text-xs
            text-ink-faint
          "
        >
          {surahNumber} /{" "}
          {TOTAL_SURAHS}
        </span>


        {/* NEXT */}

        <button
          type="button"
          onClick={() =>
            goTo(1)
          }
          disabled={
            surahNumber >=
            TOTAL_SURAHS
          }
          className="
            flex
            items-center
            gap-1
            text-sm
            font-semibold
            text-emerald-deep
            disabled:opacity-30
          "
        >

          <span>
            Next
          </span>

          <ChevronRight
            size={16}
          />

        </button>

      </div>


      {/* =====================================================
          READING PROGRESS SHEET
      ====================================================== */}

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

            <div
              className="
                mx-auto
                mb-4
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-emerald-soft
              "
            >

              <Bookmark
                size={21}
                className="text-gold"
              />

            </div>


            <h3
              className="
                mb-1
                font-display
                text-xl
                font-semibold
                text-ink
              "
            >
              Ayah{" "}
              {
                selectedAyah.number
              }
            </h3>


            <p className="mb-6 text-sm text-ink-soft">
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