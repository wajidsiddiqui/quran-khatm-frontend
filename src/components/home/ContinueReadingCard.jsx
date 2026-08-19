import { Link } from "react-router-dom";
import { BookOpenText, ArrowRight } from "lucide-react";
import Button from "../common/Button";

export default function ContinueReadingCard({ khatm, para }) {
  const hasPara = Boolean(khatm && para);

  return (
    <div
      className="relative mb-6 overflow-hidden rounded-2xl p-6"
      style={{
        background:
          "linear-gradient(135deg, #064E3B 0%, #065F46 55%, #047857 100%)",
      }}
    >
      {/* Decorative circles */}
      <div
        className="absolute -right-10 -top-10 h-40 w-40 rounded-full"
        style={{
          background: "rgba(251, 191, 36, 0.12)",
        }}
      />

      <div
        className="absolute -right-4 bottom-0 h-28 w-28 rounded-full"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
        }}
      />

      {/* Quran Icon */}
      <div
        className="absolute right-5 top-5"
        style={{
          color: "rgba(255, 255, 255, 0.12)",
        }}
      >
        <BookOpenText size={70} strokeWidth={1.2} />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <p
          className="mb-3 text-xs font-bold uppercase tracking-widest"
          style={{
            color: "#FCD34D",
          }}
        >
          Continue Your Journey
        </p>

        {hasPara ? (
          <>
            <h2
              className="mb-2 font-display text-3xl font-semibold"
              style={{
                color: "#FFFFFF",
              }}
            >
              Para {para.number}
            </h2>

            <p
              className="mb-6 text-sm"
              style={{
                color: "#D1FAE5",
              }}
            >
              {para.status === "completed"
                ? "Completed · "
                : "In progress · "}
              {khatm?.dedicatedTo || "Your Khatm"}
            </p>

            {/* Button Right Side */}
            <div className="flex justify-end">
              <Link
                to={`/khatm/${khatm._id}/para/${para.number}/read`}
              >
                <Button variant="gold" size="sm" icon={ArrowRight}>
                  {para.status === "completed"
                    ? "Read Again"
                    : "Continue Reading"}
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <h2
              className="mb-2 font-display text-3xl font-semibold"
              style={{
                color: "#FFFFFF",
              }}
            >
              Start Reading
            </h2>

            <p
              className="mb-6 max-w-sm text-sm leading-relaxed"
              style={{
                color: "#D1FAE5",
              }}
            >
              Pick up the Quran and begin a peaceful reading session.
            </p>

            {/* Browse Quran Button - Right Side */}
            <div className="flex justify-end">
              <Link to="/quran">
                <Button variant="gold" size="sm" icon={ArrowRight}>
                  Browse the Quran
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}