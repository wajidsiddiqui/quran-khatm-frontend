// Shared gold ornamental Mushaf-style frame, used by every Quran reading/
// browsing screen (Para reading, Surah reading, Juz browsing) so the look
// stays consistent across the app.

export function CornerFlourish({ className }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" className={className} aria-hidden="true">
      <path d="M0 0 H22 V4.5 H4.5 V22 H0 Z" fill="#C9A24B" />
      <circle cx="7" cy="7" r="1.6" fill="#C9A24B" />
    </svg>
  );
}

export default function MushafFrame({ label, children, className = "" }) {
  return (
    <div className={`relative border border-gold/50 rounded-lg px-5 pt-9 pb-6 bg-cream-card ${className}`}>
      <CornerFlourish className="absolute -top-px -left-px" />
      <CornerFlourish className="absolute -top-px -right-px rotate-90" />
      <CornerFlourish className="absolute -bottom-px -right-px rotate-180" />
      <CornerFlourish className="absolute -bottom-px -left-px -rotate-90" />

      {label && (
        <div className="text-center mb-7">
          <span className="inline-block text-xs font-semibold text-gold uppercase tracking-wide border border-gold/40 rounded-full px-3.5 py-1">
            {label}
          </span>
        </div>
      )}

      {children}
    </div>
  );
}
