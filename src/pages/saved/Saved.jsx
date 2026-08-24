import {
  Bookmark,
  BookOpen,
  ChevronRight,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useKhatms,
} from "../../context/KhatmContext";

import {
  fetchSurah,
} from "../../services/quranApi";

export default function Saved() {
  const navigate = useNavigate();

  const {
    getAllReadingProgress,
    deleteReadingProgress,
  } = useKhatms();

  const [savedLocations, setSavedLocations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [deletingId, setDeletingId] =
    useState(null);

  /*
   * ========================================
   * LOAD SAVED LOCATIONS
   * ========================================
   *
   * Quran bookmarks created before the
   * Para display feature do not contain
   * juzNumber in the backend.
   *
   * We resolve their Para from:
   *
   * globalAyahNumber → fetchSurah() → juzNumber
   *
   * Existing Khatm progress already contains
   * paraNumber, so it remains untouched.
   */

  useEffect(() => {
    let cancelled = false;

    async function loadSavedLocations() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getAllReadingProgress();

        if (cancelled) {
          return;
        }

        const locations =
          Array.isArray(data)
            ? data
            : [];

        const enrichedLocations =
          await Promise.all(
            locations.map(
              async (progress) => {
                /*
                 * Khatm progress does not need
                 * Para resolution.
                 */

                if (
                  progress.type !== "quran"
                ) {
                  return progress;
                }

                /*
                 * Keep an existing Para value
                 * if one is already available.
                 */

                if (
                  progress.juzNumber ||
                  progress.paraNumber
                ) {
                  return progress;
                }

                if (
                  !progress.surahNumber ||
                  !progress.ayahNumber
                ) {
                  return progress;
                }

                try {
                  const surah =
                    await fetchSurah(
                      Number(
                        progress.surahNumber,
                      ),
                    );

                  /*
                   * Global Ayah number is the
                   * primary identifier.
                   */

                  let matchedAyah = null;

                  if (
                    progress.globalAyahNumber
                  ) {
                    matchedAyah =
                      surah.ayahs.find(
                        (ayah) =>
                          Number(
                            ayah.globalNumber,
                          ) ===
                          Number(
                            progress.globalAyahNumber,
                          ),
                      );
                  }

                  /*
                   * Fallback to Surah Ayah number.
                   */

                  if (!matchedAyah) {
                    matchedAyah =
                      surah.ayahs.find(
                        (ayah) =>
                          Number(
                            ayah.number,
                          ) ===
                          Number(
                            progress.ayahNumber,
                          ),
                      );
                  }

                  if (
                    !matchedAyah?.juzNumber
                  ) {
                    return progress;
                  }

                  return {
                    ...progress,
                    juzNumber:
                      matchedAyah.juzNumber,
                  };
                } catch (error) {
                  console.error(
                    "Failed to resolve Quran bookmark Para:",
                    {
                      surahNumber:
                        progress.surahNumber,
                      ayahNumber:
                        progress.ayahNumber,
                      error:
                        error.message,
                    },
                  );

                  /*
                   * Keep the original saved
                   * location if resolution fails.
                   */

                  return progress;
                }
              },
            ),
          );

        if (cancelled) {
          return;
        }

        setSavedLocations(
          enrichedLocations,
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load saved locations:",
          error,
        );

        setError(
          error.message ||
            "Failed to load saved locations.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSavedLocations();

    return () => {
      cancelled = true;
    };
  }, [
    getAllReadingProgress,
  ]);

  /*
   * ========================================
   * CONTINUE FROM SAVED LOCATION
   * ========================================
   */

  function handleContinue(progress) {
    /*
     * ====================================
     * NORMAL QURAN BOOKMARK
     * ====================================
     */

    if (
      progress.type === "quran"
    ) {
      navigate(
        `/quran/surah/${progress.surahNumber}`,
        {
          state: {
            savedAyah: {
              juzNumber:
                progress.juzNumber ??
                progress.paraNumber,

              surahNumber:
                progress.surahNumber,

              ayahNumber:
                progress.ayahNumber,

              globalAyahNumber:
                progress.globalAyahNumber,
            },
          },
        },
      );

      return;
    }

    /*
     * ====================================
     * KHATM READING PROGRESS
     * ====================================
     */

    const khatmId =
      progress.khatm?._id ||
      progress.khatm;

    const paraNumber =
      progress.paraNumber;

    if (
      !khatmId ||
      !paraNumber
    ) {
      console.error(
        "Invalid Khatm reading progress:",
        progress,
      );

      return;
    }

    navigate(
      `/khatm/${khatmId}/para/${paraNumber}/read`,
      {
        state: {
          savedAyah: {
            paraNumber:
              progress.paraNumber,

            surahNumber:
              progress.surahNumber,

            ayahNumber:
              progress.ayahNumber,

            globalAyahNumber:
              progress.globalAyahNumber,
          },
        },
      },
    );
  }

  /*
   * ========================================
   * DELETE SAVED LOCATION
   * ========================================
   */

  async function handleDelete(
    progressId,
  ) {
    try {
      setDeletingId(progressId);
      setError("");

      await deleteReadingProgress(
        progressId,
      );

      setSavedLocations(
        (previousLocations) =>
          previousLocations.filter(
            (progress) =>
              progress._id !==
              progressId,
          ),
      );
    } catch (error) {
      console.error(
        "Failed to delete reading progress:",
        error,
      );

      setError(
        error.message ||
          "Failed to delete saved location.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  /*
   * ========================================
   * LOADING STATE
   * ========================================
   */

  if (loading) {
    return (
      <div className="min-h-screen bg-cream px-5 py-6">
        <div className="max-w-md mx-auto">

          <PageHeader />

          <div className="flex flex-col items-center justify-center pt-20">

            <Loader2
              size={30}
              className="text-emerald-deep animate-spin"
            />

            <p className="text-sm text-ink-soft mt-4">
              Loading saved locations...
            </p>

          </div>
        </div>
      </div>
    );
  }

  /*
   * ========================================
   * ERROR STATE
   * ========================================
   */

  if (error) {
    return (
      <div className="min-h-screen bg-cream px-5 py-6">
        <div className="max-w-md mx-auto">

          <PageHeader />

          <div className="flex flex-col items-center justify-center text-center pt-16">

            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-5">

              <AlertCircle
                size={28}
                className="text-red-500"
              />

            </div>

            <h2 className="font-display text-lg font-semibold text-ink">
              Unable to load saved locations
            </h2>

            <p className="text-sm text-ink-soft leading-relaxed mt-2 max-w-[280px]">
              {error}
            </p>

          </div>
        </div>
      </div>
    );
  }

  /*
   * ========================================
   * EMPTY STATE
   * ========================================
   */

  if (
    savedLocations.length === 0
  ) {
    return (
      <div className="min-h-screen bg-cream px-5 py-6">
        <div className="max-w-md mx-auto">

          <PageHeader />

          <div className="flex flex-col items-center justify-center text-center pt-16">

            <div className="w-16 h-16 rounded-full bg-emerald-soft flex items-center justify-center mb-5">

              <Bookmark
                size={28}
                className="text-emerald-deep"
              />

            </div>

            <h2 className="font-display text-lg font-semibold text-ink">
              No saved locations yet
            </h2>

            <p className="text-sm text-ink-soft leading-relaxed mt-2 max-w-[280px]">
              Save an Ayah while reading the Quran or your Khatm and continue
              from exactly where you left off.
            </p>

          </div>
        </div>
      </div>
    );
  }

  /*
   * ========================================
   * FILTER SAVED LOCATIONS
   * ========================================
   */

  const quranBookmarks =
    savedLocations.filter(
      (progress) =>
        progress.type === "quran",
    );

  const khatmProgress =
    savedLocations.filter(
      (progress) =>
        progress.type === "khatm",
    );

  /*
   * ========================================
   * MAIN SAVED PAGE
   * ========================================
   */

  return (
    <div className="min-h-screen bg-cream px-5 py-6">
      <div className="max-w-md mx-auto">

        <PageHeader />

        {/* ====================================
            QURAN BOOKMARKS
        ===================================== */}

        {quranBookmarks.length > 0 && (
          <section className="mb-8">

            <div className="flex items-center gap-2 mb-3">

              <Bookmark
                size={18}
                className="text-emerald-deep"
              />

              <h2 className="font-display text-base font-semibold text-ink">
                Quran Bookmarks
              </h2>

              <span className="text-xs text-ink-faint">
                ({quranBookmarks.length})
              </span>

            </div>

            <div className="space-y-3">

              {quranBookmarks.map(
                (progress) => (
                  <SavedLocationCard
                    key={progress._id}
                    progress={progress}
                    type="quran"
                    isDeleting={
                      deletingId ===
                      progress._id
                    }
                    onContinue={() =>
                      handleContinue(
                        progress,
                      )
                    }
                    onDelete={() =>
                      handleDelete(
                        progress._id,
                      )
                    }
                  />
                ),
              )}

            </div>
          </section>
        )}

        {/* ====================================
            KHATM READING PROGRESS
        ===================================== */}

        {khatmProgress.length > 0 && (
          <section>

            <div className="flex items-center gap-2 mb-3">

              <BookOpen
                size={18}
                className="text-emerald-deep"
              />

              <h2 className="font-display text-base font-semibold text-ink">
                Khatm Reading Progress
              </h2>

              <span className="text-xs text-ink-faint">
                ({khatmProgress.length})
              </span>

            </div>

            <div className="space-y-3">

              {khatmProgress.map(
                (progress) => (
                  <SavedLocationCard
                    key={progress._id}
                    progress={progress}
                    type="khatm"
                    isDeleting={
                      deletingId ===
                      progress._id
                    }
                    onContinue={() =>
                      handleContinue(
                        progress,
                      )
                    }
                    onDelete={() =>
                      handleDelete(
                        progress._id,
                      )
                    }
                  />
                ),
              )}

            </div>
          </section>
        )}

      </div>
    </div>
  );
}

/*
 * ========================================
 * PAGE HEADER
 * ========================================
 */

function PageHeader() {
  return (
    <div className="mb-7">

      <h1 className="font-display text-2xl font-semibold text-ink">
        Saved
      </h1>

      <p className="text-sm text-ink-soft mt-1">
        Your saved Quran reading locations
      </p>

    </div>
  );
}

/*
 * ========================================
 * SAVED LOCATION CARD
 * ========================================
 */

function SavedLocationCard({
  progress,
  type,
  isDeleting,
  onContinue,
  onDelete,
}) {
  const isQuranBookmark =
    type === "quran";

  /*
   * KHATM TITLE
   */

  const khatmTitle =
    progress.khatm?.title ||
    progress.khatm?.dedicatedTo ||
    "Quran Khatm";

  /*
   * CARD TITLE
   */

  const title =
    isQuranBookmark
      ? "Quran"
      : khatmTitle;

  /*
   * PARA NUMBER
   *
   * Quran:
   * resolved juzNumber / paraNumber
   *
   * Khatm:
   * stored paraNumber
   */

  const paraNumber =
    isQuranBookmark
      ? (
          progress.juzNumber ??
          progress.paraNumber
        )
      : progress.paraNumber;

  /*
   * LOCATION
   */

  const locationText =
    `Para ${
      paraNumber ?? "—"
    } · Surah ${
      progress.surahNumber ?? "—"
    } · Ayah ${
      progress.ayahNumber ?? "—"
    }`;

  return (
    <div className="w-full bg-cream-card border border-emerald-deep/10 rounded-2xl p-4">

      <div className="flex items-center gap-3">

        {/* CONTINUE */}

        <button
          type="button"
          onClick={onContinue}
          disabled={isDeleting}
          className="flex flex-1 items-center gap-3 min-w-0 text-left disabled:opacity-60"
        >

          <div className="w-11 h-11 rounded-xl bg-emerald-soft flex items-center justify-center shrink-0">

            {isQuranBookmark ? (
              <Bookmark
                size={20}
                className="text-emerald-deep"
              />
            ) : (
              <BookOpen
                size={21}
                className="text-emerald-deep"
              />
            )}

          </div>

          <div className="flex-1 min-w-0">

            <p className="font-semibold text-ink text-sm truncate">
              {title}
            </p>

            <p className="text-xs text-ink-soft mt-1">
              {locationText}
            </p>

          </div>

        </button>

        {/* DELETE */}

        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-ink-faint hover:bg-red-50 hover:text-red-500 transition-colors shrink-0 disabled:opacity-60"
          aria-label="Delete saved location"
        >
          {isDeleting ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <Trash2
              size={18}
            />
          )}
        </button>

        {/* CONTINUE ARROW */}

        <button
          type="button"
          onClick={onContinue}
          disabled={isDeleting}
          className="w-8 h-10 flex items-center justify-center text-ink-faint shrink-0 disabled:opacity-60"
          aria-label="Continue reading"
        >
          <ChevronRight
            size={20}
          />
        </button>

      </div>
    </div>
  );
}