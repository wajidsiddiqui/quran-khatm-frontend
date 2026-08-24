import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { ChevronRight } from "lucide-react";
import { useKhatms } from "../../context/KhatmContext";
import { fetchJuz } from "../../services/quranApi";
import {
  QuranLoading,
  QuranError,
} from "../../components/quran/QuranStateNotice";
import MushafFrame from "../../components/quran/MushafFrame";
import TopBar from "../../components/common/TopBar";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

export default function JuzDetail() {
  const { num } = useParams();
  const navigate = useNavigate();
  const { khatms } = useKhatms();
  const juzNumber = Number(num);

  const activeKhatm = khatms.find((k) => k.status === "active");
  const myPara = activeKhatm?.paras.find(
    (p) => p.number === juzNumber && p.assignedToId === "u1",
  );

  const [juz, setJuz] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setError(null);
    setJuz(null);
    fetchJuz(juzNumber)
      .then(setJuz)
      .catch((e) => setError(e.message));
  }, [juzNumber]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="min-h-screen bg-cream">
      <TopBar title={`Para ${num}`} />
      <div className="px-5 pb-8">
        {myPara && activeKhatm && (
          <Card className="mb-5 bg-emerald-soft !border-emerald/20">
            <p className="text-xs font-semibold text-emerald-deep uppercase tracking-wide mb-1">
              Your Assigned Para
            </p>
            <h3 className="font-display text-lg font-semibold text-ink mb-1">
              Para {num}
            </h3>
            <p className="text-sm text-ink-soft mb-4">
              {myPara.status === "completed" ? "✓ Completed" : "In Progress"} ·{" "}
              {activeKhatm.dedicatedTo}
            </p>
            <Button
              size="sm"
              className="w-full"
              onClick={() =>
                navigate(`/khatm/${activeKhatm.id}/para/${num}/read`)
              }
            >
              Continue Reading
            </Button>
          </Card>
        )}

        {error ? (
          <QuranError onRetry={load} />
        ) : !juz ? (
          <QuranLoading label={`Loading Para ${juzNumber}...`} />
        ) : (
          <MushafFrame
            label={`Juz ${juzNumber} \u00b7 Surahs`}
            className="!px-0 !pb-0 mb-4"
          >
            <div className="divide-y divide-gold/15">
              {juz.surahGroups.map((g) => (
                <button
                  key={g.surahNumber}
                  onClick={() => navigate(`/quran/surah/${g.surahNumber}`)}
                  className="w-full flex items-center justify-between px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-soft flex items-center justify-center text-emerald-deep font-display font-semibold text-xs shrink-0">
                      {g.surahNumber}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-ink text-[15px]">
                        {g.surahName}
                      </p>
                      <p className="text-xs text-ink-soft">
                        {g.ayahs.length} verses in this Para
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-quran font-bold text-lg text-emerald-deep">
                      {g.surahArabicName}
                    </p>
                    <ChevronRight size={16} className="text-ink-faint" />
                  </div>
                </button>
              ))}
            </div>
          </MushafFrame>
        )}

        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={() => navigate("/quran")}
        >
          Browse All Surahs
        </Button>
      </div>
    </div>
  );
}
