import { useParams, Navigate } from "react-router-dom";
import { useState } from "react";
import { Copy, Share2, Check } from "lucide-react";
import { useKhatms } from "../../context/KhatmContext";
import TopBar from "../../components/common/TopBar";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

export default function Invite() {
  const { id } = useParams();
  const { getKhatm } = useKhatms();

  const khatm = getKhatm(id);

  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  if (!khatm) {
    return <Navigate to="/khatms" replace />;
  }

  // Actual current website URL
  const link = `${window.location.origin}/join/${khatm.inviteCode}`;

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(link);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to copy invite link:", error);
    }
  };

  const shareInvite = async () => {
    try {
      setSharing(true);

      if (navigator.share) {
        await navigator.share({
          title: "Join Quran Khatm",
          text: `Join Quran Khatm for ${khatm.dedicatedTo}`,
          url: link,
        });
      } else {
        await copyInviteLink();
      }
    } catch (error) {
      // User cancelling the share dialog is not an actual app error
      if (error.name !== "AbortError") {
        console.error("Failed to share invite:", error);
      }
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <TopBar title="Invite Members" />

      <div className="px-5 pt-2 pb-10 text-center">
        <p className="text-sm text-ink-soft mb-8 max-w-[30ch] mx-auto">
          Share this invitation with family and friends to join this Quran
          Khatm.
        </p>

        <Card className="mb-6">
          <p className="text-xs text-gold font-semibold uppercase tracking-wide mb-1">
            {khatm.intentionType}
          </p>

          <h2 className="font-display text-lg font-semibold text-ink mb-4">
            Join Quran Khatm for {khatm.dedicatedTo}
          </h2>

          <div className="flex items-center justify-between bg-emerald-soft rounded-2xl px-4 py-3">
            <span className="text-sm text-emerald-deep font-mono truncate">
              {link}
            </span>

            <button
              onClick={copyInviteLink}
              className="shrink-0 ml-3 text-emerald-deep"
              aria-label="Copy invite link"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>

          <p className="text-xs text-ink-soft mt-4">
            Invite Code:{" "}
            <span className="font-semibold text-emerald-deep">
              {khatm.inviteCode}
            </span>
          </p>
        </Card>

        <div className="space-y-3">
          <Button
            className="w-full"
            icon={Share2}
            onClick={shareInvite}
            disabled={sharing}
          >
            {sharing ? "Opening Share..." : "Share Invite Link"}
          </Button>

          <Button
            variant="outline"
            className="w-full"
            icon={copied ? Check : Copy}
            onClick={copyInviteLink}
          >
            {copied ? "Copied!" : "Copy Link"}
          </Button>
        </div>
      </div>
    </div>
  );
}