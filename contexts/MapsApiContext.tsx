
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Make gm_authFailure available on window for the Maps API to call it.
// Centralize Google Maps type definitions to avoid duplication.
// Fix: Moved the google namespace declaration into declare global to make it available across all files.
declare global {
  interface Window {
    google: typeof google;
    gm_authFailure?: () => void;
  }

  namespace google {
    namespace maps {
      class Map {
        constructor(mapDiv: Element | null, opts?: any);
        setCenter(latLng: any): void;
        setZoom(zoom: number): void;
      }
  
      class Marker {
        constructor(opts?: any);
        addListener(eventName: string, handler: () => void): any;
        getPosition(): { lat: () => number; lng: () => number; } | null;
        setPosition(latLng: any): void;
      }
  
      class Geocoder {
        geocode(request: any, callback: (results: { formatted_address: string }[] | null, status: string) => void): void;
      }
  
      namespace places {
        interface PlaceResult {
          geometry?: {
            location: {
              lat: () => number;
              lng: () => number;
            };
          };
          formatted_address?: string;
        }
  
        class Autocomplete {
          constructor(inputField: HTMLInputElement, opts?: any);
          addListener(eventName: string, handler: () => void): any;
          getPlace(): PlaceResult;
        }
      }
    }
  }
}


interface MapsApiContextType {
  isLoaded: boolean;
  loadError: Error | null;
}

const MapsApiContext = createContext<MapsApiContextType>({ isLoaded: false, loadError: null });

export const MapsApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if placeholder API key is being used.
    // Fix: Cast the result of querySelector to HTMLScriptElement to access the 'src' property.
    const script = document.querySelector<HTMLScriptElement>('script[src*="maps.googleapis.com/maps/api/js"]');
    if (script && script.src.includes('YOUR_GOOGLE_MAPS_API_KEY')) {
      setLoadError(new Error("The Google Maps API key is missing. Please replace 'YOUR_GOOGLE_MAPS_API_KEY' in index.html with a valid key."));
      return;
    }

    // Official way to handle auth errors from Google Maps API
    window.gm_authFailure = () => {
      setLoadError(new Error('Google Maps API authentication failed. This is often due to an invalid API key, incorrect billing setup, or domain restrictions.'));
    };

    // Check if the API is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }
    
    // Poll to see if the script has loaded.
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        clearInterval(interval);
      } else if (attempts > 50) { // 5-second timeout
        if (!loadError) { 
           setLoadError(new Error('Failed to load the Google Maps script. Please check your internet connection and that the script tag in index.html is correct.'));
        }
        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      delete window.gm_authFailure;
    };
  }, []);

  return (
    <MapsApiContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </MapsApiContext.Provider>
  );
};

export const useMapsApi = (): MapsApiContextType => {
  const context = useContext(MapsApiContext);
  if (context === undefined) {
    throw new Error('useMapsApi must be used within a MapsApiProvider');
  }
  return context;
};
