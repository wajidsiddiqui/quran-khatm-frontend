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

import { useAuth } from "../../context/AuthContext";
import { useKhatms } from "../../context/KhatmContext";
import { paraProgress } from "../../data/mockData";
import { useParaProgress } from "../../hooks/useParaProgress";

import HomeHeader from "../../components/home/HomeHeader";
import ContinueReadingCard from "../../components/home/ContinueReadingCard";
import QuickActionCard from "../../components/home/QuickActionCard";
import ActiveKhatmCard from "../../components/home/ActiveKhatmCard";
import ParaProgressCard from "../../components/home/ParaProgressCard";
import ActivityPreview from "../../components/home/ActivityPreview";

export default function Home() {
  const { user } = useAuth();

  const {
    khatms,
    activityLog,
    khatmLoading,
    readingProgress,
    getReadingProgress,
  } = useKhatms();

  // Local loading state for saved reading progress
  const [readingProgressLoading, setReadingProgressLoading] =
    useState(false);

  // Get active Khatm
  const activeKhatm = khatms.find(
    (khatm) => khatm.status === "active"
  );

  // Current logged-in user ID
  const userId = String(
    user?._id || user?.id || ""
  );

  // Get ALL Paras belonging to current user
  const myParas =
    activeKhatm?.paras?.filter((para) => {
      if (!para.assignedTo) {
        return false;
      }

      const assignedUserId =
        para.assignedTo?._id ||
        para.assignedTo?.id ||
        para.assignedTo;

      return (
        String(assignedUserId) === userId
      );
    }) || [];

  // Prefer a claimed Para first
  const claimedPara = myParas.find(
    (para) => para.status === "claimed"
  );

  // If no claimed Para, show completed Para
  const completedPara = myParas.find(
    (para) => para.status === "completed"
  );

  // Main Para to show
  const myPara =
    claimedPara ||
    completedPara ||
    null;

  // Existing Khatm-level progress
  const progress = activeKhatm
    ? paraProgress(activeKhatm)
    : null;

  /*
    IMPORTANT:
    After page refresh, Context state becomes empty.

    So whenever Home loads and we know the active
    Khatm + user's Para, fetch saved reading progress
    again from the backend.
  */
  useEffect(() => {
    if (!activeKhatm?._id || !myPara?.number) {
      return;
    }

    let cancelled = false;

    async function loadSavedReadingProgress() {
      try {
        setReadingProgressLoading(true);

        await getReadingProgress(
          activeKhatm._id,
          myPara.number
        );
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to load reading progress:",
            error.message
          );
        }
      } finally {
        if (!cancelled) {
          setReadingProgressLoading(false);
        }
      }
    }

    loadSavedReadingProgress();

    return () => {
      cancelled = true;
    };

    // getReadingProgress intentionally omitted
    // because it is recreated by Context on each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeKhatm?._id,
    myPara?.number,
  ]);

  // Reading progress for the user's Para
  const readingProgressForPara =
    activeKhatm && myPara
      ? readingProgress[
          `${activeKhatm._id}-${myPara.number}`
        ] || null
      : null;

  // Actual Quran Ayah-based Para progress
  const {
    completedAyahs,
    totalAyahs,
    percentage,
    loading: paraProgressLoading,
  } = useParaProgress(
    myPara?.number,
    readingProgressForPara
  );

  // Combine both loading states
  const isProgressLoading =
    readingProgressLoading ||
    paraProgressLoading;

  const quickActions = [
    {
      to: "/quran",
      icon: BookOpen,
      title: "Read Quran",
      description: "Browse Surahs & Juz",
      accent: "emerald",
    },

    {
      to: "/khatms",
      icon: Layers,
      title: "My Khatms",
      description: "Active & completed",
      accent: "violet",
    },

    {
      to: "/khatms/create",
      icon: PlusCircle,
      title: "Create Khatm",
      description: "Start a new intention",
      accent: "gold",
    },

    ...(activeKhatm
      ? [
          {
            to: `/khatm/${activeKhatm._id}/progress`,
            icon: BarChart3,
            title: "Khatm Progress",
            description:
              "See the full Para grid",
            accent: "sky",
          },
        ]
      : []),
  ];

  if (khatmLoading) {
    return (
      <div className="px-5 pt-14 pb-4">
        <p className="text-sm text-ink-soft">
          Loading your Khatms...
        </p>
      </div>
    );
  }

  return (
    <div className="px-5 pt-14 pb-4">
      <HomeHeader
        name={
          user?.name?.split(" ")[0] ||
          "Guest"
        }
      />

      <ContinueReadingCard
        khatm={activeKhatm}
        para={myPara}
        percentage={percentage}
        completedAyahs={completedAyahs}
        totalAyahs={totalAyahs}
        progressLoading={isProgressLoading}
      />

      <p className="text-xs font-semibold text-ink-soft uppercase tracking-wide mb-3">
        Quick Access
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {quickActions.map((action) => (
          <QuickActionCard
            key={action.to}
            {...action}
          />
        ))}
      </div>

      {activeKhatm && progress && (
        <ActiveKhatmCard
          khatm={activeKhatm}
          progress={progress}
        />
      )}

      {activeKhatm && (
        <ParaProgressCard
          khatm={activeKhatm}
          para={myPara}
          paras={myParas}
        />
      )}

      {activeKhatm && (
        <ActivityPreview
          khatmId={activeKhatm._id}
          items={activityLog}
        />
      )}
    </div>
  );
}