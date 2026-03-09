'use client';

import { Route } from '@/lib/types';
import { ArrowRight, Clock, MapPin, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RouteCardProps {
  route: Route;
  isSelected?: boolean;
  onSelect: (routeId: string) => void;
  onEdit: (routeId: string) => void;
}

export function RouteCard({ route, isSelected, onSelect, onEdit }: RouteCardProps) {
  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'pm' : 'am';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}${period}`;
  };

  return (
    <div
      className={`backdrop-blur-md rounded-lg p-4 border cursor-pointer transition-all hover:bg-white/10 ${
        isSelected ? 'ring-2 ring-white/30' : ''
      }`}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderColor: 'rgba(255, 255, 255, 0.12)',
      }}
      onClick={() => onSelect(route.id)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-2 text-white">{route.name}</h3>

          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm text-white/70">
              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="break-words">{route.startAddress}</div>
              </div>
            </div>

            <div className="flex items-start gap-2 text-sm text-white/70">
              <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="break-words">{route.endAddress}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-white/70 pt-1">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>
                {formatHour(route.commuteStartHour)} – {formatHour(route.commuteEndHour)}
              </span>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(route.id);
          }}
          className="flex-shrink-0 rounded-full h-9 w-9 hover:bg-white/10 text-white"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
