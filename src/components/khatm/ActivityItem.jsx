import { CheckCircle2, Hand } from "lucide-react";

export default function ActivityItem({ item }) {
  const isCompleted = item.action === "completed";

  const userName =
    item.user?.name || item.user?.fullName || item.userName || "Member";

  const para = item.para || item.paraNumber || null;

  const actionText =
    item.action === "completed"
      ? "completed"
      : item.action === "claimed"
        ? "claimed"
        : item.action === "joined"
          ? "joined the Khatm"
          : item.action;

  const getTimeAgo = (date) => {
    if (!date) return "";

    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    if (seconds < 60) {
      return "Just now";
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }

    const days = Math.floor(hours / 24);

    if (days === 1) {
      return "Yesterday";
    }

    if (days < 7) {
      return `${days} days ago`;
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-emerald-deep/6 last:border-0">
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
          isCompleted
            ? "bg-gold-dim text-gold"
            : "bg-emerald-soft text-emerald-deep"
        }`}
      >
        {isCompleted ? <CheckCircle2 size={17} /> : <Hand size={16} />}
      </div>

      <div className="flex-1">
        <p className="text-[14.5px] text-ink">
          <span className="font-semibold">{userName}</span> {actionText}
          {para && <span className="font-semibold"> Juz {para}</span>}
        </p>

        <p className="text-xs text-ink-faint mt-0.5">
          {getTimeAgo(item.createdAt)}
        </p>
      </div>
    </div>
  );
}
