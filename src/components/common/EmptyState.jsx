export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-emerald-soft flex items-center justify-center mb-4">
          <Icon size={26} className="text-emerald" strokeWidth={1.6} />
        </div>
      )}
      <h3 className="font-display text-lg font-medium text-ink mb-1.5">{title}</h3>
      {description && <p className="text-sm text-ink-soft max-w-[26ch] mb-5">{description}</p>}
      {action}
    </div>
  );
}
