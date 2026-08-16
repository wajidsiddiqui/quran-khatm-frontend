import { useParams, useNavigate, Navigate } from "react-router-dom";
import { BookOpenText, HandHeart, BarChart3, Share2 } from "lucide-react";
import { useKhatms } from "../../context/KhatmContext";
import Button from "../../components/common/Button";

export default function KhatmComplete() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getKhatm } = useKhatms();
  const khatm = getKhatm(id);
  if (!khatm) return <Navigate to="/khatms" replace />;

  return (
    <div className="min-h-screen bg-emerald-gradient geo-pattern-dark flex flex-col items-center justify-center text-center px-8 py-16">
      <div className="w-20 h-20 rounded-full bg-cream/10 border border-cream/20 flex items-center justify-center mb-7">
        <BookOpenText size={32} className="text-gold" strokeWidth={1.5} />
      </div>
      <p className="text-gold font-display text-lg font-semibold mb-2">Alhamdulillah</p>
      <h1 className="font-display text-2xl font-semibold text-cream mb-3 leading-snug">
        The Quran Khatm Has Been Completed
      </h1>
      <p className="text-cream/60 text-sm mb-1">For</p>
      <p className="font-display text-lg text-cream mb-5">{khatm.dedicatedTo}</p>
      <p className="text-cream/60 text-sm italic max-w-[30ch] mb-10 leading-relaxed">
        "May Allah accept this effort and grant its reward according to His mercy."
      </p>

      <div className="w-full space-y-3">
        <Button variant="gold" className="w-full" icon={HandHeart} onClick={() => navigate(`/khatm/${id}/dua`)}>
          Make Dua
        </Button>
        <Button
          className="w-full !bg-cream/10 !text-cream border border-cream/20"
          icon={BarChart3}
          onClick={() => navigate(`/khatm/${id}/progress`)}
        >
          View Khatm Summary
        </Button>
        <Button variant="ghost" className="w-full !text-cream/70" icon={Share2}>
          Share
        </Button>
      </div>
    </div>
  );
}
