import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Users, Activity, Share2, ListChecks } from "lucide-react";
import { useKhatms } from "../../context/KhatmContext";
import TopBar from "../../components/common/TopBar";
import ParaRing from "../../components/common/ParaRing";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

export default function KhatmDetails() {
  const { id } = useParams();
  const { getKhatm } = useKhatms();

  const [khatm, setKhatm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadKhatm() {
      setLoading(true);
      setNotFound(false);

      const data = await getKhatm(id);

      if (!data) {
        setNotFound(true);
      } else {
        setKhatm(data);
      }

      setLoading(false);
    }

    loadKhatm();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-ink-soft">Loading Khatm...</p>
      </div>
    );
  }

  if (notFound || !khatm) {
    return <Navigate to="/khatms" replace />;
  }

  const completed =
    khatm.paras?.filter((p) => p.status === "completed").length || 0;

  const claimed =
    khatm.paras?.filter((p) => p.status === "claimed").length || 0;

  const available =
    khatm.paras?.filter((p) => p.status === "available").length || 0;

  const progress = {
    completed,
    claimed,
    available,
  };

  const isCompleted = khatm.status === "completed";

  if (isCompleted) {
    return <Navigate to={`/khatm/${id}/complete`} replace />;
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-emerald-gradient geo-pattern-dark rounded-b-[2rem] pb-8 shadow-soft">
        <TopBar
          title=""
          dark
          transparent
          right={
            <button className="text-cream/80">
              <Share2 size={18} />
            </button>
          }
        />

        <div className="text-center px-6 -mt-1">
          <p className="text-gold text-xs font-semibold uppercase tracking-wide mb-1">
            Quran Khatm
          </p>

          <p className="text-cream/60 text-xs mb-0.5">
            {khatm.intentionType}
          </p>

          <h1 className="font-display text-2xl font-semibold text-cream mb-1">
            {khatm.dedicatedTo}
          </h1>

          {khatm.message && (
            <p className="text-cream/60 text-sm italic mb-6 max-w-[26ch] mx-auto">
              "{khatm.message}"
            </p>
          )}

          <div className="flex justify-center">
            <ParaRing
              paras={khatm.paras || []}
              size={168}
              label="Paras Completed"
              light
            />
          </div>
        </div>
      </div>

      <div className="px-5 -mt-6">
        <Card className="grid grid-cols-3 divide-x divide-emerald-deep/8 !p-0 mb-5">
          <div className="text-center py-4">
            <p className="font-display text-lg font-semibold text-gold">
              {progress.completed}
            </p>

            <p className="text-[11px] text-ink-soft mt-0.5">
              Completed
            </p>
          </div>

          <div className="text-center py-4">
            <p className="font-display text-lg font-semibold text-emerald-deep">
              {progress.claimed}
            </p>

            <p className="text-[11px] text-ink-soft mt-0.5">
              Claimed
            </p>
          </div>

          <div className="text-center py-4">
            <p className="font-display text-lg font-semibold text-ink-faint">
              {progress.available}
            </p>

            <p className="text-[11px] text-ink-soft mt-0.5">
              Available
            </p>
          </div>
        </Card>

        <div className="space-y-3">
          <Link to={`/khatm/${id}/paras`}>
            <Card className="flex items-center justify-between hover:shadow-soft">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-soft flex items-center justify-center">
                  <ListChecks
                    size={18}
                    className="text-emerald-deep"
                  />
                </div>

                <span className="font-semibold text-ink text-[15px]">
                  View All 30 Paras
                </span>
              </div>
            </Card>
          </Link>

          <Link to={`/khatm/${id}/members`}>
            <Card className="flex items-center justify-between hover:shadow-soft">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-soft flex items-center justify-center">
                  <Users
                    size={18}
                    className="text-emerald-deep"
                  />
                </div>

                <span className="font-semibold text-ink text-[15px]">
                  {khatm.members?.length || 0} Members
                </span>
              </div>
            </Card>
          </Link>

          <Link to={`/khatm/${id}/activity`}>
            <Card className="flex items-center justify-between hover:shadow-soft">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-soft flex items-center justify-center">
                  <Activity
                    size={18}
                    className="text-emerald-deep"
                  />
                </div>

                <span className="font-semibold text-ink text-[15px]">
                  Recent Activity
                </span>
              </div>
            </Card>
          </Link>
        </div>

        <Link
          to={`/khatm/${id}/invite`}
          className="block mt-5"
        >
          <Button variant="outline" className="w-full">
            Invite Family & Friends
          </Button>
        </Link>
      </div>
    </div>
  );
}