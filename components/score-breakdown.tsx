'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2, CircleAlert as AlertCircle } from 'lucide-react';
import type { RidecastResult } from '@/lib/types';

interface ScoreBreakdownProps {
  result: RidecastResult;
}

export function ScoreBreakdown({ result }: ScoreBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSeverityIcon = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low':
        return <CheckCircle2 className="w-4 h-4" style={{ color: 'rgba(120, 220, 200, 0.9)' }} />;
      case 'medium':
        return <AlertCircle className="w-4 h-4" style={{ color: 'rgba(255, 200, 120, 0.9)' }} />;
      case 'high':
        return <AlertTriangle className="w-4 h-4" style={{ color: 'rgba(255, 120, 120, 0.9)' }} />;
    }
  };

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low':
        return 'rgba(120, 220, 200, 0.9)';
      case 'medium':
        return 'rgba(255, 200, 120, 0.9)';
      case 'high':
        return 'rgba(255, 120, 120, 0.9)';
    }
  };

  if (!result?.breakdown) {
    return null;
  }

  const breakdownItems = [
    { label: 'Rain Probability', detail: result.breakdown.rainProbability },
    { label: 'Rain Intensity', detail: result.breakdown.rainIntensity },
    { label: 'Wind Speed', detail: result.breakdown.wind },
    { label: 'Wind Gusts', detail: result.breakdown.gust },
  ];

  const totalDeductions =
    result.deductions.wind +
    result.deductions.gust +
    result.deductions.rainProbability +
    result.deductions.rainIntensity;

  return (
    <div className="bg-card rounded-2xl border-2 border-border/60 overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-7 flex items-center justify-between hover:bg-accent/50 transition-all duration-200"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center shadow-sm shadow-primary/10">
            <span className="text-lg font-bold text-white">{result.score}</span>
          </div>
          <div className="text-left">
            <h3 className="font-bold text-lg text-white">Why this score?</h3>
            <p className="text-sm font-medium mt-0.5 text-white/70">
              {totalDeductions === 0 ? 'No issues detected' : `${totalDeductions} points deducted`}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <ChevronDown className="w-6 h-6 text-white/70" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-7 pb-7 space-y-4 border-t border-border pt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-white/70">Starting score</span>
                <span className="font-bold text-base text-white">100</span>
              </div>

              {breakdownItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className={`
                    p-5 rounded-xl border-2 shadow-sm
                    ${
                      item.detail.points > 0
                        ? 'bg-red-500/10 shadow-red-500/10'
                        : 'bg-accent/30 shadow-black/5'
                    }
                  `}
                  style={{
                    borderColor: item.detail.points > 0
                      ? 'rgba(255, 120, 120, 0.4)'
                      : 'rgba(255, 255, 255, 0.15)'
                  }}
                >
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(item.detail.severity)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm text-white">{item.label}</span>
                        <span
                          className="font-bold text-base tabular-nums"
                          style={{
                            color: item.detail.points > 0
                              ? getSeverityColor(item.detail.severity)
                              : 'rgba(255, 255, 255, 0.6)'
                          }}
                        >
                          {item.detail.points > 0 ? `-${item.detail.points}` : '0'}
                        </span>
                      </div>
                      <p className="text-xs break-words leading-relaxed text-white/70">
                        {item.detail.reason}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="flex items-center justify-between text-sm pt-5 border-t-2 border-border/60 mt-2">
                <span className="font-bold text-base text-white">Final Score</span>
                <span className="text-3xl font-extrabold tabular-nums text-white">{result.score}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
