import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  OSM_TILE_LAYER_URL, 
  OSM_ATTRIBUTION, 
  createCustomMarkerIcon,
  openDeviceNavigation,
  BHEL_BHOPAL_CENTER 
} from './leafletUtils';
import { Provider, Booking } from '../../types/doit';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  Compass, 
  CheckCircle2, 
  Layers,
  ExternalLink
} from 'lucide-react';

interface ProviderJobsMapProps {
  provider: Provider;
  assignedBookings: Booking[];
}

export const ProviderJobsMap: React.FC<ProviderJobsMapProps> = ({
  provider,
  assignedBookings,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const circleRef = useRef<L.Circle | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(
    assignedBookings[0] || null
  );
  const [coverageRadiusKm, setCoverageRadiusKm] = useState<number>(
    provider.maxTravelDistanceKm || 6
  );

  const provLat = provider.coordinates?.lat ?? BHEL_BHOPAL_CENTER.lat;
  const provLng = provider.coordinates?.lng ?? BHEL_BHOPAL_CENTER.lng;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [provLat, provLng],
      zoom: 14,
      zoomControl: false
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    L.tileLayer(OSM_TILE_LAYER_URL, {
      attribution: OSM_ATTRIBUTION,
      maxZoom: 19
    }).addTo(map);

    // Provider Base Hub Marker
    const providerIcon = createCustomMarkerIcon({
      color: '#f59e0b',
      iconType: 'worker',
      size: 44,
      label: 'My Base Hub'
    });

    const provMarker = L.marker([provLat, provLng], { icon: providerIcon }).addTo(map);
    provMarker.bindPopup(`
      <div style="font-family: inherit; font-size: 12px; padding: 4px;">
        <strong style="color: #d97706; font-size: 13px; display: block;">${provider.name}</strong>
        <span>Hub: ${provider.residentialLocality || 'BHEL Bhopal'}</span>
      </div>
    `);

    // Coverage Circle
    const circle = L.circle([provLat, provLng], {
      radius: coverageRadiusKm * 1000,
      color: '#00c29e',
      weight: 1.5,
      fillColor: '#00c29e',
      fillOpacity: 0.08,
      dashArray: '4, 6'
    }).addTo(map);
    circleRef.current = circle;

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
  }, [provLat, provLng, coverageRadiusKm, provider.name, provider.residentialLocality]);

  // Update Booking Markers & Route
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((m: any) => m?.remove?.());
    markersRef.current = {};

    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    const bounds = L.latLngBounds([[provLat, provLng]]);

    assignedBookings.forEach((booking) => {
      const bLat = booking.coordinates?.lat ?? provLat + 0.005;
      const bLng = booking.coordinates?.lng ?? provLng + 0.005;
      bounds.extend([bLat, bLng]);

      const isSelected = selectedBooking?.id === booking.id;
      const markerIcon = createCustomMarkerIcon({
        color: isSelected ? '#00755f' : '#00c29e',
        iconType: 'home',
        size: isSelected ? 42 : 36,
        pulse: isSelected || booking.status === 'PROVIDER_ON_THE_WAY'
      });

      const marker = L.marker([bLat, bLng], { icon: markerIcon }).addTo(map);
      marker.on('click', () => {
        setSelectedBooking(booking);
      });

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; padding: 4px; min-width: 180px;">
          <strong style="color: #00755f; font-size: 13px; display: block;">${booking.subService}</strong>
          <div style="font-weight: 600; color: #1f2937; margin-top: 2px;">${booking.customerName}</div>
          <p style="margin: 2px 0 0 0; color: #4b5563;">${booking.address}, ${booking.locality}</p>
          ${booking.landmark ? `<p style="margin: 1px 0 0 0; font-size: 11px; color: #6b7280;">Landmark: ${booking.landmark}</p>` : ''}
          <div style="margin-top: 6px; font-size: 11px; font-weight: bold; color: #00c29e; text-transform: uppercase;">
            ${booking.status.replace(/_/g, ' ')}
          </div>
        </div>
      `);

      markersRef.current[booking.id] = marker;
    });

    // Draw route line to selected booking
    if (selectedBooking) {
      const bLat = selectedBooking.coordinates?.lat ?? provLat + 0.005;
      const bLng = selectedBooking.coordinates?.lng ?? provLng + 0.005;

      const polyline = L.polyline([[provLat, provLng], [bLat, bLng]], {
        color: '#00c29e',
        weight: 4,
        opacity: 0.85,
        dashArray: '6, 8'
      }).addTo(map);
      polylineRef.current = polyline;
    }

    if (assignedBookings.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [assignedBookings, selectedBooking, provLat, provLng]);

  // Update circle radius
  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.setRadius(coverageRadiusKm * 1000);
    }
  }, [coverageRadiusKm]);

  const handleOpenNav = (booking: Booking) => {
    const lat = booking.coordinates?.lat ?? provLat;
    const lng = booking.coordinates?.lng ?? provLng;
    const label = `${booking.customerName} - ${booking.locality}`;
    openDeviceNavigation(lat, lng, label);
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-[#00c29e] flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>OpenStreetMap Hyperlocal Dispatch</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mt-0.5">
            Customer Quarters & Dispatch Route
          </h3>
          <p className="text-xs text-zinc-500">
            Assigned service jobs within your {coverageRadiusKm}km BHEL Bhopal coverage radius
          </p>
        </div>

        {/* Coverage Slider */}
        <div className="flex items-center gap-2 bg-zinc-50 px-3 py-1.5 rounded-xl border border-zinc-200 text-xs">
          <span className="text-zinc-500">Radius:</span>
          <span className="font-bold text-[#00755f]">{coverageRadiusKm} km</span>
          <input
            type="range"
            min="2"
            max="12"
            value={coverageRadiusKm}
            onChange={(e) => setCoverageRadiusKm(Number(e.target.value))}
            className="w-20 accent-[#00c29e] cursor-pointer"
          />
        </div>
      </div>

      {/* Main Content: Map + Job List Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Map Container */}
        <div className="lg:col-span-2 h-[360px] sm:h-[420px] rounded-xl overflow-hidden relative border border-zinc-200 bg-zinc-100">
          <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />
          
          <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-zinc-200 text-[11px] font-semibold text-zinc-700 shadow-sm pointer-events-none flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>My Hub</span>
            <span className="text-zinc-300">|</span>
            <span className="w-2 h-2 rounded-full bg-[#00c29e]" />
            <span>Customer Quarters</span>
          </div>
        </div>

        {/* Assigned Jobs List */}
        <div className="space-y-3 overflow-y-auto max-h-[420px]">
          <div className="text-xs font-bold text-zinc-700 uppercase tracking-wide flex items-center justify-between">
            <span>Assigned Jobs ({assignedBookings.length})</span>
          </div>

          {assignedBookings.length === 0 ? (
            <div className="p-6 rounded-xl bg-zinc-50 border border-zinc-200 text-center text-xs text-zinc-500">
              No active job assignments. Incoming requests nearby will appear here.
            </div>
          ) : (
            assignedBookings.map((b) => {
              const isSelected = selectedBooking?.id === b.id;
              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBooking(b)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-[#f0fdf9] border-[#00c29e] shadow-xs'
                      : 'bg-white hover:bg-zinc-50 border-zinc-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#00755f] bg-[#e6faf6] px-1.5 py-0.5 rounded">
                        {b.id}
                      </span>
                      <h4 className="font-bold text-xs text-zinc-900 mt-1">{b.subService}</h4>
                      <p className="text-[11px] text-zinc-500">{b.address}, {b.locality}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-zinc-100 text-zinc-700">
                      {b.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-zinc-100 text-[11px]">
                    <span className="text-zinc-600 font-medium">Customer: {b.customerName}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenNav(b);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#00c29e] hover:bg-[#00a889] text-white font-semibold transition-colors cursor-pointer"
                      title="Launch device GPS navigation"
                    >
                      <Navigation className="w-3 h-3" />
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
