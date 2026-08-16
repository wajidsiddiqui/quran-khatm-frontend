import { useNavigate } from "react-router-dom";
import { BookOpenText } from "lucide-react";
import Button from "../../components/common/Button";

export default function Welcome() {
  const navigate = useNavigate();
  return (
    <div className="h-full min-h-screen bg-cream flex flex-col px-8 pt-24 pb-10">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-deep flex items-center justify-center mb-6">
          <BookOpenText size={28} className="text-gold" strokeWidth={1.6} />
        </div>
        <h1 className="font-display text-2xl font-semibold text-ink mb-2">Quran Khatm</h1>
        <p className="text-ink-soft text-[15px]">Complete the Quran together, one Para at a time.</p>
      </div>
      <div className="space-y-3">
        <Button className="w-full" onClick={() => navigate("/signup")}>
          Create Account
        </Button>
        <Button variant="outline" className="w-full" onClick={() => navigate("/login")}>
          Log In
        </Button>
      </div>
    </div>
  );
}
