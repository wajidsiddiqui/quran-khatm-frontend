const palette = ["#155843", "#1E6E54", "#C9A24B", "#0F3D2E", "#8B9A93"];

function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h);
}

export default function Avatar({ name = "", initials, size = 40 }) {
  const text = initials || name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const bg = palette[hashStr(name || text) % palette.length];
  return (
    <div
      className="rounded-full flex items-center justify-center font-semibold text-cream shrink-0"
      style={{ width: size, height: size, backgroundColor: bg, fontSize: size * 0.38 }}
    >
      {text}
    </div>
  );
}
