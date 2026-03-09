'use client';

import { MapPin } from 'lucide-react';

interface RouteMapProps {
  startLat: number;
  startLon: number;
  endLat: number;
  endLon: number;
  startAddress?: string;
  endAddress?: string;
}

export function RouteMap({
  startLat,
  startLon,
  endLat,
  endLon,
  startAddress,
  endAddress,
}: RouteMapProps) {
  const minLat = Math.min(startLat, endLat);
  const maxLat = Math.max(startLat, endLat);
  const minLon = Math.min(startLon, endLon);
  const maxLon = Math.max(startLon, endLon);

  const latDiff = maxLat - minLat || 0.01;
  const lonDiff = maxLon - minLon || 0.01;

  const padding = 0.3;
  const bbox = `${minLon - lonDiff * padding},${minLat - latDiff * padding},${maxLon + lonDiff * padding},${maxLat + latDiff * padding}`;

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${startLat},${startLon}&marker=${endLat},${endLon}`;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        <h3 className="font-semibold text-sm">Route Preview</h3>
      </div>
      <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden border relative">
        <iframe
          src={mapUrl}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Route Map"
        />
      </div>
      {startAddress && endAddress && (
        <div className="text-xs text-muted-foreground space-y-1 px-1">
          <div className="flex items-start gap-2">
            <span className="font-semibold min-w-[60px]">From:</span>
            <span className="line-clamp-2">{startAddress}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-semibold min-w-[60px]">To:</span>
            <span className="line-clamp-2">{endAddress}</span>
          </div>
        </div>
      )}
    </div>
  );
}
