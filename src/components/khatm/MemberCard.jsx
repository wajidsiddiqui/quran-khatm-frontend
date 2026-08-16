import Avatar from "../common/Avatar";
import Badge from "../common/Badge";

export default function MemberCard({ member }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-emerald-deep/6 last:border-0">
      <div className="flex items-center gap-3">
        <Avatar name={member.name} />
        <div>
          <p className="font-semibold text-ink text-[15px]">{member.name}</p>
          <p className="text-xs text-ink-soft">
            {member.para ? `Para ${member.para}` : "No Para Assigned"}
          </p>
        </div>
      </div>
      <Badge status={member.status} />
    </div>
  );
}
