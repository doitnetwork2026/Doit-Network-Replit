import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  OSM_TILE_LAYER_URL, 
  OSM_ATTRIBUTION, 
  createCustomMarkerIcon,
  openDeviceNavigation
} from './leafletUtils';
import { Navigation, MapPin, ExternalLink, ShieldCheck, Compass } from 'lucide-react';

export interface ServiceLocationMapProps {
  serviceLocation: {
    latitude: number;
    longitude: number;
    address?: string;
    locality?: string;
    landmark?: string;
    houseFlatNumber?: string;
  };
  providerLocation?: {
    latitude: number;
    longitude: number;
    name?: string;
  };
  title?: string;
  height?: string | number;
  showNavigationButton?: boolean;
  interactive?: boolean;
}

export const ServiceLocationMap: React.FC<ServiceLocationMapProps> = ({
  serviceLocation,
  providerLocation,
  title = 'Customer Service Quarter',
  height = '320px',
  showNavigationButton = true,
  interactive = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const custLat = serviceLocation.latitude;
    const custLng = serviceLocation.longitude;

    const map = L.map(mapContainerRef.current, {
      center: [custLat, custLng],
      zoom: 15,
      zoomControl: false,
      dragging: interactive,
      touchZoom: interactive,
      scrollWheelZoom: false,
      doubleClickZoom: interactive
    });

    if (interactive) {
      L.control.zoom({ position: 'topright' }).addTo(map);
    }

    L.tileLayer(OSM_TILE_LAYER_URL, {
      attribution: OSM_ATTRIBUTION,
      maxZoom: 19
    }).addTo(map);

    // Customer Location Marker
    const customerIcon = createCustomMarkerIcon({
      color: '#00c29e',
      iconType: 'home',
      size: 38,
      label: 'Service Quarter'
    });

    const custMarker = L.marker([custLat, custLng], { icon: customerIcon }).addTo(map);
    const addressHtml = `
      <div style="font-family: inherit; font-size: 12px; padding: 2px;">
        <strong style="color: #00755f; font-size: 13px; display: block;">
          ${serviceLocation.houseFlatNumber ? serviceLocation.houseFlatNumber + ', ' : ''}${serviceLocation.locality || 'BHEL Quarter'}
        </strong>
        <p style="margin: 3px 0 0 0; color: #4b5563;">${serviceLocation.address || 'BHEL Township'}</p>
        ${serviceLocation.landmark ? `<p style="margin: 2px 0 0 0; font-size: 11px; color: #6b7280;">Landmark: ${serviceLocation.landmark}</p>` : ''}
      </div>
    `;
    custMarker.bindPopup(addressHtml);

    // If Provider Location is also present, draw route line and provider marker
    if (providerLocation) {
      const provLat = providerLocation.latitude;
      const provLng = providerLocation.longitude;

      const providerIcon = createCustomMarkerIcon({
        color: '#f59e0b',
        iconType: 'worker',
        size: 38,
        label: providerLocation.name ? `${providerLocation.name} (En Route)` : 'Provider'
      });

      const provMarker = L.marker([provLat, provLng], { icon: providerIcon }).addTo(map);
      provMarker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; padding: 2px;">
          <strong style="color: #d97706; font-size: 13px; display: block;">Assigned Provider</strong>
          <span>${providerLocation.name || 'KYC Verified DOIT Partner'}</span>
        </div>
      `);

      // Route polyline connecting provider and customer
      const polyline = L.polyline([
        [provLat, provLng],
        [custLat, custLng]
      ], {
        color: '#00c29e',
        weight: 4,
        opacity: 0.8,
        dashArray: '8, 8'
      }).addTo(map);

      // Fit bounds to show both
      const bounds = L.latLngBounds([
        [provLat, provLng],
        [custLat, custLng]
      ]);
      map.fitBounds(bounds, { padding: [40, 40] });
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
  }, [
    serviceLocation.latitude,
    serviceLocation.longitude,
    serviceLocation.address,
    serviceLocation.locality,
    serviceLocation.landmark,
    serviceLocation.houseFlatNumber,
    providerLocation,
    interactive
  ]);

  const handleOpenNavigation = () => {
    const label = `${serviceLocation.houseFlatNumber ? serviceLocation.houseFlatNumber + ', ' : ''}${serviceLocation.locality || 'BHEL Bhopal'}`;
    openDeviceNavigation(serviceLocation.latitude, serviceLocation.longitude, label);
  };

  return (
    <div className="rounded-2xl border border-zinc-200/90 bg-white overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="p-3.5 bg-zinc-50 border-b border-zinc-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#e6faf6] text-[#00755f] flex items-center justify-center border border-[#99ede0]">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-900">{title}</h4>
            <p className="text-[11px] text-zinc-500">
              {serviceLocation.houseFlatNumber ? `${serviceLocation.houseFlatNumber}, ` : ''}
              {serviceLocation.locality || 'BHEL Bhopal'}
              {serviceLocation.landmark ? ` • Landmark: ${serviceLocation.landmark}` : ''}
            </p>
          </div>
        </div>

        {showNavigationButton && (
          <button
            type="button"
            onClick={handleOpenNavigation}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00c29e] hover:bg-[#00a889] text-white text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0"
            title="Open in Google Maps / Android Navigation / Apple Maps"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Open Navigation</span>
          </button>
        )}
      </div>

      {/* Map Container */}
      <div style={{ height }} className="w-full relative bg-zinc-100">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />
      </div>

      {/* Address Details Footnote */}
      <div className="p-3 bg-white border-t border-zinc-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-zinc-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-800">Exact Destination:</span>
          <span className="text-zinc-600 truncate max-w-[280px] sm:max-w-md">
            {serviceLocation.address || serviceLocation.locality}
          </span>
        </div>
        <span className="text-[11px] text-zinc-400 font-mono">
          {serviceLocation.latitude.toFixed(4)}, {serviceLocation.longitude.toFixed(4)}
        </span>
      </div>
    </div>
  );
};
