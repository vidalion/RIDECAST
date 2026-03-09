import type { WeatherData, UserThresholds, RidecastResult, Verdict, DeductionDetail } from './types';

export function calculateRidecastScore(
  weather: WeatherData,
  thresholds: UserThresholds
): RidecastResult {
  let score = 100;

  const windDeduction = calculateWindDeduction(weather.windSpeed, thresholds.maxWindSpeed);
  const gustDeduction = calculateGustDeduction(weather.windGust, thresholds.maxWindGust);
  const rainProbDeduction = calculateRainProbabilityDeduction(
    weather.rainProbability,
    thresholds.maxRainProbability
  );
  const rainIntensityDeduction = calculateRainIntensityDeduction(
    weather.rainIntensity,
    thresholds.maxRainIntensity
  );

  score -= windDeduction.points;
  score -= gustDeduction.points;
  score -= rainProbDeduction.points;
  score -= rainIntensityDeduction.points;

  score = Math.max(0, Math.round(score));

  const verdict: Verdict = score >= 80 ? 'YES' : score >= 50 ? 'MAYBE' : 'NO';

  const deductions = {
    wind: windDeduction.points,
    gust: gustDeduction.points,
    rainProbability: rainProbDeduction.points,
    rainIntensity: rainIntensityDeduction.points,
  };

  const breakdown = {
    wind: windDeduction,
    gust: gustDeduction,
    rainProbability: rainProbDeduction,
    rainIntensity: rainIntensityDeduction,
  };

  const explanation = generateExplanation(weather, thresholds, verdict, deductions);

  return {
    score,
    verdict,
    explanation,
    deductions,
    breakdown,
  };
}

function calculateWindDeduction(windSpeed: number, threshold: number): DeductionDetail {
  if (windSpeed <= threshold) {
    return {
      points: 0,
      reason: 'Wind speed is within your comfort zone (' + windSpeed + ' km/h)',
      severity: 'low',
    };
  }

  const excess = windSpeed - threshold;
  const gradualPenalty = Math.pow(excess, 1.4) * 1.5;
  const points = Math.min(Math.round(gradualPenalty), 30);

  const severity: DeductionDetail['severity'] =
    points < 10 ? 'low' : points < 20 ? 'medium' : 'high';

  return {
    points,
    reason: 'Wind speed ' + excess + ' km/h above your threshold (' + windSpeed + ' km/h vs ' + threshold + ' km/h)',
    severity,
  };
}

function calculateGustDeduction(windGust: number, threshold: number): DeductionDetail {
  if (windGust <= threshold) {
    return {
      points: 0,
      reason: 'Wind gusts are manageable (' + windGust + ' km/h)',
      severity: 'low',
    };
  }

  const excess = windGust - threshold;

  // Heavily penalize gusts with tiered system
  // Gusts weighted 1.5x normal wind
  let penalty;

  if (windGust >= 60) {
    // 60+ km/h: Severe penalty (extremely dangerous)
    penalty = 45 + Math.pow(excess - (60 - threshold), 2) * 2;
  } else if (windGust >= 45) {
    // 45-59 km/h: Strong penalty (dangerous)
    const base = 25;
    const additional = Math.pow(windGust - 45, 1.8) * 1.5;
    penalty = base + additional;
  } else if (windGust >= 35) {
    // 35-44 km/h: Moderate penalty (challenging)
    const base = 15;
    const additional = Math.pow(windGust - 35, 1.6) * 1.2;
    penalty = base + additional;
  } else {
    // Below 35 km/h: Standard penalty with 1.5x multiplier
    penalty = Math.pow(excess, 1.5) * 2.25;
  }

  const points = Math.min(Math.round(penalty), 50);

  const severity: DeductionDetail['severity'] =
    windGust >= 60 ? 'high' : windGust >= 45 ? 'high' : windGust >= 35 ? 'medium' : 'low';

  let reason = 'Dangerous gusts ' + excess + ' km/h above threshold (' + windGust + ' km/h vs ' + threshold + ' km/h)';
  if (windGust >= 60) {
    reason = 'SEVERE gusts ' + windGust + ' km/h - extremely dangerous';
  } else if (windGust >= 45) {
    reason = 'STRONG gusts ' + windGust + ' km/h - dangerous conditions';
  } else if (windGust >= 35) {
    reason = 'MODERATE gusts ' + windGust + ' km/h - challenging ride';
  }

  return {
    points,
    reason,
    severity,
  };
}

function calculateRainProbabilityDeduction(
  rainProbability: number,
  threshold: number
): DeductionDetail {
  if (rainProbability <= threshold) {
    return {
      points: 0,
      reason: 'Low rain chance (' + rainProbability + '%)',
      severity: 'low',
    };
  }

  const excess = rainProbability - threshold;
  const gradualPenalty = Math.pow(excess, 1.2) * 0.5;
  const points = Math.min(Math.round(gradualPenalty), 25);

  const severity: DeductionDetail['severity'] =
    points < 8 ? 'low' : points < 15 ? 'medium' : 'high';

  return {
    points,
    reason: excess + '% higher rain chance than preferred (' + rainProbability + '% vs ' + threshold + '%)',
    severity,
  };
}

function calculateRainIntensityDeduction(
  rainIntensity: number,
  threshold: number
): DeductionDetail {
  if (rainIntensity <= threshold) {
    return {
      points: 0,
      reason: 'Light or no rain expected (' + rainIntensity + ' mm)',
      severity: 'low',
    };
  }

  const excess = rainIntensity - threshold;
  // Rain intensity weighted MORE heavily than rain probability
  // Heavy rain is worse than just probability of rain
  const gradualPenalty = Math.pow(excess, 1.5) * 12;
  const points = Math.min(Math.round(gradualPenalty), 40);

  const severity: DeductionDetail['severity'] =
    points < 12 ? 'low' : points < 25 ? 'medium' : 'high';

  return {
    points,
    reason: 'Heavy rain ' + excess.toFixed(1) + ' mm above threshold (' + rainIntensity + ' mm vs ' + threshold + ' mm)',
    severity,
  };
}

function generateExplanation(
  weather: WeatherData,
  thresholds: UserThresholds,
  verdict: Verdict,
  deductions: RidecastResult['deductions']
): string {
  const primaryIssue = getPrimaryIssue(weather, deductions);

  if (verdict === 'YES') {
    if (!primaryIssue) {
      return 'Conditions are good across the board.';
    }
    return primaryIssue.text + ' - minor but worth noting.';
  }

  if (verdict === 'MAYBE') {
    if (!primaryIssue) {
      return 'Conditions are marginal but manageable.';
    }
    return primaryIssue.text + ' - that\'s the main concern.';
  }

  if (!primaryIssue) {
    return 'Multiple factors make this a difficult ride.';
  }
  return primaryIssue.text + ' - that\'s the main risk.';
}

function getPrimaryIssue(
  weather: WeatherData,
  deductions: RidecastResult['deductions']
): { text: string; severity: number } | null {
  const issues = [
    {
      text: 'Gusts are high (' + weather.windGust + ' km/h)',
      severity: deductions.gust,
    },
    {
      text: 'Rain intensity is high (' + weather.rainIntensity + ' mm)',
      severity: deductions.rainIntensity,
    },
    {
      text: 'Wind speed is strong (' + weather.windSpeed + ' km/h)',
      severity: deductions.wind,
    },
    {
      text: 'Rain probability is ' + weather.rainProbability + '%',
      severity: deductions.rainProbability,
    },
  ].filter(issue => issue.severity > 0);

  if (issues.length === 0) {
    return null;
  }

  issues.sort((a, b) => b.severity - a.severity);
  return issues[0];
}
