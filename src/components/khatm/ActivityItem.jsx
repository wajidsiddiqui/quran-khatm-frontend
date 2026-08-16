import { CheckCircle2, Hand } from "lucide-react";

export default function ActivityItem({ item }) {
  const isCompleted = item.action === "completed";
  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-emerald-deep/6 last:border-0">
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
          isCompleted ? "bg-gold-dim text-gold" : "bg-emerald-soft text-emerald-deep"
        }`}
      >
        {isCompleted ? <CheckCircle2 size={17} /> : <Hand size={16} />}
      </div>
      <div className="flex-1">
        <p className="text-[14.5px] text-ink">
          <span className="font-semibold">{item.user}</span>{" "}
          {item.action === "completed" ? "completed" : item.action === "claimed" ? "claimed" : item.action}
          {item.para && <span className="font-semibold"> Para {item.para}</span>}
        </p>
        <p className="text-xs text-ink-faint mt-0.5">{item.time}</p>
      </div>
    </div>
  );
}
