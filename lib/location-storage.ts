import type { UserLocation } from './types';

const LOCATION_KEY = 'ridecast_user_location';

export function saveUserLocation(location: UserLocation): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCATION_KEY, JSON.stringify(location));
}

export function getUserLocation(): UserLocation | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(LOCATION_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as UserLocation;
  } catch {
    return null;
  }
}

export function clearUserLocation(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LOCATION_KEY);
}

export function requestGeolocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000,
    });
  });
}
