import { supabase } from './supabase';
import { Route, RouteFormData } from './types';

function transformRouteFromDb(dbRoute: any): Route {
  return {
    id: dbRoute.id,
    userId: dbRoute.user_id,
    name: dbRoute.name,
    startAddress: dbRoute.start_address,
    startLatitude: dbRoute.start_latitude,
    startLongitude: dbRoute.start_longitude,
    endAddress: dbRoute.end_address,
    endLatitude: dbRoute.end_latitude,
    endLongitude: dbRoute.end_longitude,
    commuteStartHour: dbRoute.commute_start_hour,
    commuteEndHour: dbRoute.commute_end_hour,
    createdAt: dbRoute.created_at,
    updatedAt: dbRoute.updated_at,
  };
}

export async function getUserRoutes(userId: string): Promise<Route[]> {
  const { data, error } = await supabase
    .from('routes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data ? data.map(transformRouteFromDb) : [];
}

export async function getRoute(routeId: string): Promise<Route | null> {
  const { data, error } = await supabase
    .from('routes')
    .select('*')
    .eq('id', routeId)
    .maybeSingle();

  if (error) throw error;
  return data ? transformRouteFromDb(data) : null;
}

export async function createRoute(userId: string, routeData: RouteFormData): Promise<Route> {
  const { data, error } = await supabase
    .from('routes')
    .insert({
      user_id: userId,
      name: routeData.name,
      start_address: routeData.startAddress,
      start_latitude: routeData.startLatitude,
      start_longitude: routeData.startLongitude,
      end_address: routeData.endAddress,
      end_latitude: routeData.endLatitude,
      end_longitude: routeData.endLongitude,
      commute_start_hour: routeData.commuteStartHour,
      commute_end_hour: routeData.commuteEndHour,
    })
    .select()
    .single();

  if (error) throw error;
  return transformRouteFromDb(data);
}

export async function updateRoute(routeId: string, routeData: RouteFormData): Promise<Route> {
  const { data, error } = await supabase
    .from('routes')
    .update({
      name: routeData.name,
      start_address: routeData.startAddress,
      start_latitude: routeData.startLatitude,
      start_longitude: routeData.startLongitude,
      end_address: routeData.endAddress,
      end_latitude: routeData.endLatitude,
      end_longitude: routeData.endLongitude,
      commute_start_hour: routeData.commuteStartHour,
      commute_end_hour: routeData.commuteEndHour,
      updated_at: new Date().toISOString(),
    })
    .eq('id', routeId)
    .select()
    .single();

  if (error) throw error;
  return transformRouteFromDb(data);
}

export async function deleteRoute(routeId: string): Promise<void> {
  const { error } = await supabase
    .from('routes')
    .delete()
    .eq('id', routeId);

  if (error) throw error;
}
