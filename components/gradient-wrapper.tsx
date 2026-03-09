'use client';

import { useTimeTheme } from '@/hooks/use-time-theme';

export function GradientWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTimeTheme();

  if (!theme) {
    return (
      <div className="min-h-screen w-full bg-slate-900">
        {children}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full relative"
      style={{
        background: theme.backgroundGradient,
        color: theme.textPrimary,
        transition: 'background 1s ease-in-out, color 1s ease-in-out'
      }}
    >
      {children}
    </div>
  );
}
