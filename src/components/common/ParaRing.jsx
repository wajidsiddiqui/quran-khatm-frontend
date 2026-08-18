// ParaRing.jsx

export default function ParaRing({
  paras = [],
  size = 200,
  label,
  sublabel,
  light = false,
}) {
  const total = 30;

  const strokeWidth = size * 0.075;

  // Circle ko SVG ke andar properly fit rakhne ke liye
  const radius = (size - strokeWidth) / 2 - 2;

  const center = size / 2;

  // Har para ke beech equal gap
  const gapDeg = 3;
  const segmentDeg = 360 / total - gapDeg;

  const completed = paras.filter(
    (para) => para.status === "completed"
  ).length;

  const getColor = (status) => {
    // Completed Paras
    if (status === "completed") {
      return "#C9A24B";
    }

    // Claimed Paras
    if (status === "claimed") {
      return light
        ? "#38B889"
        : "#16735A";
    }

    // Available Paras
    return light
      ? "rgba(255, 255, 255, 0.28)"
      : "#DDE8E3";
  };

  const polarToCartesian = (angle) => {
    const radians = (angle * Math.PI) / 180;

    return {
      x: center + radius * Math.cos(radians),
      y: center + radius * Math.sin(radians),
    };
  };

  return (
    <div
      className="relative inline-flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="block"
      >
        {Array.from({ length: total }).map((_, index) => {
          const para = paras[index];

          const startAngle =
            index * (360 / total) - 90;

          const endAngle =
            startAngle + segmentDeg;

          const start = polarToCartesian(startAngle);
          const end = polarToCartesian(endAngle);

          return (
            <path
              key={para?.number || index}
              d={`
                M ${start.x} ${start.y}
                A ${radius} ${radius}
                0 0 1
                ${end.x} ${end.y}
              `}
              stroke={getColor(para?.status)}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="none"
            />
          );
        })}
      </svg>

      {/* CENTER CONTENT */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span
          className={`font-display text-3xl font-semibold ${
            light
              ? "text-white"
              : "text-emerald-deep"
          }`}
        >
          {completed}/{total}
        </span>

        {label && (
          <span
            className={`text-xs mt-1 ${
              light
                ? "text-white/75"
                : "text-ink-soft"
            }`}
          >
            {label}
          </span>
        )}

        {sublabel && (
          <span
            className={`text-[11px] mt-0.5 ${
              light
                ? "text-white/55"
                : "text-ink-faint"
            }`}
          >
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}