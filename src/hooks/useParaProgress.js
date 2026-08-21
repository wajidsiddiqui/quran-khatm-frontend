import {
  useEffect,
  useState,
} from "react";

import { fetchJuz } from "../services/quranApi";
import { calculateParaProgress } from "../utils/quranProgress";

export function useParaProgress(
  paraNumber,
  readingProgress,
) {
  const [juz, setJuz] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  /*
   * STEP 1:
   * Load Quran/Para data ONLY when
   * the Para number changes.
   *
   * readingProgress is intentionally
   * NOT included here.
   */
  useEffect(() => {
    if (!paraNumber) {
      setJuz(null);
      setError(null);
      setLoading(false);

      return;
    }

    let cancelled = false;

    async function loadPara() {
      try {
        setLoading(true);
        setError(null);

        const data =
          await fetchJuz(
            Number(paraNumber),
          );

        if (cancelled) {
          return;
        }

        setJuz(data);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load Para:",
          error.message,
        );

        setError(error.message);
        setJuz(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPara();

    return () => {
      cancelled = true;
    };
  }, [paraNumber]);

  /*
   * STEP 2:
   * Calculate progress separately.
   *
   * When readingProgress changes,
   * ONLY this calculation runs.
   *
   * Quran API is NOT called again.
   */
  const progress =
    calculateParaProgress(
      juz,
      readingProgress,
    );

  return {
    juz,

    completedAyahs:
      progress.completedAyahs,

    totalAyahs:
      progress.totalAyahs,

    percentage:
      progress.percentage,

    loading,
    error,
  };
}