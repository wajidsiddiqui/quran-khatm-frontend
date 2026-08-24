function OrnamentDiamond({ className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-2.5 w-2.5 rotate-45 rounded-[2px] border border-gold/70 bg-[#FFFDF8] ${className}`}
    />
  );
}

function OrnamentDot({ className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-1.5 w-1.5 rounded-full bg-gold/80 ${className}`}
    />
  );
}

function CornerOrnament({ position }) {
  const positions = {
    "top-left": "left-1 top-1",
    "top-right": "right-1 top-1 -scale-x-100",
    "bottom-left": "bottom-1 left-1 -scale-y-100",
    "bottom-right":
      "bottom-1 right-1 -scale-x-100 -scale-y-100",
  };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute ${positions[position]}`}
    >
      <div className="relative h-7 w-7">
        <span className="absolute left-0 top-0 h-5 w-1 rounded-full bg-gold" />

        <span className="absolute left-0 top-0 h-1 w-5 rounded-full bg-gold" />

        <span className="absolute left-1 top-1 h-2.5 w-2.5 rotate-45 border border-gold/80 bg-emerald-deep/10" />

        <span className="absolute left-4 top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-deep/80" />
      </div>
    </div>
  );
}

function HeaderCell({
  children,
  dir = "ltr",
  emphasis = false,
}) {
  return (
    <div className="flex min-w-0 items-center justify-center px-0.5 py-1 sm:px-1 sm:py-1.5">
      <div
        dir={dir}
        className={`
          relative
          flex
          h-full
          min-h-[58px]
          w-full
          min-w-0
          items-center
          justify-center
          rounded-[6px]
          border
          px-1
          py-2
          text-center
          sm:min-h-[64px]
          sm:px-1.5
          sm:py-1.5
          ${
            emphasis
              ? "border-gold/50 bg-emerald-deep/[0.035]"
              : "border-gold/30 bg-[#FFFDF8]"
          }
        `}
      >
        <span className="pointer-events-none absolute inset-[2px] rounded-[4px] border border-gold/15" />

        <div className="relative z-10 flex w-full min-w-0 flex-col items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function SurahHeader({
  number,
  arabicName,
  revelationTypeArabic,
  ayahCount,
  rukuCount,
  revelationOrder,
  onClick,
  isPlaying = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        block
        w-full
        text-left
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-gold/50
        focus-visible:ring-offset-2
        focus-visible:ring-offset-cream
      "
      aria-label={
        isPlaying
          ? `Stop full Surah ${number} audio`
          : `Play full Surah ${number} audio`
      }
    >
      <div
        className={`
          relative
          overflow-hidden
          rounded-[2px]
          border
          bg-[#FFFDF8]
          shadow-soft
          transition-all
          duration-200
          ${
            isPlaying
              ? "border-gold shadow-card"
              : "border-gold/70"
          }
          group-hover:border-gold
          group-hover:shadow-card
          group-active:scale-[0.998]
        `}
      >
        {/* =====================================================
            OUTER FRAME
        ====================================================== */}

        <div className="pointer-events-none absolute inset-1 rounded-[2px] border border-gold/25" />

        <div className="pointer-events-none absolute inset-[6px] rounded-[3px] border border-emerald-deep/10" />

        <CornerOrnament position="top-left" />
        <CornerOrnament position="top-right" />
        <CornerOrnament position="bottom-left" />
        <CornerOrnament position="bottom-right" />

        {/* =====================================================
            TOP RAIL
        ====================================================== */}

        <div className="pointer-events-none absolute left-4 right-4 top-2.5 h-[4px] rounded-full bg-emerald-deep" />

        <div className="pointer-events-none absolute left-1/2 top-2.5 h-[4px] w-[34%] -translate-x-1/2 rounded-full bg-gold/75" />

        {/* =====================================================
            MUSHAF INFO STRIP
        ====================================================== */}

        <div className="relative px-1.5 pt-4 sm:px-2">
          <div className="relative overflow-hidden rounded-[10px] border border-gold/65 bg-[#FCFAF3]">
            {/* SIDE ORNAMENTS */}

            <div className="pointer-events-none absolute left-2 top-1/2 flex -translate-y-1/2 items-center gap-1 opacity-80 sm:left-3 sm:gap-1.5">
              <OrnamentDot />
              <OrnamentDiamond />
              <OrnamentDot />
            </div>

            <div className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 opacity-80 sm:right-3 sm:gap-1.5">
              <OrnamentDot />
              <OrnamentDiamond />
              <OrnamentDot />
            </div>

            {/* =================================================
                SAME 5-COLUMN DESIGN

                1 → Number of Ayahs
                2 → Place of Revelation
                3 → Surah Name
                4 → Number of Ruku
                5 → Revelation Order
            ================================================== */}

            <div
              className="
                grid
                w-full
                min-w-0
                grid-cols-[1.05fr_0.95fr_2.65fr_1fr_1fr]
                gap-x-0
                px-1
                pb-1
                pt-2
                sm:gap-x-0.5
                sm:px-1.5
                sm:pb-1.5
              "
            >
              {/* =================================================
                  1 — NUMBER OF AYAHS
              ================================================== */}

              <HeaderCell dir="rtl">
                <span className="whitespace-nowrap font-quran text-[8px] leading-tight text-ink-soft sm:text-[10px]">
                  عدد الآيات
                </span>

                <span className="mt-1 font-quran text-[15px] font-bold leading-none text-emerald-deep sm:text-[18px]">
                  {ayahCount}
                </span>
              </HeaderCell>

              {/* =================================================
                  2 — PLACE OF REVELATION
              ================================================== */}

              <HeaderCell dir="rtl">
                <span className="whitespace-nowrap font-quran text-[12px] font-bold leading-tight text-emerald-deep sm:text-[16px]">
                  {revelationTypeArabic}
                </span>

                <span className="mt-1 whitespace-nowrap text-[6px] uppercase tracking-[0.08em] text-ink-faint sm:text-[8px] sm:tracking-[0.12em]">
                
                </span>
              </HeaderCell>

              {/* =================================================
                  3 — SURAH NAME
              ================================================== */}

              <HeaderCell
                dir="rtl"
                emphasis
              >
                <span
                  dir="rtl"
                  className="
                    max-w-full
                    truncate
                    font-quran
                    text-[15px]
                    font-bold
                    leading-[1.7]
                    text-emerald-deep
                    sm:text-[19px]
                  "
                >
                  {arabicName}
                </span>
              </HeaderCell>

              {/* =================================================
                  4 — NUMBER OF RUKU
              ================================================== */}

              <HeaderCell dir="rtl">
                <span className="whitespace-nowrap font-quran text-[8px] leading-tight text-ink-soft sm:text-[10px]">
                  عدد الركوع
                </span>

                <div
                  className="
                    mt-1.5
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-1
                    px-1
                    sm:mt-2
                    sm:gap-1.5
                    sm:px-2
                  "
                >
                  {/* RUKU SYMBOL */}

                  <span
                    dir="rtl"
                    className="
                      flex
                      h-6
                      w-6
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-gold/60
                      bg-[#FFFDF8]
                      font-quran
                      text-[14px]
                      font-bold
                      leading-none
                      text-emerald-deep
                      sm:h-7
                      sm:w-7
                      sm:text-[17px]
                    "
                  >
                    ع
                  </span>

                  {/* RUKU COUNT */}

                  <span
                    className="
                      shrink-0
                      font-display
                      text-[15px]
                      font-bold
                      leading-none
                      text-emerald-deep
                      sm:text-[18px]
                    "
                  >
                    {rukuCount}
                  </span>
                </div>
              </HeaderCell>

              {/* =================================================
                  5 — REVELATION ORDER
              ================================================== */}

              <HeaderCell dir="rtl">
                <span
                  className="
                    whitespace-nowrap
                    font-quran
                    text-[8px]
                    font-medium
                    leading-tight
                    text-ink-soft
                    sm:text-[10px]
                  "
                >
                  ترتيب النزول
                </span>

                <span
                  className="
                    mt-0.5
                    whitespace-nowrap
                    text-[6px]
                    uppercase
                    tracking-[0.06em]
                    text-ink-faint
                    sm:mt-1
                    sm:text-[8px]
                    sm:tracking-[0.1em]
                  "
                >
                  
                </span>

                {/* REVELATION ORDER NUMBER */}

                <div
                  className="
                    relative
                    mt-2
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    sm:h-9
                    sm:w-9
                  "
                >
                  {/* OUTER DIAMOND */}

                  <span
                    className="
                      absolute
                      h-6
                      w-6
                      rotate-45
                      rounded-[5px]
                      border
                      border-gold/65
                      bg-[#FFFDF8]
                      sm:h-7
                      sm:w-7
                      sm:rounded-[6px]
                    "
                  />

                  {/* INNER DIAMOND */}

                  <span
                    className="
                      absolute
                      h-[18px]
                      w-[18px]
                      rotate-45
                      rounded-[3px]
                      border
                      border-gold/25
                      bg-transparent
                      sm:h-[21px]
                      sm:w-[21px]
                      sm:rounded-[4px]
                      
                      
                    "
                  />

                  {/* ORDER NUMBER */}

                  <span
                    className="
                      relative
                      z-10
                      text-[12px]
                      font-bold
                      leading-none
                      text-emerald-deep
                      sm:text-[14px]
                    "
                  >
                    {revelationOrder ?? "—"}
                  </span>
                </div>
              </HeaderCell>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}