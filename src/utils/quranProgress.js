// Calculate accurate reading progress inside a single Para/Juz.
//
// The calculation is based on the actual Ayahs returned by fetchJuz(),
// NOT on Surah count, scroll position, or arbitrary sections.

export function calculateParaProgress(juz, progress) {
  // No Quran data or no confirmed progress yet
  if (!juz || !Array.isArray(juz.surahGroups)) {
    return {
      completedAyahs: 0,
      totalAyahs: juz?.totalAyahs || 0,
      percentage: 0,
    };
  }

  // Flatten all Ayahs belonging to this Para/Juz.
  const allAyahs = juz.surahGroups.flatMap((group) =>
    group.ayahs.map((ayah) => ({
      ...ayah,
      surahNumber: group.surahNumber,
    })),
  );

  const totalAyahs = allAyahs.length;

  // No confirmed reading position yet.
  if (!progress) {
    return {
      completedAyahs: 0,
      totalAyahs,
      percentage: 0,
    };
  }

  // First try the global Ayah number.
  // This is the most reliable identifier.
  let progressIndex = -1;

  if (progress.globalAyahNumber) {
    progressIndex = allAyahs.findIndex(
      (ayah) => Number(ayah.globalNumber) === Number(progress.globalAyahNumber),
    );
  }

  // Fallback to Surah + Ayah number.
  if (progressIndex === -1) {
    progressIndex = allAyahs.findIndex(
      (ayah) =>
        Number(ayah.surahNumber) === Number(progress.surahNumber) &&
        Number(ayah.number) === Number(progress.ayahNumber),
    );
  }

  // Saved progress doesn't belong to this Para.
  if (progressIndex === -1) {
    return {
      completedAyahs: 0,
      totalAyahs,
      percentage: 0,
    };
  }

  // +1 because the selected Ayah itself is considered read.
  const completedAyahs = progressIndex + 1;

  const percentage =
    totalAyahs > 0 ? Math.round((completedAyahs / totalAyahs) * 100) : 0;

  return {
    completedAyahs,
    totalAyahs,
    percentage,
  };
}
