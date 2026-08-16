import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, BarChart3 } from "lucide-react";
import Button from "../../components/common/Button";

const slides = [
  {
    icon: BookOpen,
    title: "Read the Quran",
    text: "Read the Quran with a clean and peaceful reading experience.",
  },
  {
    icon: Users,
    title: "Complete the Quran Together",
    text: "Invite family and friends and divide the 30 Paras among the group.",
  },
  {
    icon: BarChart3,
    title: "Track Every Step",
    text: "See which Paras are available, claimed, and completed.",
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const slide = slides[step];
  const Icon = slide.icon;
  const isLast = step === slides.length - 1;

  return (
    <div className="h-full min-h-screen bg-cream flex flex-col px-8 pt-20 pb-10">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-48 h-48 rounded-full bg-emerald-soft geo-pattern flex items-center justify-center mb-10">
          <Icon size={56} className="text-emerald-deep" strokeWidth={1.3} />
        </div>
        <h2 className="font-display text-2xl font-semibold text-ink mb-3">{slide.title}</h2>
        <p className="text-ink-soft text-[15px] leading-relaxed max-w-[30ch]">{slide.text}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-8">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-emerald" : "w-1.5 bg-emerald/20"}`}
          />
        ))}
      </div>

      {isLast ? (
        <Button onClick={() => navigate("/welcome")} className="w-full">
          Get Started
        </Button>
      ) : (
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => navigate("/welcome")}>
            Skip
          </Button>
          <Button className="flex-[2]" onClick={() => setStep(step + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
