export default function ProgressBar({ percent, className = "", trackClass = "bg-emerald-soft", barClass = "bg-emerald" }) {
  return (
    <div className={`w-full h-2.5 rounded-full overflow-hidden ${trackClass} ${className}`}>
      <div
        className={`h-full rounded-full ${barClass} transition-all duration-500`}
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  );
}
