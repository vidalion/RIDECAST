'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Bell, Wind, CloudRain, Gauge, Droplets, Route } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useTimeTheme } from '@/hooks/use-time-theme';
import { getAppSettings, updateAppSettings } from '@/lib/app-settings-api';
import type { AppSettings } from '@/lib/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { theme } = useTimeTheme();

  useEffect(() => {
    async function loadSettings() {
      const data = await getAppSettings('00000000-0000-0000-0000-000000000000');
      setSettings(data);
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      await updateAppSettings('00000000-0000-0000-0000-000000000000', {
        notificationTime: settings.notificationTime,
        weekdaysOnly: settings.weekdaysOnly,
        morningAlertEnabled: settings.morningAlertEnabled,
        maxWindSpeed: settings.maxWindSpeed,
        maxWindGust: settings.maxWindGust,
        maxRainProbability: settings.maxRainProbability,
        maxRainIntensity: settings.maxRainIntensity,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!theme || !settings) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/70">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/">
            <Button
              variant="ghost"
              className="rounded-full hover:bg-white/10 text-white mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">App Settings</h1>
          <p className="text-white/70">Configure global notification preferences</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div
            className="backdrop-blur-md rounded-lg p-6 border"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              borderColor: 'rgba(255, 255, 255, 0.12)',
            }}
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-2">
                <Bell className="w-5 h-5" />
                Notifications
              </h2>
              <p className="text-white/60 text-sm">
                Control when and how you receive cycling alerts
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Morning Alert</Label>
                  <p className="text-sm text-white/60">
                    Get notified about conditions before your commute
                  </p>
                </div>
                <Switch
                  checked={settings.morningAlertEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, morningAlertEnabled: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notificationTime" className="text-white">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Notification Time
                  </div>
                </Label>
                <Input
                  id="notificationTime"
                  type="time"
                  value={settings.notificationTime}
                  onChange={(e) =>
                    setSettings({ ...settings, notificationTime: e.target.value })
                  }
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Weekdays Only
                    </div>
                  </Label>
                  <p className="text-sm text-white/60">
                    Only receive notifications on weekdays
                  </p>
                </div>
                <Switch
                  checked={settings.weekdaysOnly}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, weekdaysOnly: checked })
                  }
                />
              </div>
            </div>
          </div>

          <div
            className="backdrop-blur-md rounded-lg p-6 border"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              borderColor: 'rgba(255, 255, 255, 0.12)',
            }}
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-2">
                <Gauge className="w-5 h-5" />
                Weather Thresholds
              </h2>
              <p className="text-white/60 text-sm">
                Set limits for acceptable cycling conditions
              </p>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxWindSpeed" className="text-white">
                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4" />
                      Max Wind Speed (km/h)
                    </div>
                  </Label>
                  <Input
                    id="maxWindSpeed"
                    type="number"
                    value={settings.maxWindSpeed}
                    onChange={(e) =>
                      setSettings({ ...settings, maxWindSpeed: parseFloat(e.target.value) })
                    }
                    min="0"
                    step="1"
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxWindGust" className="text-white">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4" />
                      Max Wind Gust (km/h)
                    </div>
                  </Label>
                  <Input
                    id="maxWindGust"
                    type="number"
                    value={settings.maxWindGust}
                    onChange={(e) =>
                      setSettings({ ...settings, maxWindGust: parseFloat(e.target.value) })
                    }
                    min="0"
                    step="1"
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxRainProbability" className="text-white">
                    <div className="flex items-center gap-2">
                      <CloudRain className="w-4 h-4" />
                      Max Rain Probability (%)
                    </div>
                  </Label>
                  <Input
                    id="maxRainProbability"
                    type="number"
                    value={settings.maxRainProbability}
                    onChange={(e) =>
                      setSettings({ ...settings, maxRainProbability: parseFloat(e.target.value) })
                    }
                    min="0"
                    max="100"
                    step="1"
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxRainIntensity" className="text-white">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4" />
                      Max Rain Intensity (mm/h)
                    </div>
                  </Label>
                  <Input
                    id="maxRainIntensity"
                    type="number"
                    value={settings.maxRainIntensity}
                    onChange={(e) =>
                      setSettings({ ...settings, maxRainIntensity: parseFloat(e.target.value) })
                    }
                    min="0"
                    step="0.1"
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className="backdrop-blur-md rounded-lg p-6 border"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              borderColor: 'rgba(255, 255, 255, 0.12)',
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-2">
                  <Route className="w-5 h-5" />
                  Route Management
                </h2>
                <p className="text-white/60 text-sm mb-4">
                  Create routes with real addresses and custom commute time windows.
                  Each route is analyzed using the weather thresholds above.
                </p>
              </div>
              <Link href="/routes">
                <Button
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  Manage Routes
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
