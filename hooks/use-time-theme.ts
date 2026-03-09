'use client';

import { useEffect, useState } from 'react';

export interface TimeTheme {
  name: 'Morning' | 'Day' | 'Evening' | 'Night';
  backgroundGradient: string;
  textPrimary: string;
  textSecondary: string;
  cardBg: string;
  cardBorder: string;
  accent: string;
}

function getTimeTheme(): TimeTheme {
  return {
    name: 'Night',

    // Darker, richer night gradient
    backgroundGradient:
      'linear-gradient(135deg, #0B1F33 0%, #081621 55%, #142F45 100%)',

    textPrimary: '#F0F4EF',
    textSecondary: '#B4CDED',

    // Slightly darker cards for better contrast
    cardBg: 'rgba(18, 42, 63, 0.65)',
    cardBorder: 'rgba(180, 205, 237, 0.25)',

    accent: '#4a7c9e',
  };
}

export function useTimeTheme() {
  const [theme, setTheme] = useState<TimeTheme | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTheme = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');

      setCurrentTime(`${hours}:${minutes}`);
      setTheme(getTimeTheme());
    };

    updateTheme();

    const interval = setInterval(updateTheme, 60000);

    return () => clearInterval(interval);
  }, []);

  return { theme, currentTime };
}