// Signature visual: a 30-segment ring representing the 30 Paras of the Khatm.
// Each segment is colored by status — completed / claimed / available.
export default function ParaRing({ paras, size = 200, label, sublabel, light = false }) {
  const total = 30;
  const strokeWidth = size * 0.09;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const gapDeg = 2.2;
  const segDeg = 360 / total - gapDeg;

  const colorFor = (status) => {
    if (status === "completed") return "#C9A24B"; // gold
    if (status === "claimed") return light ? "#8FE0BE" : "#1E6E54";
    return light ? "rgba(255,255,255,0.18)" : "#E4EFE9";
  };

  const completed = paras.filter((p) => p.status === "completed").length;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {paras.map((p, i) => {
          const startAngle = i * (360 / total) - 90;
          const endAngle = startAngle + segDeg;
          const toRad = (d) => (d * Math.PI) / 180;
          const x1 = center + radius * Math.cos(toRad(startAngle));
          const y1 = center + radius * Math.sin(toRad(startAngle));
          const x2 = center + radius * Math.cos(toRad(endAngle));
          const y2 = center + radius * Math.sin(toRad(endAngle));
          return (
            <path
              key={p.number}
              d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`}
              stroke={colorFor(p.status)}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="none"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <span className={`font-display text-3xl font-semibold ${light ? "text-cream" : "text-emerald-deep"}`}>
          {completed}/{total}
        </span>
        {label && (
          <span className={`text-xs mt-1 ${light ? "text-cream/70" : "text-ink-soft"}`}>{label}</span>
        )}
        {sublabel && (
          <span className={`text-[11px] mt-0.5 ${light ? "text-cream/50" : "text-ink-faint"}`}>{sublabel}</span>
        )}
      </div>
    </div>
  );
}
