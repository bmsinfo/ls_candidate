'use client';

import { useState, useEffect, useCallback } from 'react';

import { useStore } from '@/app/store/store';
import { TIMER_KEY } from '@/lib/constants';
import { secureStorage } from '@/lib/secure-storage';

interface TimerData {
  timeInSeconds: number;
  lastUpdated: number;
}

const getStoredTime = (): TimerData | null => {
  const stored = secureStorage.getItem(TIMER_KEY);
  if (stored === 'NaN') {
    return null;
  }
  return stored ? JSON.parse(stored) : null;
};

const storeTime = (timeInSeconds: number) => {
  secureStorage.setItem(
    TIMER_KEY,
    JSON.stringify({
      timeInSeconds,
      lastUpdated: Date.now(),
    }),
  );
};

export const useTimer = (): {
  timeInSeconds: number;
  isNegative: boolean;
  isCountDownRunning: boolean;
  minutes: number;
  seconds: number;
} => {
  const isCountDownRunning = useStore((state) => state.isCountDownRunning);
  const test_time = useStore((state) => state.interview.test_time);

  const [timeInSeconds, setTimeInSeconds] = useState(() => {
    const stored = getStoredTime();
    if (!stored) return test_time * 60;

    const elapsed = Math.floor((Date.now() - stored.lastUpdated) / 1000);
    return isCountDownRunning
      ? Math.max(stored.timeInSeconds - elapsed, stored.timeInSeconds)
      : stored.timeInSeconds;
  });

  const decrementTime = useCallback(() => {
    setTimeInSeconds((prev) => {
      const newTime = prev - 1;
      storeTime(newTime);
      return newTime;
    });
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isCountDownRunning) {
      interval = setInterval(decrementTime, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCountDownRunning, decrementTime]);

  return {
    timeInSeconds,
    isNegative: timeInSeconds < 0,
    isCountDownRunning,
    minutes: Math.floor(timeInSeconds / 60),
    seconds: timeInSeconds % 60,
  };
};
