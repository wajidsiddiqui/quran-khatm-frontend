import { Link } from "react-router-dom";
import {
  BookOpenText,
  ArrowRight,
} from "lucide-react";

import Button from "../common/Button";

export default function ContinueReadingCard({
  khatm,
  para,
  percentage = 0,
  completedAyahs = 0,
  totalAyahs = 0,
  progressLoading = false,
}) {
  const hasPara = Boolean(khatm && para);

  const isCompleted =
    para?.status === "completed";

  const safePercentage = Math.min(
    100,
    Math.max(0, Number(percentage) || 0)
  );

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
          background:
            "rgba(251, 191, 36, 0.12)",
        }}
      />

      <div
        className="absolute -right-4 bottom-0 h-28 w-28 rounded-full"
        style={{
          background:
            "rgba(255, 255, 255, 0.05)",
        }}
      />

      {/* Quran Icon */}
      <div
        className="absolute right-5 top-5"
        style={{
          color:
            "rgba(255, 255, 255, 0.12)",
        }}
      >
        <BookOpenText
          size={70}
          strokeWidth={1.2}
        />
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
            {/* Para Number */}
            <h2
              className="mb-2 font-display text-3xl font-semibold"
              style={{
                color: "#FFFFFF",
              }}
            >
              Para {para.number}
            </h2>

            {/* Status */}
            <p
              className="mb-5 text-sm"
              style={{
                color: "#D1FAE5",
              }}
            >
              {isCompleted
                ? "● Completed"
                : "● In Progress"}
            </p>

            {/* Actual Para Reading Progress */}
            {!isCompleted && (
              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <p
                    className="text-sm font-medium"
                    style={{
                      color: "#D1FAE5",
                    }}
                  >
                    Your progress in Para{" "}
                    {para.number}
                  </p>

                  <span
                    className="text-sm font-bold"
                    style={{
                      color: "#FFFFFF",
                    }}
                  >
                    {progressLoading
                      ? "..."
                      : `${safePercentage}%`}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${safePercentage}%`,
                      background:
                        "#FCD34D",
                    }}
                  />
                </div>

                {/* Ayah Count */}
                {!progressLoading &&
                  totalAyahs > 0 && (
                    <p
                      className="mt-2 text-xs"
                      style={{
                        color:
                          "rgba(209, 250, 229, 0.75)",
                      }}
                    >
                      {completedAyahs} of{" "}
                      {totalAyahs} Ayahs
                    </p>
                  )}
              </div>
            )}

            {/* Completed Message */}
            {isCompleted && (
              <div
                className="mb-6 rounded-xl px-4 py-3 text-sm"
                style={{
                  background:
                    "rgba(255, 255, 255, 0.08)",
                  color: "#D1FAE5",
                }}
              >
                You have completed
                reading this Para.
              </div>
            )}

            {/* Continue Button */}
            <div className="flex justify-end">
              <Link
                to={`/khatm/${khatm._id}/para/${para.number}/read`}
              >
                <Button
                  variant="gold"
                  size="sm"
                  icon={ArrowRight}
                >
                  {isCompleted
                    ? "Read Again"
                    : "Continue Reading"}
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* No Para */}
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
              Pick up the Quran and
              begin a peaceful reading
              session.
            </p>

            <div className="flex justify-end">
              <Link to="/quran">
                <Button
                  variant="gold"
                  size="sm"
                  icon={ArrowRight}
                >
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