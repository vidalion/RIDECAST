const SELECTED_ROUTE_KEY = 'ridecast_selected_route_id';

export function getSelectedRouteId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SELECTED_ROUTE_KEY);
}

export function setSelectedRouteId(routeId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SELECTED_ROUTE_KEY, routeId);
}

export function clearSelectedRouteId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SELECTED_ROUTE_KEY);
}
