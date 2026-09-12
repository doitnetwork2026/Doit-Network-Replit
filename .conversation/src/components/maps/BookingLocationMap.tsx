import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  OSM_TILE_LAYER_URL, 
  OSM_ATTRIBUTION, 
  createCustomMarkerIcon,
  openDeviceNavigation,
  BHEL_BHOPAL_CENTER
} from './leafletUtils';
import { Booking, Provider } from '../../types/doit';
import { MapPin, Navigation, Phone, Calendar, Clock, User, ShieldCheck } from 'lucide-react';

export interface BookingLocationMapProps {
  booking: Booking;
  provider?: Provider | null;
  height?: string | number;
  showDetailsCard?: boolean;
  onLocalityFilter?: (locality: string) => void;
}

export const BookingLocationMap: React.FC<BookingLocationMapProps> = ({
  booking,
  provider,
  height = '360px',
  showDetailsCard = true,
  onLocalityFilter
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const bookingLat = booking.coordinates?.lat ?? BHEL_BHOPAL_CENTER.lat;
  const bookingLng = booking.coordinates?.lng ?? BHEL_BHOPAL_CENTER.lng;

  const providerLat = provider?.coordinates?.lat;
  const providerLng = provider?.coordinates?.lng;

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [bookingLat, bookingLng],
      zoom: 15,
      zoomControl: true
    });

    L.tileLayer(OSM_TILE_LAYER_URL, {
      attribution: OSM_ATTRIBUTION,
      maxZoom: 19
    }).addTo(map);

    // Customer / Booking Location Pin
    const bookingIcon = createCustomMarkerIcon({
      color: '#00c29e',
      iconType: 'home',
      size: 40,
      label: booking.subService,
      pulse: booking.status === 'PROVIDER_ON_THE_WAY' || booking.status === 'ARRIVED'
    });

    const bookingMarker = L.marker([bookingLat, bookingLng], { icon: bookingIcon }).addTo(map);
    bookingMarker.bindPopup(`
      <div style="font-family: inherit; padding: 4px; font-size: 12px; min-width: 180px;">
        <span style="font-weight: bold; color: #00755f; font-size: 13px; display: block;">${booking.subService}</span>
        <div style="font-weight: 600; color: #1f2937; margin-top: 2px;">${booking.customerName}</div>
        <p style="margin: 2px 0 0 0; color: #4b5563;">${booking.address}, ${booking.locality}</p>
        ${booking.landmark ? `<p style="margin: 2px 0 0 0; font-size: 11px; color: #6b7280;">Near ${booking.landmark}</p>` : ''}
        <div style="margin-top: 6px; font-size: 11px; font-weight: bold; color: #059669; text-transform: uppercase;">
          Status: ${booking.status.replace(/_/g, ' ')}
        </div>
      </div>
    `);

    // If Provider coordinates exist, add provider marker & route polyline
    if (providerLat && providerLng) {
      const providerIcon = createCustomMarkerIcon({
        color: '#f59e0b',
        iconType: 'worker',
        size: 38,
        label: `${provider.name}`
      });

      const providerMarker = L.marker([providerLat, providerLng], { icon: providerIcon }).addTo(map);
      providerMarker.bindPopup(`
        <div style="font-family: inherit; padding: 4px; font-size: 12px;">
          <strong style="color: #d97706; display: block; font-size: 13px;">${provider.name}</strong>
          <span style="color: #4b5563;">${provider.residentialLocality || 'BHEL Partner Hub'}</span>
          <div style="margin-top: 4px; color: #059669; font-weight: 600;">⭐ ${provider.rating} Rating</div>
        </div>
      `);

      L.polyline([
        [providerLat, providerLng],
        [bookingLat, bookingLng]
      ], {
        color: '#00c29e',
        weight: 4,
        dashArray: '6, 8',
        opacity: 0.85
      }).addTo(map);

      const bounds = L.latLngBounds([
        [providerLat, providerLng],
        [bookingLat, bookingLng]
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

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
  }, [bookingLat, bookingLng, booking, provider, providerLat, providerLng]);

  const handleOpenNavigation = () => {
    const label = `${booking.customerName} - ${booking.locality}`;
    openDeviceNavigation(bookingLat, bookingLng, label);
  };

  return (
    <div className="rounded-2xl border border-zinc-200/90 bg-white overflow-hidden shadow-sm space-y-0">
      {/* Map Header */}
      <div className="p-3.5 bg-zinc-50 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-zinc-500">{booking.id}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-[#e6faf6] text-[#00755f]">
              {booking.status.replace(/_/g, ' ')}
            </span>
            {onLocalityFilter && (
              <button
                type="button"
                onClick={() => onLocalityFilter(booking.locality)}
                className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-700 hover:bg-zinc-300 transition-colors font-medium cursor-pointer"
              >
                Filter: {booking.locality}
              </button>
            )}
          </div>
          <h4 className="text-sm font-bold text-zinc-900 mt-1">{booking.subService}</h4>
        </div>

        <button
          type="button"
          onClick={handleOpenNavigation}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00c29e] hover:bg-[#00a889] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Device Navigation</span>
        </button>
      </div>

      {/* Map Container */}
      <div style={{ height }} className="w-full relative bg-zinc-100">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />
      </div>

      {/* Details Card */}
      {showDetailsCard && (
        <div className="p-4 bg-white border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">Customer Service Quarter:</span>
            <div className="font-bold text-zinc-900">{booking.customerName}</div>
            <div className="text-zinc-600">{booking.address}, {booking.locality}</div>
            {booking.landmark && (
              <div className="text-zinc-500 text-[11px]">Landmark: {booking.landmark}</div>
            )}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={`tel:${booking.customerPhone}`}
                className="inline-flex items-center gap-1 text-[#00755f] font-semibold hover:underline"
              >
                <Phone className="w-3 h-3 text-[#00c29e]" />
                <span>{booking.customerPhone}</span>
              </a>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">Assigned Service Provider:</span>
            {provider ? (
              <div>
                <div className="font-bold text-zinc-900 flex items-center gap-1">
                  <span>{provider.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#e6faf6] text-[#00755f] font-bold">
                    KYC Verified
                  </span>
                </div>
                <div className="text-zinc-600">Hub: {provider.residentialLocality || 'BHEL Township'}</div>
                <div className="text-zinc-500 text-[11px]">Rating: ⭐ {provider.rating} ({provider.completedJobsCount} jobs)</div>
                <div className="pt-1">
                  <a
                    href={`tel:${provider.phone}`}
                    className="inline-flex items-center gap-1 text-[#00755f] font-semibold hover:underline"
                  >
                    <Phone className="w-3 h-3 text-[#00c29e]" />
                    <span>{provider.phone}</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-zinc-500 italic">No provider assigned yet (Matching nearby workers)</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
