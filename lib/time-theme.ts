export interface TimeTheme {
  backgroundGradient: string;
  accentColor: string;
  textColor: string;
  name: string;
}

export function getTimeTheme(date: Date = new Date()): TimeTheme {
  const hour = date.getHours();

  if (hour >= 5 && hour < 10) {
    return {
      name: 'morning',
      backgroundGradient: 'from-sky-100 via-blue-50 to-cyan-50',
      accentColor: '#14b8a6',
      textColor: '#0f172a',
    };
  }

  if (hour >= 10 && hour < 17) {
    return {
      name: 'day',
      backgroundGradient: 'from-blue-100 via-sky-100 to-blue-50',
      accentColor: '#3b82f6',
      textColor: '#0f172a',
    };
  }

  if (hour >= 17 && hour < 21) {
    return {
      name: 'evening',
      backgroundGradient: 'from-orange-100 via-amber-50 to-yellow-50',
      accentColor: '#f59e0b',
      textColor: '#0f172a',
    };
  }

  return {
    name: 'night',
    backgroundGradient: 'from-slate-900 via-blue-950 to-slate-800',
    accentColor: '#60a5fa',
    textColor: '#f8fafc',
  };
}
