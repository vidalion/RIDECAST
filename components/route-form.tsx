'use client';

import { useState } from 'react';
import { Route, RouteFormData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Trash2, Clock } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { AddressAutocomplete } from './address-autocomplete';
import { RouteMap } from './route-map';

interface RouteFormProps {
  route?: Route;
  onSave: (data: RouteFormData) => Promise<void>;
  onDelete?: (routeId: string) => Promise<void>;
  onCancel: () => void;
}

export function RouteForm({ route, onSave, onDelete, onCancel }: RouteFormProps) {
  const [name, setName] = useState(route?.name || '');
  const [startAddress, setStartAddress] = useState(route?.startAddress || '');
  const [startLat, setStartLat] = useState(route?.startLatitude || -41.2865);
  const [startLon, setStartLon] = useState(route?.startLongitude || 174.7762);
  const [endAddress, setEndAddress] = useState(route?.endAddress || '');
  const [endLat, setEndLat] = useState(route?.endLatitude || -41.2865);
  const [endLon, setEndLon] = useState(route?.endLongitude || 174.7762);
  const [commuteStartHour, setCommuteStartHour] = useState(route?.commuteStartHour || 7);
  const [commuteEndHour, setCommuteEndHour] = useState(route?.commuteEndHour || 9);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startAddress || !endAddress) {
      alert('Please select both start and end addresses');
      return;
    }

    setIsSaving(true);

    try {
      const formData: RouteFormData = {
        name,
        startAddress,
        startLatitude: startLat,
        startLongitude: startLon,
        endAddress,
        endLatitude: endLat,
        endLongitude: endLon,
        commuteStartHour,
        commuteEndHour,
      };

      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!route || !onDelete) return;
    await onDelete(route.id);
    setShowDeleteDialog(false);
  };

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  const showMap = startAddress && endAddress && startLat && startLon && endLat && endLon;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onCancel}
          className="hover:bg-white/10 text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        {route && onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            className="hover:bg-red-500/10 text-red-400 hover:text-red-300"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        )}
      </div>

      <div
        className="backdrop-blur-md rounded-lg border"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          borderColor: 'rgba(255, 255, 255, 0.12)',
        }}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-6">
            {route ? 'Edit Route' : 'Create New Route'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/90">Route Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., To Work, Home from Work"
                required
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
              />
            </div>

            <div className="space-y-4">
              <AddressAutocomplete
                label="Start Location"
                value={startAddress}
                onChange={(address, lat, lon) => {
                  setStartAddress(address);
                  setStartLat(lat);
                  setStartLon(lon);
                }}
                placeholder="Enter start address"
              />

              <AddressAutocomplete
                label="End Location"
                value={endAddress}
                onChange={(address, lat, lon) => {
                  setEndAddress(address);
                  setEndLat(lat);
                  setEndLon(lon);
                }}
                placeholder="Enter destination address"
              />
            </div>

            {showMap && (
              <RouteMap
                startLat={startLat}
                startLon={startLon}
                endLat={endLat}
                endLon={endLon}
                startAddress={startAddress}
                endAddress={endAddress}
              />
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white/70" />
                <h3 className="font-semibold text-white">Time Window</h3>
              </div>
              <p className="text-sm text-white/60">
                Set the time range when you typically travel this route
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="commuteStartHour" className="text-white/90">Start Time</Label>
                  <Select
                    value={commuteStartHour.toString()}
                    onValueChange={(val) => setCommuteStartHour(parseInt(val))}
                  >
                    <SelectTrigger id="commuteStartHour" className="bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {formatHour(i)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commuteEndHour" className="text-white/90">End Time</Label>
                  <Select
                    value={commuteEndHour.toString()}
                    onValueChange={(val) => setCommuteEndHour(parseInt(val))}
                  >
                    <SelectTrigger id="commuteEndHour" className="bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {formatHour(i)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Route'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                className="hover:bg-white/10 text-white"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Route</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this route? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
