'use client';

import { motion } from 'framer-motion';
import type { Verdict } from '@/lib/types';

interface ScoreRingProps {
  score: number;
  verdict: Verdict;
  accentColor?: string;
  textColor?: string;
  textSecondary?: string;
}

export function ScoreRing({ score, verdict, accentColor, textColor, textSecondary }: ScoreRingProps) {
  const radius = 140;
  const strokeWidth = 24;
  const circumference = Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getGradientColors = () => {
    if (accentColor) {
      return { light: accentColor, deep: accentColor };
    }
    if (score >= 80) return { light: '#60efff', deep: '#0ea5e9' };
    if (score >= 50) return { light: '#fcd34d', deep: '#f59e0b' };
    return { light: '#ff6b6b', deep: '#ef4444' };
  };

  const colors = getGradientColors();

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        className="w-full"
      >
        <svg className="w-full h-auto" viewBox="0 0 340 200" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.light} stopOpacity="0.15" />
              <stop offset="50%" stopColor={colors.deep} stopOpacity="0.15" />
              <stop offset="100%" stopColor={colors.light} stopOpacity="0.15" />
            </linearGradient>

            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.light} stopOpacity="1" />
              <stop offset="50%" stopColor={colors.deep} stopOpacity="1" />
              <stop offset="100%" stopColor={colors.light} stopOpacity="1" />
            </linearGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="arcBrightness">
              <feComponentTransfer>
                <feFuncR type="linear" slope="1.2"/>
                <feFuncG type="linear" slope="1.2"/>
                <feFuncB type="linear" slope="1.2"/>
              </feComponentTransfer>
            </filter>
          </defs>

          <path
            d="M 30 170 A 140 140 0 0 1 310 170"
            fill="none"
            stroke="url(#trackGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          <motion.path
            d="M 30 170 A 140 140 0 0 1 310 170"
            fill="none"
            stroke="url(#arcGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            filter="url(#glow) url(#arcBrightness)"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{
              duration: 1.8,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.3
            }}
          />

          <motion.text
            x="170"
            y="140"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={textColor}
            className="font-bold tabular-nums"
            style={{ fontSize: '66px', letterSpacing: '-0.03em' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            {score}%
          </motion.text>

          <motion.text
            x="170"
            y="180"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={textSecondary || textColor}
            className="uppercase tracking-widest"
            style={{ fontSize: '11px', letterSpacing: '0.2em', fontWeight: 500 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.4 }}
          >
            SCORE
          </motion.text>
        </svg>
      </motion.div>
    </div>
  );
}
