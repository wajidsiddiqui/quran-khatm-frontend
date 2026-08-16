import { useParams, Navigate, Link } from "react-router-dom";
import { useKhatms } from "../../context/KhatmContext";
import TopBar from "../../components/common/TopBar";
import MemberCard from "../../components/khatm/MemberCard";
import Button from "../../components/common/Button";
import { UserPlus } from "lucide-react";

export default function Members() {
  const { id } = useParams();
  const { getKhatm, members } = useKhatms();
  const khatm = getKhatm(id);
  if (!khatm) return <Navigate to="/khatms" replace />;

  return (
    <div className="min-h-screen bg-cream">
      <TopBar title="Members" />
      <div className="px-5 pb-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-ink-soft">{khatm.memberCount} Members</p>
          <Link to={`/khatm/${id}/invite`}>
            <Button size="sm" icon={UserPlus}>Invite</Button>
          </Link>
        </div>
        <div>
          {members.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </div>
      </div>
    </div>
  );
}
