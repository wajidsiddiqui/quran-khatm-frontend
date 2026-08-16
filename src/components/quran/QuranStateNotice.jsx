import { Loader2, AlertTriangle } from "lucide-react";

export function QuranLoading({ label = "Loading the Quran..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Loader2 size={26} className="text-emerald-deep animate-spin mb-3" strokeWidth={1.8} />
      <p className="text-sm text-ink-soft">{label}</p>
    </div>
  );
}

export function QuranError({ message = "Couldn't load Quran text. Check your connection and try again.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <AlertTriangle size={22} className="text-red-500" strokeWidth={1.8} />
      </div>
      <p className="text-sm text-ink-soft mb-4 max-w-[28ch]">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-sm font-semibold text-emerald-deep">
          Try Again
        </button>
      )}
    </div>
  );
}
