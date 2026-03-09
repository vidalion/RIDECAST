export type Verdict = 'YES' | 'MAYBE' | 'NO';

export interface WeatherData {
  windSpeed: number;
  windGust: number;
  windDirection: number;
  rainProbability: number;
  rainIntensity: number;
}

export interface UserThresholds {
  maxWindSpeed: number;
  maxWindGust: number;
  maxRainProbability: number;
  maxRainIntensity: number;
}

export interface DeductionDetail {
  points: number;
  reason: string;
  severity: 'low' | 'medium' | 'high';
}

export interface RidecastResult {
  score: number;
  verdict: Verdict;
  explanation: string;
  deductions: {
    wind: number;
    gust: number;
    rainProbability: number;
    rainIntensity: number;
  };
  breakdown: {
    wind: DeductionDetail;
    gust: DeductionDetail;
    rainProbability: DeductionDetail;
    rainIntensity: DeductionDetail;
  };
}

export interface UserSettings extends UserThresholds {
  id: string;
  notificationTime: string;
  weekdaysOnly: boolean;
  morningAlertEnabled: boolean;
  city: string;
}

export interface HourlyWeatherData {
  hour: number;
  windSpeed: number;
  windGust: number;
  rainProbability: number;
  precipitation: number;
}

export interface RideWindow {
  startHour: number;
  endHour: number;
  riskScore: number;
  reason: string;
  avgGust: number;
  avgRainProb: number;
  avgPrecipitation: number;
}

export interface UserLocation {
  type: 'coords' | 'city';
  label: string;
  latitude?: number;
  longitude?: number;
  cityName?: string;
}

export interface Route {
  id: string;
  userId: string;
  name: string;
  startAddress: string;
  startLatitude: number;
  startLongitude: number;
  endAddress: string;
  endLatitude: number;
  endLongitude: number;
  commuteStartHour: number;
  commuteEndHour: number;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  id: string;
  userId: string;
  notificationTime: string;
  weekdaysOnly: boolean;
  morningAlertEnabled: boolean;
  maxWindSpeed: number;
  maxWindGust: number;
  maxRainProbability: number;
  maxRainIntensity: number;
  createdAt: string;
  updatedAt: string;
}

export interface RouteFormData {
  name: string;
  startAddress: string;
  startLatitude: number;
  startLongitude: number;
  endAddress: string;
  endLatitude: number;
  endLongitude: number;
  commuteStartHour: number;
  commuteEndHour: number;
}
