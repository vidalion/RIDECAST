export function degreesToCardinal(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((degrees % 360) / 45)) % 8;
  return directions[index];
}

export function getWindDirectionInsight(degrees: number, cityId?: string): string | null {
  const cardinal = degreesToCardinal(degrees);

  if (cityId === 'wellington') {
    if (degrees >= 315 || degrees < 45) {
      return 'Headwind likely on waterfront route';
    } else if (degrees >= 135 && degrees < 225) {
      return 'Tailwind on waterfront route';
    } else if (degrees >= 225 && degrees < 315) {
      return 'Crosswind from the west';
    } else {
      return 'Crosswind from the east';
    }
  }

  if (cityId === 'auckland') {
    if (degrees >= 315 || degrees < 45) {
      return 'Headwind on harbour routes';
    } else if (degrees >= 135 && degrees < 225) {
      return 'Tailwind on harbour routes';
    }
  }

  if (cityId === 'christchurch') {
    if (degrees >= 45 && degrees < 135) {
      return 'Easterly wind from the sea';
    } else if (degrees >= 225 && degrees < 315) {
      return 'Westerly wind from the hills';
    }
  }

  return null;
}
