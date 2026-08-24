import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const juzNames = [
  "الم",
  "سَيَقُولُ",
  "تِلْكَ الرُّسُلُ",
  "لَنْ تَنَالُوا",
  "وَالْمُحْصَنَاتُ",
  "لَا يُحِبُّ اللَّهُ",
  "وَإِذَا سَمِعُوا",
  "وَلَوْ أَنَّنَا",
  "قَالَ الْمَلَأُ",
  "وَاعْلَمُوا",
  "يَعْتَذِرُونَ",
  "وَمَا مِنْ دَابَّةٍ",
  "وَمَا أُبَرِّئُ",
  "رُبَمَا",
  "سُبْحَانَ الَّذِي",
  "قَالَ أَلَمْ",
  "اقْتَرَبَ لِلنَّاسِ",
  "قَدْ أَفْلَحَ",
  "وَقَالَ الَّذِينَ",
  "أَمَّنْ خَلَقَ",
  "اتْلُ مَا أُوحِيَ",
  "وَمَنْ يَقْنُتْ",
  "وَمَا لِيَ",
  "فَمَنْ أَظْلَمُ",
  "إِلَيْهِ يُرَدُّ",
  "حم",
  "قَالَ فَمَا خَطْبُكُمْ",
  "قَدْ سَمِعَ اللَّهُ",
  "تَبَارَكَ الَّذِي",
  "عَمَّ يَتَسَاءَلُونَ",
];

export default function JuzGrid() {
  return (
    <div className="flex flex-col gap-2.5">
      {juzNames.map((name, index) => {
        const juzNumber = index + 1;

        return (
          <Link
            key={juzNumber}
            to={`/quran/juz/${juzNumber}/read`}
            className="group relative flex items-center gap-4 overflow-hidden rounded-2xl bg-cream-card border border-emerald-deep/10 px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-deep/25 hover:bg-emerald-soft/50"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-soft font-display text-lg font-semibold text-emerald-deep transition-transform duration-200 group-hover:scale-105">
              {juzNumber}
            </div>

            <div className="flex-1">
              <p
                dir="rtl"
                className="font-display text-2xl text-emerald-deep leading-relaxed"
              >
                {name}
              </p>
            </div>

            <ChevronRight
              size={21}
              className="shrink-0 text-emerald-deep/60 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-emerald-deep"
            />
          </Link>
        );
      })}
    </div>
  );
}