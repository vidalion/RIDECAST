'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface WeatherCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit: string;
  threshold?: number;
  exceeded?: boolean;
  index?: number;
}

export function WeatherCard({
  icon: Icon,
  label,
  value,
  unit,
  threshold,
  exceeded = false,
  index = 0,
}: WeatherCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`
        relative overflow-hidden
        rounded-2xl border-2
        bg-card p-6
        transition-all duration-300
        shadow-md hover:shadow-lg
        ${exceeded
          ? 'border-red-500/60 dark:border-red-400/70 bg-red-500/10 dark:bg-red-500/15 shadow-red-500/10'
          : 'border-border/60 hover:border-border shadow-black/5'
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`
              p-3 rounded-xl shadow-sm
              ${exceeded ? 'bg-red-500/15 shadow-red-500/10' : 'bg-primary/15 shadow-primary/10'}
            `}
            >
              <Icon
                className={`w-5 h-5 ${exceeded ? 'text-red-600 dark:text-red-400' : 'text-primary'}`}
              />
            </div>
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {label}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-extrabold tabular-nums ${exceeded ? 'text-red-600 dark:text-red-400' : ''}`}>
              {value}
            </span>
            <span className="text-base text-muted-foreground font-medium">{unit}</span>
          </div>
          {threshold !== undefined && (
            <div className="mt-3 text-xs font-medium text-muted-foreground">
              Threshold: {threshold} {unit}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
