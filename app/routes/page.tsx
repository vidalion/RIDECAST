'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { RouteList } from '@/components/route-list';
import { RouteForm } from '@/components/route-form';
import { useTimeTheme } from '@/hooks/use-time-theme';
import { getUserRoutes, createRoute, updateRoute, deleteRoute } from '@/lib/routes-api';
import { setSelectedRouteId, clearSelectedRouteId } from '@/lib/route-storage';
import type { Route, RouteFormData } from '@/lib/types';

type View = 'list' | 'create' | 'edit';

export default function RoutesPage() {
  const router = useRouter();
  const [view, setView] = useState<View>('list');
  const [routes, setRoutes] = useState<Route[]>([]);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTimeTheme();

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      const userRoutes = await getUserRoutes('00000000-0000-0000-0000-000000000000');
      setRoutes(userRoutes);
    } catch (error) {
      console.error('Failed to load routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRoute = (routeId: string) => {
    setSelectedRouteId(routeId);
    router.push('/');
  };

  const handleCreateRoute = async (data: RouteFormData) => {
    try {
      const newRoute = await createRoute('00000000-0000-0000-0000-000000000000', data);
      setRoutes([...routes, newRoute]);
      setSelectedRouteId(newRoute.id);
      router.push('/');
    } catch (error) {
      console.error('Failed to create route:', error);
    }
  };

  const handleUpdateRoute = async (data: RouteFormData) => {
    if (!editingRoute) return;

    try {
      const updated = await updateRoute(editingRoute.id, data);
      setRoutes(routes.map((r) => (r.id === updated.id ? updated : r)));
      setEditingRoute(null);
      setView('list');
    } catch (error) {
      console.error('Failed to update route:', error);
    }
  };

  const handleDeleteRoute = async (routeId: string) => {
    try {
      await deleteRoute(routeId);
      setRoutes(routes.filter((r) => r.id !== routeId));
      clearSelectedRouteId();
      setEditingRoute(null);
      setView('list');
    } catch (error) {
      console.error('Failed to delete route:', error);
    }
  };

  if (loading || !theme) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/70">Loading routes...</p>
        </div>
      </div>
    );
  }

  if (view === 'create') {
    return (
      <div className="min-h-screen px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <RouteForm
            onSave={handleCreateRoute}
            onCancel={() => setView('list')}
          />
        </div>
      </div>
    );
  }

  if (view === 'edit' && editingRoute) {
    return (
      <div className="min-h-screen px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <RouteForm
            route={editingRoute}
            onSave={handleUpdateRoute}
            onDelete={handleDeleteRoute}
            onCancel={() => {
              setEditingRoute(null);
              setView('list');
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center mb-8 relative"
        >
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 rounded-full h-9 w-9 hover:bg-white/10 text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <Logo size="medium" />
          <Link href="/settings" className="absolute right-0">
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
          selectedRouteId={null}
          onSelectRoute={handleSelectRoute}
          onCreateRoute={() => setView('create')}
          onEditRoute={(routeId) => {
            const route = routes.find((r) => r.id === routeId);
            if (route) {
              setEditingRoute(route);
              setView('edit');
            }
          }}
        />
      </div>
    </div>
  );
}
