import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Users, ListChecks } from "lucide-react";
import { useKhatms } from "../../context/KhatmContext";
import { paraProgress } from "../../data/mockData";
import Button from "../../components/common/Button";
import ParaRing from "../../components/common/ParaRing";

export default function JoinKhatm() {
  const { inviteCode } = useParams();
  const navigate = useNavigate();

  const {
    getKhatmFromInvite,
    joinKhatm,
  } = useKhatms();

  const [khatm, setKhatm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInviteKhatm = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getKhatmFromInvite(
          inviteCode
        );

        setKhatm(result);
      } catch (error) {
        console.error(
          "Failed to load invite:",
          error
        );

        setError(
          error.message ||
            "Invalid or expired invite link."
        );
      } finally {
        setLoading(false);
      }
    };

    loadInviteKhatm();
  }, [inviteCode]);

  const handleJoin = async () => {
    if (!khatm) return;

    try {
      setJoining(true);
      setError("");

      const khatmId =
        khatm._id || khatm.id;

      const joinedKhatm = await joinKhatm(
        khatmId
      );

      const joinedKhatmId =
        joinedKhatm._id ||
        joinedKhatm.id;

      navigate(
        `/khatm/${joinedKhatmId}/paras`
      );
    } catch (error) {
      console.error(
        "Failed to join Khatm:",
        error
      );

      setError(
        error.message ||
          "Failed to join Khatm."
      );
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-sm text-ink-soft">
          Loading Khatm...
        </p>
      </div>
    );
  }

  if (!khatm) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-8 text-center">
        <h1 className="font-display text-xl font-semibold text-ink mb-2">
          Invite Not Found
        </h1>

        <p className="text-sm text-ink-soft mb-6">
          {error ||
            "This invite link is invalid or expired."}
        </p>

        <Button
          onClick={() =>
            navigate("/khatms")
          }
        >
          Go to My Khatms
        </Button>
      </div>
    );
  }

  const progress = paraProgress(khatm);

  const memberCount =
    khatm.members?.length ||
    khatm.memberCount ||
    1;

  return (
    <div className="min-h-screen bg-cream flex flex-col px-8 pt-20 pb-10">
      <div className="flex-1 flex flex-col items-center text-center">
        <p className="text-sm text-ink-soft mb-1">
          You have been invited to join
        </p>

        <p className="text-xs text-gold font-semibold uppercase tracking-wide mb-1">
          Quran Khatm for
        </p>

        <h1 className="font-display text-2xl font-semibold text-ink mb-6">
          {khatm.dedicatedTo}
        </h1>

        <ParaRing
          paras={khatm.paras || []}
          size={160}
          label="Paras Completed"
        />

        <div className="flex items-center gap-6 mt-6 text-sm">
          <div className="flex items-center gap-1.5 text-ink-soft">
            <Users size={15} />
            {memberCount} Members
          </div>

          <div className="flex items-center gap-1.5 text-ink-soft">
            <ListChecks size={15} />
            {30 - progress.completed} Remaining
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 mt-5">
            {error}
          </p>
        )}
      </div>

      <Button
        className="w-full"
        onClick={handleJoin}
        disabled={joining}
      >
        {joining
          ? "Joining..."
          : "Join Khatm"}
      </Button>
    </div>
  );
}
