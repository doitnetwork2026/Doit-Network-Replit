import React, { useState } from 'react';
import { 
  SERVICE_AREA_GROUPS, 
  LocalityItem,
  BHEL_TOWNSHIP_LOCATIONS,
  NEARBY_AREAS_LOCATIONS 
} from '../../data/serviceAreaData';
import { ServiceAreaMap } from './ServiceAreaMap';
import { 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Info,
  Building2,
  Navigation
} from 'lucide-react';
import { ServiceCategoryId } from '../../types/doit';

interface ServiceAreaSectionProps {
  onSelectCategoryForBooking?: (catId: ServiceCategoryId) => void;
  onOpenCustomerApp?: () => void;
  selectedLocalityName?: string;
  onSelectLocality?: (localityName: string) => void;
}

export const ServiceAreaSection: React.FC<ServiceAreaSectionProps> = ({
  onSelectCategoryForBooking,
  onOpenCustomerApp,
  selectedLocalityName,
  onSelectLocality
}) => {
  // Find initial selected locality or default to Piplani
  const initialLocality = BHEL_TOWNSHIP_LOCATIONS.find(
    loc => loc.name === selectedLocalityName
  ) || NEARBY_AREAS_LOCATIONS.find(
    loc => loc.name === selectedLocalityName
  ) || BHEL_TOWNSHIP_LOCATIONS[0];

  const [selectedLocality, setSelectedLocality] = useState<LocalityItem>(initialLocality);
  const [activeTab, setActiveTab] = useState<'all' | 'bhel-township' | 'nearby-areas'>('all');

  const handleLocalityCardClick = (loc: LocalityItem) => {
    setSelectedLocality(loc);
    if (onSelectLocality) {
      onSelectLocality(loc.name);
    }
  };

  const handleProceedToBooking = (localityName?: string) => {
    const targetLocality = localityName || selectedLocality.name;
    if (onSelectLocality) {
      onSelectLocality(targetLocality);
    }

    if (onOpenCustomerApp) {
      onOpenCustomerApp();
    } else if (onSelectCategoryForBooking) {
      onSelectCategoryForBooking('gardener');
    }
  };

  const bhelTownshipGroup = SERVICE_AREA_GROUPS[0];
  const nearbyAreasGroup = SERVICE_AREA_GROUPS[1];

  return (
    <section 
      id="service-area" 
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10"
      aria-labelledby="service-area-heading"
    >
      {/* Section Header: Strictly Centered */}
      <header className="space-y-3 text-center max-w-2xl mx-auto flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#f0fdf9] border border-[#99ede0] text-[#00755f] text-xs font-semibold tracking-wide">
          <MapPin className="w-3.5 h-3.5 text-[#00c29e]" aria-hidden="true" />
          <span>LOCAL COVERAGE & HUBS</span>
        </div>

        <div className="space-y-1 text-center">
          <h2 
            id="service-area-heading" 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900 text-center"
          >
            Service Area
          </h2>

          <h3 className="text-base sm:text-lg font-semibold text-[#00755f] text-center">
            Serving BHEL Township and Nearby Bhopal Areas
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed text-center max-w-xl mx-auto">
          DOIT connects customers with verified local professionals across BHEL Township and selected nearby areas, ensuring fast response times and dependable service.
        </p>
      </header>

      {/* Main Grid: 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* Left Column: Shortened, Compact Area Cards & Booking Action Box */}
        <div className="order-2 lg:order-1 lg:col-span-5 space-y-5 max-w-md mx-auto lg:max-w-none w-full">
          
          {/* Active Selection & Booking Action Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#00c29e]/10 via-white to-zinc-50 border-2 border-[#00c29e]/40 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00c29e] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#00755f]">
                  Active Selected Locality
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                selectedLocality.type === 'primary' 
                  ? 'bg-[#e6faf6] text-[#00755f] border border-[#99ede0]' 
                  : 'bg-[#f0f9ff] text-[#0369a1] border border-[#bae6fd]'
              }`}>
                {selectedLocality.type === 'primary' ? 'BHEL Township' : 'Nearby Area'}
              </span>
            </div>

            <div>
              <h4 className="text-base sm:text-lg font-bold text-zinc-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#00c29e] shrink-0" />
                <span>{selectedLocality.name}</span>
              </h4>
              <p className="text-xs text-zinc-600 mt-1">
                {selectedLocality.shortDescription || 'Verified service providers with immediate booking availability.'}
              </p>
            </div>

            <div className="pt-1 flex items-center justify-between gap-3 text-xs text-zinc-500 border-t border-zinc-200/60">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#00c29e]" />
                <span>Quick Arrival</span>
              </span>
              <span className="font-semibold text-zinc-700">
                Avg Response: &lt; 15 mins
              </span>
            </div>

            {/* Direct Booking CTA connecting to existing booking flow */}
            <button
              type="button"
              id="service-area-book-cta"
              onClick={() => handleProceedToBooking(selectedLocality.name)}
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-[#00755f] text-white font-bold text-xs sm:text-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-md border border-zinc-900 hover:border-[#00755f] active:scale-[0.99]"
            >
              <span>Book a Service in {selectedLocality.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Group 1: BHEL Township (Primary Service Zone) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2 pb-1 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00c29e] border border-[#00755f]" />
                <h4 className="text-xs sm:text-sm font-bold text-zinc-900">
                  {bhelTownshipGroup.name}
                </h4>
              </div>
              <span className="text-[10px] font-semibold text-[#00755f] bg-[#e6faf6] px-2 py-0.5 rounded-full border border-[#99ede0]">
                {bhelTownshipGroup.badgeText}
              </span>
            </div>

            <p className="text-[11px] text-zinc-500">
              {bhelTownshipGroup.description}
            </p>

            {/* Shortened, Compact Item Grid (Flex/Grid with constrained dimensions) */}
            <div className="grid grid-cols-2 gap-1.5 text-xs max-w-full">
              {bhelTownshipGroup.locations.map((loc) => {
                const isSelected = selectedLocality.id === loc.id;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => handleLocalityCardClick(loc)}
                    className={`px-3 py-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-1 text-[11px] ${
                      isSelected
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-2xs font-bold'
                        : 'bg-white text-zinc-700 hover:text-zinc-900 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 font-medium'
                    }`}
                  >
                    <div className="truncate flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        isSelected ? 'bg-[#00c29e]' : 'bg-[#00755f]'
                      }`} />
                      <span className="truncate">{loc.name}</span>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-3 h-3 text-[#00c29e] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group 2: Nearby Areas (Secondary Service Zone) */}
          <div className="space-y-2.5 pt-3 border-t border-zinc-200">
            <div className="flex items-center justify-between gap-2 pb-1 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] border border-[#0284c7]" />
                <h4 className="text-xs sm:text-sm font-bold text-zinc-900">
                  {nearbyAreasGroup.name}
                </h4>
              </div>
              <span className="text-[10px] font-semibold text-[#0369a1] bg-[#f0f9ff] px-2 py-0.5 rounded-full border border-[#bae6fd]">
                {nearbyAreasGroup.badgeText}
              </span>
            </div>

            <p className="text-[11px] text-zinc-500">
              {nearbyAreasGroup.description}
            </p>

            {/* Shortened, Compact Item Grid */}
            <div className="grid grid-cols-2 gap-1.5 text-xs max-w-full">
              {nearbyAreasGroup.locations.map((loc) => {
                const isSelected = selectedLocality.id === loc.id;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => handleLocalityCardClick(loc)}
                    className={`px-3 py-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-1 text-[11px] ${
                      isSelected
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-2xs font-bold'
                        : 'bg-white text-zinc-700 hover:text-zinc-900 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 font-medium'
                    }`}
                  >
                    <div className="truncate flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        isSelected ? 'bg-[#38bdf8]' : 'bg-[#0284c7]'
                      }`} />
                      <span className="truncate">{loc.name}</span>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-3 h-3 text-[#38bdf8] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Business Logic Disclaimer Notice */}
          <div className="p-3 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-600 text-[11px] flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Service Notice:</strong> Availability may vary by provider location. Bookings are matched with verified local technicians based on schedule, exact sector, and skill requirements.
            </p>
          </div>

        </div>

        {/* Right Column: Large Interactive Leaflet Map */}
        <div className="order-1 lg:order-2 lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
              <Navigation className="w-3.5 h-3.5 text-[#00c29e]" />
              <span>Interactive Coverage Map</span>
            </div>
            <span className="text-[11px] text-zinc-500">
              Click any locality card or marker to view
            </span>
          </div>

          <ServiceAreaMap
            selectedLocality={selectedLocality}
            onSelectLocality={handleLocalityCardClick}
            onBookNow={handleProceedToBooking}
          />
        </div>

      </div>
    </section>
  );
};
