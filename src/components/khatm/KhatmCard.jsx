import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import Card from "../common/Card";
import ProgressBar from "../common/ProgressBar";
import { paraProgress } from "../../data/mockData";

export default function KhatmCard({ khatm }) {
  const { completed, percent } = paraProgress(khatm);
  return (
    <Link to={`/khatm/${khatm.id}`}>
      <Card className="mb-4 hover:shadow-soft transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs text-gold font-semibold uppercase tracking-wide mb-1">
              {khatm.intentionType}
            </p>
            <h3 className="font-display text-lg font-medium text-ink leading-snug">{khatm.title}</h3>
          </div>
          {khatm.status === "completed" && (
            <span className="text-[11px] font-semibold text-gold bg-gold-dim px-2.5 py-1 rounded-full shrink-0 ml-2">
              Completed
            </span>
          )}
        </div>
        <ProgressBar percent={percent} className="mb-2.5" />
        <div className="flex items-center justify-between text-sm text-ink-soft">
          <span>{completed} / 30 Completed</span>
          <span className="flex items-center gap-1">
            <Users size={14} /> {khatm.memberCount} Members
          </span>
        </div>
      </Card>
    </Link>
  );
}
