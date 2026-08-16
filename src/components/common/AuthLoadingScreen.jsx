import { BookOpenText } from "lucide-react";

// Shown briefly on app load while we check localStorage for a token and
// validate it against the backend (GET /api/auth/me). Keeps this minimal —
// it's meant to be on-screen for a fraction of a second, not a full splash.
export default function AuthLoadingScreen() {
  return (
    <div className="h-full min-h-screen bg-cream flex flex-col items-center justify-center">
      <div className="w-14 h-14 rounded-2xl bg-emerald-deep flex items-center justify-center mb-4 animate-pulse">
        <BookOpenText size={24} className="text-gold" strokeWidth={1.6} />
      </div>
      <div className="w-5 h-5 border-2 border-emerald/30 border-t-emerald rounded-full animate-spin" />
    </div>
  );
}
