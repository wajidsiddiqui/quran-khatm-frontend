import {
  Link,
} from "react-router-dom";

import {
  Users,
  Heart,
  ArrowRight,
} from "lucide-react";

import ProgressBar from "../common/ProgressBar";

import Button from "../common/Button";


export default function ActiveKhatmCard({
  khatm,
  progress,
  isCreator = false,
}) {
  /* =========================================================
     KHATM ID
  ========================================================= */

  const khatmId =
    khatm?._id ||
    khatm?.id;


  /* =========================================================
     FULL KHATM COMPLETION
  ========================================================= */

  const completedJuz =
    Number(
      progress?.completed,
    ) || 0;


  const isFullKhatmCompleted =
    completedJuz >= 30;


  /* =========================================================
     FINAL KHATM DUA BUTTON
     
     ONLY:
     1. All 30 Juz are completed
     2. Current user is creator
     3. Khatm is still active
     
     The Khatm becomes officially completed only
     after the creator finishes the final Khatm Dua.
  ========================================================= */

  const showKhatmDuaButton =
    isFullKhatmCompleted &&
    isCreator &&
    khatm?.status ===
      "active";


  return (
    <div className="relative bg-cream-card rounded-xl2 p-5 border border-emerald-deep/6 shadow-card overflow-hidden mb-6 animate-fade-up">

      {/* =====================================================
          DECORATIVE CIRCLE
      ====================================================== */}

      <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-emerald-soft/60 pointer-events-none" />


      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="relative flex items-start justify-between mb-4">

        <div>

          <p className="text-xs font-semibold text-gold uppercase tracking-wide mb-1">
            Active Quran Khatm
          </p>


          <p className="text-xs text-ink-soft mb-0.5">
            {khatm.intentionType}
          </p>


          <h3 className="font-display text-lg font-semibold text-ink">
            {khatm.dedicatedTo}
          </h3>

        </div>


        <span className="shrink-0 ml-3 text-lg font-display font-semibold text-emerald-deep">
          {progress.percent}%
        </span>

      </div>


      {/* =====================================================
          PROGRESS BAR
      ====================================================== */}

      <ProgressBar
        percent={
          progress.percent
        }
        className="mb-3"
      />


      {/* =====================================================
          KHATM SUMMARY + VIEW BUTTON
      ====================================================== */}

      <div className="relative flex items-center justify-between">

        <div className="flex items-center gap-4 text-xs text-ink-soft">

          <span className="font-medium text-ink">
            {progress.completed} / 30 Juz
          </span>


          <span className="flex items-center gap-1">

            <Users
              size={13}
            />

            {khatm.memberCount ??
              khatm.members?.length ??
              0}{" "}
            Members

          </span>

        </div>


        <Link
          to={`/khatm/${khatmId}`}
        >
          <Button
            size="sm"
            variant="outline"
          >
            View Khatm
          </Button>
        </Link>

      </div>


      {/* =====================================================
          FINAL KHATM DUA
      ====================================================== */}

      {showKhatmDuaButton && (
        <div className="relative mt-4 pt-4 border-t border-gold/15">

          {/* =================================================
              COMPLETION MESSAGE
          ================================================== */}

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-dim text-gold">

              <Heart
                size={18}
                fill="currentColor"
                strokeWidth={1.8}
              />

            </div>


            <div className="min-w-0 flex-1">

              <p className="text-sm font-semibold text-emerald-deep">
                All 30 Juz Completed
              </p>


              <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">
                Your Khatm is ready for the final Dua.
              </p>

            </div>

          </div>


          {/* =================================================
              FINAL KHATM DUA BUTTON

              Uses the same Button component and sizing
              pattern as the rest of the application.
          ================================================== */}

          <Link
            to={`/khatm/${khatmId}/khatm-dua`}
            className="mt-3 block"
          >

            <Button
              size="sm"
              className="w-full"
              variant="gold"
              icon={ArrowRight}
            >
              Make Dua for This Khatm
            </Button>

          </Link>

        </div>
      )}

    </div>
  );
}