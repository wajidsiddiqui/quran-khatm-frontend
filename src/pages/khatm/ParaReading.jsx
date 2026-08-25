import {
  useParams,
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Lock,
  Bookmark,
} from "lucide-react";

import {
  useKhatms,
} from "../../context/KhatmContext";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  fetchJuz,
  fetchSurah,
} from "../../services/quranApi";

import {
  useAyahAudio,
} from "../../hooks/useAyahAudio";

import {
  QuranLoading,
  QuranError,
} from "../../components/quran/QuranStateNotice";

import MushafFrame from "../../components/quran/MushafFrame";

import TopBar from "../../components/common/TopBar";

import Button from "../../components/common/Button";

import Sheet from "../../components/common/Sheet";

import SurahHeader from "../../components/quran/SurahHeader";

import {
  isSurahStart,
} from "../../utils/quranSurah";


const TOTAL_PARAS = 30;


/* =========================================================
   REMOVE BISMILLAH FROM FIRST AYAH
========================================================= */

function removeBismillah(text = "") {
  return text
    .replace(
      /^(?:بِسْمِ|بِسْمِ)\s+(?:ٱ|ا)?للَّ?هِ\s+(?:ٱ|ا)?لرَّحْمَٰنِ\s+(?:ٱ|ا)?لرَّحِيمِ[\s\uFEFF]*/,
      "",
    )
    .trim();
}


/* =========================================================
   ARABIC AYAH NUMBER
========================================================= */

function toArabicNumber(number) {
  return String(number)
    .split("")
    .map(
      (digit) =>
        "٠١٢٣٤٥٦٧٨٩"[digit],
    )
    .join("");
}


/* =========================================================
   JUZ READING
========================================================= */

export default function ParaReading() {
  const {
    id,
    num,
  } = useParams();

  const navigate =
    useNavigate();


  /* =========================================================
     KHATM CONTEXT
  ========================================================= */

  const {
    getKhatm,
    completePara,
    getReadingProgress,
    saveReadingProgress,
    deleteReadingProgress,
  } = useKhatms();


  const {
    user,
  } = useAuth();


  const khatm =
    getKhatm(id);


  const paraNumber =
    Number(num);


  /* =========================================================
     UI STATE
  ========================================================= */

  const [
    confirming,
    setConfirming,
  ] = useState(false);


  const [
    done,
    setDone,
  ] = useState(false);


  const [
    juz,
    setJuz,
  ] = useState(null);


  const [
    error,
    setError,
  ] = useState(null);


  const [
    savedProgress,
    setSavedProgress,
  ] = useState(null);


  const [
    selectedAyah,
    setSelectedAyah,
  ] = useState(null);


  const [
    savingProgress,
    setSavingProgress,
  ] = useState(false);


  const [
    deletingProgress,
    setDeletingProgress,
  ] = useState(false);


  const [
    hasResumed,
    setHasResumed,
  ] = useState(false);


  /* =========================================================
     AUDIO
  ========================================================= */

  const {
    playingAyah,
    playingSurah,
    toggle:
      toggleAyahAudio,
    toggleSurah,
    reset:
      resetAudio,
  } = useAyahAudio();


  /* =========================================================
     FONT SIZE
  ========================================================= */

  const [
    fontSize,
    setFontSize,
  ] = useState(
    localStorage.getItem(
      "quranFontSize",
    ) || "Medium",
  );


  useEffect(() => {
    const handleStorageChange =
      () => {
        setFontSize(
          localStorage.getItem(
            "quranFontSize",
          ) || "Medium",
        );
      };


    window.addEventListener(
      "storage",
      handleStorageChange,
    );


    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange,
      );
    };
  }, []);


  const getArabicFontSize =
    () => {
      if (
        fontSize === "Small"
      ) {
        return 19;
      }


      if (
        fontSize === "Large"
      ) {
        return 30;
      }


      return 23;
    };


  /* =========================================================
     LOAD JUZ
  ========================================================= */

  const load =
    useCallback(() => {
      setError(null);

      setJuz(null);

      setHasResumed(false);


      fetchJuz(
        paraNumber,
      )
        .then(setJuz)
        .catch((e) => {
          setError(
            e.message,
          );
        });
    }, [paraNumber]);


  useEffect(() => {
    load();


    window.scrollTo(
      0,
      0,
    );


    resetAudio();


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);


  /* =========================================================
     LOAD SAVED PROGRESS
  ========================================================= */

  useEffect(() => {
    if (
      !id ||
      !paraNumber
    ) {
      return;
    }


    setSavedProgress(
      null,
    );

    setHasResumed(
      false,
    );


    getReadingProgress(
      id,
      paraNumber,
    )
      .then((progress) => {
        setSavedProgress(
          progress,
        );
      })
      .catch((error) => {
        console.error(
          "Failed to load reading progress:",
          error.message,
        );


        setSavedProgress(
          null,
        );
      });


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    id,
    paraNumber,
  ]);


  /* =========================================================
     AUTO RESUME
  ========================================================= */

  useEffect(() => {
    if (
      !savedProgress ||
      !juz ||
      hasResumed
    ) {
      return;
    }


    const targetId =
      `ayah-${savedProgress.surahNumber}-${savedProgress.ayahNumber}`;


    const timer =
      setTimeout(() => {
        const element =
          document.getElementById(
            targetId,
          );


        if (!element) {
          return;
        }


        const top =
          element.getBoundingClientRect()
            .top +
          window.scrollY -
          120;


        window.scrollTo({
          top,
          behavior: "smooth",
        });


        setHasResumed(
          true,
        );
      }, 500);


    return () => {
      clearTimeout(
        timer,
      );
    };
  }, [
    savedProgress,
    juz,
    hasResumed,
  ]);


  /* =========================================================
     KHATM NOT FOUND
  ========================================================= */

  if (!khatm) {
    return (
      <Navigate
        to="/khatms"
        replace
      />
    );
  }


  /* =========================================================
     JUZ DATA
  ========================================================= */

  const para =
    khatm.paras.find(
      (p) =>
        p.number ===
        paraNumber,
    );


  const isCompleted =
    done ||
    para?.status ===
      "completed";


  const currentUserId =
    user?._id ||
    user?.id;


  const assignedUserId =
    para?.assignedTo?._id ||
    para?.assignedTo?.id ||
    para?.assignedToId;


  const isMyPara =
    assignedUserId &&
    currentUserId &&
    String(
      assignedUserId,
    ) ===
      String(
        currentUserId,
      );


  const isClaimedBySomeoneElse =
    para?.status ===
      "claimed" &&
    !isMyPara;


  const isAvailable =
    para?.status ===
    "available";


  /* =========================================================
     SELECT AYAH
  ========================================================= */

  const handleAyahClick =
    (
      group,
      ayah,
    ) => {
      setSelectedAyah({
        surahNumber:
          group.surahNumber,

        surahName:
          group.surahName,

        ayahNumber:
          ayah.number,

        globalAyahNumber:
          ayah.globalNumber,
      });
    };


  const handleAyahKeyDown =
    (
      event,
      group,
      ayah,
    ) => {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();

        handleAyahClick(
          group,
          ayah,
        );
      }
    };


  /* =========================================================
     PLAY COMPLETE SURAH FROM HEADER
  ========================================================= */

  const handleSurahHeaderAudio =
    async (
      group,
    ) => {
      /*
       * If this Surah is already playing,
       * clicking the header stops it.
       */

      if (
        playingSurah ===
        group.surahNumber
      ) {
        toggleSurah(
          group.surahNumber,
          group.ayahs,
        );

        return;
      }


      try {
        /*
         * A Juz can contain only PART
         * of a Surah.
         *
         * Therefore header audio uses
         * the COMPLETE Surah.
         */

        const fullSurah =
          await fetchSurah(
            group.surahNumber,
          );


        toggleSurah(
          group.surahNumber,
          fullSurah.ayahs,
        );
      } catch (error) {
        console.error(
          "Failed to load full Surah audio:",
          error.message,
        );
      }
    };


  /* =========================================================
     SAVE READING PROGRESS
  ========================================================= */

  const handleSetReadingProgress =
    async () => {
      if (!selectedAyah) {
        return;
      }


      try {
        setSavingProgress(
          true,
        );


        const progress =
          await saveReadingProgress(
            id,
            paraNumber,
            {
              surahNumber:
                selectedAyah.surahNumber,

              ayahNumber:
                selectedAyah.ayahNumber,

              globalAyahNumber:
                selectedAyah.globalAyahNumber,
            },
          );


        setSavedProgress(
          progress,
        );


        setSelectedAyah(
          null,
        );
      } catch (error) {
        console.error(
          "Failed to save reading progress:",
          error.message,
        );
      } finally {
        setSavingProgress(
          false,
        );
      }
    };


  /* =========================================================
     DELETE SAVED PROGRESS
  ========================================================= */

  const handleDeleteReadingProgress =
    async () => {
      if (
        !savedProgress?._id
      ) {
        return;
      }


      try {
        setDeletingProgress(
          true,
        );


        await deleteReadingProgress(
          savedProgress._id,
        );


        setSavedProgress(
          null,
        );


        setSelectedAyah(
          null,
        );


        setHasResumed(
          true,
        );
      } catch (error) {
        console.error(
          "Failed to delete reading progress:",
          error.message,
        );
      } finally {
        setDeletingProgress(
          false,
        );
      }
    };


  /* =========================================================
     COMPLETE JUZ
     
     IMPORTANT:
     After successful Juz completion,
     go DIRECTLY to the Juz Dua page.
     
     The previous intermediate completion
     screen is intentionally skipped.
  ========================================================= */

  const handleComplete =
    async () => {
      try {
        await completePara(
          id,
          paraNumber,
        );


        setDone(
          true,
        );


        setConfirming(
          false,
        );


        navigate(
          `/khatm/${id}/dua`,
        );
      } catch (error) {
        console.error(
          "Failed to complete Juz:",
          error.message,
        );


        setConfirming(
          false,
        );
      }
    };


  /* =========================================================
     JUZ NAVIGATION
  ========================================================= */

  const goToPara =
    (delta) => {
      const target =
        paraNumber +
        delta;


      if (
        target >= 1 &&
        target <=
          TOTAL_PARAS
      ) {
        navigate(
          `/khatm/${id}/para/${target}/read`,
        );
      }
    };


  const arabicFontSize =
    getArabicFontSize();


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-cream">

      <TopBar
        title="Juz Reading"
      />


      <div className="px-5 pb-32">

        {/* =====================================================
            KHATM INFO
        ====================================================== */}

        <div className="bg-emerald-soft rounded-2xl p-4 mb-6 text-center">

          <p className="text-xs text-ink-soft mb-1">
            Your contribution to
          </p>


          <p className="font-display text-[15px] font-semibold text-emerald-deep">
            Quran Khatm for{" "}
            {khatm.dedicatedTo}
          </p>


          <p className="text-xs text-ink-soft mt-1.5">
            {isCompleted
              ? "✓ Reading completed"
              : isMyPara
                ? "Your Juz — Reading in progress"
                : isClaimedBySomeoneElse
                  ? "This Juz is being read by another member"
                  : "This Juz is available to claim"}
          </p>

        </div>


        {/* =====================================================
            CONTENT STATES
        ====================================================== */}

        {error ? (
          <QuranError
            onRetry={load}
          />
        ) : !juz ? (
          <QuranLoading
            label={`Loading Juz ${paraNumber}...`}
          />
        ) : (
          <>

            {/* =================================================
                QURAN CONTENT
            ================================================== */}

            <MushafFrame
              label={`Juz ${paraNumber}`}
            >

              <div className="space-y-10">

                {juz.surahGroups.map(
                  (
                    group,
                    groupIndex,
                  ) => {

                    const isThisSurahPlaying =
                      playingSurah ===
                      group.surahNumber;


                    const showSurahHeader =
                      isSurahStart(
                        group,
                      );


                    return (
                      <div
                        key={
                          group.surahNumber
                        }
                        className={
                          groupIndex >
                          0
                            ? "border-t border-emerald-deep/10 pt-10"
                            : ""
                        }
                      >

                        {/* =====================================
                            SURAH HEADER

                            Only shown when this group
                            actually begins at Ayah 1.
                        ====================================== */}

                        {showSurahHeader && (
                          <SurahHeader
                            number={
                              group.surahNumber
                            }

                            arabicName={
                              group.surahArabicName
                            }

                            revelationTypeArabic={
                              group.revelationTypeArabic
                            }

                            ayahCount={
                              group.totalVerses
                            }

                            rukuCount={
                              group.totalRukus
                            }

                            isPlaying={
                              isThisSurahPlaying
                            }

                            onClick={() =>
                              handleSurahHeaderAudio(
                                group,
                              )
                            }
                          />
                        )}


                        {/* =====================================
                            CONTINUOUS AYAH FLOW
                        ====================================== */}

                        <div
                          dir="rtl"
                          className="font-quran font-bold text-[#141414]"
                          style={{
                            fontSize:
                              arabicFontSize,

                            lineHeight:
                              2.5,

                            textAlign:
                              "justify",

                            textAlignLast:
                              "right",
                          }}
                        >

                          {group.ayahs.map(
                            (ayah) => {

                              const isSavedAyah =
                                savedProgress &&
                                String(
                                  savedProgress.surahNumber,
                                ) ===
                                  String(
                                    group.surahNumber,
                                  ) &&
                                String(
                                  savedProgress.ayahNumber,
                                ) ===
                                  String(
                                    ayah.number,
                                  );


                              const isPlaying =
                                playingAyah ===
                                ayah.globalNumber;


                              const isFirstAyah =
                                ayah.number ===
                                1;


                              /*
                               * Remove Bismillah from
                               * the first Ayah of every
                               * Surah except:
                               *
                               * Surah 1
                               * Surah 9
                               */

                              const shouldRemoveBismillah =
                                group.surahNumber !==
                                  1 &&
                                group.surahNumber !==
                                  9 &&
                                isFirstAyah;


                              const displayAyahText =
                                shouldRemoveBismillah
                                  ? removeBismillah(
                                      ayah.arabic,
                                    )
                                  : ayah.arabic;


                              return (
                                <span
                                  key={
                                    ayah.number
                                  }
                                  id={`ayah-${group.surahNumber}-${ayah.number}`}
                                  className={`relative inline rounded-md transition-colors ${
                                    isSavedAyah
                                      ? "bg-emerald-soft/70"
                                      : ""
                                  }`}
                                >

                                  {/* AYAH TEXT */}

                                  <span
                                    role="button"
                                    tabIndex={0}
                                    onClick={() =>
                                      handleAyahClick(
                                        group,
                                        ayah,
                                      )
                                    }
                                    onKeyDown={(
                                      event,
                                    ) =>
                                      handleAyahKeyDown(
                                        event,
                                        group,
                                        ayah,
                                      )
                                    }
                                    className={`cursor-pointer rounded-md transition-colors ${
                                      isSavedAyah
                                        ? "px-1"
                                        : "hover:bg-emerald-soft/30"
                                    }`}
                                    aria-label={`Set reading progress at ayah ${ayah.number}`}
                                  >
                                    {
                                      displayAyahText
                                    }
                                  </span>


                                  {/* SAVED BOOKMARK */}

                                  {isSavedAyah && (
                                    <Bookmark
                                      size={Math.max(
                                        arabicFontSize -
                                          8,
                                        14,
                                      )}
                                      strokeWidth={
                                        2.2
                                      }
                                      className="inline-block align-middle mx-1 text-emerald-deep"
                                      aria-label="Saved reading position"
                                    />
                                  )}


                                  {/* AYAH AUDIO */}

                                  <button
                                    type="button"
                                    onClick={(
                                      event,
                                    ) => {
                                      event.stopPropagation();

                                      toggleAyahAudio(
                                        ayah.globalNumber,
                                      );
                                    }}
                                    className="inline p-0 mx-1 border-0 bg-transparent cursor-pointer align-baseline hover:opacity-70"
                                    aria-label={`Play ayah ${ayah.number}`}
                                  >

                                    {isPlaying ? (
                                      <Volume2
                                        size={Math.max(
                                          arabicFontSize -
                                            7,
                                          15,
                                        )}
                                        className="inline text-gold align-middle"
                                      />
                                    ) : (
                                      <span
                                        className="text-gold font-quran"
                                        style={{
                                          fontSize:
                                            Math.max(
                                              arabicFontSize -
                                                7,
                                              15,
                                            ),
                                        }}
                                      >
                                        ﴿
                                        {toArabicNumber(
                                          ayah.number,
                                        )}
                                        ﴾
                                      </span>
                                    )}

                                  </button>{" "}

                                </span>
                              );
                            },
                          )}

                        </div>

                      </div>
                    );
                  },
                )}

              </div>

            </MushafFrame>


            {/* =================================================
                JUZ NAVIGATION
            ================================================== */}

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
                <ChevronLeft
                  size={16}
                />

                Juz{" "}
                {paraNumber - 1}
              </button>


              <button
                onClick={() =>
                  goToPara(1)
                }
                disabled={
                  paraNumber >=
                  TOTAL_PARAS
                }
                className="flex items-center gap-1 text-sm font-semibold text-emerald-deep disabled:opacity-30"
              >
                Juz{" "}
                {paraNumber + 1}

                <ChevronRight
                  size={16}
                />

              </button>

            </div>

          </>
        )}

      </div>


      {/* =======================================================
          BOTTOM ACTION
      ======================================================== */}

      <div className="fixed bottom-0 left-0 right-0 bg-cream/95 backdrop-blur border-t border-emerald-deep/8 px-5 py-4">

        <div className="max-w-md md:max-w-xl mx-auto">

          {isCompleted && (
            <div className="flex items-center justify-center gap-2 text-emerald font-semibold py-3.5">

              <CheckCircle2
                size={18}
              />

              Juz {num} Completed

            </div>
          )}


          {!isCompleted &&
            isMyPara && (
              <Button
                className="w-full"
                onClick={() =>
                  setConfirming(
                    true,
                  )
                }
              >
                Mark Juz as Completed
              </Button>
            )}


          {!isCompleted &&
            isClaimedBySomeoneElse && (
              <div className="flex items-center justify-center gap-2 text-ink-soft font-medium py-3.5">

                <Lock
                  size={16}
                />

                This Juz is assigned to another member

              </div>
            )}


          {!isCompleted &&
            isAvailable && (
              <div className="text-center text-sm text-ink-soft py-3.5">

                Claim this Juz from the Juz Division page to start reading.

              </div>
            )}

        </div>

      </div>


      {/* =======================================================
          READING PROGRESS SHEET
      ======================================================== */}

      <Sheet
        open={Boolean(
          selectedAyah,
        )}
        onClose={() => {
          if (
            !savingProgress &&
            !deletingProgress
          ) {
            setSelectedAyah(
              null,
            );
          }
        }}
      >

        {selectedAyah && (
          <div className="text-center">

            <div className="w-14 h-14 rounded-full bg-emerald-soft mx-auto mb-4 flex items-center justify-center">

              <Bookmark
                size={22}
                className="text-emerald-deep"
              />

            </div>


            <h3 className="font-display text-xl font-semibold text-ink mb-1">

              {savedProgress &&
              String(
                savedProgress.surahNumber,
              ) ===
                String(
                  selectedAyah.surahNumber,
                ) &&
              String(
                savedProgress.ayahNumber,
              ) ===
                String(
                  selectedAyah.ayahNumber,
                )
                ? "Saved Reading Position"
                : "Set Reading Progress Here?"}

            </h3>


            <p className="text-sm text-ink-soft mb-2">

              Ayah{" "}
              {
                selectedAyah.ayahNumber
              }

              {" · "}

              {
                selectedAyah.surahName
              }

            </p>


            <p className="text-xs text-ink-faint mb-6">

              {savedProgress &&
              String(
                savedProgress.surahNumber,
              ) ===
                String(
                  selectedAyah.surahNumber,
                ) &&
              String(
                savedProgress.ayahNumber,
              ) ===
                String(
                  selectedAyah.ayahNumber,
                )
                ? "This is your current saved reading position."
                : "You can continue reading from this Ayah next time."}

            </p>


            <div className="space-y-3">

              {/* SAVE / UPDATE */}

              <Button
                className="w-full"
                onClick={
                  handleSetReadingProgress
                }
                disabled={
                  savingProgress ||
                  deletingProgress
                }
              >
                {savingProgress
                  ? "Saving..."
                  : "Save Progress"}
              </Button>


              {/* DELETE */}

              {savedProgress &&
                String(
                  savedProgress.surahNumber,
                ) ===
                  String(
                    selectedAyah.surahNumber,
                  ) &&
                String(
                  savedProgress.ayahNumber,
                ) ===
                  String(
                    selectedAyah.ayahNumber,
                  ) && (
                  <Button
                    variant="ghost"
                    className="w-full text-red-500"
                    onClick={
                      handleDeleteReadingProgress
                    }
                    disabled={
                      savingProgress ||
                      deletingProgress
                    }
                  >
                    {deletingProgress
                      ? "Removing..."
                      : "Remove Saved Position"}
                  </Button>
                )}


              {/* CANCEL */}

              <Button
                variant="ghost"
                className="w-full"
                onClick={() =>
                  setSelectedAyah(
                    null,
                  )
                }
                disabled={
                  savingProgress ||
                  deletingProgress
                }
              >
                Cancel
              </Button>

            </div>

          </div>
        )}

      </Sheet>


      {/* =======================================================
          COMPLETE JUZ SHEET
      ======================================================== */}

      <Sheet
        open={confirming}
        onClose={() =>
          setConfirming(
            false,
          )
        }
      >

        <div className="text-center">

          <h3 className="font-display text-xl font-semibold text-ink mb-2">
            Have you completed Juz{" "}
            {num}?
          </h3>


          <p className="text-sm text-ink-soft mb-6">
            This action will update the
            Khatm progress.
          </p>


          <div className="space-y-3">

            <Button
              className="w-full"
              onClick={
                handleComplete
              }
            >
              Yes, Mark as Completed
            </Button>


            <Button
              variant="ghost"
              className="w-full"
              onClick={() =>
                setConfirming(
                  false,
                )
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