// Bismillah shown on its own line at the start of a Surah (Quran.com style).
// Not shown for Al-Fatihah (where it IS verse 1) or At-Tawbah (which has none).
export const BISMILLAH_TEXT = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

export default function BismillahLine() {
  return (
    <p
      dir="rtl"
      className="font-quran font-bold text-center text-emerald-deep text-[26px] leading-loose mb-3"
    >
      {BISMILLAH_TEXT}
    </p>
  );
}
