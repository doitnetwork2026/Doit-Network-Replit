/**
 * Geocoding Service Abstraction
 * Decoupled from map rendering so any provider (Nominatim, Mapbox, Photon, custom DOIT GIS)
 * can be plugged in without touching map components.
 */

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  displayName: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export interface AddressDetails {
  latitude: number;
  longitude: number;
  address: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  houseFlatNumber?: string;
}

// BHEL Area Bhopal Localities Reference Database
export const BHEL_BHOPAL_AREAS: Array<{
  name: string;
  locality: string;
  lat: number;
  lng: number;
  pincode: string;
  landmark: string;
  sectorTag: string;
}> = [
  {
    name: 'BHEL Sector 1',
    locality: 'BHEL Sector 1',
    lat: 23.2355,
    lng: 77.4610,
    pincode: '462022',
    landmark: 'Near Sector 1 Community Hall & Market',
    sectorTag: 'Sector 1'
  },
  {
    name: 'BHEL Sector 2',
    locality: 'BHEL Sector 2',
    lat: 23.2380,
    lng: 77.4680,
    pincode: '462022',
    landmark: 'Near BHEL Officers Club & Dispensary',
    sectorTag: 'Sector 2'
  },
  {
    name: 'BHEL Sector 3',
    locality: 'BHEL Sector 3',
    lat: 23.2310,
    lng: 77.4645,
    pincode: '462022',
    landmark: 'Near Kasturba Hospital West Wing',
    sectorTag: 'Sector 3'
  },
  {
    name: 'BHEL Sector 4',
    locality: 'BHEL Sector 4',
    lat: 23.2425,
    lng: 77.4720,
    pincode: '462022',
    landmark: 'Near BHEL Central School & Park',
    sectorTag: 'Sector 4'
  },
  {
    name: 'BHEL Sector 5',
    locality: 'BHEL Sector 5',
    lat: 23.2460,
    lng: 77.4770,
    pincode: '462022',
    landmark: 'Near Sector 5 Shopping Complex & Bank',
    sectorTag: 'Sector 5'
  },
  {
    name: 'BHEL Sector 6',
    locality: 'BHEL Sector 6',
    lat: 23.2280,
    lng: 77.4580,
    pincode: '462022',
    landmark: 'Near Berkheda Main Ground & Gate',
    sectorTag: 'Sector 6'
  },
  {
    name: 'Piplani',
    locality: 'Piplani',
    lat: 23.2395,
    lng: 77.4820,
    pincode: '462021',
    landmark: 'Near Piplani Petrol Pump & Jubilee Gate',
    sectorTag: 'Piplani'
  },
  {
    name: 'Govindpura',
    locality: 'Govindpura',
    lat: 23.2510,
    lng: 77.4560,
    pincode: '462023',
    landmark: 'Near Industrial Area & ITI Campus',
    sectorTag: 'Govindpura'
  },
  {
    name: 'Indrapuri',
    locality: 'Indrapuri',
    lat: 23.2440,
    lng: 77.4890,
    pincode: '462021',
    landmark: 'Near Raisen Road & B-Sector Market',
    sectorTag: 'Indrapuri'
  },
  {
    name: 'Ayodhya Nagar',
    locality: 'Ayodhya Nagar',
    lat: 23.2620,
    lng: 77.4850,
    pincode: '462041',
    landmark: 'Near Ayodhya Bypass & Minal Mall',
    sectorTag: 'Ayodhya Nagar'
  },
  {
    name: 'Awadhpuri',
    locality: 'Awadhpuri',
    lat: 23.2230,
    lng: 77.4940,
    pincode: '462022',
    landmark: 'Near BHEL Shiksha Mandal & BDA Colony',
    sectorTag: 'Awadhpuri'
  },
  {
    name: 'Berkheda',
    locality: 'Berkheda',
    lat: 23.2260,
    lng: 77.4520,
    pincode: '462022',
    landmark: 'Near Berkheda Post Office & Ground',
    sectorTag: 'Berkheda'
  },
  {
    name: 'Kasturba Hospital BHEL',
    locality: 'BHEL Sector 3',
    lat: 23.2325,
    lng: 77.4650,
    pincode: '462022',
    landmark: 'Kasturba Hospital Campus, Habibganj Road',
    sectorTag: 'BHEL Sector 3'
  }
];

// Helper: Calculate distance between two lat/lng coordinates in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Geocode an address query to coordinates & location details.
 * Queries local high-accuracy BHEL database first; falls back to OpenStreetMap Nominatim.
 */
export async function geocodeAddress(query: string): Promise<GeocodingResult[]> {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  const results: GeocodingResult[] = [];

  // 1. Local BHEL Bhopal match
  for (const area of BHEL_BHOPAL_AREAS) {
    if (
      area.name.toLowerCase().includes(clean) ||
      area.locality.toLowerCase().includes(clean) ||
      area.landmark.toLowerCase().includes(clean) ||
      area.sectorTag.toLowerCase().includes(clean) ||
      clean.includes(area.sectorTag.toLowerCase())
    ) {
      results.push({
        latitude: area.lat,
        longitude: area.lng,
        displayName: `${area.name}, ${area.landmark}, Bhopal, MP ${area.pincode}`,
        locality: area.locality,
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: area.pincode,
        landmark: area.landmark
      });
    }
  }

  // 2. OpenStreetMap Nominatim search (with fallback on failure)
  try {
    const searchParam = clean.includes('bhopal') ? clean : `${clean}, Bhopal, Madhya Pradesh`;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchParam)}&format=json&addressdetails=1&limit=4`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'DOIT-HomeServices-Bhopal/1.0'
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        for (const item of data) {
          const lat = parseFloat(item.lat);
          const lon = parseFloat(item.lon);
          const addr = item.address || {};
          
          // Avoid duplicate coordinates
          const isDuplicate = results.some(
            r => Math.abs(r.latitude - lat) < 0.001 && Math.abs(r.longitude - lon) < 0.001
          );

          if (!isDuplicate && !isNaN(lat) && !isNaN(lon)) {
            const locality = addr.suburb || addr.neighbourhood || addr.residential || addr.quarter || 'BHEL Area';
            results.push({
              latitude: lat,
              longitude: lon,
              displayName: item.display_name,
              locality: locality.startsWith('BHEL') ? locality : `BHEL Area (${locality})`,
              city: addr.city || 'Bhopal',
              state: addr.state || 'Madhya Pradesh',
              pincode: addr.postcode || '462022',
              landmark: addr.road || addr.amenity || undefined
            });
          }
        }
      }
    }
  } catch {
    // Network or rate-limit fail: local results suffice
  }

  // If still no results, offer general BHEL Township center
  if (results.length === 0) {
    results.push({
      latitude: 23.2335,
      longitude: 77.4645,
      displayName: `BHEL Township, Bhopal, Madhya Pradesh 462022`,
      locality: 'BHEL Area',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      pincode: '462022',
      landmark: 'Near Central Administrative Complex'
    });
  }

  return results;
}

/**
 * Reverse geocode coordinates to an address object.
 * Identifies the nearest BHEL Sector and queries OpenStreetMap Nominatim for street/building info.
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<AddressDetails> {
  // Find nearest BHEL reference area
  let nearestArea = BHEL_BHOPAL_AREAS[0];
  let minDistance = calculateDistanceKm(latitude, longitude, nearestArea.lat, nearestArea.lng);

  for (const area of BHEL_BHOPAL_AREAS) {
    const dist = calculateDistanceKm(latitude, longitude, area.lat, area.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestArea = area;
    }
  }

  const defaultDetails: AddressDetails = {
    latitude,
    longitude,
    address: `${nearestArea.name}, BHEL Township`,
    locality: nearestArea.locality,
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    pincode: nearestArea.pincode,
    landmark: nearestArea.landmark
  };

  // Attempt Nominatim reverse geocode
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'DOIT-HomeServices-Bhopal/1.0'
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data && data.address) {
        const addr = data.address;
        const road = addr.road || addr.pedestrian || addr.street;
        const houseNum = addr.house_number || addr.quarter;
        const locality = addr.suburb || addr.neighbourhood || addr.residential || nearestArea.locality;

        return {
          latitude,
          longitude,
          address: road ? (houseNum ? `${houseNum}, ${road}` : road) : defaultDetails.address,
          locality: locality || nearestArea.locality,
          city: addr.city || addr.town || 'Bhopal',
          state: addr.state || 'Madhya Pradesh',
          pincode: addr.postcode || nearestArea.pincode,
          landmark: addr.amenity || addr.building || nearestArea.landmark,
          houseFlatNumber: houseNum
        };
      }
    }
  } catch {
    // Fall back to defaultDetails
  }

  return defaultDetails;
}
