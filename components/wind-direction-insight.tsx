'use client';

import { Compass } from 'lucide-react';
import { degreesToCardinal, getWindDirectionInsight } from '@/lib/wind-direction';

interface WindDirectionInsightProps {
  degrees: number;
  cityId?: string;
  theme: {
    textPrimary: string;
    textSecondary: string;
    accent: string;
  };
}

export function WindDirectionInsight({ degrees, cityId, theme }: WindDirectionInsightProps) {
  const cardinal = degreesToCardinal(degrees);
  const insight = getWindDirectionInsight(degrees, cityId);

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
      }}
    >
      <Compass className="w-3.5 h-3.5 shrink-0 text-white/70" />
      <div className="flex items-center gap-2 text-xs">
        <span className="font-semibold text-white">
          {degrees}° {cardinal}
        </span>
        {insight && (
          <>
            <span className="text-white/70">·</span>
            <span className="text-white/70">{insight}</span>
          </>
        )}
      </div>
    </div>
  );
}
