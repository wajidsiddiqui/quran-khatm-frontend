export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex items-center gap-1.5 bg-emerald-soft/60 p-1 rounded-full">
      {tabs.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={`flex-1 text-[13px] font-semibold py-2 rounded-full transition-colors ${
            active === t.value ? "bg-emerald text-cream shadow-soft" : "text-emerald-deep/70"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
