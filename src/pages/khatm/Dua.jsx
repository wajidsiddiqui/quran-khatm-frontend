import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useKhatms } from "../../context/KhatmContext";
import { duaForKhatm } from "../../data/mockData";
import TopBar from "../../components/common/TopBar";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

export default function Dua() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getKhatm } = useKhatms();
  const khatm = getKhatm(id);

  if (!khatm) return <Navigate to="/khatms" replace />;

  return (
    <div className="min-h-screen bg-cream">
      <TopBar title="Make Dua" />

      <div className="px-6 pb-10 pt-2 text-center">
        <p className="text-sm text-ink-soft mb-1">For</p>

        <h1 className="font-display text-xl font-semibold text-ink mb-8">
          {khatm.dedicatedTo}
        </h1>

        <Card className="mb-6">
          <p className="font-arabic text-3xl leading-loose text-emerald-deep mb-5">
            {duaForKhatm.arabic}
          </p>

          <div className="h-px bg-emerald-deep/10 my-4" />

          <p className="text-sm text-ink-soft italic mb-3">
            {duaForKhatm.transliteration}
          </p>

          <p className="text-[15px] text-ink">{duaForKhatm.meaning}</p>
        </Card>

        <Button className="w-full" onClick={() => navigate("/home")}>
          Ameen
        </Button>
      </div>
    </div>
  );
}
