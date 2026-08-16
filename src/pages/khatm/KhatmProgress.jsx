import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useKhatms } from "../../context/KhatmContext";
import { paraProgress } from "../../data/mockData";
import TopBar from "../../components/common/TopBar";
import ParaRing from "../../components/common/ParaRing";
import Card from "../../components/common/Card";

const dotStyles = {
  completed: "bg-gold text-emerald-deep",
  claimed: "bg-emerald text-cream",
  available: "bg-ink-faint/15 text-ink-faint",
};

export default function KhatmProgress() {
  const { id } = useParams();
  const { getKhatm } = useKhatms();

  const [khatm, setKhatm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadKhatm = async () => {
      try {
        setLoading(true);

        const data = await getKhatm(id);

        if (!data) {
          setNotFound(true);
          return;
        }

        setKhatm(data);
      } catch (error) {
        console.error("Failed to load Khatm:", error.message);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadKhatm();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <TopBar title="Khatm Progress" />

        <div className="flex justify-center items-center pt-20">
          <p className="text-ink-soft">Loading Khatm...</p>
        </div>
      </div>
    );
  }

  if (notFound || !khatm) {
    return <Navigate to="/khatms" replace />;
  }

  const progress = paraProgress(khatm);

  const memberCount = khatm.members?.length || 0;

  return (
    <div className="min-h-screen bg-cream">
      <TopBar title="Khatm Progress" />

      <div className="px-5 pb-10">
        <div className="flex justify-center mb-6 mt-2">
          <ParaRing
            paras={khatm.paras || []}
            size={190}
            label="Paras Completed"
          />
        </div>

        <Card className="grid grid-cols-3 divide-x divide-emerald-deep/8 !p-0 mb-6">
          <div className="text-center py-4">
            <p className="font-display text-lg font-semibold text-ink">
              {memberCount}
            </p>

            <p className="text-[11px] text-ink-soft mt-0.5">
              Members
            </p>
          </div>

          <div className="text-center py-4">
            <p className="font-display text-lg font-semibold text-gold">
              {progress.completed}
            </p>

            <p className="text-[11px] text-ink-soft mt-0.5">
              Completed
            </p>
          </div>

          <div className="text-center py-4">
            <p className="font-display text-lg font-semibold text-ink-faint">
              {30 - progress.completed}
            </p>

            <p className="text-[11px] text-ink-soft mt-0.5">
              Remaining
            </p>
          </div>
        </Card>

        <div className="grid grid-cols-6 gap-2 mb-6">
          {(khatm.paras || []).map((p) => (
            <div
              key={p.number}
              className={`aspect-square rounded-xl flex items-center justify-center text-xs font-semibold ${
                dotStyles[p.status] || dotStyles.available
              }`}
            >
              {p.number}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-5 text-xs text-ink-soft">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gold inline-block" />
            Completed
          </span>

          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald inline-block" />
            In Progress
          </span>

          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-ink-faint/30 inline-block" />
            Available
          </span>
        </div>
      </div>
    </div>
  );
}