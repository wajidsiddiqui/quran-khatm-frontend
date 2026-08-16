import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Layers } from "lucide-react";
import { useKhatms } from "../../context/KhatmContext";
import KhatmCard from "../../components/khatm/KhatmCard";
import Tabs from "../../components/common/Tabs";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";

export default function MyKhatms() {
  const { khatms } = useKhatms();
  const [tab, setTab] = useState("active");
  const filtered = khatms.filter((k) => k.status === tab);

  return (
    <div className="px-5 pt-14 pb-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-xl font-semibold text-ink">My Khatms</h1>
        <Link to="/khatms/create">
          <button className="w-10 h-10 rounded-full bg-emerald text-cream flex items-center justify-center shadow-soft">
            <Plus size={20} />
          </button>
        </Link>
      </div>

      <Tabs
        tabs={[
          { label: "Active", value: "active" },
          { label: "Completed", value: "completed" },
        ]}
        active={tab}
        onChange={setTab}
      />

      <div className="mt-5">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Layers}
            title={tab === "active" ? "No active Khatms" : "No completed Khatms yet"}
            description={
              tab === "active"
                ? "Create a new Khatm or join one through an invite link."
                : "Completed Khatms will appear here once all 30 Paras are done."
            }
            action={
              tab === "active" && (
                <Link to="/khatms/create">
                  <Button size="sm">+ Create New Khatm</Button>
                </Link>
              )
            }
          />
        ) : (
          filtered.map((k) => <KhatmCard key={k.id} khatm={k} />)
        )}
      </div>
    </div>
  );
}
