import { PlusCircle, Layers, BookOpen, BarChart3 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useKhatms } from "../../context/KhatmContext";
import { paraProgress } from "../../data/mockData";

import HomeHeader from "../../components/home/HomeHeader";
import ContinueReadingCard from "../../components/home/ContinueReadingCard";
import QuickActionCard from "../../components/home/QuickActionCard";
import ActiveKhatmCard from "../../components/home/ActiveKhatmCard";
import ParaProgressCard from "../../components/home/ParaProgressCard";
import ActivityPreview from "../../components/home/ActivityPreview";

export default function Home() {
  const { user } = useAuth();
  const { khatms, activityLog } = useKhatms();

  const activeKhatm = khatms.find(
    (k) => k.status === "active"
  );

  // Backend me assignedTo field ObjectId hai
  const myPara = activeKhatm?.paras.find(
    (p) =>
      String(p.assignedTo?._id || p.assignedTo) ===
      String(user?._id)
  );

  const progress = activeKhatm
    ? paraProgress(activeKhatm)
    : null;

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
            description: "See the full Para grid",
            accent: "sky",
          },
        ]
      : []),
  ];

  return (
    <div className="px-5 pt-14 pb-4">
      <HomeHeader
        name={user?.name?.split(" ")[0] || "Guest"}
      />

      <ContinueReadingCard
        khatm={activeKhatm}
        para={myPara}
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