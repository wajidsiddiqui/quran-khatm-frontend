import { Link } from "react-router-dom";

export default function SurahCard({ surah }) {
  return (
    <Link
      to={`/quran/surah/${surah.number}`}
      className="flex items-center justify-between py-3.5 border-b border-emerald-deep/6 last:border-0"
    >
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-full bg-emerald-soft flex items-center justify-center text-emerald-deep font-display font-semibold text-sm">
          {surah.number}
        </div>
        <div>
          <p className="font-semibold text-ink text-[15px]">{surah.name}</p>
          <p className="text-xs text-ink-soft">{surah.verses} Verses</p>
        </div>
      </div>
      <p className="font-arabic text-xl text-emerald-deep">{surah.arabic}</p>
    </Link>
  );
}
