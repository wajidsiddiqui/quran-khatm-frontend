const styles = {
  completed: "bg-gold-dim text-gold border border-gold/40",
  claimed: "bg-emerald-soft text-emerald border border-emerald/20",
  available: "bg-ink-faint/10 text-ink-soft border border-ink-faint/20",
  none: "bg-ink-faint/10 text-ink-faint border border-ink-faint/20",
};

const labels = {
  completed: "Completed",
  claimed: "In Progress",
  available: "Available",
  none: "Not Assigned",
};

export default function Badge({ status, children }) {
  return (
    <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full ${styles[status] || styles.available}`}>
      {children || labels[status] || status}
    </span>
  );
}
