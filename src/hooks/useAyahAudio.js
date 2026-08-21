import { useRef, useState, useCallback } from "react";

export function useAyahAudio() {
  const audioRef = useRef(null);

  const [playingAyah, setPlayingAyah] =
    useState(null);

  const [playingSurah, setPlayingSurah] =
    useState(null);

  const stopCurrentAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current = null;
    }

    setPlayingAyah(null);

    setPlayingSurah(null);
  }, []);

  const toggle = useCallback(
    (globalAyahNumber) => {
      /*
       * IMPORTANT:
       * Keep your existing audio URL logic here
       * if your project already has one.
       *
       * This fallback assumes audio files are
       * fetched by global ayah number.
       */

      if (
        playingAyah ===
        globalAyahNumber
      ) {
        stopCurrentAudio();

        return;
      }

      stopCurrentAudio();

      const audio = new Audio(
        `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyahNumber}.mp3`,
      );

      audioRef.current = audio;

      setPlayingAyah(
        globalAyahNumber,
      );

      audio.play().catch((error) => {
        console.error(
          "Failed to play ayah:",
          error,
        );

        setPlayingAyah(null);
      });

      audio.onended = () => {
        setPlayingAyah(null);

        audioRef.current = null;
      };
    },
    [
      playingAyah,
      stopCurrentAudio,
    ],
  );

  const toggleSurah = useCallback(
    (surahNumber, ayahs) => {
      if (
        playingSurah ===
        surahNumber
      ) {
        stopCurrentAudio();

        return;
      }

      stopCurrentAudio();

      if (
        !ayahs ||
        ayahs.length === 0
      ) {
        return;
      }

      setPlayingSurah(
        surahNumber,
      );

      let currentIndex = 0;

      const playNextAyah = () => {
        if (
          currentIndex >=
          ayahs.length
        ) {
          setPlayingSurah(null);

          setPlayingAyah(null);

          audioRef.current = null;

          return;
        }

        const ayah =
          ayahs[currentIndex];

        const audio = new Audio(
          `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.globalNumber}.mp3`,
        );

        audioRef.current = audio;

        setPlayingAyah(
          ayah.globalNumber,
        );

        audio.play().catch((error) => {
          console.error(
            "Failed to play ayah:",
            error,
          );

          setPlayingSurah(null);

          setPlayingAyah(null);
        });

        audio.onended = () => {
          currentIndex += 1;

          playNextAyah();
        };
      };

      playNextAyah();
    },
    [
      playingSurah,
      stopCurrentAudio,
    ],
  );

  const reset = useCallback(() => {
    stopCurrentAudio();
  }, [
    stopCurrentAudio,
  ]);

  return {
    playingAyah,
    playingSurah,
    toggle,
    toggleSurah,
    reset,
  };
}