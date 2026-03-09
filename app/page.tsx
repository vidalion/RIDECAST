'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Wind, CloudRain, RefreshCw, Map, ArrowLeft, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ScoreRing } from '@/components/score-ring';
import { PenaltyBreakdown } from '@/components/penalty-breakdown';
import { BestRideWindow } from '@/components/best-ride-window';
import { WindCompass } from '@/components/wind-compass';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { RouteList } from '@/components/route-list';
import { RouteForm } from '@/components/route-form';
import { calculateRidecastScore } from '@/lib/scoring';
import { fetchWeatherData } from '@/services/weather';
import { findBestRideWindow } from '@/lib/ride-window';
import { useTimeTheme } from '@/hooks/use-time-theme';
import { getUserRoutes, createRoute, updateRoute, deleteRoute, getRoute } from '@/lib/routes-api';
import { getSelectedRouteId, setSelectedRouteId, clearSelectedRouteId } from '@/lib/route-storage';
import { getAppSettings } from '@/lib/app-settings-api';
import type { RidecastResult, WeatherData, RideWindow, Route, RouteFormData, AppSettings } from '@/lib/types';
import { Card } from '@/components/ui/card';

// View types: 'routes' = Routes List Page, 'forecast' = Forecast Page, 'create-route' = Create Route Form Page, 'edit-route' = Edit Route Form Page
type View = 'routes' | 'forecast' | 'create-route' | 'edit-route';

export default function Home() {
  const searchParams = useSearchParams();
  const [view, setView] = useState<View>('routes');
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  const [result, setResult] = useState<RidecastResult | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [bestWindow, setBestWindow] = useState<RideWindow | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [routeDropdownOpen, setRouteDropdownOpen] = useState(false);
  const { theme } = useTimeTheme();

  const loadRoutes = async () => {
    try {
      const settings = await getAppSettings('00000000-0000-0000-0000-000000000000');
      setAppSettings(settings);

      const userRoutes = await getUserRoutes('00000000-0000-0000-0000-000000000000');
      setRoutes(userRoutes);

      const savedRouteId = getSelectedRouteId();
      if (savedRouteId) {
        const route = userRoutes.find((r) => r.id === savedRouteId);
        if (route) {
          setSelectedRoute(route);
          setView('forecast');
          await loadWeatherForRoute(route, settings);
        }
      }
    } catch (error) {
      console.error('Failed to load routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWeatherForRoute = async (route: Route, settings?: AppSettings) => {
    try {
      const thresholds = settings || appSettings;
      if (!thresholds) return;

      const weatherResult = await fetchWeatherData(undefined, route.startLatitude, route.startLongitude);

      if (!weatherResult?.data) return;

      setWeather(weatherResult.data);

      const ridecastResult = calculateRidecastScore(weatherResult.data, {
        maxWindSpeed: thresholds.maxWindSpeed,
        maxWindGust: thresholds.maxWindGust,
        maxRainProbability: thresholds.maxRainProbability,
        maxRainIntensity: thresholds.maxRainIntensity,
      });

      setResult(ridecastResult);

      const window = findBestRideWindow(
        weatherResult.hourlyData,
        route.commuteStartHour,
        route.commuteEndHour
      );
      setBestWindow(window);
    } catch (error) {
      console.error('Failed to load weather:', error);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  useEffect(() => {
    const viewParam = searchParams.get('view');
    if (viewParam === 'routes') {
      setView('routes');
    }
  }, [searchParams]);

  useEffect(() => {
    if (view !== 'forecast' || !selectedRoute) return;

    const intervalId = setInterval(() => {
      loadWeatherForRoute(selectedRoute);
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [view, selectedRoute]);

  const handleSelectRoute = async (routeId: string) => {
    const route = routes.find((r) => r.id === routeId);
    if (!route) return;

    setSelectedRoute(route);
    setSelectedRouteId(routeId);
    setView('forecast');
    await loadWeatherForRoute(route);
  };

  const handleCreateRoute = async (data: RouteFormData) => {
    try {
      const newRoute = await createRoute('00000000-0000-0000-0000-000000000000', data);
      setRoutes([...routes, newRoute]);
      setSelectedRoute(newRoute);
      setSelectedRouteId(newRoute.id);
      setView('forecast');
      await loadWeatherForRoute(newRoute);
    } catch (error) {
      console.error('Failed to create route:', error);
    }
  };

  const handleUpdateRoute = async (data: RouteFormData) => {
    if (!editingRoute) return;

    try {
      const updated = await updateRoute(editingRoute.id, data);
      setRoutes(routes.map((r) => (r.id === updated.id ? updated : r)));
      if (selectedRoute?.id === updated.id) {
        setSelectedRoute(updated);
        await loadWeatherForRoute(updated);
      }
      setEditingRoute(null);
      setView(selectedRoute?.id === updated.id ? 'forecast' : 'routes');
    } catch (error) {
      console.error('Failed to update route:', error);
    }
  };

  const handleDeleteRoute = async (routeId: string) => {
    try {
      await deleteRoute(routeId);
      setRoutes(routes.filter((r) => r.id !== routeId));
      if (selectedRoute?.id === routeId) {
        setSelectedRoute(null);
        clearSelectedRouteId();
        setView('routes');
      }
      setEditingRoute(null);
    } catch (error) {
      console.error('Failed to delete route:', error);
    }
  };

  const handleRefresh = async () => {
    if (!selectedRoute || refreshing) return;
    setRefreshing(true);
    await loadWeatherForRoute(selectedRoute);
    setRefreshing(false);
  };

  const handleBackToRoutes = () => {
    setView('routes');
  };

  if (loading || !theme) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/70">Loading Ridecast...</p>
        </div>
      </div>
    );
  }

  const getVerdictHeadline = (verdict: string) => {
    switch (verdict) {
      case 'YES':
        return 'Ride today.';
      case 'MAYBE':
        return 'Borderline.';
      case 'NO':
        return 'Not today.';
      default:
        return verdict;
    }
  };

  // ============================================================
  // PAGE VIEW: Create Route Form
  // User clicked "Add Route" button from Routes List Page
  // ============================================================
  if (view === 'create-route') {
    return (
      <div className="min-h-screen px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <RouteForm
            onSave={handleCreateRoute}
            onCancel={() => setView('routes')} // Back button → Routes List Page
          />
        </div>
      </div>
    );
  }

  // ============================================================
  // PAGE VIEW: Edit Route Form
  // User clicked "Edit" button on a route card
  // ============================================================
  if (view === 'edit-route' && editingRoute) {
    return (
      <div className="min-h-screen px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <RouteForm
            route={editingRoute}
            onSave={handleUpdateRoute}
            onDelete={handleDeleteRoute}
            onCancel={() => {
              setEditingRoute(null);
              setView(selectedRoute ? 'forecast' : 'routes'); // Back button → Forecast Page or Routes List Page
            }}
          />
        </div>
      </div>
    );
  }

  // ============================================================
  // PAGE VIEW: Routes List
  // Shows all saved routes and allows creating/selecting routes
  // ============================================================
  if (view === 'routes') {
    return (
      <div className="min-h-screen px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center mb-8 relative"
          >
            {selectedRoute && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setView('forecast')}
                className="absolute left-0 rounded-full h-9 w-9 hover:bg-white/10 text-white"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <Logo size="medium" />
            <Link href="/settings" className="absolute right-0">
              {/* Settings button → Settings Page (/settings) */}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-9 w-9 hover:bg-white/10 text-white"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          <RouteList
            routes={routes}
            selectedRouteId={selectedRoute?.id || null}
            onSelectRoute={handleSelectRoute} // Clicking a route card → Forecast Page
            onCreateRoute={() => setView('create-route')} // "Add Route" button → Create Route Form Page
            onEditRoute={(routeId) => {
              // "Edit" button → Edit Route Form Page
              const route = routes.find((r) => r.id === routeId);
              if (route) {
                setEditingRoute(route);
                setView('edit-route');
              }
            }}
          />
        </div>
      </div>
    );
  }

  // ============================================================
  // PAGE VIEW: Empty Forecast State
  // Shown when no route is selected or weather data is loading
  // ============================================================
  if (!selectedRoute || !result || !weather) {
    return (
      <div className="min-h-screen px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Logo size="medium" />
            {/* Map button → Routes List Page */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToRoutes}
              className="rounded-full h-9 w-9 hover:bg-white/10 text-white"
            >
              <Map className="w-4 h-4" />
            </Button>
          </div>
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Select a route to see your forecast</p>
          </Card>
        </div>
      </div>
    );
  }

  // ============================================================
  // PAGE VIEW: Forecast Page
  // Shows weather forecast and ride score for the selected route
  // ============================================================
  return (
    <div className="min-h-screen px-6 sm:px-6 py-6 sm:py-8 pb-24">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-16 sm:mb-24"
      >
        <div className="flex items-start justify-between mb-16">
          {/* Route selector dropdown */}
          <div
            className="backdrop-blur-md rounded-xl border-2 border-border/60 overflow-hidden shadow-md"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
            }}
          >
            <button
              onClick={() => setRouteDropdownOpen(!routeDropdownOpen)}
              className="w-full px-3 py-2 flex items-center justify-between hover:bg-accent/50 transition-all duration-200 min-w-[140px]"
            >
              <div className="text-left">
                <h3 className="text-[10px] font-semibold text-white/70 mb-0.5">Route</h3>
                <p className="text-xs font-bold text-white">{selectedRoute.name}</p>
              </div>
              <motion.div
                animate={{ rotate: routeDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <ChevronDown className="w-4 h-4 text-white/70" />
              </motion.div>
            </button>

            <AnimatePresence>
              {routeDropdownOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-border">
                    {routes.map((route) => (
                      <button
                        key={route.id}
                        onClick={() => {
                          handleSelectRoute(route.id);
                          setRouteDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left hover:bg-accent/50 transition-all duration-200 ${
                          route.id === selectedRoute.id ? 'bg-accent/30' : ''
                        }`}
                      >
                        <p className="text-xs font-medium text-white">{route.name}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-0.5">
            {/* Map button → Routes List Page */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-9 w-9 hover:bg-white/10 text-white"
              onClick={handleBackToRoutes}
            >
              <Map className="w-4 h-4" />
            </Button>
            {/* Refresh button - Reloads weather data for current route */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-9 w-9 hover:bg-white/10 text-white"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            {/* Settings button → Settings Page (/settings) */}
            <Link href="/settings">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-9 w-9 hover:bg-white/10 text-white"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 top-16">
          <div className="hidden sm:block">
            <Logo size="medium" />
          </div>
          <div className="block sm:hidden">
            <Logo size="small" />
          </div>
        </div>

        {bestWindow && (
          <div className="max-w-sm">
            <BestRideWindow window={bestWindow} theme={theme} />
          </div>
        )}
      </motion.div>

      <div className="max-w-4xl mx-auto mt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <div className="text-center space-y-4 w-full max-w-2xl">
            <div className="space-y-2">
              <h2 className="text-6xl md:text-8xl font-extrabold tracking-tight drop-shadow-lg text-white">
                {getVerdictHeadline(result.verdict)}
              </h2>
              <p className="text-lg md:text-xl leading-relaxed drop-shadow-md text-white/80">
                {result.explanation}
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center py-4"
              style={{
                filter: 'drop-shadow(0 0 40px rgba(0, 0, 0, 0.3))',
              }}
            >
              <ScoreRing
                score={result.score}
                verdict={result.verdict}
                accentColor={theme.accent}
                textColor="#ffffff"
                textSecondary="rgba(255, 255, 255, 0.75)"
              />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.6 }}
        >
          <PenaltyBreakdown breakdown={result.breakdown} weather={weather} theme={theme} />
        </motion.div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-md rounded-lg p-3 border transition-all duration-1000"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              borderColor: 'rgba(255, 255, 255, 0.12)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <CloudRain className="w-3.5 h-3.5 text-white/70" />
              <h3 className="text-xs font-semibold text-white">Rain</h3>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between py-0.5">
                <span className="text-[10px] text-white/70">Probability</span>
                <span className="text-base font-bold tabular-nums text-white">
                  {weather.rainProbability}%
                </span>
              </div>

              <div className="flex items-center justify-between py-0.5">
                <span className="text-[10px] text-white/70">Intensity</span>
                <span className="text-base font-bold tabular-nums text-white">
                  {weather.rainIntensity} mm
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="backdrop-blur-md rounded-lg p-3 border transition-all duration-1000 relative"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              borderColor: 'rgba(255, 255, 255, 0.12)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Wind className="w-3.5 h-3.5 text-white/70" />
              <h3 className="text-xs font-semibold text-white">Wind</h3>
            </div>

            <div className="absolute top-3 right-3">
              <WindCompass degrees={weather.windDirection} />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between py-0.5">
                <span className="text-[10px] text-white/70">Speed</span>
                <span className="text-base font-bold tabular-nums text-white">
                  {weather.windSpeed} km/h
                </span>
              </div>

              <div className="flex items-center justify-between py-0.5">
                <span className="text-[10px] text-white/70">Gusts</span>
                <span className="text-base font-bold tabular-nums text-white">
                  {weather.windGust} km/h
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
