import { Route, RouteFormData } from './types';

const ROUTES_KEY = 'ridecast_routes';

function getStoredRoutes(): Route[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(ROUTES_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as Route[];
  } catch {
    return [];
  }
}

function saveStoredRoutes(routes: Route[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ROUTES_KEY, JSON.stringify(routes));
}

function transformRoute(route: Route): Route {
  return {
    ...route,
    name:
      route.name?.trim() ||
      `${route.startAddress.split(',')[0]} to ${route.endAddress.split(',')[0]}`,
  };
}

export async function getUserRoutes(userId?: string): Promise<Route[]> {
  const routes = getStoredRoutes();
  if (!userId) return routes.map(transformRoute);
  return routes.filter((r) => r.userId === userId).map(transformRoute);
}

export async function getRoute(routeId: string): Promise<Route | null> {
  const routes = getStoredRoutes();
  const route = routes.find((r) => r.id === routeId);
  return route ? transformRoute(route) : null;
}

export async function createRoute(userId: string, routeData: RouteFormData): Promise<Route> {
  const routes = getStoredRoutes();

  const newRoute: Route = transformRoute({
    id: crypto.randomUUID(),
    userId,
    name: routeData.name,
    startAddress: routeData.startAddress,
    startLatitude: routeData.startLatitude,
    startLongitude: routeData.startLongitude,
    endAddress: routeData.endAddress,
    endLatitude: routeData.endLatitude,
    endLongitude: routeData.endLongitude,
    commuteStartHour: routeData.commuteStartHour,
    commuteEndHour: routeData.commuteEndHour,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  routes.push(newRoute);
  saveStoredRoutes(routes);

  return newRoute;
}

export async function updateRoute(routeId: string, routeData: RouteFormData): Promise<Route> {
  const routes = getStoredRoutes();
  const index = routes.findIndex((r) => r.id === routeId);

  if (index === -1) {
    throw new Error('Route not found');
  }

  const updatedRoute: Route = transformRoute({
    ...routes[index],
    name: routeData.name,
    startAddress: routeData.startAddress,
    startLatitude: routeData.startLatitude,
    startLongitude: routeData.startLongitude,
    endAddress: routeData.endAddress,
    endLatitude: routeData.endLatitude,
    endLongitude: routeData.endLongitude,
    commuteStartHour: routeData.commuteStartHour,
    commuteEndHour: routeData.commuteEndHour,
    updatedAt: new Date().toISOString(),
  });

  routes[index] = updatedRoute;
  saveStoredRoutes(routes);

  return updatedRoute;
}

export async function deleteRoute(routeId: string): Promise<void> {
  const routes = getStoredRoutes().filter((r) => r.id !== routeId);
  saveStoredRoutes(routes);
}
