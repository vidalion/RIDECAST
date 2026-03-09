'use client';

import { degreesToCardinal } from '@/lib/wind-direction';
import { ArrowUp } from 'lucide-react';

interface WindCompassProps {
  degrees: number;
}

export function WindCompass({ degrees }: WindCompassProps) {
  const cardinal = degreesToCardinal(degrees);

  return (
    <div className="flex items-center gap-1.5">
      <div
        className="transition-transform duration-700 ease-out"
        style={{
          transform: `rotate(${degrees}deg)`,
        }}
      >
        <ArrowUp className="w-3.5 h-3.5 text-white drop-shadow-sm" strokeWidth={2.5} fill="white" />
      </div>
      <div className="flex items-baseline gap-0.5">
        <span className="text-xs font-semibold text-white/90">{cardinal}</span>
        <span className="text-[9px] text-white/40">{degrees}°</span>
      </div>
    </div>
  );
}
