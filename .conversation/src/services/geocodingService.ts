import { ALL_SERVICE_LOCATIONS, LocalityItem } from '../data/serviceAreaData';

export interface GeocodedLocation {
  displayName: string;
  latitude: number;
  longitude: number;
  locality?: string;
}

// In-memory cache to prevent redundant OpenStreetMap Nominatim queries
const geocodeCache: Record<string, GeocodedLocation> = {};

// Pre-fill cache with our verified static locations
ALL_SERVICE_LOCATIONS.forEach((loc) => {
  const normalizedKey = loc.name.toLowerCase().trim();
  geocodeCache[normalizedKey] = {
    displayName: `${loc.name}, Bhopal, Madhya Pradesh, India`,
    latitude: loc.latitude,
    longitude: loc.longitude,
    locality: loc.name
  };
});

/**
 * Geocodes an address or locality query in the Bhopal region.
 * Uses static verified locations first, then cached results, and falls back gracefully.
 */
export async function geocodeLocation(query: string): Promise<GeocodedLocation | null> {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return null;

  // 1. Direct or partial match in static cache
  if (geocodeCache[normalized]) {
    return geocodeCache[normalized];
  }

  const matchedStatic = ALL_SERVICE_LOCATIONS.find(loc => 
    loc.name.toLowerCase().includes(normalized) || 
    normalized.includes(loc.name.toLowerCase())
  );
  if (matchedStatic) {
    return {
      displayName: `${matchedStatic.name}, Bhopal, Madhya Pradesh`,
      latitude: matchedStatic.latitude,
      longitude: matchedStatic.longitude,
      locality: matchedStatic.name
    };
  }

  // 2. OpenStreetMap Nominatim request with polite caching & bounding
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query + ', Bhopal, MP, India'
    )}&limit=1&bounded=1&viewbox=77.30,23.35,77.60,23.15`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DOIT-Hyperlocal-HomeServices/1.0'
      }
    });

    if (!response.ok) return null;
    const data = await response.json();
    if (data && data.length > 0) {
      const result: GeocodedLocation = {
        displayName: data[0].display_name,
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
        locality: query
      };
      geocodeCache[normalized] = result;
      return result;
    }
  } catch (error) {
    console.warn('Geocoding service network lookup fell back to default:', error);
  }

  return null;
}

/**
 * Reverse-geocodes a latitude and longitude to a human-readable Bhopal locality.
 */
export async function reverseGeocodeLocation(lat: number, lng: number): Promise<string | null> {
  // Find closest verified location in our network first (Euclidean approx)
  let closestLocality: LocalityItem | null = null;
  let minDistanceSq = Infinity;

  ALL_SERVICE_LOCATIONS.forEach(loc => {
    const distSq = Math.pow(loc.latitude - lat, 2) + Math.pow(loc.longitude - lng, 2);
    if (distSq < minDistanceSq) {
      minDistanceSq = distSq;
      closestLocality = loc;
    }
  });

  // If within ~1.5km
  if (closestLocality && minDistanceSq < 0.0003) {
    return (closestLocality as LocalityItem).name;
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DOIT-Hyperlocal-HomeServices/1.0'
      }
    });
    if (response.ok) {
      const data = await response.json();
      return data?.address?.suburb || data?.address?.neighbourhood || data?.address?.road || closestLocality?.name || 'BHEL Bhopal';
    }
  } catch (error) {
    console.warn('Reverse geocoding fell back to nearest sector:', error);
  }

  return closestLocality ? (closestLocality as LocalityItem).name : 'BHEL Township';
}
