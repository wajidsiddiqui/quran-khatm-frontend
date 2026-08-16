export default function Sheet({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-emerald-deep/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-cream-card rounded-t-[2rem] p-6 pb-8 shadow-soft animate-[slideUp_0.25s_ease-out]">
        <div className="w-10 h-1.5 bg-ink-faint/30 rounded-full mx-auto mb-5" />
        {children}
      </div>
    </div>
  );
}
