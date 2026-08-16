import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TopBar({ title, onBack, right, transparent = false, dark = false }) {
  const navigate = useNavigate();
  return (
    <div
      className={`sticky top-0 z-20 flex items-center justify-between px-5 py-4 ${
        transparent ? "bg-transparent" : dark ? "bg-emerald-deep" : "bg-cream/90 backdrop-blur"
      }`}
    >
      <button
        onClick={onBack || (() => navigate(-1))}
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          dark ? "bg-white/10 text-cream" : "bg-emerald-soft text-emerald-deep"
        }`}
      >
        <ChevronLeft size={20} />
      </button>
      <h1 className={`font-display text-lg font-medium ${dark ? "text-cream" : "text-ink"}`}>{title}</h1>
      <div className="w-10 h-10 flex items-center justify-center">{right}</div>
    </div>
  );
}
