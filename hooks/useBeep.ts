"use client";

import { useRef, useCallback, useEffect } from "react";

const useBeep = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  //   const audioRef = useRef(new Audio("/audio/beep.mp3"));

  useEffect(() => {
    audioRef.current = new Audio("/audio/beep.mp3");
  }, []);
  const play = useCallback(() => {
    audioRef.current?.play();
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  return { play, pause };
};

export default useBeep;
