import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Lock,
  Bookmark,
  ExternalLink,
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

const BISMILLAH = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

function removeBismillah(text = "") {
  return text
    .replace(
      /^(?:بِسْمِ|بِسْمِ)\s+(?:ٱ|ا)?للَّ?هِ\s+(?:ٱ|ا)?لرَّحْمَٰنِ\s+(?:ٱ|ا)?لرَّحِيمِ[\s\uFEFF]*/,
      "",
    )
    .trim();
}

function toArabicNumber(number) {
  return String(number)
    .split("")
    .map((digit) => "٠١٢٣٤٥٦٧٨٩"[digit])
    .join("");
}

export default function ParaReading() {
  const { id, num } = useParams();

  const navigate = useNavigate();

  const { getKhatm, completePara, getReadingProgress, saveReadingProgress } =
    useKhatms();

  const { user } = useAuth();

  const khatm = getKhatm(id);

  const paraNumber = Number(num);

  /* =========================
     UI STATE
  ========================== */

  const [confirming, setConfirming] = useState(false);

  const [done, setDone] = useState(false);

  const [juz, setJuz] = useState(null);

  const [error, setError] = useState(null);

  const [savedProgress, setSavedProgress] = useState(null);

  const [selectedAyah, setSelectedAyah] = useState(null);

  const [savingProgress, setSavingProgress] = useState(false);

  const [hasResumed, setHasResumed] = useState(false);

  /* =========================
     AUDIO
  ========================== */

  const {
    playingAyah,
    playingSurah,
    toggle: toggleAyahAudio,
    toggleSurah,
    reset: resetAudio,
  } = useAyahAudio();

  /* =========================
     FONT SIZE
  ========================== */

  const [fontSize, setFontSize] = useState(
    localStorage.getItem("quranFontSize") || "Medium",
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setFontSize(localStorage.getItem("quranFontSize") || "Medium");
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const getArabicFontSize = () => {
    if (fontSize === "Small") {
      return 19;
    }

    if (fontSize === "Large") {
      return 30;
    }

    return 23;
  };

  /* =========================
     LOAD PARA
  ========================== */

  const load = useCallback(() => {
    setError(null);
    setJuz(null);
    setHasResumed(false);

    fetchJuz(paraNumber)
      .then(setJuz)
      .catch((e) => {
        setError(e.message);
      });
  }, [paraNumber]);

  useEffect(() => {
    load();

    window.scrollTo(0, 0);

    resetAudio();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  /* =========================
     LOAD SAVED PROGRESS
  ========================== */

  useEffect(() => {
    if (!id || !paraNumber) {
      return;
    }

    setSavedProgress(null);
    setHasResumed(false);

    getReadingProgress(id, paraNumber)
      .then((progress) => {
        setSavedProgress(progress);
      })
      .catch((error) => {
        console.error("Failed to load reading progress:", error.message);

        setSavedProgress(null);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, paraNumber]);

  /* =========================
     AUTO RESUME
  ========================== */

  useEffect(() => {
    if (!savedProgress || !juz || hasResumed) {
      return;
    }

    const targetId = `ayah-${savedProgress.surahNumber}-${savedProgress.ayahNumber}`;

    const timer = setTimeout(() => {
      const element = document.getElementById(targetId);

      if (!element) {
        return;
      }

      const top = element.getBoundingClientRect().top + window.scrollY - 120;

      window.scrollTo({
        top,
        behavior: "smooth",
      });

      setHasResumed(true);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [savedProgress, juz, hasResumed]);

  /* =========================
     KHATM NOT FOUND
  ========================== */

  if (!khatm) {
    return <Navigate to="/khatms" replace />;
  }

  /* =========================
     PARA DATA
  ========================== */

  const para = khatm.paras.find((p) => p.number === paraNumber);

  const isCompleted = done || para?.status === "completed";

  const currentUserId = user?._id || user?.id;

  const assignedUserId =
    para?.assignedTo?._id || para?.assignedTo?.id || para?.assignedToId;

  const isMyPara =
    assignedUserId &&
    currentUserId &&
    String(assignedUserId) === String(currentUserId);

  const isClaimedBySomeoneElse = para?.status === "claimed" && !isMyPara;

  const isAvailable = para?.status === "available";

  /* =========================
     SELECT AYAH
  ========================== */

  const handleAyahClick = (group, ayah) => {
    setSelectedAyah({
      surahNumber: group.surahNumber,

      surahName: group.surahName,

      ayahNumber: ayah.number,

      globalAyahNumber: ayah.globalNumber,
    });
  };

  const handleAyahKeyDown = (event, group, ayah) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      handleAyahClick(group, ayah);
    }
  };

  /* =========================
     SAVE READING PROGRESS
  ========================== */

  const handleSetReadingProgress = async () => {
    if (!selectedAyah) {
      return;
    }

    try {
      setSavingProgress(true);

      const progress = await saveReadingProgress(id, paraNumber, {
        surahNumber: selectedAyah.surahNumber,

        ayahNumber: selectedAyah.ayahNumber,

        globalAyahNumber: selectedAyah.globalAyahNumber,
      });

      setSavedProgress(progress);

      setSelectedAyah(null);
    } catch (error) {
      console.error("Failed to save reading progress:", error.message);
    } finally {
      setSavingProgress(false);
    }
  };

  /* =========================
     COMPLETE PARA
  ========================== */

  const handleComplete = async () => {
    try {
      await completePara(id, paraNumber);

      setDone(true);

      setConfirming(false);

      setTimeout(() => {
        navigate(`/khatm/${id}/complete`);
      }, 900);
    } catch (error) {
      console.error("Failed to complete Para:", error.message);

      setConfirming(false);
    }
  };

  /* =========================
     PARA NAVIGATION
  ========================== */

  const goToPara = (delta) => {
    const target = paraNumber + delta;

    if (target >= 1 && target <= TOTAL_PARAS) {
      navigate(`/khatm/${id}/para/${target}/read`);
    }
  };

  /* =========================
     OPEN FULL SURAH
  ========================== */

  const handleOpenSurah = (surahNumber) => {
    resetAudio();

    navigate(`/quran/surah/${surahNumber}`);
  };

  const arabicFontSize = getArabicFontSize();

  return (
    <div className="min-h-screen bg-cream">
      <TopBar title="Para Reading" />

      <div className="px-5 pb-32">
        {/* =========================
            KHATM INFO
        ========================== */}

        <div className="bg-emerald-soft rounded-2xl p-4 mb-6 text-center">
          <p className="text-xs text-ink-soft mb-1">Your contribution to</p>

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
          <QuranLoading label={`Loading Para ${paraNumber}...`} />
        ) : (
          <>
            {/* =========================
                QURAN CONTENT
            ========================== */}

            <MushafFrame label={`Juz ${paraNumber}`}>
              <div className="space-y-10">
                {juz.surahGroups.map((group, groupIndex) => {
                  const firstAyahNumber = group.ayahs[0]?.number;

                  const shouldShowBismillah =
                    group.surahNumber !== 1 &&
                    group.surahNumber !== 9 &&
                    firstAyahNumber === 1;

                  const isThisSurahPlaying = playingSurah === group.surahNumber;

                  return (
                    <div
                      key={group.surahNumber}
                      className={
                        groupIndex > 0
                          ? "border-t border-emerald-deep/10 pt-10"
                          : ""
                      }
                    >
                      {/* =========================
                            SURAH HEADER

                            CLICK HEADER:
                            OPEN FULL SURAH

                            CLICK AUDIO ICON:
                            PLAY FULL SURAH
                        ========================== */}

                      <div
                        className={`relative w-full border rounded-[10px] px-4 pt-6 pb-4 mb-5 transition-all ${
                          isThisSurahPlaying
                            ? "border-gold bg-emerald-soft"
                            : "border-gold/60 bg-[#FFFDF8]"
                        }`}
                      >
                        {/* =====================
                              SURAH CLICK AREA
                          ====================== */}

                        <button
                          type="button"
                          onClick={() => handleOpenSurah(group.surahNumber)}
                          className="block w-full cursor-pointer"
                          aria-label={`Open full ${group.surahName}`}
                        >
                          {/* FLOATING PILL */}

                          <div className="absolute left-1/2 -translate-x-1/2 -top-3 whitespace-nowrap bg-[#FFFDF8] border border-gold/50 rounded-full px-4 py-1">
                            <span className="text-[11px] font-bold text-emerald-deep">
                              SURAH {group.surahNumber}
                            </span>

                            <span className="text-gold mx-1.5">·</span>

                            <span className="font-arabic-indopak text-sm font-bold text-emerald-deep">
                              {group.surahArabicName}
                            </span>
                          </div>

                          {/* SURAH INFO */}

                          <div className="flex items-center justify-center gap-3 mt-1 text-[11px]">
                            <span className="font-arabic-indopak font-semibold text-emerald-deep">
                              {group.revelationTypeArabic}
                            </span>

                            <span className="w-1 h-1 rounded-full bg-gold" />

                            <span className="text-ink-soft">
                              {group.totalVerses} Ayahs
                            </span>
                          </div>

                          {/* BISMILLAH */}

                          {shouldShowBismillah && (
                            <p className="font-arabic-indopak font-bold text-[24px] leading-relaxed text-center text-emerald-deep mt-3">
                              {BISMILLAH}
                            </p>
                          )}
                        </button>

                        {/* =====================
                              HEADER ACTIONS
                          ====================== */}

                        <div className="flex items-center justify-center gap-3 mt-3">
                          {/* OPEN SURAH */}

                          <button
                            type="button"
                            onClick={() => handleOpenSurah(group.surahNumber)}
                            className="inline-flex items-center gap-1.5 text-[10px] text-emerald-deep hover:text-gold transition-colors"
                          >
                            <ExternalLink size={13} />
                            Read Full Surah
                          </button>

                          <span className="w-1 h-1 rounded-full bg-gold/70" />

                          {/* PLAY SURAH */}

                          <button
                            type="button"
                            onClick={() =>
                              toggleSurah(group.surahNumber, group.ayahs)
                            }
                            className={`inline-flex items-center gap-1.5 text-[10px] transition-colors ${
                              isThisSurahPlaying
                                ? "text-gold"
                                : "text-ink-soft hover:text-gold"
                            }`}
                            aria-label={
                              isThisSurahPlaying
                                ? "Stop Surah"
                                : "Play complete Surah"
                            }
                          >
                            <Volume2 size={14} />

                            {isThisSurahPlaying ? "Stop Audio" : "Play Surah"}
                          </button>
                        </div>
                      </div>

                      {/* =========================
                            CONTINUOUS AYAH FLOW
                        ========================== */}

                      <div
                        dir="rtl"
                        className="font-arabic-indopak font-bold text-[#141414]"
                        style={{
                          fontSize: arabicFontSize,

                          lineHeight: 2.5,

                          textAlign: "justify",

                          textAlignLast: "right",
                        }}
                      >
                        {group.ayahs.map((ayah) => {
                          const isSavedAyah =
                            savedProgress &&
                            String(savedProgress.surahNumber) ===
                              String(group.surahNumber) &&
                            String(savedProgress.ayahNumber) ===
                              String(ayah.number);

                          const isPlaying = playingAyah === ayah.globalNumber;

                          const isFirstAyah = ayah.number === 1;

                          const shouldRemoveBismillah =
                            group.surahNumber !== 1 &&
                            group.surahNumber !== 9 &&
                            isFirstAyah;

                          const displayAyahText = shouldRemoveBismillah
                            ? removeBismillah(ayah.arabic)
                            : ayah.arabic;

                          return (
                            <span
                              key={ayah.number}
                              id={`ayah-${group.surahNumber}-${ayah.number}`}
                              className={`relative inline rounded-md transition-colors ${
                                isSavedAyah ? "bg-emerald-soft/70" : ""
                              }`}
                            >
                              {/* AYAH TEXT */}
                              <span
                                role="button"
                                tabIndex={0}
                                onClick={() => handleAyahClick(group, ayah)}
                                onKeyDown={(event) =>
                                  handleAyahKeyDown(event, group, ayah)
                                }
                                className={`cursor-pointer rounded-md transition-colors ${
                                  isSavedAyah
                                    ? "px-1"
                                    : "hover:bg-emerald-soft/30"
                                }`}
                                aria-label={`Set reading progress at ayah ${ayah.number}`}
                              >
                                {displayAyahText}
                              </span>
                              {/* SAVED BOOKMARK */}
                              {isSavedAyah && (
                                <Bookmark
                                  size={Math.max(arabicFontSize - 8, 14)}
                                  strokeWidth={2.2}
                                  className="inline-block align-middle mx-1 text-emerald-deep"
                                  aria-label="Saved reading position"
                                />
                              )}
                              {/* AYAH AUDIO */}
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();

                                  toggleAyahAudio(ayah.globalNumber);
                                }}
                                className="inline p-0 mx-1 border-0 bg-transparent cursor-pointer align-baseline hover:opacity-70"
                                aria-label={`Play ayah ${ayah.number}`}
                              >
                                {isPlaying ? (
                                  <Volume2
                                    size={Math.max(arabicFontSize - 7, 15)}
                                    className="inline text-gold align-middle"
                                  />
                                ) : (
                                  <span
                                    className="text-gold font-arabic-indopak"
                                    style={{
                                      fontSize: Math.max(
                                        arabicFontSize - 7,
                                        15,
                                      ),
                                    }}
                                  >
                                    ﴿{toArabicNumber(ayah.number)}﴾
                                  </span>
                                )}
                              </button>{" "}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </MushafFrame>

            {/* =========================
                PARA NAVIGATION
            ========================== */}

            <div className="flex items-center justify-between mt-5">
              <button
                onClick={() => goToPara(-1)}
                disabled={paraNumber <= 1}
                className="flex items-center gap-1 text-sm font-semibold text-emerald-deep disabled:opacity-30"
              >
                <ChevronLeft size={16} />
                Para {paraNumber - 1}
              </button>

              <button
                onClick={() => goToPara(1)}
                disabled={paraNumber >= TOTAL_PARAS}
                className="flex items-center gap-1 text-sm font-semibold text-emerald-deep disabled:opacity-30"
              >
                Para {paraNumber + 1}
                <ChevronRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* =========================
          BOTTOM ACTION
      ========================== */}

      <div className="fixed bottom-0 left-0 right-0 bg-cream/95 backdrop-blur border-t border-emerald-deep/8 px-5 py-4">
        <div className="max-w-md md:max-w-xl mx-auto">
          {isCompleted && (
            <div className="flex items-center justify-center gap-2 text-emerald font-semibold py-3.5">
              <CheckCircle2 size={18} />
              Para {num} Completed
            </div>
          )}

          {!isCompleted && isMyPara && (
            <Button className="w-full" onClick={() => setConfirming(true)}>
              Mark Para as Completed
            </Button>
          )}

          {!isCompleted && isClaimedBySomeoneElse && (
            <div className="flex items-center justify-center gap-2 text-ink-soft font-medium py-3.5">
              <Lock size={16} />
              This Para is assigned to another member
            </div>
          )}

          {!isCompleted && isAvailable && (
            <div className="text-center text-sm text-ink-soft py-3.5">
              Claim this Para from the Para Division page to start reading.
            </div>
          )}
        </div>
      </div>

      {/* =========================
          READING PROGRESS SHEET
      ========================== */}

      <Sheet open={Boolean(selectedAyah)} onClose={() => setSelectedAyah(null)}>
        {selectedAyah && (
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-soft mx-auto mb-4 flex items-center justify-center">
              <Bookmark size={22} className="text-emerald-deep" />
            </div>

            <h3 className="font-display text-xl font-semibold text-ink mb-1">
              Set Reading Progress Here?
            </h3>

            <p className="text-sm text-ink-soft mb-2">
              Ayah {selectedAyah.ayahNumber}
              {" · "}
              {selectedAyah.surahName}
            </p>

            <p className="text-xs text-ink-faint mb-6">
              You can continue reading from this Ayah next time.
            </p>

            <div className="space-y-3">
              <Button
                className="w-full"
                onClick={handleSetReadingProgress}
                disabled={savingProgress}
              >
                {savingProgress ? "Saving..." : "Save Progress"}
              </Button>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setSelectedAyah(null)}
                disabled={savingProgress}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Sheet>

      {/* =========================
          COMPLETE PARA SHEET
      ========================== */}

      <Sheet open={confirming} onClose={() => setConfirming(false)}>
        <div className="text-center">
          <h3 className="font-display text-xl font-semibold text-ink mb-2">
            Have you completed Para {num}?
          </h3>

          <p className="text-sm text-ink-soft mb-6">
            This action will update the Khatm progress.
          </p>

          <div className="space-y-3">
            <Button className="w-full" onClick={handleComplete}>
              Yes, Mark as Completed
            </Button>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setConfirming(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Sheet>
    </div>
  );
}
