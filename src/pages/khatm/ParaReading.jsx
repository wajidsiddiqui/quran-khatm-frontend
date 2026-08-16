import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Lock,
} from "lucide-react";

import { useKhatms } from "../../context/KhatmContext";
import { useAuth } from "../../context/AuthContext";
import { fetchJuz } from "../../services/quranApi";
import { useAyahAudio } from "../../hooks/useAyahAudio";

import {
  QuranLoading,
  QuranError,
} from "../../components/quran/QuranStateNotice";

import MushafFrame from "../../components/quran/MushafFrame";
import TopBar from "../../components/common/TopBar";
import Button from "../../components/common/Button";
import Sheet from "../../components/common/Sheet";

const TOTAL_PARAS = 30;

export default function ParaReading() {
  const { id, num } = useParams();
  const navigate = useNavigate();

  const { getKhatm, completePara } = useKhatms();
  const { user } = useAuth();

  const khatm = getKhatm(id);

  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  const paraNumber = Number(num);

  const [juz, setJuz] = useState(null);
  const [error, setError] = useState(null);

  const {
    playingAyah,
    toggle: toggleAyahAudio,
    reset: resetAudio,
  } = useAyahAudio();

  const [fontSize, setFontSize] = useState(
    localStorage.getItem("quranFontSize") || "Medium"
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setFontSize(
        localStorage.getItem("quranFontSize") || "Medium"
      );
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  const getArabicFontSize = () => {
    if (fontSize === "Small") {
      return "text-[19px]";
    }

    if (fontSize === "Large") {
      return "text-[30px]";
    }

    return "text-[23px]";
  };

  const load = useCallback(() => {
    setError(null);
    setJuz(null);

    fetchJuz(paraNumber)
      .then(setJuz)
      .catch((e) => setError(e.message));
  }, [paraNumber]);

  useEffect(() => {
    load();

    window.scrollTo(0, 0);

    resetAudio();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  if (!khatm) {
    return <Navigate to="/khatms" replace />;
  }

  const para = khatm.paras.find(
    (p) => p.number === paraNumber
  );

  const isCompleted =
    done || para?.status === "completed";

  // Current logged-in user ID
  const currentUserId =
    user?._id || user?.id;

  // User who claimed this Para
  const assignedUserId =
    para?.assignedTo?._id ||
    para?.assignedTo?.id ||
    para?.assignedToId;

  // Check if this Para belongs to current user
  const isMyPara =
    assignedUserId &&
    currentUserId &&
    String(assignedUserId) ===
      String(currentUserId);

  const isClaimedBySomeoneElse =
    para?.status === "claimed" &&
    !isMyPara;

  const isAvailable =
    para?.status === "available";

  const handleComplete = async () => {
    try {
      await completePara(id, paraNumber);

      setDone(true);
      setConfirming(false);

      setTimeout(() => {
        navigate(`/khatm/${id}/complete`);
      }, 900);
    } catch (error) {
      console.error(
        "Failed to complete Para:",
        error.message
      );

      setConfirming(false);
    }
  };

  const goToPara = (delta) => {
    const target = paraNumber + delta;

    if (
      target >= 1 &&
      target <= TOTAL_PARAS
    ) {
      navigate(
        `/khatm/${id}/para/${target}/read`
      );
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <TopBar title="Para Reading" />

      <div className="px-5 pb-32">
        <div className="bg-emerald-soft rounded-2xl p-4 mb-6 text-center">
          <p className="text-xs text-ink-soft mb-1">
            Your contribution to
          </p>

          <p className="font-display text-[15px] font-semibold text-emerald-deep">
            Quran Khatm for {khatm.dedicatedTo}
          </p>

          <p className="text-xs text-ink-soft mt-1.5">
            {isCompleted
              ? "✓ Reading completed"
              : isMyPara
              ? "Your Para — Reading in progress"
              : isClaimedBySomeoneElse
              ? "This Para is being read by another member"
              : "This Para is available to claim"}
          </p>
        </div>

        {error ? (
          <QuranError onRetry={load} />
        ) : !juz ? (
          <QuranLoading
            label={`Loading Para ${paraNumber}...`}
          />
        ) : (
          <>
            <MushafFrame
              label={`Juz ${paraNumber}`}
            >
              <div className="space-y-10">
                {juz.surahGroups.map((group) => (
                  <div
                    key={group.surahNumber}
                  >
                    <div className="flex items-center justify-center gap-2.5 mb-5">
                      <span className="text-gold text-xs">
                        ✦
                      </span>

                      <p className="font-arabic-indopak font-bold text-xl text-emerald-deep">
                        {group.surahArabicName}
                      </p>

                      <p className="text-xs font-semibold text-ink-soft uppercase tracking-wide">
                        {group.surahName}
                      </p>

                      <span className="text-gold text-xs">
                        ✦
                      </span>
                    </div>

                    <div className="space-y-7">
                      {group.ayahs.map((a) => (
                        <div key={a.number}>
                          <p
                            className={`font-arabic-indopak font-bold ${getArabicFontSize()} leading-[2.5] text-[#141414] text-right`}
                            style={{
                              textAlign: "justify",
                              textAlignLast: "right",
                            }}
                          >
                            {a.arabic}{" "}

                            <button
                              onClick={() =>
                                toggleAyahAudio(
                                  a.globalNumber
                                )
                              }
                              className="inline-flex items-center justify-center align-middle text-[11px] text-gold border border-gold/50 rounded-full w-6 h-6 hover:bg-gold-dim transition-colors"
                              aria-label={`Play recitation for ayah ${a.number}`}
                            >
                              {playingAyah ===
                              a.globalNumber ? (
                                <Volume2 size={11} />
                              ) : (
                                a.number
                              )}
                            </button>
                          </p>

                          <p className="text-sm text-ink-soft text-left mt-1.5 leading-relaxed">
                            {a.translation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </MushafFrame>

            <div className="flex items-center justify-between mt-5">
              <button
                onClick={() =>
                  goToPara(-1)
                }
                disabled={
                  paraNumber <= 1
                }
                className="flex items-center gap-1 text-sm font-semibold text-emerald-deep disabled:opacity-30"
              >
                <ChevronLeft size={16} />
                Para {paraNumber - 1}
              </button>

              <button
                onClick={() =>
                  goToPara(1)
                }
                disabled={
                  paraNumber >= TOTAL_PARAS
                }
                className="flex items-center gap-1 text-sm font-semibold text-emerald-deep disabled:opacity-30"
              >
                Para {paraNumber + 1}
                <ChevronRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-cream/95 backdrop-blur border-t border-emerald-deep/8 px-5 py-4">
        <div className="max-w-md md:max-w-xl mx-auto">

          {/* Completed Para */}
          {isCompleted && (
            <div className="flex items-center justify-center gap-2 text-emerald font-semibold py-3.5">
              <CheckCircle2 size={18} />
              Para {num} Completed
            </div>
          )}

          {/* Current user's claimed Para */}
          {!isCompleted && isMyPara && (
            <Button
              className="w-full"
              onClick={() =>
                setConfirming(true)
              }
            >
              Mark Para as Completed
            </Button>
          )}

          {/* Claimed by another user */}
          {!isCompleted &&
            isClaimedBySomeoneElse && (
              <div className="flex items-center justify-center gap-2 text-ink-soft font-medium py-3.5">
                <Lock size={16} />
                This Para is assigned to another member
              </div>
            )}

          {/* Available Para */}
          {!isCompleted &&
            isAvailable && (
              <div className="text-center text-sm text-ink-soft py-3.5">
                Claim this Para from the Para
                Division page to start reading.
              </div>
            )}

        </div>
      </div>

      <Sheet
        open={confirming}
        onClose={() =>
          setConfirming(false)
        }
      >
        <div className="text-center">
          <h3 className="font-display text-xl font-semibold text-ink mb-2">
            Have you completed Para {num}?
          </h3>

          <p className="text-sm text-ink-soft mb-6">
            This action will update the Khatm
            progress.
          </p>

          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={handleComplete}
            >
              Yes, Mark as Completed
            </Button>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() =>
                setConfirming(false)
              }
            >
              Cancel
            </Button>
          </div>
        </div>
      </Sheet>
    </div>
  );
}