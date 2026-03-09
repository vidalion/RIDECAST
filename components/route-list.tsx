'use client';

import { Route } from '@/lib/types';
import { RouteCard } from './route-card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface RouteListProps {
  routes: Route[];
  selectedRouteId: string | null;
  onSelectRoute: (routeId: string) => void;
  onCreateRoute: () => void;
  onEditRoute: (routeId: string) => void;
}

export function RouteList({
  routes,
  selectedRouteId,
  onSelectRoute,
  onCreateRoute,
  onEditRoute,
}: RouteListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">My Routes</h2>
        <Button
          onClick={onCreateRoute}
          size="sm"
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Route
        </Button>
      </div>

      {routes.length === 0 ? (
        <div
          className="text-center py-12 px-4 border-2 border-dashed rounded-lg backdrop-blur-md"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderColor: 'rgba(255, 255, 255, 0.12)',
          }}
        >
          <p className="text-white/70 mb-4">No routes yet</p>
          <Button
            onClick={onCreateRoute}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Route
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {routes.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              isSelected={selectedRouteId === route.id}
              onSelect={onSelectRoute}
              onEdit={onEditRoute}
            />
          ))}
        </div>
      )}
    </div>
  );
}
