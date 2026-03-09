'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import type { RideWindow } from '@/lib/types';
import type { TimeTheme } from '@/hooks/use-time-theme';
import { formatRideWindow } from '@/lib/ride-window';

interface BestRideWindowProps {
  window: RideWindow | null;
  theme: TimeTheme;
}

export function BestRideWindow({ window, theme }: BestRideWindowProps) {
  if (!window) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="backdrop-blur-md rounded-lg p-3 border transition-all duration-1000"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderColor: 'rgba(255, 255, 255, 0.12)',
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.75)' }} />
        <h3 className="text-xs font-semibold" style={{ color: '#ffffff' }}>
          Best Window
        </h3>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between py-0.5">
          <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Time
          </span>
          <span
            className="text-base font-bold tabular-nums"
            style={{ color: '#ffffff' }}
          >
            {formatRideWindow(window)}
          </span>
        </div>

        <div className="flex items-center justify-between py-0.5">
          <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Reason
          </span>
          <span
            className="text-xs font-semibold text-right"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            {window.reason}
          </span>
        </div>
      </div>
    </motion.div>
  );
}