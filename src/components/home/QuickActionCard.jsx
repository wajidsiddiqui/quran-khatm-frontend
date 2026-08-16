import { Link } from "react-router-dom";

const accentStyles = {
  emerald: "bg-emerald-soft text-emerald-deep",
  violet: "bg-violet-50 text-violet-600",
  gold: "bg-gold-dim text-gold",
  sky: "bg-sky-50 text-sky-600",
};

export default function QuickActionCard({ to, icon: Icon, title, description, accent = "emerald" }) {
  return (
    <Link
      to={to}
      className="flex flex-col gap-3 bg-cream-card rounded-2xl p-4 border border-emerald-deep/6 shadow-card hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200"
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accentStyles[accent]}`}>
        <Icon size={20} strokeWidth={1.8} />
      </div>
      <div>
        <p className="text-[13.5px] font-semibold text-ink leading-tight">{title}</p>
        {description && <p className="text-[11px] text-ink-soft mt-0.5 leading-snug">{description}</p>}
      </div>
    </Link>
  );
}
