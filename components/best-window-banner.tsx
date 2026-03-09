'use client';

import { Clock } from 'lucide-react';
import type { RideWindow } from '@/lib/types';
import { formatRideWindow } from '@/lib/ride-window';

interface BestWindowBannerProps {
  window: RideWindow | null;
  theme: {
    cardBg: string;
    cardBorder: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
  };
}

export function BestWindowBanner({ window, theme }: BestWindowBannerProps) {
  if (!window) {
    return null;
  }

  return (
    <div
      className="w-full max-w-2xl mx-auto mt-6 rounded-xl backdrop-blur-md border p-5"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderColor: 'rgba(255, 255, 255, 0.15)',
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="p-2.5 rounded-lg shrink-0"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <Clock className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="text-sm font-semibold mb-1 uppercase tracking-wide text-white/70"
          >
            Best ride window today
          </h3>
          <div className="flex items-baseline gap-2 mb-2">
            <span
              className="text-2xl font-bold text-white"
            >
              {formatRideWindow(window)}
            </span>
          </div>
          <p
            className="text-sm text-white/70"
          >
            {window.reason}
          </p>
        </div>
      </div>
    </div>
  );
}
