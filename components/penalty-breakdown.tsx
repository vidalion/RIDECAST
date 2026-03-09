'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { RidecastResult } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

interface PenaltyBreakdownProps {
  breakdown: RidecastResult['breakdown'];
  weather: {
    windSpeed: number;
    windGust: number;
    rainProbability: number;
    rainIntensity: number;
  };
  theme: {
    cardBg: string;
    cardBorder: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
  };
}

export function PenaltyBreakdown({ breakdown, weather, theme }: PenaltyBreakdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const factors = [
    {
      label: 'Wind speed',
      value: weather.windSpeed + ' km/h',
      detail: breakdown.wind,
    },
    {
      label: 'Gusts',
      value: weather.windGust + ' km/h',
      detail: breakdown.gust,
    },
    {
      label: 'Rain probability',
      value: weather.rainProbability + '%',
      detail: breakdown.rainProbability,
    },
    {
      label: 'Rain intensity',
      value: weather.rainIntensity + ' mm',
      detail: breakdown.rainIntensity,
    },
  ].sort((a, b) => b.detail.points - a.detail.points);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'rgba(255, 120, 120, 0.9)';
      case 'medium':
        return 'rgba(255, 200, 120, 0.9)';
      case 'low':
        return 'rgba(120, 220, 200, 0.9)';
      default:
        return 'rgba(255, 255, 255, 0.6)';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'High';
      case 'medium':
        return 'Moderate';
      case 'low':
        return 'Low';
      default:
        return 'None';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl backdrop-blur-md border transition-all hover:opacity-80"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderColor: 'rgba(255, 255, 255, 0.15)',
        }}
      >
        <span className="font-semibold text-white">Why this verdict?</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''} text-white/70`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div
              className="mt-3 rounded-xl p-5 backdrop-blur-md border"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
              }}
            >
              <div className="space-y-3">
                {factors.map((factor, index) => {
                  const severityColor = getSeverityColor(factor.detail.severity);
                  const severityLabel = getSeverityLabel(factor.detail.severity);

                  return (
                    <div key={index} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: severityColor }}
                        />
                        <span className="text-sm font-medium text-white">
                          {factor.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm font-semibold text-white">
                          {factor.value}
                        </span>
                        <span
                          className="text-sm font-medium min-w-[70px] text-right"
                          style={{ color: severityColor }}
                        >
                          {severityLabel}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
