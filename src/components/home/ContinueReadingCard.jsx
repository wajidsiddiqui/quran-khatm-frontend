import { Link } from "react-router-dom";

import {
  ArrowRight,
} from "lucide-react";

import Button from "../common/Button";

import quranCalligraphyBg from "../../assets/quran-calligraphy-bg.jpg";


/* =========================================================
   ANIMATION STYLES
========================================================= */

function CardAnimationStyles() {
  return (
    <style>{`
      @keyframes crc-fade-up {
        from {
          opacity: 0;
          transform: translateY(12px);
        }

        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes crc-twinkle {
        0%, 100% {
          opacity: 0.2;
          transform: scale(0.85);
        }

        50% {
          opacity: 0.8;
          transform: scale(1);
        }
      }

      @keyframes crc-shimmer {
        0% {
          transform: translateX(-120%);
        }

        100% {
          transform: translateX(320%);
        }
      }

      @keyframes crc-glow {
        0%, 100% {
          opacity: 0.35;
          transform: scale(1);
        }

        50% {
          opacity: 0.65;
          transform: scale(1.06);
        }
      }

      @keyframes crc-float {
        0%, 100% {
          transform: translateY(0);
        }

        50% {
          transform: translateY(-3px);
        }
      }

      @keyframes crc-ring {
        from {
          transform: rotate(0deg);
        }

        to {
          transform: rotate(360deg);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .crc-fade-up,
        .crc-twinkle,
        .crc-shimmer,
        .crc-glow,
        .crc-float,
        .crc-ring {
          animation: none !important;
        }
      }

      .crc-fade-up {
        animation:
          crc-fade-up
          0.5s
          cubic-bezier(0.16, 1, 0.3, 1)
          both;
      }

      .crc-twinkle {
        animation:
          crc-twinkle
          3.2s
          ease-in-out
          infinite;
      }

      .crc-shimmer {
        animation:
          crc-shimmer
          2.8s
          ease-in-out
          infinite;
      }

      .crc-glow {
        animation:
          crc-glow
          2.8s
          ease-in-out
          infinite;
      }

      .crc-float {
        animation:
          crc-float
          4s
          ease-in-out
          infinite;
      }

      .crc-ring {
        animation:
          crc-ring
          16s
          linear
          infinite;
      }
    `}</style>
  );
}


/* =========================================================
   QURAN CALLIGRAPHY BACKGROUND
   Uses the uploaded image from src/assets.
========================================================= */

function QuranCalligraphyBackground({
  opacity = 0.05,
  overlayClassName = "",
}) {
  return (
    <>
      <img
        src={quranCalligraphyBg}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center select-none"
        style={{
          opacity,
        }}
      />

      <div
        className={`pointer-events-none absolute inset-0 ${overlayClassName}`}
      />
    </>
  );
}


/* =========================================================
   EIGHT POINT STAR
========================================================= */

function EightPointStar({
  className = "",
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
    >
      <g transform="translate(50,50)">
        <rect
          x="-38"
          y="-38"
          width="76"
          height="76"
          rx="10"
          fill="currentColor"
        />

        <rect
          x="-38"
          y="-38"
          width="76"
          height="76"
          rx="10"
          fill="currentColor"
          transform="rotate(45)"
        />
      </g>
    </svg>
  );
}


/* =========================================================
   OPEN BOOK ILLUSTRATION
========================================================= */

function OpenBookIllustration({
  className = "",
  tone = "gold",
}) {
  const page =
    tone === "gold"
      ? "#FCEFC7"
      : "#DCEFE5";

  const line =
    tone === "gold"
      ? "#B98F2E"
      : "#0F5C46";

  const cover =
    tone === "gold"
      ? "#D9B76A"
      : "#0F5C46";

  return (
    <svg
      viewBox="0 0 64 48"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M14 44 L50 44 L46 40 L18 40 Z"
        fill={cover}
        opacity="0.5"
      />

      <path
        d="M32 12 C24 8 14 8 8 11 L8 34 C14 31 24 31 32 35 Z"
        fill={page}
        stroke={line}
        strokeWidth="1"
      />

      <path
        d="M32 12 C40 8 50 8 56 11 L56 34 C50 31 40 31 32 35 Z"
        fill={page}
        stroke={line}
        strokeWidth="1"
      />

      <path
        d="M32 12 L32 35"
        stroke={line}
        strokeWidth="1.4"
      />

      <path
        d="M12 16 L27 19 M12 21 L27 24 M12 26 L27 29"
        stroke={line}
        strokeWidth="0.8"
        opacity="0.55"
        strokeLinecap="round"
      />

      <path
        d="M52 16 L37 19 M52 21 L37 24 M52 26 L37 29"
        stroke={line}
        strokeWidth="0.8"
        opacity="0.55"
        strokeLinecap="round"
      />
    </svg>
  );
}


/* =========================================================
   MOON + STARS
========================================================= */

function MoonAndStars() {
  const stars = [
    {
      top: "14%",
      left: "60%",
      delay: "0s",
      size: 3,
    },
    {
      top: "27%",
      left: "74%",
      delay: "0.6s",
      size: 2,
    },
    {
      top: "11%",
      left: "84%",
      delay: "1.1s",
      size: 2.5,
    },
    {
      top: "38%",
      left: "66%",
      delay: "1.7s",
      size: 2,
    },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">

      <svg
        viewBox="0 0 40 40"
        className="absolute right-10 top-5 h-8 w-8 text-gold/45 sm:right-14"
        aria-hidden="true"
      >
        <path
          d="M25 4a16 16 0 1 0 11 27A13 13 0 0 1 25 4Z"
          fill="currentColor"
        />
      </svg>

      {stars.map(
        (
          star,
          index,
        ) => (
          <span
            key={index}
            className="crc-twinkle absolute rounded-full bg-white"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animationDelay:
                star.delay,
            }}
          />
        ),
      )}
    </div>
  );
}


/* =========================================================
   MOSQUE SILHOUETTE
========================================================= */

function MosqueSkyline({
  className = "",
}) {
  return (
    <svg
      viewBox="0 0 400 60"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M0 60 L0 40 L20 40 L20 30 L30 22 L40 30 L40 40 L60 40 L60 18 A12 12 0 0 1 84 18 L84 40 L100 40 L100 34 L110 34 L110 24 L115 18 L120 24 L120 34 L130 34 L130 40 L150 40 L150 12 A18 18 0 0 1 186 12 L186 40 L210 40 L210 30 L220 22 L230 30 L230 40 L250 40 L250 40 L260 40 L260 20 A14 14 0 0 1 288 20 L288 40 L310 40 L310 34 L320 34 L320 24 L325 18 L330 24 L330 34 L340 34 L340 40 L400 40 L400 60 Z"
        fill="currentColor"
      />
    </svg>
  );
}


/* =========================================================
   MEDALLION
========================================================= */

function Medallion({
  children,
  size = 56,
  tone = "gold",
}) {
  const ring =
    tone === "gold"
      ? "border-gold/40"
      : "border-emerald-deep/15";

  const bg =
    tone === "gold"
      ? "bg-white/[0.07]"
      : "bg-emerald-soft/60";

  const glow =
    tone === "gold"
      ? "bg-gold/20"
      : "bg-emerald-deep/10";

  return (
    <div
      className="relative flex shrink-0 items-center justify-center"
      style={{
        width: size,
        height: size,
      }}
    >
      <span
        className={`crc-glow pointer-events-none absolute inset-[-5px] rounded-full ${glow} blur-md`}
      />

      <span
        className={`crc-ring pointer-events-none absolute inset-[-3px] rounded-full border border-dashed ${
          tone === "gold"
            ? "border-gold/20"
            : "border-emerald-deep/15"
        }`}
      />

      <div
        className={`relative flex h-full w-full items-center justify-center rounded-full border ${ring} ${bg}`}
      >
        <div className="crc-float relative">
          {children}
        </div>
      </div>
    </div>
  );
}


/* =========================================================
   KHATM CARD
========================================================= */

function KhatmProgressCard({
  khatm,
  para,
  percentage = 0,
  completedAyahs = 0,
  totalAyahs = 0,
  progressLoading = false,
}) {
  const hasPara =
    Boolean(khatm && para);

  const isCompleted =
    para?.status ===
    "completed";

  const safePercentage =
    Math.min(
      100,
      Math.max(
        0,
        Number(
          percentage,
        ) || 0,
      ),
    );


  /* =======================================================
     EMPTY KHATM STATE
  ======================================================= */

  if (!hasPara) {
    return (
      <div className="crc-fade-up relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-deep via-emerald-800 to-emerald-900 px-6 py-7 shadow-card sm:px-8 sm:py-8">

        {/* IMAGE BACKGROUND */}

        <QuranCalligraphyBackground
          opacity={0.075}
          overlayClassName="bg-emerald-deep/25"
        />

        <MoonAndStars />

        <MosqueSkyline
          className="pointer-events-none absolute bottom-0 left-0 h-9 w-full text-white/[0.045]"
        />

        <EightPointStar
          className="pointer-events-none absolute -bottom-4 -left-4 h-20 w-20 text-white/[0.03]"
        />

        <div className="relative z-10">

          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">
            Khatm Progress
          </p>

          <h2 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
            No Active Khatm
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-relaxed text-emerald-100/80">
            Join or start a Khatm to get a
            Juz assigned and track your
            reading progress here.
          </p>

          <div className="mt-6">
            <Link to="/khatms">
              <Button
                variant="gold"
                size="sm"
                icon={ArrowRight}
              >
                Browse Khatms
              </Button>
            </Link>
          </div>

        </div>
      </div>
    );
  }


  /* =======================================================
     ACTIVE KHATM
  ======================================================= */

  return (
    <div className="crc-fade-up group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-deep via-emerald-800 to-emerald-900 px-6 py-7 shadow-card transition-all duration-500 hover:-translate-y-0.5 hover:shadow-2xl sm:px-8 sm:py-8">

      {/* IMAGE BACKGROUND */}

      <QuranCalligraphyBackground
        opacity={0.06}
        overlayClassName="bg-emerald-deep/25"
      />

      <MoonAndStars />

      <MosqueSkyline
        className="pointer-events-none absolute bottom-0 left-0 h-9 w-full text-white/[0.045]"
      />

      <EightPointStar
        className="pointer-events-none absolute -bottom-4 -left-4 h-20 w-20 text-white/[0.03]"
      />

      <div className="relative z-10">

        <div className="flex items-start justify-between gap-4">

          <div>

            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">
              Khatm Progress
            </p>

            <h2 className="mt-2 font-display text-3xl font-semibold text-white sm:text-4xl">
              Juz {para.number}
            </h2>

            <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-100/90">

              <span className="relative h-1.5 w-1.5">

                <span className="crc-glow absolute inset-0 rounded-full bg-gold" />

                <span className="relative block h-1.5 w-1.5 rounded-full bg-gold" />

              </span>

              {isCompleted
                ? "Completed"
                : "In Progress"}

            </p>

          </div>

          <Medallion
            size={58}
            tone="gold"
          >
            <OpenBookIllustration
              className="h-7 w-7"
              tone="gold"
            />
          </Medallion>

        </div>


        {!isCompleted && (
          <div className="mt-6">

            <div className="flex items-center justify-between gap-4">

              <p className="text-sm font-medium text-emerald-100/80">
                Your progress in Juz{" "}
                {para.number}
              </p>

              <span className="shrink-0 text-sm font-bold text-white">
                {progressLoading
                  ? "..."
                  : `${safePercentage}%`}
              </span>

            </div>


            <div className="relative mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/15">

              <div
                className="relative h-full rounded-full bg-gradient-to-r from-gold to-amber-400 transition-all duration-700"
                style={{
                  width: `${safePercentage}%`,
                }}
              >
                <span className="pointer-events-none absolute inset-y-0 right-0 w-3 rounded-full bg-white/50 blur-[3px]" />
              </div>

              <div className="crc-shimmer pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-transparent via-white/35 to-transparent" />

            </div>


            {!progressLoading &&
              totalAyahs > 0 && (
                <p className="mt-2 text-xs text-emerald-100/70">
                  {completedAyahs} of{" "}
                  {totalAyahs} Ayahs
                </p>
              )}

          </div>
        )}


        {isCompleted && (
          <div className="mt-6 rounded-xl bg-white/[0.08] px-4 py-3 text-sm text-emerald-100">
            You have completed reading
            this Juz.
          </div>
        )}


        <div className="mt-6">

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
                : "Continue Khatm Reading"}
            </Button>
          </Link>

        </div>

      </div>
    </div>
  );
}


/* =========================================================
   QURAN READING CARD — JUZ BASED
========================================================= */

function QuranReadingCard({
  quranReading,
  onStartReading,
}) {
  const cardShell =
    "crc-fade-up group relative overflow-hidden rounded-3xl border border-emerald-deep/10 bg-gradient-to-b from-white via-[#FFFDF8] to-[#F6F2E8] px-6 py-6 shadow-soft transition-all duration-500 hover:-translate-y-0.5 hover:shadow-xl sm:px-7";


  /* =======================================================
     EMPTY QURAN STATE
  ======================================================= */

  if (!quranReading) {
    return (
      <div
        className={cardShell}
        style={{
          animationDelay:
            "0.12s",
        }}
      >

        {/* IMAGE BACKGROUND */}

        <QuranCalligraphyBackground
          opacity={0.07}
          overlayClassName="bg-[#FFFDF8]/35"
        />

        <EightPointStar
          className="pointer-events-none absolute -bottom-3 -right-3 h-16 w-16 text-emerald-deep/[0.035]"
        />

        <div className="relative z-10">

          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-deep/70">
            Quran Reading
          </p>

          <h3 className="mt-1.5 font-display text-lg font-bold text-ink">
            No Saved Position
          </h3>

          <p className="mt-1 max-w-md text-sm leading-relaxed text-ink-soft">
            Start reading any Surah and
            your last reading position will
            appear here.
          </p>

          <button
            type="button"
            onClick={
              onStartReading
            }
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-soft px-4 py-2 text-sm font-semibold text-emerald-deep transition-all hover:bg-emerald-soft/70 hover:gap-3 active:scale-[0.98]"
          >
            Start Reading Quran

            <ArrowRight
              size={15}
              strokeWidth={2.5}
            />
          </button>

        </div>
      </div>
    );
  }


  const {
    juzNumber,
    juzCompletedAyahs = 0,
    juzTotalAyahs = 0,
    juzPercentage = 0,

    surahName,
    ayahNumber,

    onContinue,
  } = quranReading;


  const safeJuzNumber =
    Number(juzNumber) || 0;


  const safeCompletedAyahs =
    Math.max(
      0,
      Number(
        juzCompletedAyahs,
      ) || 0,
    );


  const safeJuzTotalAyahs =
    Math.max(
      0,
      Number(
        juzTotalAyahs,
      ) || 0,
    );


  const safeJuzPercentage =
    safeJuzTotalAyahs > 0
      ? Math.min(
          100,
          Math.max(
            0,
            Number(
              juzPercentage,
            ) ||
              Math.round(
                (safeCompletedAyahs /
                  safeJuzTotalAyahs) *
                  100,
              ),
          ),
        )
      : 0;


  return (
    <div
      className={cardShell}
      style={{
        animationDelay:
          "0.12s",
      }}
    >

      {/* IMAGE BACKGROUND */}

      <QuranCalligraphyBackground
        opacity={0.075}
        overlayClassName="bg-[#FFFDF8]/40"
      />

      <EightPointStar
        className="pointer-events-none absolute -bottom-3 -right-3 h-16 w-16 text-emerald-deep/[0.035]"
      />


      <div className="relative z-10">

        {/* =================================================
            HEADER
        ================================================== */}

        <div className="flex items-start justify-between gap-4">

          <div className="min-w-0">

            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-deep/70">
              Quran Reading
            </p>

            <h3 className="mt-1.5 font-display text-lg font-bold text-ink">
              Last Read
            </h3>


            {/* MAIN JUZ */}

            <p className="mt-2 font-display text-xl font-bold text-emerald-deep sm:text-2xl">
              {safeJuzNumber
                ? `Juz ${safeJuzNumber}`
                : "Quran Reading"}
            </p>


            {/* EXACT SAVED POSITION */}

            <p className="mt-1 truncate font-quran text-sm font-semibold text-emerald-deep/75 sm:text-base">
              {surahName ||
                "Quran"}
              {" · "}
              Ayah{" "}
              {ayahNumber}
            </p>

          </div>


          <Medallion
            size={56}
            tone="emerald"
          >
            <OpenBookIllustration
              className="h-7 w-7"
              tone="emerald"
            />
          </Medallion>

        </div>


        {/* =================================================
            JUZ PROGRESS
        ================================================== */}

        <div className="mt-6">

          <div className="flex items-center justify-between gap-4">

            <p className="text-sm font-medium text-ink-soft">
              {safeJuzNumber
                ? `Your progress in Juz ${safeJuzNumber}`
                : "Your Quran reading progress"}
            </p>

            <span className="shrink-0 text-sm font-bold text-emerald-deep">
              {safeJuzTotalAyahs >
              0
                ? `${safeJuzPercentage}%`
                : "..."}
            </span>

          </div>


          <div className="relative mt-2 h-2.5 w-full overflow-hidden rounded-full bg-emerald-deep/10">

            <div
              className="relative h-full rounded-full bg-gradient-to-r from-emerald-deep via-emerald-700 to-emerald-600 transition-all duration-700 ease-out"
              style={{
                width:
                  safeJuzTotalAyahs >
                  0
                    ? `${safeJuzPercentage}%`
                    : "0%",
              }}
            />

            {safeJuzTotalAyahs >
              0 &&
              safeJuzPercentage >
                0 && (
                <div className="crc-shimmer pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-transparent via-white/35 to-transparent" />
              )}

          </div>


          <p className="mt-2 text-xs text-ink-faint">

            {safeJuzTotalAyahs >
            0
              ? `${safeCompletedAyahs} of ${safeJuzTotalAyahs} Ayahs`
              : "Juz progress unavailable"}

          </p>

        </div>


        {/* =================================================
            CONTINUE
        ================================================== */}

        <button
          type="button"
          onClick={
            onContinue
          }
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-soft px-4 py-2 text-sm font-semibold text-emerald-deep transition-all hover:bg-emerald-soft/70 hover:gap-3 active:scale-[0.98]"
        >
          Continue Quran Reading

          <ArrowRight
            size={15}
            strokeWidth={2.5}
          />
        </button>

      </div>
    </div>
  );
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ContinueReadingCard({
  khatm,
  para,

  percentage = 0,
  completedAyahs = 0,
  totalAyahs = 0,
  progressLoading = false,

  quranReading = null,

  onStartReading,
}) {
  return (
    <div className="mb-6 flex flex-col gap-4">

      <CardAnimationStyles />

      <KhatmProgressCard
        khatm={khatm}
        para={para}
        percentage={
          percentage
        }
        completedAyahs={
          completedAyahs
        }
        totalAyahs={
          totalAyahs
        }
        progressLoading={
          progressLoading
        }
      />

      <QuranReadingCard
        quranReading={
          quranReading
        }
        onStartReading={
          onStartReading
        }
      />

    </div>
  );
}