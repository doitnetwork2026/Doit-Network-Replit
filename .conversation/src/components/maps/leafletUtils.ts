import L from 'leaflet';

// Defensive patches for Leaflet to safeguard against unmounted elements or concurrent transitions in React StrictMode
if (typeof window !== 'undefined' && L) {
  // 1. Safeguard L.DomUtil.getPosition and setPosition
  if (L.DomUtil) {
    const origGetPos = L.DomUtil.getPosition;
    L.DomUtil.getPosition = function (el: any) {
      if (!el) {
        return new L.Point(0, 0);
      }
      try {
        return origGetPos ? origGetPos.call(L.DomUtil, el) : ((el && el._leaflet_pos) || new L.Point(0, 0));
      } catch {
        return (el && el._leaflet_pos) || new L.Point(0, 0);
      }
    };

    const origSetPos = L.DomUtil.setPosition;
    L.DomUtil.setPosition = function (el: any, point: L.Point) {
      if (!el) return;
      try {
        origSetPos.call(L.DomUtil, el, point);
      } catch {
        if (el) {
          el._leaflet_pos = point;
        }
      }
    };
  }

  // 2. Safeguard L.Map.prototype._getMapPanePos and remove()
  if (L.Map && L.Map.prototype) {
    const origGetMapPanePos = (L.Map.prototype as any)._getMapPanePos;
    (L.Map.prototype as any)._getMapPanePos = function () {
      if (!this._mapPane) {
        return new L.Point(0, 0);
      }
      try {
        return origGetMapPanePos ? origGetMapPanePos.call(this) : (L.DomUtil.getPosition(this._mapPane) || new L.Point(0, 0));
      } catch {
        return new L.Point(0, 0);
      }
    };

    const origRemove = L.Map.prototype.remove;
    L.Map.prototype.remove = function () {
      try {
        this.stop();
        if ((this as any)._panAnim) {
          (this as any)._panAnim.stop();
        }
      } catch {
        // safely ignore
      }
      return origRemove.call(this);
    };
  }

  // 3. Safeguard L.Popup.prototype._adjustPan and _animateZoom
  if (L.Popup && L.Popup.prototype) {
    const origAdjustPan = (L.Popup.prototype as any)._adjustPan;
    (L.Popup.prototype as any)._adjustPan = function () {
      if (!this._container || !this._map || !this.options.autoPan) return;
      try {
        origAdjustPan.call(this);
      } catch {
        // safely ignore
      }
    };

    const origAnimateZoom = (L.Popup.prototype as any)._animateZoom;
    (L.Popup.prototype as any)._animateZoom = function (e: any) {
      if (!this._container || !this._map) return;
      try {
        origAnimateZoom.call(this, e);
      } catch {
        // safely ignore
      }
    };
  }

  // 4. Safeguard L.PosAnimation.prototype.run
  if (L.PosAnimation && L.PosAnimation.prototype) {
    const origRun = L.PosAnimation.prototype.run;
    L.PosAnimation.prototype.run = function (el: any, newPos: any, duration: any, easeLinearity: any) {
      if (!el) return;
      try {
        origRun.call(this, el, newPos, duration, easeLinearity);
      } catch {
        // safely ignore
      }
    };
  }
}

export const BHEL_BHOPAL_CENTER = {
  lat: 23.2335,
  lng: 77.4645,
  zoom: 14
};

export const OSM_TILE_LAYER_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';

/**
 * Creates a clean SVG-based Leaflet DivIcon
 */
export function createCustomMarkerIcon({
  color = '#00c29e',
  iconType = 'pin',
  size = 36,
  label,
  pulse = false
}: {
  color?: string;
  iconType?: 'pin' | 'home' | 'worker' | 'target' | 'user';
  size?: number;
  label?: string;
  pulse?: boolean;
}): L.DivIcon {
  let iconSvg = '';
  if (iconType === 'home') {
    iconSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    `;
  } else if (iconType === 'worker') {
    iconSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    `;
  } else if (iconType === 'target') {
    iconSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="3"/>
        <line x1="12" y1="2" x2="12" y2="6"/>
        <line x1="12" y1="18" x2="12" y2="22"/>
        <line x1="2" y1="12" x2="6" y2="12"/>
        <line x1="18" y1="12" x2="22" y2="12"/>
      </svg>
    `;
  } else if (iconType === 'user') {
    iconSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    `;
  } else {
    iconSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="${color}" stroke-width="1.5">
        <circle cx="12" cy="12" r="4" fill="${color}" />
      </svg>
    `;
  }

  const pulseRing = pulse
    ? `<div style="position: absolute; inset: -8px; border-radius: 9999px; background-color: ${color}; opacity: 0.25; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
    : '';

  const labelHtml = label
    ? `<div style="position: absolute; top: -24px; left: 50%; transform: translateX(-50%); white-space: nowrap; background: rgba(0,0,0,0.85); color: #ffffff; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: 700; letter-spacing: 0.025em; box-shadow: 0 2px 4px rgba(0,0,0,0.2); pointer-events: none;">${label}</div>`
    : '';

  const html = `
    <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; cursor: grab;">
      ${pulseRing}
      ${labelHtml}
      <div style="width: ${size}px; height: ${size}px; border-radius: 9999px; background-color: ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25); border: 2.5px solid #ffffff; transition: transform 0.15s ease;">
        ${iconSvg}
      </div>
      <div style="position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid ${color};"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'doit-custom-leaflet-marker',
    iconSize: [size, size + 6],
    iconAnchor: [size / 2, size + 6],
    popupAnchor: [0, -(size + 8)]
  });
}

/**
 * Open external navigation using the device's native map application or preferred web map
 */
export function openDeviceNavigation(lat: number, lng: number, label = 'Customer Service Location') {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isIOS) {
    // Apple Maps URL scheme
    window.open(`https://maps.apple.com/?q=${encodeURIComponent(label)}&ll=${lat},${lng}`, '_blank');
  } else if (isMobile) {
    // Android Geo Intent / OpenStreetMap directions fallback
    const geoUrl = `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(label)})`;
    window.open(geoUrl, '_blank');
  } else {
    // Desktop: OpenStreetMap / Google Maps fallback for web routing
    const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(webUrl, '_blank');
  }
}
