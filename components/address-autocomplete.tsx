'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Loader as Loader2 } from 'lucide-react';
import { searchAddresses, GeocodingResult } from '@/services/geocoding';

interface AddressAutocompleteProps {
  label: string;
  value: string;
  onChange: (address: string, latitude: number, longitude: number) => void;
  placeholder?: string;
}

export function AddressAutocomplete({
  label,
  value,
  onChange,
  placeholder,
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.length >= 3) {
        setLoading(true);
        const searchResults = await searchAddresses(query);
        setResults(searchResults);
        setLoading(false);
        setShowDropdown(true);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleSelect = (result: GeocodingResult) => {
    setQuery(result.displayName);
    onChange(result.displayName, result.latitude, result.longitude);
    setShowDropdown(false);
    setResults([]);
  };

  return (
    <div className="space-y-2 relative">
      <Label htmlFor={label}>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {label}
        </div>
      </Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id={label}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) {
              setShowDropdown(true);
            }
          }}
          placeholder={placeholder || 'Enter an address'}
          className="pr-10"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {showDropdown && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {results.map((result, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(result)}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-start gap-3 transition-colors"
            >
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
              <span className="text-sm text-gray-900">{result.displayName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
