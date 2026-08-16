import Badge from "../common/Badge";
import Button from "../common/Button";
import { BookOpen } from "lucide-react";

export default function ParaCard({ para, onClaim, onOpen }) {
  const assignedUser =
    typeof para.assignedTo === "object"
      ? para.assignedTo?.name
      : para.assignedTo;

  return (
    <div className="flex items-center justify-between bg-cream-card rounded-2xl px-4 py-3.5 border border-emerald-deep/6 mb-3">
      <div className="flex items-center gap-3.5">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center font-display font-semibold text-[15px] ${
            para.status === "completed"
              ? "bg-gold-dim text-gold"
              : para.status === "claimed"
              ? "bg-emerald-soft text-emerald-deep"
              : "bg-ink-faint/10 text-ink-faint"
          }`}
        >
          {para.number}
        </div>

        <div>
          <p className="font-semibold text-ink text-[15px]">
            Para {para.number}
          </p>

          {para.status === "available" ? (
            <p className="text-xs text-ink-soft">
              Available
            </p>
          ) : (
            <p className="text-xs text-ink-soft">
              {para.status === "completed"
                ? "Completed by "
                : "Claimed by "}

              <span className="font-medium text-ink">
                {assignedUser || "Unknown User"}
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="shrink-0">
        {para.status === "available" && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onClaim(para)}
          >
            Claim
          </Button>
        )}

        {para.status === "claimed" && (
          <Button
            size="sm"
            variant="ghost"
            icon={BookOpen}
            onClick={() => onOpen(para)}
          >
            Read
          </Button>
        )}

        {para.status === "completed" && (
          <Badge status="completed">
            ✓ Done
          </Badge>
        )}
      </div>
    </div>
  );
}