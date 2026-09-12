import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  OSM_TILE_LAYER_URL, 
  OSM_ATTRIBUTION, 
  createCustomMarkerIcon,
  BHEL_BHOPAL_CENTER 
} from './leafletUtils';
import { Provider, ServiceCategory, ServiceCategoryId } from '../../types/doit';
import { MapPin, Star, ShieldCheck, Phone, ArrowRight, Filter, Users } from 'lucide-react';

interface ProviderDirectoryMapProps {
  providers: Provider[];
  categories: ServiceCategory[];
  onSelectCategoryForBooking?: (catId: ServiceCategoryId) => void;
  selectedLocality: string;
}

export const ProviderDirectoryMap: React.FC<ProviderDirectoryMapProps> = ({
  providers,
  categories,
  onSelectCategoryForBooking,
  selectedLocality,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProvider, setActiveProvider] = useState<Provider | null>(null);

  const filteredProviders = providers.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.categories.includes(selectedCategory as ServiceCategoryId);
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [BHEL_BHOPAL_CENTER.lat, BHEL_BHOPAL_CENTER.lng],
      zoom: 14,
      zoomControl: false
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    L.tileLayer(OSM_TILE_LAYER_URL, {
      attribution: OSM_ATTRIBUTION,
      maxZoom: 19
    }).addTo(map);

    mapInstanceRef.current = map;

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
    };
  }, []);

  // Update Markers when filteredProviders change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((m: any) => m?.remove?.());
    markersRef.current = {};

    const bounds = L.latLngBounds([]);

    filteredProviders.forEach((prov) => {
      const lat = prov.coordinates?.lat ?? BHEL_BHOPAL_CENTER.lat;
      const lng = prov.coordinates?.lng ?? BHEL_BHOPAL_CENTER.lng;
      bounds.extend([lat, lng]);

      const isSelected = activeProvider?.id === prov.id;
      const icon = createCustomMarkerIcon({
        color: isSelected ? '#00755f' : '#00c29e',
        iconType: 'worker',
        size: isSelected ? 42 : 36,
        pulse: prov.isEmergencyAvailable
      });

      const marker = L.marker([lat, lng], { icon }).addTo(map);
      marker.on('click', () => {
        setActiveProvider(prov);
      });

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; padding: 4px; min-width: 170px;">
          <strong style="color: #00755f; font-size: 13px; display: block;">${prov.name}</strong>
          <span style="color: #4b5563;">${prov.skills.join(', ')}</span>
          <div style="margin-top: 4px; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-weight: 600; color: #059669;">⭐ ${prov.rating} (${prov.completedJobsCount} jobs)</span>
          </div>
          <p style="margin: 4px 0 0 0; font-size: 11px; color: #6b7280;">Hub: ${prov.residentialLocality || 'BHEL'}</p>
        </div>
      `);

      markersRef.current[prov.id] = marker;
    });

    if (filteredProviders.length > 0 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [filteredProviders, activeProvider]);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 space-y-4 shadow-sm">
      {/* Top Bar with Category Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-[#00c29e] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>OpenStreetMap Coverage Directory</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mt-0.5">
            Verified Service Providers in {selectedLocality}
          </h3>
          <p className="text-xs text-zinc-500">
            Real-time distribution of background-verified workers across BHEL Sectors 1–6
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full border transition-colors cursor-pointer shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-[#00c29e] text-white border-[#00c29e] font-bold'
                : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
            }`}
          >
            All Categories ({providers.length})
          </button>
          {categories.slice(0, 5).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full border transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-[#00c29e] text-white border-[#00c29e] font-bold'
                  : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Map & Provider Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map Stage */}
        <div className="lg:col-span-2 h-[360px] sm:h-[420px] rounded-xl overflow-hidden relative border border-zinc-200 bg-zinc-100">
          <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />
          
          <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-zinc-200 text-[11px] font-semibold text-zinc-700 shadow-sm pointer-events-none flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00c29e]" />
            <span>{filteredProviders.length} Verified Workers on Duty</span>
          </div>
        </div>

        {/* Provider Info Card */}
        <div className="space-y-3 overflow-y-auto max-h-[420px]">
          <div className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
            {activeProvider ? 'Selected Provider' : 'Featured Verified Workers'}
          </div>

          {(activeProvider ? [activeProvider] : filteredProviders).slice(0, 4).map((p) => (
            <div
              key={p.id}
              onClick={() => setActiveProvider(p)}
              className="p-4 rounded-xl border border-zinc-200 hover:border-[#00c29e] bg-white transition-all cursor-pointer space-y-3 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={p.photo}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-xl object-cover border border-zinc-200"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-zinc-900 flex items-center gap-1">
                      <span>{p.name}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#00c29e]" />
                    </h4>
                    <p className="text-[11px] text-zinc-500">{p.skills.slice(0, 2).join(' • ')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-zinc-900 flex items-center gap-0.5 justify-end">
                    <Star className="w-3.5 h-3.5 fill-[#00c29e] text-[#00c29e]" />
                    <span>{p.rating}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400">{p.completedJobsCount} jobs</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-zinc-100">
                <span className="text-zinc-500">{p.residentialLocality || 'BHEL Township'}</span>
                {onSelectCategoryForBooking && p.categories.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCategoryForBooking(p.categories[0]);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00755f] hover:underline"
                  >
                    <span>Book Service</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {activeProvider && (
            <button
              type="button"
              onClick={() => setActiveProvider(null)}
              className="w-full py-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-600 transition-colors cursor-pointer"
            >
              Show All Nearby Workers
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
