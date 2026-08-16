import { Link } from "react-router-dom";
import { BookOpenText, ArrowRight } from "lucide-react";
import Button from "../common/Button";

// Hero "continue reading" card. Falls back to a general Quran CTA when the
// user has no active Khatm / claimed Para yet — reuses existing routes only.
export default function ContinueReadingCard({ khatm, para }) {
  const hasPara = !!(khatm && para);

  return (
    <div className="relative rounded-xl2 bg-emerald-gradient geo-pattern-dark p-6 mb-6 overflow-hidden shadow-soft animate-fade-up">
      {/* decorative shapes */}
      <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full bg-gold/10 pointer-events-none" />
      <div className="absolute -right-2 bottom-2 w-24 h-24 rounded-full bg-cream/5 pointer-events-none" />
      <div className="absolute right-5 top-5 text-cream/10 pointer-events-none">
        <BookOpenText size={64} strokeWidth={1} />
      </div>

      <div className="relative">
        <p className="text-gold text-xs font-semibold uppercase tracking-wide mb-2">
          Continue Your Journey
        </p>

        {hasPara ? (
          <>
            <h2 className="font-display text-2xl font-semibold text-cream mb-1">Para {para.number}</h2>
            <p className="text-cream/60 text-xs mb-5">
              {para.status === "completed" ? "Completed \u00b7 " : "In progress \u00b7 "}
              {khatm.dedicatedTo}
            </p>
            <Link to={`/khatm/${khatm.id}/para/${para.number}/read`}>
              <Button variant="gold" size="sm" icon={ArrowRight}>
                {para.status === "completed" ? "Read Again" : "Continue Reading"}
              </Button>
            </Link>
          </>
        ) : (
          <>
            <h2 className="font-display text-2xl font-semibold text-cream mb-1">Start Reading</h2>
            <p className="text-cream/60 text-xs mb-5">
              Pick up the Quran and begin a peaceful reading session.
            </p>
            <Link to="/quran">
              <Button variant="gold" size="sm" icon={ArrowRight}>
                Browse the Quran
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
