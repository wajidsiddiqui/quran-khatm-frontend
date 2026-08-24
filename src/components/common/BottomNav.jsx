import { NavLink } from "react-router-dom";
import {
  Home,
  BookOpen,
  Users,
  User,
  Bookmark,
} from "lucide-react";

const items = [
  {
    to: "/home",
    label: "Home",
    icon: Home,
  },
  {
    to: "/khatms",
    label: "My Khatms",
    icon: Users,
  },
  {
    to: "/quran",
    label: "Quran",
    icon: BookOpen,
  },
  {
    to: "/saved",
    label: "Saved",
    icon: Bookmark,
  },
  {
    to: "/profile",
    label: "Profile",
    icon: User,
  },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-cream-card/95 backdrop-blur border-t border-emerald-deep/8 px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
      <div className="max-w-md md:max-w-xl mx-auto flex items-center justify-between">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1.5 px-2 min-w-[56px] rounded-2xl transition-all duration-200 ${
                isActive
                  ? "text-emerald-deep bg-emerald-soft"
                  : "text-ink-faint"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />

                <span
                  className={`text-[10px] whitespace-nowrap ${
                    isActive
                      ? "font-semibold"
                      : "font-medium"
                  }`}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}