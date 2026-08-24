import {
  PlusCircle,
  Layers,
  BookOpen,
  BarChart3,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  useKhatms,
} from "../../context/KhatmContext";

import {
  paraProgress,
} from "../../data/mockData";

import {
  useParaProgress,
} from "../../hooks/useParaProgress";

import {
  fetchSurah,
  fetchJuz,
  getParaBoundary,
} from "../../services/quranApi";

import HomeHeader from "../../components/home/HomeHeader";

import ContinueReadingCard from "../../components/home/ContinueReadingCard";

import QuickActionCard from "../../components/home/QuickActionCard";

import ActiveKhatmCard from "../../components/home/ActiveKhatmCard";

import ParaProgressCard from "../../components/home/ParaProgressCard";

import ActivityPreview from "../../components/home/ActivityPreview";


const TOTAL_JUZ = 30;


/* =========================================================
   COMPARE QURAN POSITIONS
========================================================= */

function compareQuranPosition(
  a,
  b,
) {
  const aSurah =
    Number(
      a?.surahNumber,
    );

  const bSurah =
    Number(
      b?.surahNumber,
    );

  if (
    aSurah <
    bSurah
  ) {
    return -1;
  }

  if (
    aSurah >
    bSurah
  ) {
    return 1;
  }

  const aAyah =
    Number(
      a?.ayahNumber,
    );

  const bAyah =
    Number(
      b?.ayahNumber,
    );

  if (
    aAyah <
    bAyah
  ) {
    return -1;
  }

  if (
    aAyah >
    bAyah
  ) {
    return 1;
  }

  return 0;
}


/* =========================================================
   FIND APPLICATION JUZ FOR A SAVED QURAN POSITION

   Uses the application's fixed boundaries from quranApi.js.
   ========================================================= */

function findJuzForPosition(
  position,
) {
  for (
    let juzNumber = 1;
    juzNumber <= TOTAL_JUZ;
    juzNumber += 1
  ) {
    const boundary =
      getParaBoundary(
        juzNumber,
      );

    if (!boundary) {
      continue;
    }

    const isAfterStart =
      compareQuranPosition(
        position,
        boundary.start,
      ) >= 0;

    const isBeforeEnd =
      compareQuranPosition(
        position,
        boundary.end,
      ) <= 0;

    if (
      isAfterStart &&
      isBeforeEnd
    ) {
      return juzNumber;
    }
  }

  return null;
}


/* =========================================================
   HOME
========================================================= */

export default function Home() {
  const {
    user,
  } = useAuth();

  const navigate =
    useNavigate();


  /* =========================================================
     KHATM CONTEXT
  ========================================================= */

  const {
    khatms,
    activityLog,
    khatmLoading,
    readingProgress,
    getReadingProgress,
    getQuranBookmarks,
  } = useKhatms();


  /* =========================================================
     LOADING STATES
  ========================================================= */

  const [
    readingProgressLoading,
    setReadingProgressLoading,
  ] = useState(false);

  const [
    quranBookmarkLoading,
    setQuranBookmarkLoading,
  ] = useState(false);

  const [
    quranJuzProgressLoading,
    setQuranJuzProgressLoading,
  ] = useState(false);


  /* =========================================================
     PERSONAL QURAN READING STATE
  ========================================================= */

  const [
    latestQuranBookmark,
    setLatestQuranBookmark,
  ] = useState(null);

  const [
    latestQuranSurah,
    setLatestQuranSurah,
  ] = useState(null);

  const [
    latestQuranJuz,
    setLatestQuranJuz,
  ] = useState(null);


  /* =========================================================
     ACTIVE KHATM
  ========================================================= */

  const activeKhatm =
    khatms.find(
      (khatm) =>
        khatm.status ===
        "active",
    );


  /* =========================================================
     CURRENT USER ID
  ========================================================= */

  const userId =
    String(
      user?._id ||
        user?.id ||
        "",
    );


  /* =========================================================
     GET ALL PARAS BELONGING TO CURRENT USER
  ========================================================= */

  const myParas =
    activeKhatm?.paras?.filter(
      (para) => {
        if (!para.assignedTo) {
          return false;
        }

        const assignedUserId =
          para.assignedTo?._id ||
          para.assignedTo?.id ||
          para.assignedTo;

        return (
          String(
            assignedUserId,
          ) ===
          userId
        );
      },
    ) || [];


  /* =========================================================
     PREFER CLAIMED PARA
  ========================================================= */

  const claimedPara =
    myParas.find(
      (para) =>
        para.status ===
        "claimed",
    );


  /* =========================================================
     IF NO CLAIMED PARA, USE COMPLETED PARA
  ========================================================= */

  const completedPara =
    myParas.find(
      (para) =>
        para.status ===
        "completed",
    );


  /* =========================================================
     MAIN PARA TO SHOW
  ========================================================= */

  const myPara =
    claimedPara ||
    completedPara ||
    null;


  /* =========================================================
     EXISTING KHATM-LEVEL PROGRESS

     KEEPING THIS LOGIC UNCHANGED.
  ========================================================= */

  const progress =
    activeKhatm
      ? paraProgress(
          activeKhatm,
        )
      : null;


  /* =========================================================
     LOAD SAVED KHATM READING PROGRESS

     Existing behavior preserved.
  ========================================================= */

  useEffect(() => {
    if (
      !activeKhatm?._id ||
      !myPara?.number
    ) {
      return;
    }

    let cancelled =
      false;

    async function loadSavedReadingProgress() {
      try {
        setReadingProgressLoading(
          true,
        );

        await getReadingProgress(
          activeKhatm._id,
          myPara.number,
        );
      } catch (
        error
      ) {
        if (!cancelled) {
          console.error(
            "Failed to load reading progress:",
            error.message,
          );
        }
      } finally {
        if (!cancelled) {
          setReadingProgressLoading(
            false,
          );
        }
      }
    }

    loadSavedReadingProgress();

    return () => {
      cancelled = true;
    };

    // getReadingProgress intentionally omitted
    // because Context recreates this function.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeKhatm?._id,
    myPara?.number,
  ]);


  /* =========================================================
     READING PROGRESS FOR CURRENT KHATM JUZ
  ========================================================= */

  const readingProgressForPara =
    activeKhatm &&
    myPara
      ? readingProgress[
          `${activeKhatm._id}-${myPara.number}`
        ] || null
      : null;


  /* =========================================================
     ACTUAL QURAN AYAH-BASED KHATM JUZ PROGRESS
  ========================================================= */

  const {
    completedAyahs,
    totalAyahs,
    percentage,
    loading:
      paraProgressLoading,
  } = useParaProgress(
    myPara?.number,
    readingProgressForPara,
  );


  /* =========================================================
     COMBINE KHATM LOADING STATES
  ========================================================= */

  const isProgressLoading =
    readingProgressLoading ||
    paraProgressLoading;


  /* =========================================================
     LOAD PERSONAL QURAN BOOKMARK

     Bookmark gives us the exact saved Surah + Ayah.
  ========================================================= */

  useEffect(() => {
    let cancelled =
      false;

    async function loadLatestQuranBookmark() {
      try {
        setQuranBookmarkLoading(
          true,
        );

        const bookmarks =
          await getQuranBookmarks();

        if (cancelled) {
          return;
        }

        const latestBookmark =
          Array.isArray(
            bookmarks,
          ) &&
          bookmarks.length > 0
            ? bookmarks[0]
            : null;

        setLatestQuranBookmark(
          latestBookmark,
        );

        /*
         * No saved Quran position.
         */

        if (
          !latestBookmark?.surahNumber
        ) {
          setLatestQuranSurah(
            null,
          );

          setLatestQuranJuz(
            null,
          );

          return;
        }

        /*
         * Fetch complete Surah data.
         * Used for display name + exact metadata.
         */

        const surahData =
          await fetchSurah(
            Number(
              latestBookmark.surahNumber,
            ),
          );

        if (cancelled) {
          return;
        }

        setLatestQuranSurah(
          surahData,
        );
      } catch (
        error
      ) {
        if (!cancelled) {
          console.error(
            "Failed to load Quran bookmark:",
            error.message,
          );

          setLatestQuranBookmark(
            null,
          );

          setLatestQuranSurah(
            null,
          );

          setLatestQuranJuz(
            null,
          );
        }
      } finally {
        if (!cancelled) {
          setQuranBookmarkLoading(
            false,
          );
        }
      }
    }

    loadLatestQuranBookmark();

    return () => {
      cancelled = true;
    };

    // getQuranBookmarks intentionally omitted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  /* =========================================================
     CALCULATE PERSONAL QURAN JUZ PROGRESS

     IMPORTANT:
     This is NOT Khatm progress.

     It is the user's personal Quran position projected
     onto the application's fixed Juz boundaries.
  ========================================================= */

  useEffect(() => {
    if (
      !latestQuranBookmark
    ) {
      setLatestQuranJuz(
        null,
      );

      return;
    }

    let cancelled =
      false;

    async function loadQuranJuzProgress() {
      try {
        setQuranJuzProgressLoading(
          true,
        );

        const savedPosition = {
          surahNumber:
            latestQuranBookmark.surahNumber,

          ayahNumber:
            latestQuranBookmark.ayahNumber,
        };

        /*
         * Find which of our application's
         * fixed Juz boundaries contains
         * this saved Ayah.
         */

        const juzNumber =
          findJuzForPosition(
            savedPosition,
          );

        if (!juzNumber) {
          setLatestQuranJuz(
            null,
          );

          return;
        }

        /*
         * Fetch the exact custom Juz.
         */

        const juzData =
          await fetchJuz(
            juzNumber,
          );

        if (cancelled) {
          return;
        }

        const juzAyahs =
          juzData.surahGroups.flatMap(
            (group) =>
              group.ayahs,
          );

        let savedIndex =
          -1;


        /* ===================================================
           PRIMARY MATCH
           Use global Quran Ayah number.
        =================================================== */

        if (
          latestQuranBookmark.globalAyahNumber
        ) {
          savedIndex =
            juzAyahs.findIndex(
              (ayah) =>
                Number(
                  ayah.globalNumber,
                ) ===
                Number(
                  latestQuranBookmark.globalAyahNumber,
                ),
            );
        }


        /* ===================================================
           FALLBACK MATCH
           Use Surah + Ayah.
        =================================================== */

        if (
          savedIndex < 0
        ) {
          let runningIndex =
            0;

          for (
            const group of
              juzData.surahGroups
          ) {
            const isTargetSurah =
              Number(
                group.surahNumber,
              ) ===
              Number(
                latestQuranBookmark.surahNumber,
              );

            if (
              isTargetSurah
            ) {
              const localIndex =
                group.ayahs.findIndex(
                  (ayah) =>
                    Number(
                      ayah.number,
                    ) ===
                    Number(
                      latestQuranBookmark.ayahNumber,
                    ),
                );

              if (
                localIndex >= 0
              ) {
                savedIndex =
                  runningIndex +
                  localIndex;
              }

              break;
            }

            runningIndex +=
              group.ayahs.length;
          }
        }


        /* ===================================================
           TOTAL JUZ AYAHS
        =================================================== */

        const totalAyahsInJuz =
          Number(
            juzData.totalAyahs,
          ) ||
          juzAyahs.length ||
          0;


        /* ===================================================
           COMPLETED AYAH COUNT

           The saved Ayah itself is treated as
           the current/read position.
        =================================================== */

        const completedAyahsInJuz =
          savedIndex >= 0
            ? savedIndex + 1
            : 0;


        /* ===================================================
           PERCENTAGE
        =================================================== */

        const juzPercentage =
          totalAyahsInJuz > 0
            ? Math.min(
                100,
                Math.round(
                  (completedAyahsInJuz /
                    totalAyahsInJuz) *
                    100,
                ),
              )
            : 0;


        setLatestQuranJuz({
          juzNumber,

          completedAyahs:
            completedAyahsInJuz,

          totalAyahs:
            totalAyahsInJuz,

          percentage:
            juzPercentage,
        });
      } catch (
        error
      ) {
        if (!cancelled) {
          console.error(
            "Failed to calculate Quran Juz progress:",
            error.message,
          );

          setLatestQuranJuz(
            null,
          );
        }
      } finally {
        if (!cancelled) {
          setQuranJuzProgressLoading(
            false,
          );
        }
      }
    }

    loadQuranJuzProgress();

    return () => {
      cancelled = true;
    };
  }, [
    latestQuranBookmark,
  ]);


  /* =========================================================
     CONTINUE KHATM READING

     Existing route preserved.
  ========================================================= */

  const handleContinueKhatm =
    () => {
      if (
        !activeKhatm?._id ||
        !myPara?.number
      ) {
        navigate(
          "/khatms",
        );

        return;
      }

      navigate(
        `/khatm/${activeKhatm._id}/para/${myPara.number}/read`,
      );
    };


  /* =========================================================
     CONTINUE PERSONAL QURAN READING

     Exact saved Surah + Ayah is preserved.
  ========================================================= */

  const handleContinueQuran =
    () => {
      if (
        !latestQuranBookmark
      ) {
        navigate(
          "/quran",
        );

        return;
      }

      const surahNumber =
        Number(
          latestQuranBookmark.surahNumber,
        );

      if (
        !Number.isInteger(
          surahNumber,
        )
      ) {
        navigate(
          "/quran",
        );

        return;
      }

      navigate(
        `/quran/surah/${surahNumber}`,
        {
          state: {
            savedAyah:
              latestQuranBookmark,
          },
        },
      );
    };


  /* =========================================================
     KHATM CARD DATA
  ========================================================= */

  const homeKhatm =
    activeKhatm &&
    myPara
      ? {
          paraNumber:
            myPara.number,

          status:
            myPara.status ===
            "completed"
              ? "Completed"
              : "In Progress",

          ayahsRead:
            completedAyahs,

          totalAyahs:
            totalAyahs,

          onContinue:
            handleContinueKhatm,
        }
      : null;


  /* =========================================================
     QURAN READING CARD DATA

     Progress is now JUZ BASED.
  ========================================================= */

  const homeQuranReading =
    latestQuranBookmark &&
    latestQuranSurah &&
    latestQuranJuz
      ? {
          /*
           * MAIN CARD UNIT
           */

          juzNumber:
            latestQuranJuz.juzNumber,

          /*
           * JUZ PROGRESS
           */

          juzCompletedAyahs:
            latestQuranJuz.completedAyahs,

          juzTotalAyahs:
            latestQuranJuz.totalAyahs,

          juzPercentage:
            latestQuranJuz.percentage,

          /*
           * EXACT SAVED POSITION
           * Still shown inside the card.
           */

          surahName:
            latestQuranSurah.name ||
            `Surah ${latestQuranBookmark.surahNumber}`,

          ayahNumber:
            latestQuranBookmark.ayahNumber,

          /*
           * EXACT RESUME
           */

          onContinue:
            handleContinueQuran,
        }
      : null;


  /* =========================================================
     QUICK ACTIONS
     EXISTING LOGIC UNCHANGED.
  ========================================================= */

  const quickActions = [
    {
      to: "/quran",
      icon: BookOpen,
      title: "Read Quran",
      description:
        "Browse Surahs & Juz",
      accent: "emerald",
    },

    {
      to: "/khatms",
      icon: Layers,
      title: "My Khatms",
      description:
        "Active & completed",
      accent: "violet",
    },

    {
      to: "/khatms/create",
      icon: PlusCircle,
      title: "Create Khatm",
      description:
        "Start a new intention",
      accent: "gold",
    },

    ...(activeKhatm
      ? [
          {
            to: `/khatm/${activeKhatm._id}/progress`,
            icon: BarChart3,
            title:
              "Khatm Progress",
            description:
              "See the full Para grid",
            accent: "sky",
          },
        ]
      : []),
  ];


  /* =========================================================
     INITIAL KHATM LOADING
  ========================================================= */

  if (khatmLoading) {
    return (
      <div className="px-5 pt-14 pb-4">
        <p className="text-sm text-ink-soft">
          Loading your Khatms...
        </p>
      </div>
    );
  }


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="px-5 pt-14 pb-4">

      {/* =====================================================
          HOME HEADER
      ====================================================== */}

      <HomeHeader
        name={
          user?.name?.split(
            " ",
          )[0] ||
          "Guest"
        }
      />


      {/* =====================================================
          DUAL PROGRESS SECTION
      ====================================================== */}

      <ContinueReadingCard
        khatm={
          isProgressLoading
            ? null
            : activeKhatm
        }

        para={
          isProgressLoading
            ? null
            : myPara
        }

        percentage={
          percentage
        }

        completedAyahs={
          completedAyahs
        }

        totalAyahs={
          totalAyahs
        }

        progressLoading={
          isProgressLoading
        }

        quranReading={
          quranBookmarkLoading ||
          quranJuzProgressLoading
            ? null
            : homeQuranReading
        }

        onStartReading={() =>
          navigate(
            "/quran",
          )
        }
      />


      {/* =====================================================
          QUICK ACCESS
          EXISTING SECTION UNCHANGED.
      ====================================================== */}

      <p className="mt-6 mb-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">
        Quick Access
      </p>


      <div className="mb-6 grid grid-cols-2 gap-3">

        {quickActions.map(
          (action) => (
            <QuickActionCard
              key={
                action.to
              }
              {...action}
            />
          ),
        )}

      </div>


      {/* =====================================================
          EXISTING ACTIVE KHATM CARD
          NOT REMOVED.
      ====================================================== */}

      {activeKhatm &&
        progress && (
          <ActiveKhatmCard
            khatm={
              activeKhatm
            }
            progress={
              progress
            }
          />
        )}


      {/* =====================================================
          EXISTING PARA PROGRESS CARD
          NOT REMOVED.
      ====================================================== */}

      {activeKhatm && (
        <ParaProgressCard
          khatm={
            activeKhatm
          }
          para={
            myPara
          }
          paras={
            myParas
          }
        />
      )}


      {/* =====================================================
          EXISTING ACTIVITY PREVIEW
          NOT REMOVED.
      ====================================================== */}

      {activeKhatm && (
        <ActivityPreview
          khatmId={
            activeKhatm._id
          }
          items={
            activityLog
          }
        />
      )}

    </div>
  );
}