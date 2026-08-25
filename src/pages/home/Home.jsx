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
     
     Only an active Khatm is shown here.
     Completed Khatms go to My Khatms > Completed.
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
     CREATOR CHECK
     
     IMPORTANT:
     This is calculated in Home from the exact Khatm object
     and exact authenticated user, then passed explicitly
     to ActiveKhatmCard.
  ========================================================= */

  const isActiveKhatmCreator =
    (() => {
      if (
        !activeKhatm?.createdBy ||
        !userId
      ) {
        return false;
      }

      const creatorId =
        typeof activeKhatm.createdBy ===
        "object"
          ? activeKhatm.createdBy?._id ||
            activeKhatm.createdBy?.id
          : activeKhatm.createdBy;

      if (!creatorId) {
        return false;
      }

      return (
        String(
          creatorId,
        ) ===
        userId
      );
    })();


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
  ========================================================= */

  const progress =
    activeKhatm
      ? paraProgress(
          activeKhatm,
        )
      : null;


  /* =========================================================
     LOAD SAVED KHATM READING PROGRESS
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


        /* PRIMARY MATCH */

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


        /* FALLBACK MATCH */

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


        /* TOTAL JUZ AYAHS */

        const totalAyahsInJuz =
          Number(
            juzData.totalAyahs,
          ) ||
          juzAyahs.length ||
          0;


        /* COMPLETED AYAH COUNT */

        const completedAyahsInJuz =
          savedIndex >= 0
            ? savedIndex + 1
            : 0;


        /* PERCENTAGE */

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
  ========================================================= */

  const homeQuranReading =
    latestQuranBookmark &&
    latestQuranSurah &&
    latestQuranJuz
      ? {
          juzNumber:
            latestQuranJuz.juzNumber,

          juzCompletedAyahs:
            latestQuranJuz.completedAyahs,

          juzTotalAyahs:
            latestQuranJuz.totalAyahs,

          juzPercentage:
            latestQuranJuz.percentage,

          surahName:
            latestQuranSurah.name ||
            `Surah ${latestQuranBookmark.surahNumber}`,

          ayahNumber:
            latestQuranBookmark.ayahNumber,

          onContinue:
            handleContinueQuran,
        }
      : null;


  /* =========================================================
     QUICK ACTIONS
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
          ACTIVE KHATM CARD
          
          Creator information is explicitly passed.
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

            isCreator={
              isActiveKhatmCreator
            }
          />
        )}


      {/* =====================================================
          PARA PROGRESS CARD
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
          ACTIVITY PREVIEW
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