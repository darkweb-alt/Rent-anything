import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Item, User, Location } from '../../types';
import Header from '../common/Header';
import { useLanguage } from '../../contexts/LanguageContext';
import LocationSearchInput from '../common/LocationSearchInput';

// Haversine formula to calculate distance between two lat/lng points in kilometers
const getDistanceInKm = (loc1: Location, loc2: Location) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180);
  const dLon = (loc2.lng - loc1.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(loc1.lat * (Math.PI / 180)) * Math.cos(loc2.lat * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};


interface HomePageProps {
  items: Item[];
  onSelectItem: (item: Item) => void;
  onNavigateProfile: () => void;
  currentUser: User | null;
}

const LocationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

const ItemCard: React.FC<{ item: Item; onSelect: () => void; }> = ({ item, onSelect }) => {
    const { t } = useLanguage();
    return (
      <div 
        className="bg-white rounded-xl overflow-hidden border border-gray-200 group cursor-pointer transition-all duration-300 hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/20 transform hover:-translate-y-1"
        onClick={onSelect}
      >
        <div className="relative">
          <img src={item.imageUrl} alt={t(item.name)} className="w-full h-48 object-cover" />
          <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded-full ${item.available ? 'bg-red-600 text-white' : 'bg-gray-500 text-white'}`}>
            {item.available ? t('item.available').toUpperCase() : t('item.rented').toUpperCase()}
          </div>
        </div>
        <div className="p-4 space-y-2">
          <p className="text-sm text-gray-500">{t(item.category)}</p>
          <h3 className="text-lg font-semibold text-gray-800 truncate">{t(item.name)}</h3>
           {item.location && (
              <div className="flex items-center gap-1 text-xs text-gray-600">
                  <LocationIcon className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <span className="truncate" title={item.location.address}>{item.location.address.split(',')[0]}</span>
              </div>
          )}
          <p className="text-xl font-bold text-red-500 pt-1">₹{item.price}<span className="text-sm font-normal text-gray-500">/{t('item.perDay')}</span></p>
        </div>
      </div>
    );
};

const HomePage: React.FC<HomePageProps> = ({ items, onSelectItem, onNavigateProfile, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [locationFilter, setLocationFilter] = useState<Location | null>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  
  const categories = useMemo(() => ['all', ...new Set(items.map(item => item.category))], [items]);
  
  const handlePlaceSelected = useCallback((place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
        setLocationFilter({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: place.formatted_address || '',
        });
    }
  }, []);

  const clearLocationFilter = useCallback(() => {
    setLocationFilter(null);
    if (locationInputRef.current) {
        locationInputRef.current.value = "";
    }
  }, []);

  const filteredItems = useMemo(() => {
    const RADIUS_KM = 30; // 30km radius for location search

    return items.filter(item => {
      if (!item.available) return false;
      const matchesSearch = t(item.name).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'all' || item.category === category;
      const matchesLocation = !locationFilter || (item.location && getDistanceInKm(locationFilter, item.location) <= RADIUS_KM);
      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [items, searchTerm, category, locationFilter, t]);
  
  const translatedCategories = useMemo(() => {
      return categories.map(cat => ({
          value: cat,
          label: cat === 'all' ? t('home.allCategories') : t(cat),
      }));
  }, [categories, t]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header onNavigateProfile={onNavigateProfile} user={currentUser} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{t('home.title')}</h1>
          <p className="text-gray-600">{t('home.subtitle')}</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 sticky top-[65px] z-40 bg-gray-50/95 backdrop-blur-sm py-4">
            <input
                type="text"
                placeholder={t('home.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <div className="relative">
                <LocationSearchInput
                    ref={locationInputRef}
                    placeholder={t('home.locationPlaceholder')}
                    onPlaceSelected={handlePlaceSelected}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
                />
                {locationFilter && (
                    <button onClick={clearLocationFilter} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600" aria-label="Clear location filter">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                )}
            </div>
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
                {translatedCategories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
            </select>
        </div>

        {/* Item Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} onSelect={() => onSelectItem(item)} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
