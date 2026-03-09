# Weather Service

## Overview

The weather service fetches live weather data from the Open-Meteo API for Wellington, New Zealand.

## API Details

- **Provider**: Open-Meteo (free, no API key required)
- **Location**: Wellington, NZ (-41.2865, 174.7762)
- **Endpoint**: `https://api.open-meteo.com/v1/forecast`

## Data Fetched

- **Wind Speed** (km/h): Current wind speed at 10m height
- **Wind Gusts** (km/h): Maximum wind gusts at 10m height
- **Precipitation** (mm): Current precipitation amount
- **Precipitation Probability** (%): Probability of rain in the next hour

## Usage

```typescript
import { fetchWeatherData } from '@/services/weather';

const result = await fetchWeatherData();

if (result.data) {
  // Use weather data
  console.log(result.data.windSpeed);
  console.log(result.timestamp);
} else {
  // Handle error
  console.error(result.error);
}
```

## Response Format

```typescript
{
  data: WeatherData | null,
  timestamp: string | null,  // ISO 8601 format
  error: string | null,
  loading: boolean
}
```

## Notes

- No caching is applied (`cache: 'no-store'`)
- Prevents infinite re-fetch loops by managing state in the component
- Keeps scoring logic completely separate from weather fetching
- Default location is hardcoded (future enhancement: user location selection)
