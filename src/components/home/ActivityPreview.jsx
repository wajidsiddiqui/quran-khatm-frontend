import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Card from "../common/Card";
import ActivityItem from "../khatm/ActivityItem";

export default function ActivityPreview({ khatmId, items }) {
  if (!items?.length) return null;
  const preview = items.slice(0, 3);

  return (
    <div className="mb-4 animate-fade-up">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-ink-soft uppercase tracking-wide">Recent Activity</p>
        <Link to={`/khatm/${khatmId}/activity`} className="flex items-center gap-0.5 text-xs font-semibold text-emerald-deep">
          View all <ChevronRight size={13} />
        </Link>
      </div>
      <Card className="!p-4">
        {preview.map((item) => (
          <ActivityItem key={item.id} item={item} />
        ))}
      </Card>
    </div>
  );
}
