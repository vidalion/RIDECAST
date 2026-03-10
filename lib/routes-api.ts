import { Route, RouteFormData } from './types';

const ROUTES_KEY = 'ridecast_routes';

function getStoredRoutes(): Route[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(ROUTES_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function saveRoutes(routes: Route[]) {
  localStorage.setItem(ROUTES_KEY, JSON.stringify(routes));
}

export async function getUserRoutes(): Promise<Route[]> {
  return getStoredRoutes();
}

export async function getRoute(routeId: string): Promise<Route | null> {
  const routes = getStoredRoutes();
  return routes.find(r => r.id === routeId) || null;
}

export async function createRoute(routeData: RouteFormData): Promise<Route> {
  const routes = getStoredRoutes();

  const newRoute: Route = {
    id: crypto.randomUUID(),
    userId: 'local-user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...routeData
  };

  routes.push(newRoute);
  saveRoutes(routes);

  return newRoute;
}

export async function updateRoute(routeId: string, routeData: RouteFormData): Promise<Route> {
  const routes = getStoredRoutes();
  const index = routes.findIndex(r => r.id === routeId);

  if (index === -1) throw new Error("Route not found");

  routes[index] = {
    ...routes[index],
    ...routeData,
    updatedAt: new Date().toISOString()
  };

  saveRoutes(routes);

  return routes[index];
}

export async function deleteRoute(routeId: string): Promise<void> {
  const routes = getStoredRoutes().filter(r => r.id !== routeId);
  saveRoutes(routes);
}
