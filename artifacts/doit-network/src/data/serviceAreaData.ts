export type ServiceAreaGroupType = 'primary' | 'secondary';

export interface LocalityItem {
  id: string;
  name: string;
  type: ServiceAreaGroupType;
  latitude: number;
  longitude: number;
  serviceAvailability: 'High' | 'Active' | 'Growing';
  displayOrder: number;
  pincode?: string;
  landmark?: string;
  shortDescription?: string;
}

export interface ServiceAreaGroup {
  id: string;
  name: string;
  type: ServiceAreaGroupType;
  title: string;
  tagline: string;
  badgeText: string;
  description: string;
  locations: LocalityItem[];
}

/**
 * Verified coordinates for BHEL Township and Nearby Bhopal areas
 * Center reference: BHEL Bhopal (23.2400° N, 77.4644° E)
 */
export const BHEL_TOWNSHIP_LOCATIONS: LocalityItem[] = [
  {
    id: 'bhel-piplani',
    name: 'Piplani',
    type: 'primary',
    latitude: 23.2469,
    longitude: 77.4686,
    serviceAvailability: 'High',
    displayOrder: 1,
    pincode: '462021',
    landmark: 'Near Piplani Petrol Pump & BHEL Gate',
    shortDescription: 'Core township residential quarter with dedicated home service providers'
  },
  {
    id: 'bhel-barkhera',
    name: 'Barkhera',
    type: 'primary',
    latitude: 23.2192,
    longitude: 77.4678,
    serviceAvailability: 'High',
    displayOrder: 2,
    pincode: '462022',
    landmark: 'Barkhera BHEL Quarters & Market',
    shortDescription: 'Township sectors with rapid emergency response and daily domestic assistance'
  },
  {
    id: 'bhel-govindpura',
    name: 'Govindpura',
    type: 'primary',
    latitude: 23.2556,
    longitude: 77.4478,
    serviceAvailability: 'High',
    displayOrder: 3,
    pincode: '462023',
    landmark: 'Govindpura Industrial Area & Gate',
    shortDescription: 'Industrial and residential hub with full technician and repair coverage'
  },
  {
    id: 'bhel-sector-a',
    name: 'A-Sector',
    type: 'primary',
    latitude: 23.2435,
    longitude: 77.4690,
    serviceAvailability: 'High',
    displayOrder: 4,
    pincode: '462022',
    landmark: 'A-Sector Quarters & Community Hall',
    shortDescription: 'BHEL Officers and Staff residential quarters'
  },
  {
    id: 'bhel-sector-b',
    name: 'B-Sector',
    type: 'primary',
    latitude: 23.2390,
    longitude: 77.4670,
    serviceAvailability: 'High',
    displayOrder: 5,
    pincode: '462022',
    landmark: 'B-Sector Central Park',
    shortDescription: 'Central residential blocks with active gardening and cleaning staff'
  },
  {
    id: 'bhel-sector-c',
    name: 'C-Sector',
    type: 'primary',
    latitude: 23.2340,
    longitude: 77.4650,
    serviceAvailability: 'High',
    displayOrder: 6,
    pincode: '462022',
    landmark: 'C-Sector Market & Dispensary',
    shortDescription: 'Family residential quarters with high daily housekeeping demand'
  },
  {
    id: 'bhel-sector-d',
    name: 'D-Sector',
    type: 'primary',
    latitude: 23.2290,
    longitude: 77.4660,
    serviceAvailability: 'Active',
    displayOrder: 7,
    pincode: '462022',
    landmark: 'D-Sector Ground & Primary School',
    shortDescription: 'Established residential sector with verified electrical & plumbing specialists'
  },
  {
    id: 'bhel-sector-e',
    name: 'E-Sector',
    type: 'primary',
    latitude: 23.2240,
    longitude: 77.4640,
    serviceAvailability: 'Active',
    displayOrder: 8,
    pincode: '462022',
    landmark: 'E-Sector Quarters',
    shortDescription: 'Quiet township residential sector with fast turnaround times'
  },
  {
    id: 'bhel-sector-f',
    name: 'F-Sector',
    type: 'primary',
    latitude: 23.2190,
    longitude: 77.4630,
    serviceAvailability: 'Active',
    displayOrder: 9,
    pincode: '462022',
    landmark: 'F-Sector South Peripheral Area',
    shortDescription: 'Southern township residential sector with scheduled service visits'
  },
  {
    id: 'bhel-other-township',
    name: 'Other Township Area',
    type: 'primary',
    latitude: 23.2350,
    longitude: 77.4650,
    serviceAvailability: 'Active',
    displayOrder: 10,
    pincode: '462022',
    landmark: 'BHEL Township Inner Roads & Enclaves',
    shortDescription: 'Any internal BHEL quarter or department premise within township borders'
  }
];

export const NEARBY_AREAS_LOCATIONS: LocalityItem[] = [
  {
    id: 'nearby-awadhpuri',
    name: 'Awadhpuri',
    type: 'secondary',
    latitude: 23.2256,
    longitude: 77.4943,
    serviceAvailability: 'Active',
    displayOrder: 1,
    pincode: '462022',
    landmark: 'Awadhpuri Main Road & BDA Colony',
    shortDescription: 'Fast-growing residential zone adjacent to BHEL with verified handyman coverage'
  },
  {
    id: 'nearby-barkheda-pathani',
    name: 'Barkheda Pathani',
    type: 'secondary',
    latitude: 23.2155,
    longitude: 77.4830,
    serviceAvailability: 'Active',
    displayOrder: 2,
    pincode: '462022',
    landmark: 'Barkheda Pathani Square',
    shortDescription: 'Southern extended residential pocket served by proximate DOIT providers'
  },
  {
    id: 'nearby-anand-nagar',
    name: 'Anand Nagar',
    type: 'secondary',
    latitude: 23.2570,
    longitude: 77.4860,
    serviceAvailability: 'Active',
    displayOrder: 3,
    pincode: '462021',
    landmark: 'Anand Nagar Bypass Road',
    shortDescription: 'Vibrant neighborhood with regular painter, technician, and driver bookings'
  },
  {
    id: 'nearby-ayodhya-nagar',
    name: 'Ayodhya Nagar',
    type: 'secondary',
    latitude: 23.2670,
    longitude: 77.4810,
    serviceAvailability: 'Active',
    displayOrder: 4,
    pincode: '462041',
    landmark: 'Ayodhya Bypass & ISRO Colony Vicinity',
    shortDescription: 'Northern extended sector with regular scheduled daily and weekend visits'
  },
  {
    id: 'nearby-indrapuri',
    name: 'Indrapuri',
    type: 'secondary',
    latitude: 23.2519,
    longitude: 77.4619,
    serviceAvailability: 'High',
    displayOrder: 5,
    pincode: '462021',
    landmark: 'Indrapuri Sector A / B / C',
    shortDescription: 'High-density residential and commercial zone with immediate service response'
  },
  {
    id: 'nearby-kalpana-nagar',
    name: 'Kalpana Nagar',
    type: 'secondary',
    latitude: 23.2465,
    longitude: 77.4780,
    serviceAvailability: 'Active',
    displayOrder: 6,
    pincode: '462021',
    landmark: 'Kalpana Nagar Square',
    shortDescription: 'Adjacent residential enclave with routine domestic maintenance bookings'
  },
  {
    id: 'nearby-laharpur',
    name: 'Laharpur',
    type: 'secondary',
    latitude: 23.2085,
    longitude: 77.4720,
    serviceAvailability: 'Growing',
    displayOrder: 7,
    pincode: '462026',
    landmark: 'Laharpur Dam & Reservoir Area',
    shortDescription: 'Emerging service sector with scheduled gardener and caretaker visits'
  },
  {
    id: 'nearby-other-nearby',
    name: 'Other Nearby Area',
    type: 'secondary',
    latitude: 23.2400,
    longitude: 77.4850,
    serviceAvailability: 'Growing',
    displayOrder: 8,
    pincode: '462022',
    landmark: 'Surrounding BHEL East Bhopal Environs',
    shortDescription: 'Surrounding Bhopal locations served upon provider availability verification'
  }
];

export const SERVICE_AREA_GROUPS: ServiceAreaGroup[] = [
  {
    id: 'group-bhel-township',
    name: 'BHEL Township',
    type: 'primary',
    title: 'BHEL Township',
    tagline: 'Primary DOIT Service Area',
    badgeText: 'Primary Service Zone',
    description: 'Our core operational hub with the highest concentration of vetted professionals, fastest average response times, and full daily coverage across all residential sectors.',
    locations: BHEL_TOWNSHIP_LOCATIONS
  },
  {
    id: 'group-nearby-areas',
    name: 'Nearby Areas',
    type: 'secondary',
    title: 'Nearby Areas',
    tagline: 'Extended DOIT Service Area',
    badgeText: 'Extended Service Zone',
    description: 'Selected neighborhoods in close proximity to BHEL Bhopal with verified service availability, regular scheduled bookings, and expanding coverage.',
    locations: NEARBY_AREAS_LOCATIONS
  }
];

export const ALL_SERVICE_LOCATIONS: LocalityItem[] = [
  ...BHEL_TOWNSHIP_LOCATIONS,
  ...NEARBY_AREAS_LOCATIONS
];

/**
 * Subtle transparent highlight polygons representing DOIT Service Coverage
 * (NOT official administrative boundaries - as explicitly mandated)
 */
export const DOIT_PRIMARY_COVERAGE_POLYGON: [number, number][] = [
  [23.2580, 77.4450], // Govindpura North-West
  [23.2520, 77.4720], // Piplani North
  [23.2450, 77.4760], // Piplani East
  [23.2350, 77.4740], // C/D Sector East
  [23.2200, 77.4710], // Barkhera East
  [23.2140, 77.4640], // F-Sector South
  [23.2180, 77.4580], // Barkhera West
  [23.2320, 77.4560], // BHEL Central West
  [23.2480, 77.4440]  // Govindpura South-West
];

export const DOIT_SECONDARY_COVERAGE_POLYGON: [number, number][] = [
  [23.2720, 77.4780], // Ayodhya Nagar North
  [23.2620, 77.4920], // Anand Nagar East
  [23.2490, 77.4880], // Kalpana Nagar East
  [23.2280, 77.5020], // Awadhpuri East
  [23.2120, 77.4900], // Barkheda Pathani South
  [23.2030, 77.4740], // Laharpur South
  [23.2080, 77.4580], // Lower boundary connect
  [23.2480, 77.4380], // West boundary connect
  [23.2680, 77.4550]  // North-West connect
];
