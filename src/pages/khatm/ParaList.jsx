import { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  Navigate,
} from "react-router-dom";

import { useKhatms } from "../../context/KhatmContext";

import TopBar from "../../components/common/TopBar";
import Tabs from "../../components/common/Tabs";
import ParaCard from "../../components/khatm/ParaCard";
import Sheet from "../../components/common/Sheet";
import Button from "../../components/common/Button";

export default function ParaList() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getKhatm, claimPara } = useKhatms();

  const [khatm, setKhatm] = useState(null);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState("all");
  const [claimTarget, setClaimTarget] = useState(null);

  useEffect(() => {
    const loadKhatm = async () => {
      try {
        setLoading(true);

        const data = await getKhatm(id);

        setKhatm(data);
      } catch (error) {
        console.error("Failed to load Khatm:", error);
        setKhatm(null);
      } finally {
        setLoading(false);
      }
    };

    loadKhatm();
  }, [id]);

  const handleConfirmClaim = async () => {
    if (!claimTarget) return;

    try {
      const updatedKhatm = await claimPara(
        id,
        claimTarget.number
      );

      setKhatm(updatedKhatm);

      setClaimTarget(null);
    } catch (error) {
      console.error("Failed to claim Para:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-sm text-ink-soft">
          Loading Paras...
        </p>
      </div>
    );
  }

  if (!khatm) {
    return <Navigate to="/khatms" replace />;
  }

  const filtered = khatm.paras.filter((p) =>
    tab === "all" ? true : p.status === tab
  );

  return (
    <div className="min-h-screen bg-cream">
      <TopBar title="Para Division" />

      <div className="px-5 pb-4">
        <Tabs
          tabs={[
            {
              label: "All",
              value: "all",
            },
            {
              label: "Available",
              value: "available",
            },
            {
              label: "Claimed",
              value: "claimed",
            },
            {
              label: "Completed",
              value: "completed",
            },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      <div className="px-5 pb-8">
        {filtered.map((p) => (
          <ParaCard
            key={p.number}
            para={p}
            onClaim={setClaimTarget}
            onOpen={() =>
              navigate(
                `/khatm/${id}/para/${p.number}/read`
              )
            }
          />
        ))}
      </div>

      <Sheet
        open={!!claimTarget}
        onClose={() => setClaimTarget(null)}
      >
        {claimTarget && (
          <div className="text-center">
            <h3 className="font-display text-xl font-semibold text-ink mb-2">
              Claim Para {claimTarget.number}?
            </h3>

            <p className="text-sm text-ink-soft mb-6">
              You will be responsible for completing this Para
              as part of this Khatm.
            </p>

            <div className="space-y-3">
              <Button
                className="w-full"
                onClick={handleConfirmClaim}
              >
                Yes, Claim It
              </Button>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() =>
                  setClaimTarget(null)
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
