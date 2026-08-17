import Avatar from "../common/Avatar";
import Badge from "../common/Badge";

export default function MemberCard({ member }) {
  const name =
    member.name || member.user?.name || member.user?.fullName || "Member";

  const claimedParas = member.claimedParas || [];
  const completedParas = member.completedParas || [];

  const hasActivity = claimedParas.length > 0 || completedParas.length > 0;

  const status =
    completedParas.length > 0
      ? "completed"
      : claimedParas.length > 0
        ? "claimed"
        : "available";

  return (
    <div className="flex items-center justify-between py-3.5 border-b border-emerald-deep/6 last:border-0">
      <div className="flex items-center gap-3">
        <Avatar name={name} />

        <div>
          <p className="font-semibold text-ink text-[15px]">{name}</p>

          {hasActivity && (
            <div className="mt-1 space-y-0.5">
              {claimedParas.length > 0 && (
                <p className="text-xs text-ink-soft">
                  Claimed: Para {claimedParas.join(", ")}
                </p>
              )}

              {completedParas.length > 0 && (
                <p className="text-xs text-ink-soft">
                  Completed: Para {completedParas.join(", ")}
                </p>
              )}
            </div>
          )}

          {!hasActivity && (
            <p className="text-xs text-ink-soft">No activity yet</p>
          )}
        </div>
      </div>

      <Badge status={status} />
    </div>
  );
}
