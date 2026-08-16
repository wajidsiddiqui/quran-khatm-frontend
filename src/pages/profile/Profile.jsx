import { useNavigate } from "react-router-dom";
import {
  Layers,
  CheckCircle2,
  BookOpen,
  Settings,
  ChevronRight,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useKhatms } from "../../context/KhatmContext";
import Avatar from "../../components/common/Avatar";
import Card from "../../components/common/Card";

export default function Profile() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const { khatms } = useKhatms();

  // Count active Khatms
  const active = khatms.filter(
    (k) => k.status === "active"
  ).length;

  // Count completed Khatms
  const completed = khatms.filter(
    (k) => k.status === "completed"
  ).length;

  // Get an active Khatm for progress navigation
  const activeKhatm = khatms.find(
    (k) => k.status === "active"
  );

  const rows = [
    {
      icon: Layers,
      label: "My Khatms",
      value: `${active} active`,
      to: "/khatms",
    },
    {
      icon: CheckCircle2,
      label: "Completed Khatms",
      value: `${completed} completed`,
      to: "/khatms",
    },
    {
      icon: BookOpen,
      label: "Reading Progress",
      value: activeKhatm ? "View Progress" : "",
      to: activeKhatm
        ? `/khatm/${activeKhatm._id || activeKhatm.id}/progress`
        : "/khatms",
    },
    {
      icon: Settings,
      label: "Settings",
      value: "",
      to: "/settings",
    },
  ];

  return (
    <div className="px-5 pt-14 pb-4">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <Avatar
          name={user?.name || "Guest"}
          size={72}
        />

        <h1 className="font-display text-xl font-semibold text-ink mt-3">
          {user?.name || "Guest"}
        </h1>

        <p className="text-sm text-ink-soft">
          {user?.email}
        </p>
      </div>

      {/* Profile Menu */}
      <Card className="!p-0 divide-y divide-emerald-deep/6 mb-5">
        {rows.map(({ icon: Icon, label, value, to }) => (
          <button
            key={label}
            onClick={() => navigate(to)}
            className="w-full flex items-center justify-between px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-soft flex items-center justify-center">
                <Icon
                  size={16}
                  className="text-emerald-deep"
                />
              </div>

              <span className="font-semibold text-ink text-[15px]">
                {label}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {value && (
                <span className="text-xs text-emerald-deep font-medium">
                  {value}
                </span>
              )}

              <ChevronRight
                size={16}
                className="text-ink-faint"
              />
            </div>
          </button>
        ))}
      </Card>

      {/* Logout */}
      <button
        onClick={() => {
          logout();
          navigate("/welcome");
        }}
        className="w-full flex items-center justify-center gap-2 text-red-600 font-semibold py-3.5"
      >
        <LogOut size={16} />
        Log Out
      </button>
    </div>
  );
}