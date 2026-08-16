import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpenText } from "lucide-react";

export default function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate("/onboarding"), 1800);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="h-full min-h-screen bg-emerald-gradient geo-pattern-dark flex flex-col items-center justify-center text-center px-8">
      <div className="w-20 h-20 rounded-2xl bg-cream/10 border border-cream/20 flex items-center justify-center mb-6">
        <BookOpenText size={34} className="text-gold" strokeWidth={1.6} />
      </div>
      <h1 className="font-display text-3xl font-semibold text-cream mb-2 tracking-wide">Quran Khatm</h1>
      <p className="text-cream/60 text-sm">Complete the Quran together.</p>
    </div>
  );
}
