import { supabase } from './supabase';
import type { UserSettings } from './types';

const DEFAULT_SETTINGS_ID = '00000000-0000-0000-0000-000000000001';

export async function getSettings(): Promise<UserSettings> {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('id', DEFAULT_SETTINGS_ID)
    .maybeSingle();

  if (error) {
    console.error('Error fetching settings:', error);
    return getDefaultSettings();
  }

  if (!data) {
    return getDefaultSettings();
  }

  return {
    id: data.id,
    maxWindSpeed: data.max_wind_speed,
    maxWindGust: data.max_wind_gust,
    maxRainProbability: data.max_rain_probability,
    maxRainIntensity: data.max_rain_intensity,
    notificationTime: data.notification_time,
    weekdaysOnly: data.weekdays_only,
    morningAlertEnabled: data.morning_alert_enabled,
    city: data.city || 'wellington',
  };
}

export async function updateSettings(updates: Partial<UserSettings>): Promise<UserSettings> {
  const updateData: Record<string, unknown> = {};

  if (updates.maxWindSpeed !== undefined) updateData.max_wind_speed = updates.maxWindSpeed;
  if (updates.maxWindGust !== undefined) updateData.max_wind_gust = updates.maxWindGust;
  if (updates.maxRainProbability !== undefined)
    updateData.max_rain_probability = updates.maxRainProbability;
  if (updates.maxRainIntensity !== undefined)
    updateData.max_rain_intensity = updates.maxRainIntensity;
  if (updates.notificationTime !== undefined)
    updateData.notification_time = updates.notificationTime;
  if (updates.weekdaysOnly !== undefined) updateData.weekdays_only = updates.weekdaysOnly;
  if (updates.morningAlertEnabled !== undefined)
    updateData.morning_alert_enabled = updates.morningAlertEnabled;
  if (updates.city !== undefined) updateData.city = updates.city;

  const { data, error } = await supabase
    .from('user_settings')
    .update(updateData)
    .eq('id', DEFAULT_SETTINGS_ID)
    .select()
    .single();

  if (error) {
    console.error('Error updating settings:', error);
    return getDefaultSettings();
  }

  return {
    id: data.id,
    maxWindSpeed: data.max_wind_speed,
    maxWindGust: data.max_wind_gust,
    maxRainProbability: data.max_rain_probability,
    maxRainIntensity: data.max_rain_intensity,
    notificationTime: data.notification_time,
    weekdaysOnly: data.weekdays_only,
    morningAlertEnabled: data.morning_alert_enabled,
    city: data.city || 'wellington',
  };
}

function getDefaultSettings(): UserSettings {
  return {
    id: DEFAULT_SETTINGS_ID,
    maxWindSpeed: 25,
    maxWindGust: 40,
    maxRainProbability: 30,
    maxRainIntensity: 2.0,
    notificationTime: '06:00:00',
    weekdaysOnly: true,
    morningAlertEnabled: false,
    city: 'wellington',
  };
}
