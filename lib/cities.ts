export interface City {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

export const CITIES: City[] = [
  {
    id: 'wellington',
    name: 'Wellington',
    lat: -41.2865,
    lon: 174.7762,
  },
  {
    id: 'auckland',
    name: 'Auckland',
    lat: -36.8485,
    lon: 174.7633,
  },
  {
    id: 'christchurch',
    name: 'Christchurch',
    lat: -43.5321,
    lon: 172.6362,
  },
];

export function getCityById(id: string): City {
  return CITIES.find((city) => city.id === id) || CITIES[0];
}
