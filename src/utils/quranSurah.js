/**
 * Returns true only when the supplied Quran group
 * actually starts a Surah from Ayah 1.
 *
 * This is intentionally based on the Ayah number,
 * not on Juz/Para boundaries.
 */
export function isSurahStart(group) {
  return (
    Number(group?.ayahs?.[0]?.number) === 1
  );
}