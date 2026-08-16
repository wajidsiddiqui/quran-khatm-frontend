import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { Bookmark, ChevronLeft, ChevronRight, ChevronLeft as Back, Volume2 } from "lucide-react";
import { fetchSurah } from "../../services/quranApi";
import { useAyahAudio } from "../../hooks/useAyahAudio";
import { QuranLoading, QuranError } from "../../components/quran/QuranStateNotice";
import MushafFrame from "../../components/quran/MushafFrame";

const TOTAL_SURAHS = 114;

export default function SurahReading() {
  const { id } = useParams();
  const navigate = useNavigate();
  const surahNumber = Number(id);

  const [surah, setSurah] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("quran");
  const [bookmarked, setBookmarked] = useState(false);
  const [fontSize, setFontSize] = useState(23);
  const { playingAyah, toggle: toggleAyahAudio, reset: resetAudio } = useAyahAudio();

  const load = useCallback(() => {
    setError(null);
    setSurah(null);
    fetchSurah(surahNumber)
      .then(setSurah)
      .catch((e) => setError(e.message));
  }, [surahNumber]);

  useEffect(() => {
    load();
    window.scrollTo(0, 0);
    resetAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  const goTo = (delta) => {
    const target = surahNumber + delta;
    if (target >= 1 && target <= TOTAL_SURAHS) navigate(`/quran/surah/${target}`);
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <div className="sticky top-0 z-20 bg-cream/90 backdrop-blur px-5 pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-emerald-soft flex items-center justify-center">
            <Back size={20} className="text-emerald-deep" />
          </button>
          <div className="text-center">
            <h1 className="font-display text-lg font-medium text-ink">{surah?.name || `Surah ${surahNumber}`}</h1>
            <p className="text-xs text-ink-soft">{surah ? `${surah.verses} Verses` : "\u00A0"}</p>
          </div>
          <button
            onClick={() => setBookmarked((b) => !b)}
            className="w-10 h-10 rounded-full bg-emerald-soft flex items-center justify-center"
          >
            <Bookmark size={18} className={bookmarked ? "text-gold fill-gold" : "text-emerald-deep"} />
          </button>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-soft/60 p-1 rounded-full mb-1">
          {["quran", "translation"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 text-[13px] font-semibold py-2 rounded-full capitalize transition-colors ${
                tab === t ? "bg-emerald text-cream shadow-soft" : "text-emerald-deep/70"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-5 pt-3 pb-6">
        {error ? (
          <QuranError onRetry={load} />
        ) : !surah ? (
          <QuranLoading label={`Loading Surah ${surahNumber}...`} />
        ) : tab === "quran" ? (
          <MushafFrame label={`Surah ${surah.number} \u00b7 ${surah.arabicName}`}>
            <div className="space-y-7">
              {surah.ayahs.map((a) => (
                <p
                  key={a.number}
                  className="font-arabic-indopak font-bold text-right text-[#141414] leading-[2.5]"
                  style={{ fontSize, textAlign: "justify", textAlignLast: "right" }}
                >
                  {a.arabic}{" "}
                  <button
                    onClick={() => toggleAyahAudio(a.globalNumber)}
                    className="inline-flex items-center justify-center align-middle text-[11px] text-gold border border-gold/50 rounded-full w-6 h-6 hover:bg-gold-dim transition-colors"
                    aria-label={`Play recitation for ayah ${a.number}`}
                  >
                    {playingAyah === a.globalNumber ? <Volume2 size={11} /> : a.number}
                  </button>
                </p>
              ))}
            </div>
          </MushafFrame>
        ) : (
          <div className="space-y-5">
            {surah.ayahs.map((a) => (
              <div key={a.number} className="flex gap-3">
                <span className="text-xs text-gold border border-gold/40 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                  {a.number}
                </span>
                <p className="text-[15px] text-ink leading-relaxed">{a.translation}</p>
              </div>
            ))}
          </div>
        )}

        {surah && tab === "quran" && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className="text-xs text-ink-faint">Font Size</span>
            <button onClick={() => setFontSize((f) => Math.max(18, f - 2))} className="w-7 h-7 rounded-full bg-emerald-soft text-emerald-deep text-xs font-bold flex items-center justify-center">A-</button>
            <button onClick={() => setFontSize((f) => Math.min(34, f + 2))} className="w-7 h-7 rounded-full bg-emerald-soft text-emerald-deep text-xs font-bold flex items-center justify-center">A+</button>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-cream/95 backdrop-blur border-t border-emerald-deep/8 px-5 py-4 flex items-center justify-between">
        <button
          onClick={() => goTo(-1)}
          disabled={surahNumber <= 1}
          className="flex items-center gap-1 text-sm font-semibold text-emerald-deep disabled:opacity-30"
        >
          <ChevronLeft size={16} /> Previous
        </button>
        <span className="text-xs text-ink-faint">{surahNumber} / {TOTAL_SURAHS}</span>
        <button
          onClick={() => goTo(1)}
          disabled={surahNumber >= TOTAL_SURAHS}
          className="flex items-center gap-1 text-sm font-semibold text-emerald-deep disabled:opacity-30"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
