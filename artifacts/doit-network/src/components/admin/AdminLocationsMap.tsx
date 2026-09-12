import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  OSM_TILE_LAYER_URL, 
  OSM_ATTRIBUTION, 
  createCustomMarkerIcon, 
  openDeviceNavigation,
  BHEL_BHOPAL_CENTER 
} from '../maps/leafletUtils';
import { Booking, Provider } from '../../types/doit';
import { BHEL_BHOPAL_AREAS } from '../../services/geocoding';
import { 
  MapPin, 
  Filter, 
  Navigation, 
  Search, 
  Users, 
  Calendar, 
  ShieldCheck, 
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AdminLocationsMapProps {
  bookings: Booking[];
  providers: Provider[];
  onSelectBooking?: (booking: Booking) => void;
}

export const AdminLocationsMap: React.FC<AdminLocationsMapProps> = ({
  bookings,
  providers,
  onSelectBooking
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const bookingMarkersRef = useRef<{ [id: string]: L.Marker }>({});
  const providerMarkersRef = useRef<{ [id: string]: L.Marker }>({});

  const [selectedLocality, setSelectedLocality] = useState<string>('ALL');
  const [showBookings, setShowBookings] = useState(true);
  const [showProviders, setShowProviders] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    const matchLocality = selectedLocality === 'ALL' || b.locality === selectedLocality || b.locality.includes(selectedLocality);
    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchLocality && matchStatus;
  });

  // Filter providers
  const filteredProviders = providers.filter(p => {
    if (selectedLocality === 'ALL') return true;
    return p.residentialLocality.includes(selectedLocality) || p.serviceAreas.some(sa => sa.includes(selectedLocality));
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

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old booking markers
    Object.values(bookingMarkersRef.current).forEach((m: any) => m?.remove?.());
    bookingMarkersRef.current = {};

    // Clear old provider markers
    Object.values(providerMarkersRef.current).forEach((m: any) => m?.remove?.());
    providerMarkersRef.current = {};

    const bounds = L.latLngBounds([]);

    // Render Booking Markers
    if (showBookings) {
      filteredBookings.forEach((b) => {
        const lat = b.coordinates?.lat ?? BHEL_BHOPAL_CENTER.lat + (Math.random() - 0.5) * 0.01;
        const lng = b.coordinates?.lng ?? BHEL_BHOPAL_CENTER.lng + (Math.random() - 0.5) * 0.01;
        bounds.extend([lat, lng]);

        const isSelected = selectedBooking?.id === b.id;
        const isNeedsMatch = b.status === 'REQUESTED' || b.status === 'PROVIDER_MATCHING';

        const icon = createCustomMarkerIcon({
          color: isNeedsMatch ? '#ef4444' : isSelected ? '#00755f' : '#00c29e',
          iconType: 'home',
          size: isSelected ? 40 : 34,
          pulse: isNeedsMatch
        });

        const marker = L.marker([lat, lng], { icon }).addTo(map);
        marker.on('click', () => {
          setSelectedBooking(b);
          if (onSelectBooking) onSelectBooking(b);
        });

        marker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; padding: 4px; min-width: 180px;">
            <span style="font-size: 10px; font-weight: bold; color: #6b7280; text-transform: uppercase;">${b.id}</span>
            <strong style="color: #00755f; font-size: 13px; display: block;">${b.subService}</strong>
            <p style="margin: 2px 0 0 0; color: #374151;">${b.address}, ${b.locality}</p>
            ${b.landmark ? `<p style="margin: 1px 0 0 0; font-size: 11px; color: #6b7280;">Landmark: ${b.landmark}</p>` : ''}
            <div style="margin-top: 5px; font-size: 11px; font-weight: bold; color: ${isNeedsMatch ? '#dc2626' : '#059669'};">
              Status: ${b.status.replace(/_/g, ' ')}
            </div>
          </div>
        `);

        bookingMarkersRef.current[b.id] = marker;
      });
    }

    // Render Provider Markers
    if (showProviders) {
      filteredProviders.forEach((p) => {
        const lat = p.coordinates?.lat ?? BHEL_BHOPAL_CENTER.lat + (Math.random() - 0.5) * 0.01;
        const lng = p.coordinates?.lng ?? BHEL_BHOPAL_CENTER.lng + (Math.random() - 0.5) * 0.01;
        bounds.extend([lat, lng]);

        const icon = createCustomMarkerIcon({
          color: '#f59e0b',
          iconType: 'worker',
          size: 34
        });

        const marker = L.marker([lat, lng], { icon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; padding: 4px;">
            <strong style="color: #d97706; font-size: 13px; display: block;">${p.name}</strong>
            <span style="color: #4b5563;">${p.skills.slice(0, 2).join(', ')}</span>
            <div style="margin-top: 4px; font-weight: 600; color: #059669;">⭐ ${p.rating} (${p.completedJobsCount} jobs)</div>
            <span style="font-size: 11px; color: #6b7280;">Hub: ${p.residentialLocality}</span>
          </div>
        `);

        providerMarkersRef.current[p.id] = marker;
      });
    }

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [filteredBookings, filteredProviders, showBookings, showProviders, selectedBooking, onSelectBooking]);

  const handleSelectSector = (areaName: string) => {
    setSelectedLocality(areaName);
    const area = BHEL_BHOPAL_AREAS.find(a => a.locality === areaName || a.name === areaName);
    if (area && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([area.lat, area.lng], 15, { animate: true });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-4 sm:p-5 space-y-4">
      {/* Top Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-[#00c29e] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>Hyperlocal BHEL Operations Map</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mt-0.5">
            Live Booking Quarters & Provider Positions
          </h3>
          <p className="text-xs text-zinc-500">
            Real-time geospatial distribution of customer service orders across BHEL Bhopal sectors
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Locality Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-zinc-50 px-2.5 py-1.5 rounded-xl border border-zinc-200">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-zinc-500 font-medium">Locality:</span>
            <select
              value={selectedLocality}
              onChange={(e) => handleSelectSector(e.target.value)}
              className="bg-transparent font-bold text-zinc-800 text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL">All BHEL Areas</option>
              {BHEL_BHOPAL_AREAS.map(a => (
                <option key={a.locality} value={a.locality}>{a.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-zinc-50 px-2.5 py-1.5 rounded-xl border border-zinc-200">
            <span className="text-zinc-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-bold text-zinc-800 text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="REQUESTED">Requested / Needs Match</option>
              <option value="PROVIDER_ASSIGNED">Provider Assigned</option>
              <option value="BOOKED">Booked</option>
              <option value="PROVIDER_ON_THE_WAY">En Route</option>
              <option value="SERVICE_COMPLETED">Completed</option>
            </select>
          </div>

          {/* Layer Toggles */}
          <button
            type="button"
            onClick={() => setShowBookings(!showBookings)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showBookings
                ? 'bg-[#00c29e] text-white border-[#00c29e]'
                : 'bg-zinc-50 text-zinc-500 border-zinc-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>Bookings ({filteredBookings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setShowProviders(!showProviders)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showProviders
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-zinc-50 text-zinc-500 border-zinc-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>Providers ({filteredProviders.length})</span>
          </button>
        </div>
      </div>

      {/* Quick Sector Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-zinc-400 font-semibold shrink-0">Sectors:</span>
        <button
          type="button"
          onClick={() => setSelectedLocality('ALL')}
          className={`px-2.5 py-1 rounded-full border whitespace-nowrap transition-colors cursor-pointer ${
            selectedLocality === 'ALL'
              ? 'bg-zinc-900 text-white border-zinc-900 font-bold'
              : 'bg-white hover:bg-zinc-100 text-zinc-600 border-zinc-200'
          }`}
        >
          All Sectors
        </button>
        {BHEL_BHOPAL_AREAS.slice(0, 8).map(area => (
          <button
            key={area.sectorTag}
            type="button"
            onClick={() => handleSelectSector(area.locality)}
            className={`px-2.5 py-1 rounded-full border whitespace-nowrap transition-colors cursor-pointer ${
              selectedLocality === area.locality
                ? 'bg-[#00c29e] text-white border-[#00c29e] font-bold'
                : 'bg-white hover:bg-zinc-100 text-zinc-600 border-zinc-200'
            }`}
          >
            {area.sectorTag}
          </button>
        ))}
      </div>

      {/* Main Map + Bookings List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Map Stage */}
        <div className="lg:col-span-2 h-[440px] rounded-xl overflow-hidden relative border border-zinc-200 bg-zinc-100">
          <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />
          
          <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-zinc-200 text-[11px] font-semibold text-zinc-700 shadow-sm pointer-events-none flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Needs Match</span>
            </span>
            <span className="text-zinc-300">|</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#00c29e]" />
              <span>Assigned/Active</span>
            </span>
            <span className="text-zinc-300">|</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Provider</span>
            </span>
          </div>
        </div>

        {/* Bookings In Current Filter */}
        <div className="space-y-3 overflow-y-auto max-h-[440px] pr-1">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 uppercase tracking-wide">
            <span>Filtered Bookings ({filteredBookings.length})</span>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="p-8 rounded-xl bg-zinc-50 border border-zinc-200 text-center text-xs text-zinc-500">
              No bookings found in {selectedLocality === 'ALL' ? 'this filter' : selectedLocality}.
            </div>
          ) : (
            filteredBookings.map((b) => {
              const isSelected = selectedBooking?.id === b.id;
              const isNeedsMatch = b.status === 'REQUESTED' || b.status === 'PROVIDER_MATCHING';

              return (
                <div
                  key={b.id}
                  onClick={() => {
                    setSelectedBooking(b);
                    if (b.coordinates && mapInstanceRef.current) {
                      mapInstanceRef.current.flyTo([b.coordinates.lat, b.coordinates.lng], 16, { animate: true });
                    }
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 text-xs ${
                    isSelected
                      ? 'bg-[#f0fdf9] border-[#00c29e] shadow-xs ring-1 ring-[#00c29e]'
                      : 'bg-white hover:bg-zinc-50 border-zinc-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded">
                          {b.id}
                        </span>
                        <span className="font-semibold text-zinc-900">{b.customerName}</span>
                      </div>
                      <h4 className="font-bold text-zinc-900 mt-1">{b.subService}</h4>
                      <p className="text-[11px] text-zinc-500">{b.address}, {b.locality}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      isNeedsMatch ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-zinc-100 text-zinc-700'
                    }`}>
                      {b.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-zinc-100 text-[11px]">
                    <span className="text-zinc-500">
                      {b.landmark ? `Landmark: ${b.landmark}` : `Budget: ₹${b.expectedBudget || 350}`}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const lat = b.coordinates?.lat ?? BHEL_BHOPAL_CENTER.lat;
                        const lng = b.coordinates?.lng ?? BHEL_BHOPAL_CENTER.lng;
                        openDeviceNavigation(lat, lng, `${b.customerName} - ${b.locality}`);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] text-[#00755f] font-bold hover:underline"
                    >
                      <Navigation className="w-3 h-3 text-[#00c29e]" />
                      <span>Navigate</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
