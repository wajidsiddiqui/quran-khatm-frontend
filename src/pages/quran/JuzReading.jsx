import {
  useParams,
  useNavigate,
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


/* =========================================================
   ARABIC NUMBER
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
     
   Used only below 640px.

   Desktop/tablet continues using the existing
   reusable SurahHeader component.
========================================================= */

function MobileSurahHeader({
  group,
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
              group.totalRukus ??
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
              group.revelationOrder ??
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

          {/* AUDIO */}

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
              group.surahArabicName
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
              group.surahName ??
              `Surah ${group.surahNumber}`
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
              group.revelationTypeArabic
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
              group.totalVerses ??
              group.ayahs?.length ??
              "—"
            }
          </p>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   JUZ READING
========================================================= */

export default function JuzReading() {
  const {
    num,
  } = useParams();


  const navigate =
    useNavigate();


  const juzNumber =
    Number(num);


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
    juz,
    setJuz,
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
    fontSize,
    setFontSize,
  ] = useState(23);


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
     AUTO SCROLL
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
     LOAD JUZ
  ========================================================= */

  const load =
    useCallback(() => {
      if (
        !Number.isInteger(
          juzNumber,
        ) ||
        juzNumber < 1 ||
        juzNumber >
          TOTAL_JUZ
      ) {
        setJuz(null);

        setError(
          "Invalid Juz number.",
        );

        return;
      }


      setError(null);

      setJuz(null);


      fetchJuz(
        juzNumber,
      )
        .then(setJuz)
        .catch((e) => {
          setError(
            e.message ||
              "Failed to load Juz.",
          );
        });

    }, [
      juzNumber,
    ]);


  /* =========================================================
     RESET WHEN JUZ CHANGES
  ========================================================= */

  useEffect(() => {
    hasAutoScrolledRef.current =
      false;


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


  /* =========================================================
     LOAD SAVED QURAN BOOKMARK
  ========================================================= */

  useEffect(() => {
    if (
      !juzNumber ||
      !juz
    ) {
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


        const juzAyahs =
          juz.surahGroups.flatMap(
            (
              group,
            ) =>
              group.ayahs,
          );


        const currentBookmark =
          bookmarks.find(
            (
              bookmark,
            ) =>
              juzAyahs.some(
                (
                  ayah,
                ) =>
                  Number(
                    ayah.globalNumber,
                  ) ===
                  Number(
                    bookmark.globalAyahNumber,
                  ),
              ),
          );


        setSavedAyah(
          currentBookmark ||
            null,
        );

      } catch (
        error
      ) {
        if (cancelled) {
          return;
        }


        console.error(
          "Failed to load Juz bookmark:",
          error.message,
        );


        setSavedAyah(
          null,
        );

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
    juz,
    juzNumber,
    getQuranBookmarks,
  ]);


  /* =========================================================
     AUTO SCROLL TO SAVED AYAH
  ========================================================= */

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
    juz,
    savedAyah,
    loadingBookmark,
    tab,
    juzNumber,
  ]);


  /* =========================================================
     PLAY COMPLETE SURAH FROM HEADER
  ========================================================= */

  const handleSurahHeaderAudio =
    async (
      group,
    ) => {
      /*
       * If already playing, toggle it off.
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
         * Juz may contain only part of
         * the Surah, therefore fetch the
         * complete Surah for audio.
         */

        const fullSurah =
          await fetchSurah(
            group.surahNumber,
          );


        toggleSurah(
          group.surahNumber,
          fullSurah.ayahs,
        );

      } catch (
        error
      ) {
        console.error(
          "Failed to load full Surah audio:",
          error.message,
        );
      }
    };


  /* =========================================================
     SELECT AYAH
  ========================================================= */

  const handleAyahClick =
    (
      ayah,
      group,
    ) => {
      setSelectedAyah({
        number:
          ayah.number,

        globalNumber:
          ayah.globalNumber,

        surahNumber:
          group.surahNumber,
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
            surahNumber:
              selectedAyah.surahNumber,

            ayahNumber:
              selectedAyah.number,

            globalAyahNumber:
              selectedAyah.globalNumber,
          });


        setSavedAyah(
          progress,
        );


        setSelectedAyah(
          null,
        );

      } catch (
        error
      ) {
        console.error(
          "Failed to save Juz bookmark:",
          error.message,
        );

      } finally {
        setSavingBookmark(
          false,
        );
      }
    };


  /* =========================================================
     DELETE BOOKMARK
  ========================================================= */

  const handleClearReadingProgress =
    async () => {
      if (!savedAyah?._id) {
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
          "Failed to delete Juz bookmark:",
          error.message,
        );

      } finally {
        setDeletingBookmark(
          false,
        );
      }
    };


  /* =========================================================
     JUZ NAVIGATION
  ========================================================= */

  const goTo =
    (delta) => {
      const target =
        juzNumber +
        delta;


      if (
        target >= 1 &&
        target <=
          TOTAL_JUZ
      ) {
        navigate(
          `/quran/juz/${target}/read`,
        );
      }
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
              "juz",
          },
        },
      );
    };


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
          
          SAME DESIGN / RESPONSIVE WIDTH
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
            aria-label="Back to Quran"
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
              transition-opacity
              hover:opacity-80
              sm:h-10
              sm:w-10
            "
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
              Juz{" "}
              {juzNumber}
            </h1>


            <p
              className="
                text-[11px]
                text-ink-soft
                sm:text-xs
              "
            >
              {juz
                ? `${juz.totalAyahs} Ayahs`
                : "\u00A0"}
            </p>

          </div>


          {/* BOOKMARK INDICATOR */}

          <div
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
          >

            <Bookmark
              size={18}
              className={
                savedAyah
                  ? "fill-gold text-gold"
                  : "text-emerald-deep"
              }
            />

          </div>

        </div>


        {/* =================================================
            QURAN / TRANSLATION
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

          <button
            type="button"
            onClick={() =>
              setTab(
                "quran",
              )
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
                tab === "quran"
                  ? "bg-emerald text-cream shadow-soft"
                  : "text-emerald-deep/70"
              }
            `}
          >
            Quran
          </button>


          <button
            type="button"
            onClick={() =>
              setTab(
                "translation",
              )
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
                tab === "translation"
                  ? "bg-emerald text-cream shadow-soft"
                  : "text-emerald-deep/70"
              }
            `}
          >
            Translation
          </button>

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
            onRetry={
              load
            }
          />
        ) : !juz ? (
          <QuranLoading
            label={`Loading Juz ${juzNumber}...`}
          />
        ) : tab === "quran" ? (

          <MushafFrame>

            {/* =================================================
                JUZ HEADER
            ================================================== */}

            <div
              className="
                relative
                mb-5
                rounded-[10px]
                border
                border-gold/60
                bg-[#FFFDF8]
                px-3
                pb-4
                pt-6
                sm:px-4
              "
            >

              {/* JUZ LABEL */}

              <div
                className="
                  absolute
                  left-1/2
                  top-0
                  -translate-x-1/2
                  -translate-y-1/2
                  whitespace-nowrap
                  rounded-full
                  border
                  border-gold/50
                  bg-[#FFFDF8]
                  px-4
                  py-1
                "
              >

                <span
                  className="
                    text-[11px]
                    font-bold
                    text-emerald-deep
                  "
                >
                  Juz{" "}
                  {juzNumber}
                </span>

              </div>


              {/* JUZ SUMMARY */}

              <div
                className="
                  mt-1
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >

                <span
                  className="
                    text-[10px]
                    text-ink-soft
                    sm:text-[11px]
                  "
                >
                  {
                    juz.totalAyahs
                  }{" "}
                  Ayahs
                </span>


                <span className="h-1 w-1 rounded-full bg-gold" />


                <span
                  className="
                    text-[10px]
                    text-ink-soft
                    sm:text-[11px]
                  "
                >
                  {
                    juz.surahGroups.length
                  }{" "}
                  Surahs
                </span>

              </div>

            </div>


            {/* =================================================
                AYAH FLOW
            ================================================== */}

            {juz.surahGroups.map(
              (
                group,
              ) => {

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
                    className="
                      mb-7
                      last:mb-0
                    "
                  >

                    {/* =================================================
                        SURAH HEADER
                    ================================================== */}

                    {isSurahBeginning && (
                      <div
                        className="
                          mb-4
                          min-w-0
                        "
                      >

                        {/* =========================================
                            DESKTOP / TABLET

                            Existing current design.
                            >= 640px
                        ========================================== */}

                        <div className="hidden sm:block">

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


                        {/* =========================================
                            MOBILE

                            Same 5-box compact design.
                            < 640px
                        ========================================== */}

                        <MobileSurahHeader
                          group={
                            group
                          }

                          isPlaying={
                            isThisSurahPlaying
                          }

                          onAudio={() =>
                            handleSurahHeaderAudio(
                              group,
                            )
                          }
                        />

                      </div>
                    )}


                    {/* =================================================
                        ARABIC FLOW
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

                      {group.ayahs.map(
                        (
                          ayah,
                        ) => {

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
                                  ayah.arabic
                                }
                              </span>


                              {/* SAVED BOOKMARK */}

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


                              {/* AYAH AUDIO */}

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

                  </section>
                );
              },
            )}

          </MushafFrame>

        ) : (

          /* =================================================
              TRANSLATION
          ================================================== */

          <div
            className="
              space-y-8
            "
          >

            {juz.surahGroups.map(
              (
                group,
              ) => {

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

                    {/* DESKTOP / TABLET HEADER */}

                    {isSurahBeginning && (
                      <div className="mb-4">

                        <div className="hidden sm:block">

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


                        {/* MOBILE HEADER */}

                        <MobileSurahHeader
                          group={
                            group
                          }

                          isPlaying={
                            isThisSurahPlaying
                          }

                          onAudio={() =>
                            handleSurahHeaderAudio(
                              group,
                            )
                          }
                        />

                      </div>
                    )}


                    <div
                      className="
                        space-y-5
                      "
                    >

                      {group.ayahs.map(
                        (
                          ayah,
                        ) => (
                          <div
                            key={`${group.surahNumber}-${ayah.number}`}
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

                  </section>
                );
              },
            )}

          </div>
        )}


        {/* =================================================
            FONT SIZE
        ================================================== */}

        {juz &&
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
                aria-label="Decrease font size"
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
                aria-label="Increase font size"
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
            juzNumber <= 1
          }
          className="
            flex
            items-center
            gap-1
            text-sm
            font-semibold
            text-emerald-deep
            transition-opacity
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
          {juzNumber} /{" "}
          {TOTAL_JUZ}
        </span>


        {/* NEXT */}

        <button
          type="button"
          onClick={() =>
            goTo(1)
          }
          disabled={
            juzNumber >=
            TOTAL_JUZ
          }
          className="
            flex
            items-center
            gap-1
            text-sm
            font-semibold
            text-emerald-deep
            transition-opacity
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
          CONTINUE FROM HERE SHEET
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


            <p
              className="
                mb-6
                text-sm
                text-ink-soft
              "
            >
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
                  <span
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >

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
                  className="
                    w-full
                    text-red-500
                  "
                  onClick={
                    handleClearReadingProgress
                  }
                  disabled={
                    savingBookmark ||
                    deletingBookmark
                  }
                >

                  {deletingBookmark ? (
                    <span
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                      "
                    >

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