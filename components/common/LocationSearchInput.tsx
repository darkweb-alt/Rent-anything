import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useMapsApi } from '../../contexts/MapsApiContext';

interface LocationSearchInputProps {
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
  placeholder: string;
  className?: string;
}

const LocationSearchInput = forwardRef<HTMLInputElement, LocationSearchInputProps>(({ onPlaceSelected, placeholder, className }, ref) => {
  const internalInputRef = useRef<HTMLInputElement>(null);
  const { isLoaded, loadError } = useMapsApi();

  // Expose the internal ref to the parent component
  useImperativeHandle(ref, () => internalInputRef.current!, []);

  useEffect(() => {
    if (!isLoaded || !internalInputRef.current) {
      return;
    }

    // Restrict search to cities for broader results
    const autocomplete = new window.google.maps.places.Autocomplete(internalInputRef.current, {
      types: ['(cities)'],
      fields: ['geometry', 'formatted_address'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        onPlaceSelected(place);
      }
    });
  }, [isLoaded, onPlaceSelected]);

  return (
    <input
      ref={internalInputRef}
      type="text"
      placeholder={placeholder}
      className={className}
      disabled={!isLoaded || !!loadError}
    />
  );
});

export default LocationSearchInput;
