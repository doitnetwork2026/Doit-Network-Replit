import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  OSM_TILE_LAYER_URL, 
  OSM_ATTRIBUTION 
} from '../maps/leafletUtils';
import { 
  LocalityItem, 
  ALL_SERVICE_LOCATIONS,
  DOIT_PRIMARY_COVERAGE_POLYGON,
  DOIT_SECONDARY_COVERAGE_POLYGON
} from '../../data/serviceAreaData';
import { MapPin, Navigation, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ServiceAreaMapProps {
  selectedLocality: LocalityItem | null;
  onSelectLocality: (locality: LocalityItem) => void;
  onBookNow: (localityName: string) => void;
  className?: string;
}

const DEFAULT_CENTER: [number, number] = [23.2385, 77.4700];
const DEFAULT_ZOOM = 13;

export const ServiceAreaMap: React.FC<ServiceAreaMapProps> = ({
  selectedLocality,
  onSelectLocality,
  onBookNow,
  className = ''
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const polygonsRef = useRef<L.Polygon[]>([]);
  const activePopupRef = useRef<L.Popup | null>(null);
  const popupBtnTimeoutRef = useRef<any>(null);
  const isFirstLocalityRenderRef = useRef<boolean>(true);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      scrollWheelZoom: false
    });

    // OpenStreetMap tile layer
    L.tileLayer(OSM_TILE_LAYER_URL, {
      attribution: OSM_ATTRIBUTION,
      maxZoom: 19,
      minZoom: 11
    }).addTo(map);

    // 1. Secondary Coverage Zone Polygon (Extended Nearby Areas - lighter visual tone)
    const secondaryPolygon = L.polygon(DOIT_SECONDARY_COVERAGE_POLYGON, {
      color: '#0284c7',
      weight: 1.5,
      dashArray: '5, 5',
      fillColor: '#38bdf8',
      fillOpacity: 0.08,
      interactive: true
    }).addTo(map);

    secondaryPolygon.bindTooltip('DOIT Service Coverage • Extended Nearby Areas', {
      sticky: true,
      className: 'doit-map-tooltip'
    });

    // 2. Primary Coverage Zone Polygon (BHEL Township - visually emphasized)
    const primaryPolygon = L.polygon(DOIT_PRIMARY_COVERAGE_POLYGON, {
      color: '#00755f',
      weight: 2.2,
      dashArray: '4, 4',
      fillColor: '#00c29e',
      fillOpacity: 0.16,
      interactive: true
    }).addTo(map);

    primaryPolygon.bindTooltip('DOIT Service Coverage • Primary BHEL Township', {
      sticky: true,
      className: 'doit-map-tooltip'
    });

    polygonsRef.current = [secondaryPolygon, primaryPolygon];

    // 3. Render Locality Markers with dynamic zoom filtering
    const markersGroup = L.layerGroup().addTo(map);

    const updateMarkersForZoom = () => {
      const currentZoom = map.getZoom();
      markersGroup.clearLayers();
      markersRef.current = {};

      ALL_SERVICE_LOCATIONS.forEach((loc) => {
        const isPrimary = loc.type === 'primary';
        const isMajor = [
          'bhel-piplani',
          'bhel-barkhera',
          'bhel-govindpura',
          'bhel-sector-b',
          'nearby-awadhpuri',
          'nearby-indrapuri',
          'nearby-ayodhya-nagar'
        ].includes(loc.id);

        // At lower zoom levels, show only major markers to prevent overcrowding
        if (currentZoom < 13 && !isMajor) {
          return;
        }

        const isSelected = selectedLocality?.id === loc.id;
        const mainColor = isPrimary ? '#00755f' : '#0284c7';
        const badgeColor = isPrimary ? '#00c29e' : '#38bdf8';

        // Custom Leaflet DivIcon with clean typography & subtle pin
        const customIcon = L.divIcon({
          className: 'doit-locality-marker',
          html: `
            <div style="position: relative; transform: translate(-50%, -100%); cursor: pointer; display: inline-flex; flex-direction: column; align-items: center;">
              <div style="
                background: ${isSelected ? '#18181b' : '#ffffff'};
                color: ${isSelected ? '#ffffff' : '#18181b'};
                border: 1.5px solid ${isSelected ? mainColor : '#e4e4e7'};
                box-shadow: ${isSelected ? '0 4px 14px rgba(0,0,0,0.3)' : '0 2px 6px rgba(0,0,0,0.12)'};
                border-radius: 9999px;
                padding: ${isSelected ? '3px 9px' : '2px 7px'};
                font-size: ${isSelected ? '11px' : '10px'};
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 4px;
                white-space: nowrap;
                transition: all 0.2s ease;
              ">
                <span style="width: 6px; height: 6px; border-radius: 9999px; background-color: ${badgeColor}; display: inline-block;"></span>
                <span>${loc.name}</span>
              </div>
              <div style="
                width: 0; 
                height: 0; 
                border-left: 4px solid transparent;
                border-right: 4px solid transparent;
                border-top: 5px solid ${isSelected ? '#18181b' : '#e4e4e7'};
                margin-top: -1px;
              "></div>
            </div>
          `,
          iconSize: [0, 0]
        });

        const marker = L.marker([loc.latitude, loc.longitude], {
          icon: customIcon,
          title: `${loc.name} (${isPrimary ? 'BHEL Township' : 'Nearby Area'})`
        });

        marker.on('click', () => {
          onSelectLocality(loc);
        });

        marker.addTo(markersGroup);
        markersRef.current[loc.id] = marker;
      });
    };

    updateMarkersForZoom();
    map.on('zoomend', updateMarkersForZoom);

    mapInstanceRef.current = map;

    // Responsive size handling with defensive checks
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current && (mapInstanceRef.current as any)._mapPane) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    const initTimer = setTimeout(() => {
      if (mapInstanceRef.current && (mapInstanceRef.current as any)._mapPane) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 250);

    return () => {
      clearTimeout(initTimer);
      resizeObserver.disconnect();
      if (activePopupRef.current) {
        try {
          activePopupRef.current.remove();
        } catch {
          // ignore
        }
        activePopupRef.current = null;
      }
      if (mapInstanceRef.current) {
        const map = mapInstanceRef.current;
        mapInstanceRef.current = null;
        try {
          map.off('zoomend', updateMarkersForZoom);
          map.stop();
          map.closePopup();
          map.remove();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Center and flyTo when selectedLocality changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedLocality || !(map as any)._mapPane) return;

    if (popupBtnTimeoutRef.current) {
      clearTimeout(popupBtnTimeoutRef.current);
    }

    if (activePopupRef.current) {
      try {
        activePopupRef.current.remove();
      } catch {
        // ignore
      }
      activePopupRef.current = null;
    }

    // On initial mount, avoid aggressive flying while tiles load; fly on user selection
    if (isFirstLocalityRenderRef.current) {
      isFirstLocalityRenderRef.current = false;
      map.setView([selectedLocality.latitude, selectedLocality.longitude], 13.5);
    } else {
      map.stop();
      map.flyTo([selectedLocality.latitude, selectedLocality.longitude], 14, {
        duration: 0.8,
        easeLinearity: 0.35
      });
    }

    // Open an interactive popup with autoPan: false so it doesn't conflict with map pan/zoom
    const isPrimary = selectedLocality.type === 'primary';
    const popupContent = document.createElement('div');
    popupContent.className = 'p-1 text-zinc-900 space-y-2';
    popupContent.innerHTML = `
      <div style="font-family: inherit;">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
          <h4 style="margin: 0; font-size: 13px; font-weight: 800; color: #18181b;">${selectedLocality.name}</h4>
          <span style="
            font-size: 9px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 9999px;
            background: ${isPrimary ? '#e6faf6' : '#f0f9ff'};
            color: ${isPrimary ? '#00755f' : '#0369a1'};
            border: 1px solid ${isPrimary ? '#99ede0' : '#bae6fd'};
          ">
            ${isPrimary ? 'BHEL Township' : 'Nearby Area'}
          </span>
        </div>
        <p style="margin: 0 0 6px 0; font-size: 11px; color: #52525b; line-height: 1.4;">
          ${selectedLocality.shortDescription || 'Verified DOIT service coverage with vetted home technicians.'}
        </p>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; font-size: 10px; color: #71717a;">
          <span>Availability: <strong style="color: ${selectedLocality.serviceAvailability === 'High' ? '#00755f' : '#18181b'};">${selectedLocality.serviceAvailability}</strong></span>
          ${selectedLocality.pincode ? `<span>PIN: ${selectedLocality.pincode}</span>` : ''}
        </div>
        <button 
          id="doit-popup-book-btn"
          type="button"
          style="
            width: 100%;
            background: #00c29e;
            color: #ffffff;
            border: none;
            border-radius: 9999px;
            padding: 6px 12px;
            font-size: 11px;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          "
        >
          Book a Service in ${selectedLocality.name} →
        </button>
      </div>
    `;

    const popup = L.popup({
      offset: [0, -14],
      closeButton: true,
      autoPan: false,
      className: 'doit-custom-popup'
    })
      .setLatLng([selectedLocality.latitude, selectedLocality.longitude])
      .setContent(popupContent)
      .openOn(map);

    activePopupRef.current = popup;

    // Attach click listener to button inside popup
    popupBtnTimeoutRef.current = setTimeout(() => {
      const bookBtn = document.getElementById('doit-popup-book-btn');
      if (bookBtn) {
        bookBtn.onclick = () => {
          onBookNow(selectedLocality.name);
          popup.close();
        };
      }
    }, 50);

    return () => {
      if (popupBtnTimeoutRef.current) {
        clearTimeout(popupBtnTimeoutRef.current);
      }
    };
  }, [selectedLocality, onBookNow]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetView = () => {
    mapInstanceRef.current?.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, {
      duration: 1
    });
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-zinc-200 shadow-sm bg-zinc-100 ${className}`}>
      {/* Map Leaflet Container */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-[340px] sm:h-[420px] lg:h-[500px] z-0 focus:outline-none" 
        tabIndex={0}
        aria-label="Interactive Map of DOIT Service Areas in Bhopal"
      />

      {/* Map Header Overlay with Region Title */}
      <div className="absolute top-3 left-3 z-[400] pointer-events-none">
        <div className="bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-full border border-zinc-200/80 shadow-xs flex items-center gap-1.5 text-xs text-zinc-800 font-semibold">
          <MapPin className="w-3.5 h-3.5 text-[#00c29e]" />
          <span>BHEL Bhopal Service Region</span>
        </div>
      </div>

      {/* Zoom and Reset Controls */}
      <div className="absolute top-3 right-3 z-[400] flex flex-col gap-1.5 shadow-sm">
        <button
          type="button"
          onClick={handleZoomIn}
          aria-label="Zoom in map"
          className="w-8 h-8 rounded-lg bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 flex items-center justify-center transition-colors cursor-pointer shadow-xs active:scale-95"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          aria-label="Zoom out map"
          className="w-8 h-8 rounded-lg bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 flex items-center justify-center transition-colors cursor-pointer shadow-xs active:scale-95"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleResetView}
          aria-label="Reset map view"
          className="w-8 h-8 rounded-lg bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 flex items-center justify-center transition-colors cursor-pointer shadow-xs active:scale-95"
          title="Reset map center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Map Legend (Minimal & Consistent) */}
      <div className="absolute bottom-6 left-3 right-3 sm:right-auto z-[400]">
        <div className="bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-zinc-200/80 shadow-md space-y-2 max-w-xs text-xs">
          <div className="font-bold text-zinc-900 flex items-center justify-between border-b border-zinc-100 pb-1.5">
            <span>Coverage Zones</span>
            <span className="text-[10px] text-zinc-400 font-normal">DOIT Coverage</span>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-start gap-2">
              <span className="w-3 h-3 rounded-full bg-[#00c29e] border border-[#00755f] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-zinc-900 leading-tight">BHEL Township</p>
                <p className="text-[10px] text-zinc-500">Primary DOIT Service Area</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="w-3 h-3 rounded-full bg-[#38bdf8] border border-[#0284c7] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-zinc-900 leading-tight">Nearby Areas</p>
                <p className="text-[10px] text-zinc-500">Extended DOIT Service Area</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
