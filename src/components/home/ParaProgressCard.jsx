import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import Button from "../common/Button";

export default function ParaProgressCard({ khatm, para }) {
  const isCompleted = para?.status === "completed";

  return (
    <div className="bg-cream-card rounded-xl2 p-5 border border-emerald-deep/6 shadow-card mb-6 animate-fade-up">
      <p className="text-xs font-semibold text-ink-soft uppercase tracking-wide mb-3.5">
        Your Juz
      </p>

      {para ? (
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 ${
              isCompleted
                ? "bg-gold-dim text-gold"
                : "bg-emerald-soft text-emerald-deep"
            }`}
          >
            <BookOpen size={16} strokeWidth={1.8} />

            <span className="font-display text-sm font-semibold mt-0.5">
              {para.number}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-display text-[15px] font-semibold text-ink">
              Juz {para.number}
            </h3>

            <p className="text-xs text-ink-soft mt-0.5">
              {isCompleted
                ? "✓ Completed"
                : "Status: In Progress"}
            </p>
          </div>

          <Link
            to={`/khatm/${khatm._id}/para/${para.number}/read`}
            className="shrink-0"
          >
            <Button size="sm">
              {isCompleted ? "Read Again" : "Continue"}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-ink-soft">
            You haven't claimed a Para yet.
          </p>

          <Link
            to={`/khatm/${khatm._id}/paras`}
            className="shrink-0"
          >
            <Button size="sm" variant="outline">
              Claim One
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}