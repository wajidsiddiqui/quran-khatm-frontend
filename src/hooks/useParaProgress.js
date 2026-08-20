import { useEffect, useState } from "react";

import { fetchJuz } from "../services/quranApi";
import { calculateParaProgress } from "../utils/quranProgress";

export function useParaProgress(paraNumber, readingProgress) {
  const [juz, setJuz] = useState(null);
  const [progress, setProgress] = useState({
    completedAyahs: 0,
    totalAyahs: 0,
    percentage: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!paraNumber) {
      setJuz(null);
      setProgress({
        completedAyahs: 0,
        totalAyahs: 0,
        percentage: 0,
      });
      return;
    }

    let cancelled = false;

    async function loadPara() {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchJuz(Number(paraNumber));

        if (cancelled) {
          return;
        }

        setJuz(data);

        const calculated = calculateParaProgress(data, readingProgress);

        setProgress(calculated);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Failed to calculate Para progress:", error.message);

        setError(error.message);

        setJuz(null);

        setProgress({
          completedAyahs: 0,
          totalAyahs: 0,
          percentage: 0,
        });
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
  }, [paraNumber, readingProgress]);

  return {
    juz,
    completedAyahs: progress.completedAyahs,
    totalAyahs: progress.totalAyahs,
    percentage: progress.percentage,
    loading,
    error,
  };
}
