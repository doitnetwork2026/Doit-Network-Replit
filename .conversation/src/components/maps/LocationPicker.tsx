import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { 
  BHEL_BHOPAL_CENTER, 
  OSM_TILE_LAYER_URL, 
  OSM_ATTRIBUTION, 
  createCustomMarkerIcon 
} from './leafletUtils';
import { 
  geocodeAddress, 
  reverseGeocode, 
  GeocodingResult, 
  BHEL_BHOPAL_AREAS 
} from '../../services/geocoding';
import { SavedAddress } from '../../types/doit';
import { 
  Search, 
  MapPin, 
  Navigation, 
  Check, 
  Crosshair, 
  Sparkles, 
  Building2, 
  Home, 
  Compass,
  AlertCircle
} from 'lucide-react';

export interface LocationPickerProps {
  initialLocation?: Partial<SavedAddress>;
  onSaveLocation?: (location: SavedAddress) => void;
  onCancel?: () => void;
  allowSaveToProfile?: boolean;
  title?: string;
  subtitle?: string;
  submitButtonText?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  initialLocation,
  onSaveLocation,
  onCancel,
  allowSaveToProfile = true,
  title = 'Pick Exact Service Location',
  subtitle = 'Drag the pin to your quarter or search BHEL sector',
  submitButtonText = 'Confirm Service Location'
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLocation?.latitude ?? BHEL_BHOPAL_CENTER.lat,
    lng: initialLocation?.longitude ?? BHEL_BHOPAL_CENTER.lng
  });

  const [formData, setFormData] = useState({
    houseFlatNumber: initialLocation?.houseFlatNumber ?? '',
    address: initialLocation?.address ?? 'Sector 2, BHEL Township',
    locality: initialLocation?.locality ?? 'BHEL Sector 2',
    city: initialLocation?.city ?? 'Bhopal',
    state: initialLocation?.state ?? 'Madhya Pradesh',
    pincode: initialLocation?.pincode ?? '462022',
    landmark: initialLocation?.landmark ?? 'Near Officers Club & Dispensary'
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [saveToProfile, setSaveToProfile] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  const handleUpdateCoordinates = useCallback(async (lat: number, lng: number, fly = false) => {
    setCoords({ lat, lng });

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    }

    if (fly && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 16, { animate: true, duration: 0.8 });
    }

    // Reverse geocode to auto-fill address & landmark
    setIsReverseGeocoding(true);
    try {
      const details = await reverseGeocode(lat, lng);
      setFormData(prev => ({
        ...prev,
        address: details.address || prev.address,
        locality: details.locality || prev.locality,
        city: details.city || prev.city,
        state: details.state || prev.state,
        pincode: details.pincode || prev.pincode,
        landmark: details.landmark || prev.landmark
      }));
    } finally {
      setIsReverseGeocoding(false);
    }
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialLat = initialLocation?.latitude ?? BHEL_BHOPAL_CENTER.lat;
    const initialLng = initialLocation?.longitude ?? BHEL_BHOPAL_CENTER.lng;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 15,
      zoomControl: false
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    L.tileLayer(OSM_TILE_LAYER_URL, {
      attribution: OSM_ATTRIBUTION,
      maxZoom: 19
    }).addTo(map);

    const markerIcon = createCustomMarkerIcon({
      color: '#00c29e',
      iconType: 'target',
      size: 42,
      pulse: true,
      label: 'Drag to Quarter'
    });

    const marker = L.marker([initialLat, initialLng], {
      draggable: true,
      icon: markerIcon
    }).addTo(map);

    marker.bindPopup(`
      <div style="font-family: inherit; padding: 4px; font-size: 12px;">
        <strong style="color: #00755f; display: block; font-size: 13px;">Selected Service Spot</strong>
        <span>Drag this pin to your exact quarter gate</span>
      </div>
    `);

    // Listen to marker drag events
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      handleUpdateCoordinates(pos.lat, pos.lng, false);
    });

    // Listen to map click events to place marker
    map.on('click', (e: L.LeafletMouseEvent) => {
      handleUpdateCoordinates(e.latlng.lat, e.latlng.lng, false);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    // Invalidate size after mount
    const timer = setTimeout(() => {
      if (mapInstanceRef.current && (mapInstanceRef.current as any)._mapPane) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      try {
        map.stop();
        map.remove();
      } catch {
        // ignore
      }
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, [handleUpdateCoordinates, initialLocation?.latitude, initialLocation?.longitude]);

  // Handle Search using Geocoding service
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await geocodeAddress(searchQuery);
      setSearchResults(results);
      if (results.length > 0) {
        const top = results[0];
        handleSelectSearchResult(top);
      } else {
        setNotification('No location found. Please try "Sector 2" or "Piplani".');
        setTimeout(() => setNotification(null), 3000);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result: GeocodingResult) => {
    setSearchResults([]);
    setSearchQuery(result.displayName);
    handleUpdateCoordinates(result.latitude, result.longitude, true);
    setFormData(prev => ({
      ...prev,
      locality: result.locality,
      city: result.city,
      state: result.state,
      pincode: result.pincode,
      landmark: result.landmark || prev.landmark
    }));
  };

  const handleCenterBhel = () => {
    handleUpdateCoordinates(BHEL_BHOPAL_CENTER.lat, BHEL_BHOPAL_CENTER.lng, true);
  };

  const handleDeviceGps = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handleUpdateCoordinates(pos.coords.latitude, pos.coords.longitude, true);
          setNotification('Located via Device GPS');
          setTimeout(() => setNotification(null), 2500);
        },
        () => {
          setNotification('GPS access denied. Defaulting to BHEL Sector 1.');
          setTimeout(() => setNotification(null), 3000);
          handleCenterBhel();
        }
      );
    }
  };

  const handleSubmit = () => {
    const finalAddress: SavedAddress = {
      id: initialLocation?.id || `ADDR-${Date.now().toString().slice(-4)}`,
      latitude: coords.lat,
      longitude: coords.lng,
      houseFlatNumber: formData.houseFlatNumber.trim(),
      address: formData.address.trim(),
      locality: formData.locality.trim(),
      city: formData.city.trim() || 'Bhopal',
      state: formData.state.trim() || 'Madhya Pradesh',
      pincode: formData.pincode.trim() || '462022',
      landmark: formData.landmark.trim(),
      isDefault: saveToProfile
    };

    if (allowSaveToProfile && saveToProfile) {
      try {
        localStorage.setItem('doit_saved_customer_address', JSON.stringify(finalAddress));
      } catch {
        // localStorage fallback
      }
    }

    if (onSaveLocation) {
      onSaveLocation(finalAddress);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5 bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden text-zinc-800">
      
      {/* Left Column: Interactive Leaflet Map & Search */}
      <div className="flex-1 flex flex-col min-h-[380px] lg:min-h-[500px]">
        {/* Top Search Bar & Sector Chips */}
        <div className="p-3.5 bg-zinc-50 border-b border-zinc-200/80 space-y-2.5">
          <form onSubmit={handleSearch} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search BHEL Sector 1-6, Piplani, Kasturba Hospital..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#00c29e]"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-3.5 py-2 bg-[#00c29e] hover:bg-[#00a889] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </form>

          {/* Search Dropdown Results */}
          {searchResults.length > 0 && (
            <div className="bg-white rounded-xl border border-zinc-200 shadow-md p-1.5 space-y-1">
              <span className="text-[10px] font-bold text-zinc-400 px-2 block uppercase">Select Matching Area:</span>
              {searchResults.map((res, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectSearchResult(res)}
                  className="w-full text-left p-2 rounded-lg hover:bg-[#f0fdf9] text-xs flex items-center justify-between text-zinc-800"
                >
                  <span className="font-semibold">{res.locality}</span>
                  <span className="text-[11px] text-zinc-400 truncate max-w-[200px]">{res.landmark || res.displayName}</span>
                </button>
              ))}
            </div>
          )}

          {/* Quick Sector Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[11px] no-scrollbar">
            <span className="text-zinc-400 font-semibold shrink-0">Sectors:</span>
            {BHEL_BHOPAL_AREAS.slice(0, 7).map((area) => (
              <button
                key={area.sectorTag}
                type="button"
                onClick={() => {
                  handleUpdateCoordinates(area.lat, area.lng, true);
                  setFormData(prev => ({
                    ...prev,
                    locality: area.locality,
                    pincode: area.pincode,
                    landmark: area.landmark
                  }));
                }}
                className={`px-2.5 py-1 rounded-full border whitespace-nowrap transition-colors cursor-pointer ${
                  formData.locality === area.locality
                    ? 'bg-[#00c29e] text-white border-[#00c29e] font-bold'
                    : 'bg-white hover:bg-zinc-100 text-zinc-600 border-zinc-200'
                }`}
              >
                {area.sectorTag}
              </button>
            ))}
          </div>
        </div>

        {/* Map Stage Container */}
        <div className="relative flex-1 min-h-[320px] bg-zinc-100">
          <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

          {/* Map Floating Control Buttons */}
          <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleDeviceGps}
              title="Use My Current GPS Location"
              className="p-2.5 rounded-xl bg-white/95 backdrop-blur-xs text-zinc-700 hover:text-[#00755f] border border-zinc-200/90 shadow-md transition-all cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleCenterBhel}
              title="Center on BHEL Bhopal"
              className="p-2.5 rounded-xl bg-white/95 backdrop-blur-xs text-zinc-700 hover:text-[#00755f] border border-zinc-200/90 shadow-md transition-all cursor-pointer"
            >
              <Crosshair className="w-4 h-4" />
            </button>
          </div>

          {/* Floating Instructions Banner */}
          <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-zinc-200/80 shadow-sm text-xs font-semibold text-zinc-700 flex items-center gap-1.5 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-[#00c29e] animate-ping" />
            <span>Click map or drag the pin to your quarter</span>
          </div>

          {/* Notification Toast */}
          {notification && (
            <div className="absolute top-3 right-3 z-20 bg-zinc-900 text-white text-xs px-3 py-1.5 rounded-xl shadow-lg animate-fade-in flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#00c29e]" />
              <span>{notification}</span>
            </div>
          )}
        </div>

        {/* Coords & Reverse Geocode Status Bar */}
        <div className="px-4 py-2 bg-zinc-50 border-t border-zinc-200/80 flex items-center justify-between text-[11px] text-zinc-500">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#00c29e]" />
            <span className="font-mono">Lat: {coords.lat.toFixed(5)}, Lng: {coords.lng.toFixed(5)}</span>
          </div>
          {isReverseGeocoding && (
            <span className="text-[#00755f] font-semibold animate-pulse">Resolving BHEL quarter address...</span>
          )}
        </div>
      </div>

      {/* Right Column: Address Form & Confirmation */}
      <div className="w-full lg:w-96 p-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-zinc-200 bg-white">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#00755f] uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-[#00c29e]" />
              <span>Location Details</span>
            </div>
            <h3 className="text-base font-bold text-zinc-900 mt-0.5">{title}</h3>
            <p className="text-xs text-zinc-500">{subtitle}</p>
          </div>

          <div className="space-y-3 text-xs">
            {/* House / Quarter Number */}
            <div className="space-y-1">
              <label className="font-semibold text-zinc-700 flex items-center gap-1">
                <Home className="w-3.5 h-3.5 text-zinc-400" />
                <span>Quarter / Flat / House Number *</span>
              </label>
              <input
                type="text"
                value={formData.houseFlatNumber}
                onChange={(e) => setFormData({ ...formData, houseFlatNumber: e.target.value })}
                placeholder="e.g. Type-3, Qtr 248 or House 12B"
                className="w-full p-2.5 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#00c29e]"
              />
            </div>

            {/* Street / Address Line */}
            <div className="space-y-1">
              <label className="font-semibold text-zinc-700 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>Street / Area / Colony Line *</span>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. Street 14, Near Dispensary"
                className="w-full p-2.5 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#00c29e]"
              />
            </div>

            {/* Locality & Landmark */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Locality / Sector *</label>
                <select
                  value={formData.locality}
                  onChange={(e) => {
                    const loc = e.target.value;
                    setFormData({ ...formData, locality: loc });
                    const match = BHEL_BHOPAL_AREAS.find(a => a.locality === loc);
                    if (match) {
                      handleUpdateCoordinates(match.lat, match.lng, true);
                    }
                  }}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold"
                >
                  <option value="BHEL Sector 1">BHEL Sector 1</option>
                  <option value="BHEL Sector 2">BHEL Sector 2</option>
                  <option value="BHEL Sector 3">BHEL Sector 3</option>
                  <option value="BHEL Sector 4">BHEL Sector 4</option>
                  <option value="BHEL Sector 5">BHEL Sector 5</option>
                  <option value="BHEL Sector 6">BHEL Sector 6</option>
                  <option value="Piplani">Piplani</option>
                  <option value="Govindpura">Govindpura</option>
                  <option value="Indrapuri">Indrapuri</option>
                  <option value="Ayodhya Nagar">Ayodhya Nagar</option>
                  <option value="Awadhpuri">Awadhpuri</option>
                  <option value="Berkheda">Berkheda</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Pincode</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="462022"
                  className="w-full p-2.5 rounded-xl border border-zinc-200 bg-white font-mono"
                />
              </div>
            </div>

            {/* Landmark */}
            <div className="space-y-1">
              <label className="font-semibold text-zinc-700">Nearby Landmark</label>
              <input
                type="text"
                value={formData.landmark}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                placeholder="e.g. Near Officers Club / BHEL Hospital Gate"
                className="w-full p-2.5 rounded-xl border border-zinc-200 bg-white"
              />
            </div>

            {/* City & State (Bhopal, MP default) */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-500 pt-1">
              <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-100">
                <span className="text-zinc-400 block">City</span>
                <span className="font-semibold text-zinc-700">{formData.city}</span>
              </div>
              <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-100">
                <span className="text-zinc-400 block">State</span>
                <span className="font-semibold text-zinc-700">{formData.state}</span>
              </div>
            </div>

            {/* Save to profile checkbox */}
            {allowSaveToProfile && (
              <label className="flex items-center gap-2 text-xs text-zinc-600 pt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={saveToProfile}
                  onChange={(e) => setSaveToProfile(e.target.checked)}
                  className="w-4 h-4 rounded text-[#00c29e] focus:ring-[#00c29e] border-zinc-300"
                />
                <span>Save this address to my DOIT customer profile</span>
              </label>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-5 space-y-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl bg-[#00c29e] hover:bg-[#00a889] text-white font-bold text-xs transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>{submitButtonText}</span>
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-600 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
