import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Location } from '../../types';
import { useMapsApi } from '../../contexts/MapsApiContext';

interface LocationPickerProps {
  onLocationSelect: (location: Location) => void;
  initialLocation?: { lat: number; lng: number };
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, initialLocation }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const { isLoaded, loadError } = useMapsApi();
  const { t } = useLanguage();

  // Initialize Map and Marker
  useEffect(() => {
    if (!isLoaded || !mapRef.current) {
      return;
    }

    const defaultLocation = initialLocation || { lat: 20.5937, lng: 78.9629 }; // Center of India

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: defaultLocation,
      zoom: initialLocation ? 15 : 5,
      disableDefaultUI: true,
      zoomControl: true,
    });
    setMap(mapInstance);

    const markerInstance = new window.google.maps.Marker({
      map: mapInstance,
      position: initialLocation,
      draggable: true,
    });
    setMarker(markerInstance);
    
    // Listen for marker drag events to update location
    markerInstance.addListener('dragend', () => {
        const pos = markerInstance.getPosition();
        if (pos) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: pos }, (results, status) => {
                if (status === 'OK' && results?.[0]) {
                    const newLocation = { lat: pos.lat(), lng: pos.lng(), address: results[0].formatted_address };
                    if (inputRef.current) {
                        inputRef.current.value = newLocation.address;
                    }
                    onLocationSelect(newLocation);
                }
            });
        }
    });

  }, [isLoaded, initialLocation]);
  
  // Initialize Autocomplete
  useEffect(() => {
    if (!isLoaded || !inputRef.current || !map || !marker) {
        return;
    }

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        fields: ["geometry", "formatted_address"],
    });

    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry?.location && place.formatted_address) {
            map.setCenter(place.geometry.location);
            map.setZoom(15);
            marker.setPosition(place.geometry.location);
            onLocationSelect({
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                address: place.formatted_address,
            });
        }
    });

  }, [isLoaded, map, marker, onLocationSelect]);


  if (loadError) {
    return (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            <p className="font-bold">Map Error</p>
            <p>{loadError.message}</p>
        </div>
    );
  }

  return (
    <div>
      <label htmlFor="location-search" className="block text-sm font-medium text-gray-700 mb-2">
        {t('addItem.locationLabel')}
      </label>
      <input
        ref={inputRef}
        id="location-search"
        type="text"
        placeholder={t('addItem.locationPlaceholder')}
        className="w-full px-4 py-3 bg-white border-2 border-gray-300 text-gray-900 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-gray-400 disabled:bg-gray-100"
        disabled={!isLoaded}
      />
      <div ref={mapRef} className={`h-64 mt-4 rounded-lg relative overflow-hidden ${!isLoaded ? 'bg-gray-200 animate-pulse' : ''}`} >
        {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center h-full text-gray-500 bg-gray-200">
                <p>{t('loading.map')}</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
