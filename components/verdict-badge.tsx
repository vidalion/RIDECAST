'use client';

import { motion } from 'framer-motion';
import type { Verdict } from '@/lib/types';

interface VerdictBadgeProps {
  verdict: Verdict;
}

export function VerdictBadge({ verdict }: VerdictBadgeProps) {
  const getStyles = (v: Verdict) => {
    switch (v) {
      case 'YES':
        return {
          bg: 'bg-green-500/15',
          border: 'border-green-400/70',
          shadow: 'shadow-green-500/20',
        };
      case 'MAYBE':
        return {
          bg: 'bg-yellow-500/15',
          border: 'border-yellow-400/70',
          shadow: 'shadow-yellow-500/20',
        };
      case 'NO':
        return {
          bg: 'bg-red-500/15',
          border: 'border-red-400/70',
          shadow: 'shadow-red-500/20',
        };
    }
  };

  const styles = getStyles(verdict);

  const getMessage = (v: Verdict) => {
    switch (v) {
      case 'YES':
        return 'Yes, ride!';
      case 'MAYBE':
        return 'Maybe, be careful';
      case 'NO':
        return 'No, stay home';
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      className={`
        inline-flex items-center gap-3
        px-10 py-5
        rounded-full
        border-2 ${styles.border}
        bg-card ${styles.bg}
        shadow-lg ${styles.shadow}
      `}
    >
      <motion.div
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className={`w-3.5 h-3.5 rounded-full shadow-lg ${
          verdict === 'YES'
            ? 'bg-green-500 shadow-green-500/50'
            : verdict === 'MAYBE'
              ? 'bg-yellow-500 shadow-yellow-500/50'
              : 'bg-red-500 shadow-red-500/50'
        }`}
      />
      <span className="text-2xl font-bold tracking-tight text-white">{getMessage(verdict)}</span>
    </motion.div>
  );
}
