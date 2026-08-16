export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  icon: Icon,
  ...props
}) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-emerald text-cream shadow-soft hover:bg-emerald-deep",
    outline: "border border-emerald/30 text-emerald bg-transparent hover:bg-emerald-soft",
    ghost: "text-emerald hover:bg-emerald-soft",
    gold: "bg-gold text-emerald-deep hover:bg-gold/90",
    danger: "text-red-600 bg-red-50 hover:bg-red-100",
  };
  const sizes = {
    sm: "text-sm px-4 py-2 rounded-full",
    md: "text-[15px] px-5 py-3.5 rounded-2xl",
    lg: "text-base px-6 py-4 rounded-2xl",
  };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {Icon && <Icon size={18} strokeWidth={2} />}
      {children}
    </button>
  );
}
