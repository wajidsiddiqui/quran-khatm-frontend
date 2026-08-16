import { Bell } from "lucide-react";

export default function HomeHeader({ name }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <p className="text-ink-soft text-[15px]">Assalamu Alaikum 👋</p>
        <h1 className="font-display text-xl font-semibold text-ink mt-0.5">
          Good to see you again, {name}
        </h1>
      </div>
      <button className="w-11 h-11 rounded-full bg-cream-card border border-emerald-deep/8 flex items-center justify-center shrink-0 ml-3 hover:bg-emerald-soft transition-colors">
        <Bell size={18} className="text-emerald-deep" />
      </button>
    </div>
  );
}
