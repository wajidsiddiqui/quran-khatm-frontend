import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useKhatms } from "../../context/KhatmContext";
import { Lock, Users2 } from "lucide-react";

export default function CreateKhatm() {
  const navigate = useNavigate();
  const { createKhatm } = useKhatms();
  const [form, setForm] = useState({ title: "", dedicatedTo: "", message: "", privacy: "invite" });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSaving(true);
      // wait for the server to save it, then open its invite page
      const k = await createKhatm({
        title: form.title,
        dedicatedTo: form.dedicatedTo,
        message: form.message,
        privacy: form.privacy,
        intentionType: "For",
      });
      navigate(`/khatm/${k._id || k.id}/invite`);
    } catch (err) {
      setError(err.message || "Could not create the Khatm. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <TopBar title="Create New Khatm" />
      <form onSubmit={handleSubmit} className="px-5 pt-2 pb-10">
        <p className="text-sm text-ink-soft mb-6">
          Start a collaborative Khatm for a loved one, or for any intention close to your heart.
        </p>
        <Input
          label="Khatm Name"
          placeholder="e.g. Quran Khatm for Ahmed Khan"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <Input
          label="Dedicated To / Intention"
          placeholder="e.g. In memory of Ahmed Khan"
          value={form.dedicatedTo}
          onChange={(e) => setForm({ ...form, dedicatedTo: e.target.value })}
          required
        />
        <Input
          label="Optional Message"
          placeholder="e.g. May Allah accept this effort."
          textarea
          rows={3}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />

        <span className="block text-sm font-semibold text-ink mb-2">Privacy</span>
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button
            type="button"
            onClick={() => setForm({ ...form, privacy: "private" })}
            className={`flex flex-col items-center gap-2 rounded-2xl py-4 border ${
              form.privacy === "private" ? "border-emerald bg-emerald-soft" : "border-emerald-deep/12 bg-cream-card"
            }`}
          >
            <Lock size={18} className="text-emerald-deep" />
            <span className="text-sm font-semibold text-ink">Private</span>
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, privacy: "invite" })}
            className={`flex flex-col items-center gap-2 rounded-2xl py-4 border ${
              form.privacy === "invite" ? "border-emerald bg-emerald-soft" : "border-emerald-deep/12 bg-cream-card"
            }`}
          >
            <Users2 size={18} className="text-emerald-deep" />
            <span className="text-sm font-semibold text-ink">Invite Only</span>
          </button>
        </div>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? "Creating..." : "Create Khatm"}
        </Button>
      </form>
    </div>
  );
}
