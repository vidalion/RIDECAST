import type { HourlyWeatherData, RideWindow } from './types';

export function findBestRideWindow(
  hourlyData: HourlyWeatherData[],
  commuteStartHour?: number,
  commuteEndHour?: number
): RideWindow | null {
  if (hourlyData.length < 2) {
    return null;
  }

  let filteredData = hourlyData;

  if (commuteStartHour !== undefined && commuteEndHour !== undefined) {
    if (commuteEndHour > commuteStartHour) {
      filteredData = hourlyData.filter(
        (h) => h.hour >= commuteStartHour && h.hour <= commuteEndHour
      );
    } else {
      filteredData = hourlyData.filter(
        (h) => h.hour >= commuteStartHour || h.hour <= commuteEndHour
      );
    }
  }

  if (filteredData.length < 2) {
    return null;
  }

  let bestWindow: RideWindow | null = null;
  let lowestRisk = Infinity;

  for (let i = 0; i < filteredData.length - 1; i++) {
    const hour1 = filteredData[i];
    const hour2 = filteredData[i + 1];

    const result = calculateRiskScore(hour1, hour2);

    if (result.riskScore < lowestRisk) {
      lowestRisk = result.riskScore;
      bestWindow = {
        startHour: hour1.hour,
        endHour: hour2.hour,
        riskScore: result.riskScore,
        reason: result.reason,
        avgGust: result.avgGust,
        avgRainProb: result.avgRainProb,
        avgPrecipitation: result.avgPrecipitation,
      };
    }
  }

  return bestWindow;
}

function calculateRiskScore(hour1: HourlyWeatherData, hour2: HourlyWeatherData): {
  riskScore: number;
  reason: string;
  avgGust: number;
  avgRainProb: number;
  avgPrecipitation: number;
} {
  const avgWindSpeed = (hour1.windSpeed + hour2.windSpeed) / 2;
  const avgWindGust = (hour1.windGust + hour2.windGust) / 2;
  const avgRainProb = (hour1.rainProbability + hour2.rainProbability) / 2;
  const avgPrecipitation = (hour1.precipitation + hour2.precipitation) / 2;

  // Gusts weighted highest (50%), then precipitation intensity (25%), rain probability (15%), wind speed (10%)
  const windScore = (avgWindSpeed / 50) * 10;
  const gustScore = (avgWindGust / 70) * 50;
  const rainProbScore = (avgRainProb / 100) * 15;
  const precipitationScore = (avgPrecipitation / 5) * 25;

  const riskScore = windScore + gustScore + rainProbScore + precipitationScore;

  // Determine primary reason for this window being good
  let reason: string;
  if (avgWindGust < 25 && avgPrecipitation < 0.2) {
    reason = 'Lowest gust risk and no rain during this period';
  } else if (avgWindGust < 25) {
    reason = 'Lowest gust risk during this period';
  } else if (avgPrecipitation < 0.2 && avgRainProb < 30) {
    reason = 'Lowest rain risk during this period';
  } else if (avgRainProb < 40) {
    reason = 'Lower rain probability during this period';
  } else {
    reason = 'Best available conditions during this period';
  }

  return {
    riskScore,
    reason,
    avgGust: avgWindGust,
    avgRainProb,
    avgPrecipitation,
  };
}

export function formatRideWindow(window: RideWindow | null): string {
  if (!window) {
    return 'No suitable window';
  }

  const formatHour = (hour: number): string => {
    if (hour === 0) return '12am';
    if (hour < 12) return `${hour}am`;
    if (hour === 12) return '12pm';
    return `${hour - 12}pm`;
  };

  return `${formatHour(window.startHour)}–${formatHour(window.endHour)}`;
}
