export default function Input({ label, className = "", textarea = false, ...props }) {
  const Comp = textarea ? "textarea" : "input";
  return (
    <label className="block mb-4">
      {label && <span className="block text-sm font-semibold text-ink mb-2">{label}</span>}
      <Comp
        className={`w-full bg-cream-card border border-emerald-deep/12 rounded-2xl px-4 py-3.5 text-[15px] text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-emerald/40 focus:border-emerald/40 transition-all ${className}`}
        {...props}
      />
    </label>
  );
}
