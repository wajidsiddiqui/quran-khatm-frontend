import { useState, useRef, useEffect } from "react";
import { getAyahAudioUrl } from "../services/quranApi";

// Optional per-ayah recitation playback — self-contained, fails silently if
// audio can't load so it never blocks the reading screen it's used on.
export function useAyahAudio() {
  const audioRef = useRef(null);
  const [playingAyah, setPlayingAyah] = useState(null);

  useEffect(() => {
    return () => audioRef.current?.pause();
  }, []);

  const reset = () => {
    audioRef.current?.pause();
    setPlayingAyah(null);
  };

  const toggle = (globalNumber) => {
    if (playingAyah === globalNumber) {
      audioRef.current?.pause();
      setPlayingAyah(null);
      return;
    }
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(getAyahAudioUrl(globalNumber));
    audio.onended = () => setPlayingAyah(null);
    audio.onerror = () => setPlayingAyah(null);
    audioRef.current = audio;
    audio.play().catch(() => setPlayingAyah(null));
    setPlayingAyah(globalNumber);
  };

  return { playingAyah, toggle, reset };
}
