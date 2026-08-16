import { Link } from "react-router-dom";

export default function JuzGrid() {
  return (
    <div className="grid grid-cols-5 gap-2.5">
      {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => (
        <Link
          key={n}
          to={`/quran/juz/${n}`}
          className="aspect-square rounded-xl bg-cream-card border border-emerald-deep/8 flex items-center justify-center font-display font-semibold text-emerald-deep hover:bg-emerald-soft transition-colors"
        >
          {n}
        </Link>
      ))}
    </div>
  );
}
