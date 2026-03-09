import type { WeatherData, HourlyWeatherData } from '@/lib/types';
import { getCityById } from '@/lib/cities';

interface OpenMeteoResponse {
  current: {
    time: string;
    temperature_2m: number;
    wind_speed_10m: number;
    wind_gusts_10m: number;
    wind_direction_10m: number;
    precipitation: number;
  };
  hourly: {
    time: string[];
    wind_speed_10m: number[];
    wind_gusts_10m: number[];
    precipitation_probability: number[];
    precipitation: number[];
  };
}

export interface WeatherResult {
  data: WeatherData | null;
  hourlyData: HourlyWeatherData[];
  timestamp: string | null;
  error: string | null;
  loading: boolean;
}

export async function fetchWeatherData(
  cityId?: string,
  latitude?: number,
  longitude?: number
): Promise<WeatherResult> {
  try {
    let lat: number;
    let lon: number;

    if (latitude !== undefined && longitude !== undefined) {
      lat = latitude;
      lon = longitude;
    } else {
      const city = getCityById(cityId || 'wellington');
      lat = city.lat;
      lon = city.lon;
    }

    const currentTime = new Date();
    const nextHour = new Date(currentTime);
    nextHour.setHours(currentTime.getHours() + 1, 0, 0, 0);

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?` +
        `latitude=${lat}&` +
        `longitude=${lon}&` +
        `current=temperature_2m,wind_speed_10m,wind_gusts_10m,wind_direction_10m,precipitation&` +
        `hourly=wind_speed_10m,wind_gusts_10m,precipitation_probability,precipitation&` +
        `wind_speed_unit=kmh&` +
        `timezone=auto&` +
        `forecast_days=1`,
      {
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(`Weather API returned ${response.status}`);
    }

    const data: OpenMeteoResponse = await response.json();

    const currentHourIndex = data.hourly.time.findIndex((time) => {
      const hourTime = new Date(time);
      return hourTime >= nextHour;
    });

    const rainProbability =
      currentHourIndex >= 0 ? data.hourly.precipitation_probability[currentHourIndex] : 0;

    const hourlyData: HourlyWeatherData[] = data.hourly.time
      .map((time, index) => {
        const date = new Date(time);
        const now = new Date();

        if (date < now) return null;

        return {
          hour: date.getHours(),
          windSpeed: Math.round(data.hourly.wind_speed_10m[index]),
          windGust: Math.round(data.hourly.wind_gusts_10m[index]),
          rainProbability: Math.round(data.hourly.precipitation_probability[index]),
          precipitation: Math.round(data.hourly.precipitation[index] * 10) / 10,
        };
      })
      .filter((item): item is HourlyWeatherData => item !== null);

    return {
      data: {
        windSpeed: Math.round(data.current.wind_speed_10m),
        windGust: Math.round(data.current.wind_gusts_10m),
        windDirection: Math.round(data.current.wind_direction_10m),
        rainProbability: Math.round(rainProbability),
        rainIntensity: Math.round(data.current.precipitation * 10) / 10,
      },
      hourlyData,
      timestamp: data.current.time,
      error: null,
      loading: false,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return {
      data: null,
      hourlyData: [],
      timestamp: null,
      error: error instanceof Error ? error.message : 'Failed to fetch weather data',
      loading: false,
    };
  }
}
