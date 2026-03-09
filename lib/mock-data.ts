import type { WeatherData } from './types';

export function getMockWeather(): WeatherData {
  return {
    windSpeed: 18,
    windGust: 32,
    windDirection: 315,
    rainProbability: 25,
    rainIntensity: 1.2,
  };
}
