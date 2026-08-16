import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import ProgressBar from "../common/ProgressBar";
import Button from "../common/Button";

export default function ActiveKhatmCard({ khatm, progress }) {
  return (
    <div className="relative bg-cream-card rounded-xl2 p-5 border border-emerald-deep/6 shadow-card overflow-hidden mb-6 animate-fade-up">
      <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-emerald-soft/60 pointer-events-none" />

      <div className="relative flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-gold uppercase tracking-wide mb-1">
            Active Quran Khatm
          </p>
          <p className="text-xs text-ink-soft mb-0.5">{khatm.intentionType}</p>
          <h3 className="font-display text-lg font-semibold text-ink">{khatm.dedicatedTo}</h3>
        </div>
        <span className="shrink-0 ml-3 text-lg font-display font-semibold text-emerald-deep">
          {progress.percent}%
        </span>
      </div>

      <ProgressBar percent={progress.percent} className="mb-3" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-ink-soft">
          <span className="font-medium text-ink">{progress.completed} / 30 Paras</span>
          <span className="flex items-center gap-1">
            <Users size={13} /> {khatm.memberCount} Members
          </span>
        </div>
        <Link to={`/khatm/${khatm.id}`}>
          <Button size="sm" variant="outline">View Khatm</Button>
        </Link>
      </div>
    </div>
  );
}
