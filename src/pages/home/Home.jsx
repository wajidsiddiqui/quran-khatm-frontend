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
} from "../../services/quranApi";

import HomeHeader from "../../components/home/HomeHeader";

import ContinueReadingCard from "../../components/home/ContinueReadingCard";

import QuickActionCard from "../../components/home/QuickActionCard";

import ActiveKhatmCard from "../../components/home/ActiveKhatmCard";

import ParaProgressCard from "../../components/home/ParaProgressCard";

import ActivityPreview from "../../components/home/ActivityPreview";


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


  /* =========================================================
     PERSONAL QURAN READING STATE

     IMPORTANT:
     This is completely independent from Khatm progress.
  ========================================================= */

  const [
    latestQuranBookmark,
    setLatestQuranBookmark,
  ] = useState(null);

  const [
    latestQuranSurah,
    setLatestQuranSurah,
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
     KEEP THIS LOGIC UNCHANGED.
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
     READING PROGRESS FOR CURRENT PARA
  ========================================================= */

  const readingProgressForPara =
    activeKhatm &&
    myPara
      ? readingProgress[
          `${activeKhatm._id}-${myPara.number}`
        ] || null
      : null;


  /* =========================================================
     ACTUAL QURAN AYAH-BASED PARA PROGRESS
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
     LOAD PERSONAL QURAN BOOKMARK + FULL SURAH DATA

     IMPORTANT:
     Bookmark contains the saved location.

     fetchSurah() gives us:
     - English name
     - Arabic name
     - Total Surah Ayahs
     - Full Surah metadata

     This fixes the Quran card progress bar because
     totalAyahs now comes from the real Surah data.
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

        /* =================================================
           NO SAVED QURAN POSITION
        ================================================== */

        if (
          !latestBookmark?.surahNumber
        ) {
          setLatestQuranSurah(
            null,
          );

          return;
        }

        /* =================================================
           LOAD COMPLETE SURAH DATA
        ================================================== */

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
            "Failed to load Quran reading position:",
            error.message,
          );

          setLatestQuranBookmark(
            null,
          );

          setLatestQuranSurah(
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
     CONTINUE KHATM READING

     Existing Khatm route preserved.

     ParaReading already handles auto-resume
     to the saved Khatm Ayah.
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

     Existing SurahReading architecture uses:

     location.state.savedAyah

     Therefore preserve that exact behavior.
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

     ONLY KHATM DATA.
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

     ONLY PERSONAL QURAN DATA.

     totalAyahs comes from fetchSurah(),
     NOT from the Khatm system.
  ========================================================= */

  const homeQuranReading =
    latestQuranBookmark &&
    latestQuranSurah
      ? {
          surahName:
            latestQuranSurah.name ||
            `Surah ${latestQuranBookmark.surahNumber}`,

          ayahNumber:
            latestQuranBookmark.ayahNumber,

          totalAyahs:
            latestQuranSurah.verses,

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

          1. KHATM PROGRESS
          2. PERSONAL QURAN READING
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
          quranBookmarkLoading
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
              key={action.to}
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
            khatm={activeKhatm}
            progress={progress}
          />
        )}


      {/* =====================================================
          EXISTING PARA PROGRESS CARD
          NOT REMOVED.
      ====================================================== */}

      {activeKhatm && (
        <ParaProgressCard
          khatm={activeKhatm}
          para={myPara}
          paras={myParas}
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