import { supabase } from './supabase';
import { AppSettings } from './types';

function transformAppSettingsFromDb(dbSettings: any): AppSettings {
  return {
    id: dbSettings.id,
    userId: dbSettings.user_id,
    notificationTime: dbSettings.notification_time,
    weekdaysOnly: dbSettings.weekdays_only,
    morningAlertEnabled: dbSettings.morning_alert_enabled,
    maxWindSpeed: dbSettings.max_wind_speed,
    maxWindGust: dbSettings.max_wind_gust,
    maxRainProbability: dbSettings.max_rain_probability,
    maxRainIntensity: dbSettings.max_rain_intensity,
    createdAt: dbSettings.created_at,
    updatedAt: dbSettings.updated_at,
  };
}

export async function getAppSettings(userId: string): Promise<AppSettings> {
  const { data, error } = await supabase
    .from('app_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const defaultSettings = {
      id: userId,
      user_id: userId,
      notification_time: '18:00',
      weekdays_only: true,
      morning_alert_enabled: true,
    };

    const { data: newData, error: insertError } = await supabase
      .from('app_settings')
      .insert(defaultSettings)
      .select()
      .single();

    if (insertError) throw insertError;
    return transformAppSettingsFromDb(newData);
  }

  return transformAppSettingsFromDb(data);
}

export async function updateAppSettings(
  userId: string,
  updates: Partial<Omit<AppSettings, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<AppSettings> {
  const { data, error } = await supabase
    .from('app_settings')
    .update({
      notification_time: updates.notificationTime,
      weekdays_only: updates.weekdaysOnly,
      morning_alert_enabled: updates.morningAlertEnabled,
      max_wind_speed: updates.maxWindSpeed,
      max_wind_gust: updates.maxWindGust,
      max_rain_probability: updates.maxRainProbability,
      max_rain_intensity: updates.maxRainIntensity,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return transformAppSettingsFromDb(data);
}
