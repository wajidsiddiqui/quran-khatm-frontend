import Avatar from "../common/Avatar";
import Badge from "../common/Badge";

export default function MemberCard({ member }) {
  const name =
    member.name || member.user?.name || member.user?.fullName || "Member";

  const para = member.para || member.assignedPara || member.paraNumber || null;

  const status = member.status || (para ? "claimed" : "available");

  return (
    <div className="flex items-center justify-between py-3.5 border-b border-emerald-deep/6 last:border-0">
      <div className="flex items-center gap-3">
        <Avatar name={name} />

        <div>
          <p className="font-semibold text-ink text-[15px]">{name}</p>

          <p className="text-xs text-ink-soft">
            {para ? `Para ${para}` : "No Para Assigned"}
          </p>
        </div>
      </div>

      <Badge status={status} />
    </div>
  );
}
