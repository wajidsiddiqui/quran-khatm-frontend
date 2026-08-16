import { useParams, Navigate } from "react-router-dom";
import { useKhatms } from "../../context/KhatmContext";
import TopBar from "../../components/common/TopBar";
import ActivityItem from "../../components/khatm/ActivityItem";
import EmptyState from "../../components/common/EmptyState";
import { Activity } from "lucide-react";

export default function ActivityLog() {
  const { id } = useParams();
  const { getKhatm, activityLog } = useKhatms();
  const khatm = getKhatm(id);
  if (!khatm) return <Navigate to="/khatms" replace />;

  return (
    <div className="min-h-screen bg-cream">
      <TopBar title="Activity" />
      <div className="px-5 pb-8">
        {activityLog.length === 0 ? (
          <EmptyState icon={Activity} title="No activity yet" description="Khatm activity will appear here." />
        ) : (
          activityLog.map((a) => <ActivityItem key={a.id} item={a} />)
        )}
      </div>
    </div>
  );
}
