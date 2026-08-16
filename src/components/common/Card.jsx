export default function Card({ children, className = "", padded = true, ...props }) {
  return (
    <div
      className={`bg-cream-card rounded-xl2 shadow-card border border-emerald-deep/5 ${padded ? "p-5" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
