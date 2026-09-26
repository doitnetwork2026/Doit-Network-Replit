import React, { useState } from 'react';
import { DoitLogo } from '../common/DoitLogo';
import { 
  ServiceCategory, 
  ServiceCategoryId,
  Provider
} from '../../types/doit';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  FileCheck, 
  X,
  Sparkles,
  ChevronRight,
  Map as MapIcon,
  Navigation,
  ChevronDown,
  Trees,
  HeartHandshake,
  Paintbrush,
  ShieldAlert,
  Trash2,
  Hammer,
  HandHelping,
  Car
} from 'lucide-react';
import { LocationSelectorMapModal } from '../maps/LocationSelectorMapModal';
import { Input } from '../ui/input';
import { HowItWorksSection } from './HowItWorksSection';
import { WhyChooseDoitSection } from './WhyChooseDoitSection';
import { ServiceAreaSection } from './ServiceAreaSection';
import { PublicFooter } from './PublicFooter';
import { CMSContent } from '../../types/doit';

interface PublicWebsiteProps {
  categories: ServiceCategory[];
  providers?: Provider[];
  onSelectCategoryForBooking: (categoryId: ServiceCategoryId, subService?: string) => void;
  onOpenCustomerApp: () => void;
  onOpenProviderOnboarding: () => void;
  onOpenProviderApp?: () => void;
  onOpenAdminDashboard?: () => void;
  onOpenAboutPage?: () => void;
  selectedLocality: string;
  onSelectLocality?: (locality: string) => void;
  cmsContent?: CMSContent;
}

export const PublicWebsite: React.FC<PublicWebsiteProps> = ({
  categories,
  providers = [],
  onSelectCategoryForBooking,
  onOpenCustomerApp,
  onOpenProviderOnboarding,
  onOpenProviderApp,
  onOpenAdminDashboard,
  onOpenAboutPage,
  selectedLocality,
  onSelectLocality,
  cmsContent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceSearchQuery, setServiceSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'home' | 'gardening' | 'repairs' | 'assistance'>('all');
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [gardenerModalOpen, setGardenerModalOpen] = useState(false);
  const [gardenerSearchTerm, setGardenerSearchTerm] = useState('');
  const [maidModalOpen, setMaidModalOpen] = useState(false);
  const [maidSearchTerm, setMaidSearchTerm] = useState('');
  const [caretakerModalOpen, setCaretakerModalOpen] = useState(false);
  const [caretakerSearchTerm, setCaretakerSearchTerm] = useState('');
  const [painterModalOpen, setPainterModalOpen] = useState(false);
  const [painterSearchTerm, setPainterSearchTerm] = useState('');
  const [pestControlModalOpen, setPestControlModalOpen] = useState(false);
  const [pestControlSearchTerm, setPestControlSearchTerm] = useState('');
  const [sanitationModalOpen, setSanitationModalOpen] = useState(false);
  const [sanitationSearchTerm, setSanitationSearchTerm] = useState('');
  const [labourModalOpen, setLabourModalOpen] = useState(false);
  const [labourSearchTerm, setLabourSearchTerm] = useState('');
  const [helperModalOpen, setHelperModalOpen] = useState(false);
  const [helperSearchTerm, setHelperSearchTerm] = useState('');
  const [driverModalOpen, setDriverModalOpen] = useState(false);
  const [driverSearchTerm, setDriverSearchTerm] = useState('');

  // Provider application modal state
  const [providerForm, setProviderForm] = useState({
    fullName: '',
    phone: '',
    whatsapp: '',
    age: '',
    gender: 'Male',
    locality: 'BHEL Sector 1',
    selectedServices: ['gardener'] as ServiceCategoryId[],
    experienceYears: '3–5 years',
    pricingType: 'Per visit',
    startingRate: '350',
    kycDocType: 'Aadhaar Card',
    kycNumber: '',
    agreedToTerms: false
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const activeSearchTerm = (serviceSearchQuery || searchQuery).trim().toLowerCase();

  const filteredCategories = categories.filter((cat) => {
    // 1. Text Search matching
    const matchesSearch = !activeSearchTerm ||
      cat.name.toLowerCase().includes(activeSearchTerm) ||
      cat.shortDesc.toLowerCase().includes(activeSearchTerm) ||
      cat.subServices.some(s => s.toLowerCase().includes(activeSearchTerm));
    
    if (!matchesSearch) return false;

    // 2. Category Group filter
    if (selectedFilter === 'home') {
      return cat.id === 'maid' || cat.id === 'caretaker';
    }
    if (selectedFilter === 'gardening') {
      return cat.id === 'gardener';
    }
    if (selectedFilter === 'repairs') {
      return cat.id === 'painter' || cat.id === 'electrician_technician' || cat.id === 'labour';
    }
    if (selectedFilter === 'assistance') {
      return cat.id === 'driver' || cat.id === 'special_events' || cat.id === 'industrial_caretaker';
    }

    return true;
  });

  const handleProviderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setShowProviderModal(false);
    }, 2800);
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-[#00c29e]/30 selection:text-zinc-950 transition-colors duration-200">
      
      {/* Hero Section — Minimal, Spacious & High-Clarity */}
        <section className="relative overflow-hidden bg-white dark:bg-zinc-900/60 border-b border-zinc-200/80 dark:border-zinc-800 pt-10 sm:pt-16 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8">
        
        {/* Subtle decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#00c29e]/5 dark:bg-[#00c29e]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-5 sm:space-y-6">
            
            {/* Interactive Hyperlocal pill with Google Map selector */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setIsMapModalOpen(true)}
                className="inline-flex max-w-full items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#f0fdf9] dark:bg-[#00755f]/20 hover:bg-[#e6faf6] dark:hover:bg-[#00755f]/30 border border-[#99ede0] dark:border-[#00755f]/40 text-xs text-[#00755f] dark:text-[#99ede0] mx-auto shadow-2xs transition-all cursor-pointer group"
                title="Click to view interactive BHEL Leaflet Map"
              >
                <MapPin className="w-3.5 h-3.5 text-[#00c29e] group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">Serving {selectedLocality}</span>
                <span className="hidden sm:inline text-zinc-300 dark:text-zinc-600">•</span>
                <span className="hidden sm:inline font-medium text-[#00755f] dark:text-[#00c29e]">Verified Hyper Local Network</span>
                <span className="text-[10px] font-bold bg-[#00c29e] text-white px-2 py-0.5 rounded-full ml-1">
                  <span className="sm:hidden">Map</span>
                  <span className="hidden sm:inline">Change on Map</span>
                </span>
              </button>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.15] text-zinc-900 dark:text-white max-w-3xl mx-auto">
              Trusted local professionals for everyday home needs.
            </h1>

            <p className="text-sm sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl font-normal leading-relaxed mx-auto">
              Reliable home services, right where you need them. DOIT connects Local residents with verified local professionals, making it simple to request, coordinate, and manage everyday services with confidence.
            </p>

            {/* Quick Action Search Bar */}
            <div className="pt-2 w-full max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500 z-10" />
                <Input
                  type="text"
                  placeholder="Search gardener, maid, painter, driver, labour..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 h-12 bg-white dark:bg-zinc-800 border-2 border-zinc-700 dark:border-zinc-600 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 rounded-full focus-visible:ring-2 focus-visible:ring-zinc-800 focus-visible:border-zinc-800 transition-all shadow-xs text-left"
                />
              </div>
              <button
                onClick={onOpenCustomerApp}
                className="px-8 py-3 rounded-full bg-[#00c29e] hover:bg-[#00a889] text-white font-bold text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0 border border-[#00a889]"
              >
                <span>Book Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Micro proof points */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs text-zinc-500 mx-auto">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00c29e]" />
                <span className="font-medium text-zinc-700 dark:text-zinc-300">Trusted & Verified Professionals</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00c29e]" />
                <span className="font-medium text-zinc-700 dark:text-zinc-300">Transparent Pricing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00c29e]" />
                <span className="font-medium text-zinc-700 dark:text-zinc-300">Hyperlocal Service</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Catalog Section */}
      <section id="services" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-6 mb-10">
          {/* Centered Section Header */}
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900">
              Our Services
            </h2>
          </div>

          {/* Controls Bar: Category Pills + Short Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'All Services' },
                { id: 'home', label: 'Home Care' },
                { id: 'gardening', label: 'Gardening' },
                { id: 'repairs', label: 'Repairs & Tech' },
                { id: 'assistance', label: 'Drivers & Helpers' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                    selectedFilter === tab.id
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-2xs'
                      : 'bg-white text-zinc-600 hover:text-zinc-900 border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Shortened Search Bar & Results Count */}
            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
              <div className="relative w-44 sm:w-48">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500 z-10" />
                <Input
                  type="text"
                  placeholder="Search services"
                  value={serviceSearchQuery}
                  onChange={(e) => setServiceSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-7 h-8 text-xs bg-white border-2 border-zinc-700 text-zinc-900 placeholder:text-zinc-500 rounded-full focus-visible:ring-1 focus-visible:ring-zinc-800 transition-all shadow-xs"
                />
                {(serviceSearchQuery || searchQuery) && (
                  <button
                    type="button"
                    onClick={() => {
                      setServiceSearchQuery('');
                      setSearchQuery('');
                    }}
                    title="Clear search"
                    className="absolute right-2.5 top-1.5 text-zinc-400 hover:text-zinc-600 text-sm font-bold cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>

              <span className="text-xs font-semibold text-zinc-600 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200/80 shrink-0 whitespace-nowrap">
                {filteredCategories.length} {filteredCategories.length === 1 ? 'Service' : 'Services'}
              </span>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-zinc-200 shadow-2xs max-w-md mx-auto space-y-3">
            <Search className="w-8 h-8 text-zinc-400 mx-auto" />
            <h3 className="text-sm font-bold text-zinc-900">No matching services found</h3>
            <p className="text-xs text-zinc-500">
              {activeSearchTerm ? `No results found for "${activeSearchTerm}".` : 'No services found in this category.'} Try adjusting your filters.
            </p>
            <button
              onClick={() => {
                setServiceSearchQuery('');
                setSearchQuery('');
                setSelectedFilter('all');
              }}
              className="px-5 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold cursor-pointer border border-zinc-900"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-2xl border border-zinc-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group"
            >
              {/* Image & Badges */}
              <div 
                onClick={() => {
                  if (category.id === 'gardener') {
                    setGardenerModalOpen(true);
                  } else if (category.id === 'maid') {
                    setMaidModalOpen(true);
                  } else if (category.id === 'caretaker') {
                    setCaretakerModalOpen(true);
                  } else if (category.id === 'painter') {
                    setPainterModalOpen(true);
                  } else if (category.id === 'pest_control') {
                    setPestControlModalOpen(true);
                  } else if (category.id === 'sanitation') {
                    setSanitationModalOpen(true);
                  } else if (category.id === 'labour') {
                    setLabourModalOpen(true);
                  } else if (category.id === 'helper') {
                    setHelperModalOpen(true);
                  } else if (category.id === 'driver') {
                    setDriverModalOpen(true);
                  }
                }}
                className={`relative aspect-[4/3] w-full overflow-hidden bg-zinc-900 flex items-center justify-center ${category.id === 'gardener' || category.id === 'maid' || category.id === 'caretaker' || category.id === 'painter' || category.id === 'pest_control' || category.id === 'sanitation' || category.id === 'labour' || category.id === 'helper' || category.id === 'driver' ? 'cursor-pointer' : ''}`}
              >
                {/* Ambient backdrop to maintain seamless frame */}
                <img
                  src={category.image}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-30 select-none pointer-events-none"
                  onError={(e) => {
                    if (category.id === 'sanitation') {
                      (e.currentTarget as HTMLImageElement).src = '/images/services/service_sanitation_1789195622317.jpg';
                    }
                  }}
                />
                <img
                  src={category.image}
                  alt={category.name}
                  referrerPolicy="no-referrer"
                  className="relative z-1 w-full h-full object-contain group-hover:scale-103 transition-transform duration-500"
                  onError={(e) => {
                    if (category.id === 'sanitation') {
                      (e.currentTarget as HTMLImageElement).src = '/images/services/service_sanitation_1789195622317.jpg';
                    }
                  }}
                />
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-zinc-950/85 backdrop-blur-xs text-white text-[11px] font-bold shadow-xs">
                    {category.name}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-xs text-zinc-900 text-xs font-black shadow-2xs border border-zinc-100">
                  ₹{category.startingPrice} <span className="text-[10px] font-medium text-zinc-500">/ {category.pricingModel}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <p className="text-xs text-zinc-600 line-clamp-2">
                    {category.shortDesc}
                  </p>
                  
                  {/* Sub services tags */}
                  {category.id === 'gardener' ? (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setGardenerModalOpen(true)}
                        className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200/90 text-emerald-900 text-xs font-bold transition-all flex items-center justify-between group/btn cursor-pointer shadow-2xs"
                      >
                        <span className="flex items-center gap-2">
                          <Trees className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>18 Services Included (माली की 18 सेवाएँ)</span>
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 group-hover/btn:translate-x-0.5 transition-transform shrink-0">
                          <span>View List</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </button>
                    </div>
                  ) : category.id === 'maid' ? (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setMaidModalOpen(true)}
                        className="w-full py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100/90 border border-sky-200/90 text-sky-950 text-xs font-bold transition-all flex items-center justify-between group/btn cursor-pointer shadow-2xs"
                      >
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
                          <span>20 Cleaning Services (घर की 20 सफाई सेवाएँ)</span>
                        </span>
                        <span className="text-[11px] font-semibold text-sky-700 flex items-center gap-1 group-hover/btn:translate-x-0.5 transition-transform shrink-0">
                          <span>View List</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </button>
                    </div>
                  ) : category.id === 'caretaker' ? (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setCaretakerModalOpen(true)}
                        className="w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100/90 border border-amber-200/90 text-amber-950 text-xs font-bold transition-all flex items-center justify-between group/btn cursor-pointer shadow-2xs"
                      >
                        <span className="flex items-center gap-2">
                          <HeartHandshake className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>17 Care Services (देखभाल की 17 सेवाएँ)</span>
                        </span>
                        <span className="text-[11px] font-semibold text-amber-700 flex items-center gap-1 group-hover/btn:translate-x-0.5 transition-transform shrink-0">
                          <span>View List</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </button>
                    </div>
                  ) : category.id === 'painter' ? (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setPainterModalOpen(true)}
                        className="w-full py-2.5 px-3 rounded-xl bg-violet-50 hover:bg-violet-100/90 border border-violet-200/90 text-violet-950 text-xs font-bold transition-all flex items-center justify-between group/btn cursor-pointer shadow-2xs"
                      >
                        <span className="flex items-center gap-2">
                          <Paintbrush className="w-4 h-4 text-violet-600 shrink-0" />
                          <span>18 Painting Services (पेंट करने की 18 सेवाएँ)</span>
                        </span>
                        <span className="text-[11px] font-semibold text-violet-700 flex items-center gap-1 group-hover/btn:translate-x-0.5 transition-transform shrink-0">
                          <span>View List</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </button>
                    </div>
                  ) : category.id === 'pest_control' ? (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setPestControlModalOpen(true)}
                        className="w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100/90 border border-rose-200/90 text-rose-950 text-xs font-bold transition-all flex items-center justify-between group/btn cursor-pointer shadow-2xs"
                      >
                        <span className="flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>18 Pest Control Services (कीड़े-मकौड़ों से बचाव की 18 सेवाएँ)</span>
                        </span>
                        <span className="text-[11px] font-semibold text-rose-700 flex items-center gap-1 group-hover/btn:translate-x-0.5 transition-transform shrink-0">
                          <span>View List</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </button>
                    </div>
                  ) : category.id === 'sanitation' ? (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setSanitationModalOpen(true)}
                        className="w-full py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100/90 border border-teal-200/90 text-teal-950 text-xs font-bold transition-all flex items-center justify-between group/btn cursor-pointer shadow-2xs"
                      >
                        <span className="flex items-center gap-2">
                          <Trash2 className="w-4 h-4 text-teal-600 shrink-0" />
                          <span>6 Sanitation Services (सफाई की 6 सेवाएँ)</span>
                        </span>
                        <span className="text-[11px] font-semibold text-teal-700 flex items-center gap-1 group-hover/btn:translate-x-0.5 transition-transform shrink-0">
                          <span>View List</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </button>
                    </div>
                  ) : category.id === 'labour' ? (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setLabourModalOpen(true)}
                        className="w-full py-2.5 px-3 rounded-xl bg-orange-50 hover:bg-orange-100/90 border border-orange-200/90 text-orange-950 text-xs font-bold transition-all flex items-center justify-between group/btn cursor-pointer shadow-2xs"
                      >
                        <span className="flex items-center gap-2">
                          <Hammer className="w-4 h-4 text-orange-600 shrink-0" />
                          <span>19 Labour Services (मजदूर की 19 सेवाएँ)</span>
                        </span>
                        <span className="text-[11px] font-semibold text-orange-700 flex items-center gap-1 group-hover/btn:translate-x-0.5 transition-transform shrink-0">
                          <span>View List</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </button>
                    </div>
                  ) : category.id === 'helper' ? (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setHelperModalOpen(true)}
                        className="w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100/90 border border-amber-200/90 text-amber-950 text-xs font-bold transition-all flex items-center justify-between group/btn cursor-pointer shadow-2xs"
                      >
                        <span className="flex items-center gap-2">
                          <HandHelping className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>9 Helper Services (मदद के 9 काम)</span>
                        </span>
                        <span className="text-[11px] font-semibold text-amber-700 flex items-center gap-1 group-hover/btn:translate-x-0.5 transition-transform shrink-0">
                          <span>View List</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </button>
                    </div>
                  ) : category.id === 'driver' ? (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setDriverModalOpen(true)}
                        className="w-full py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100/90 border border-indigo-200/90 text-indigo-950 text-xs font-bold transition-all flex items-center justify-between group/btn cursor-pointer shadow-2xs"
                      >
                        <span className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-indigo-600 shrink-0" />
                          <span>20 Driver Services (ड्राइवर की 20 सेवाएँ)</span>
                        </span>
                        <span className="text-[11px] font-semibold text-indigo-700 flex items-center gap-1 group-hover/btn:translate-x-0.5 transition-transform shrink-0">
                          <span>View List</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {category.subServices.slice(0, 3).map((sub, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => onSelectCategoryForBooking(category.id as ServiceCategoryId, sub)}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium transition-colors text-left"
                        >
                          {sub}
                        </button>
                      ))}
                      {category.subServices.length > 3 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-500 font-medium">
                          +{category.subServices.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-500" />
                    {category.estimatedDuration}
                  </span>

                  {category.id === 'gardener' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setGardenerModalOpen(true)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors cursor-pointer border border-emerald-200"
                      >
                        <Trees className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Services (18)</span>
                      </button>
                      <button
                        onClick={() => setGardenerModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 hover:bg-[#00c29e] text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs border border-zinc-900 hover:border-[#00c29e]"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ) : category.id === 'maid' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setMaidModalOpen(true)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold transition-colors cursor-pointer border border-sky-200"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                        <span>Services (20)</span>
                      </button>
                      <button
                        onClick={() => setMaidModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 hover:bg-[#00c29e] text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs border border-zinc-900 hover:border-[#00c29e]"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ) : category.id === 'caretaker' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCaretakerModalOpen(true)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors cursor-pointer border border-amber-200"
                      >
                        <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />
                        <span>Services (17)</span>
                      </button>
                      <button
                        onClick={() => setCaretakerModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 hover:bg-[#00c29e] text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs border border-zinc-900 hover:border-[#00c29e]"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ) : category.id === 'painter' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPainterModalOpen(true)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-violet-50 hover:bg-violet-100 text-violet-900 text-xs font-bold transition-colors cursor-pointer border border-violet-200"
                      >
                        <Paintbrush className="w-3.5 h-3.5 text-violet-600" />
                        <span>Services (18)</span>
                      </button>
                      <button
                        onClick={() => setPainterModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 hover:bg-[#00c29e] text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs border border-zinc-900 hover:border-[#00c29e]"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ) : category.id === 'pest_control' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPestControlModalOpen(true)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-bold transition-colors cursor-pointer border border-rose-200"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                        <span>Services (18)</span>
                      </button>
                      <button
                        onClick={() => setPestControlModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 hover:bg-[#00c29e] text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs border border-zinc-900 hover:border-[#00c29e]"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ) : category.id === 'sanitation' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSanitationModalOpen(true)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-bold transition-colors cursor-pointer border border-teal-200"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-teal-600" />
                        <span>Services (6)</span>
                      </button>
                      <button
                        onClick={() => setSanitationModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 hover:bg-[#00c29e] text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs border border-zinc-900 hover:border-[#00c29e]"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ) : category.id === 'labour' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setLabourModalOpen(true)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-50 hover:bg-orange-100 text-orange-900 text-xs font-bold transition-colors cursor-pointer border border-orange-200"
                      >
                        <Hammer className="w-3.5 h-3.5 text-orange-600" />
                        <span>Services (19)</span>
                      </button>
                      <button
                        onClick={() => setLabourModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 hover:bg-[#00c29e] text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs border border-zinc-900 hover:border-[#00c29e]"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ) : category.id === 'helper' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setHelperModalOpen(true)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors cursor-pointer border border-amber-200"
                      >
                        <HandHelping className="w-3.5 h-3.5 text-amber-600" />
                        <span>Services (9)</span>
                      </button>
                      <button
                        onClick={() => setHelperModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 hover:bg-[#00c29e] text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs border border-zinc-900 hover:border-[#00c29e]"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ) : category.id === 'driver' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDriverModalOpen(true)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-bold transition-colors cursor-pointer border border-indigo-200"
                      >
                        <Car className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Services (20)</span>
                      </button>
                      <button
                        onClick={() => setDriverModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 hover:bg-[#00c29e] text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs border border-zinc-900 hover:border-[#00c29e]"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onSelectCategoryForBooking(category.id as ServiceCategoryId)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 hover:bg-[#00c29e] text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs border border-zinc-900 hover:border-[#00c29e]"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How DOIT Makes Home Services Simple Section */}
      <HowItWorksSection onSelectCategoryForBooking={onSelectCategoryForBooking} />

      {/* Why Would You Choose DOIT? Section */}
      <WhyChooseDoitSection onSelectCategoryForBooking={onSelectCategoryForBooking} />

      {/* DOIT Service Area Section */}
      <ServiceAreaSection
        onSelectCategoryForBooking={onSelectCategoryForBooking}
        onOpenCustomerApp={onOpenCustomerApp}
        selectedLocalityName={selectedLocality}
        onSelectLocality={onSelectLocality}
      />

      {/* Become a Provider CTA Card — Minimal Mint Styled */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#00c29e] text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 shadow-lg">
          <div className="space-y-3 max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              Earn with Dignity & Steady Local Jobs
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Are you a Skilled Professional?
            </h3>
            <p className="text-sm font-medium text-white/90">
              Join DOIT's trusted network. Get regular bookings in nearby BHEL sectors, prompt weekly direct payouts, and transparent low 10% platform fees.
            </p>
          </div>

          <button
            onClick={() => setShowProviderModal(true)}
            className="px-6 py-3.5 rounded-full bg-zinc-950 text-white hover:bg-zinc-800 font-bold text-sm transition-all shadow-md shrink-0 cursor-pointer border border-zinc-800"
          >
            Register as DOIT Professional
          </button>
        </div>
      </section>

      {/* Provider Onboarding Modal */}
      {showProviderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-zinc-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
              <div>
                <h3 className="text-lg font-bold text-zinc-900">DOIT Provider Onboarding</h3>
                <p className="text-xs text-zinc-500">Official Registration Form • BHEL, Bhopal</p>
              </div>
              <button
                onClick={() => setShowProviderModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formSubmitted ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-12 h-12 bg-[#e6faf6] text-[#00c29e] rounded-full flex items-center justify-center mx-auto border border-[#99ede0]">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-zinc-900">Application Submitted for Review</h4>
                <p className="text-xs text-zinc-600 max-w-sm mx-auto">
                  Your details and KYC declaration have reached the DOIT Verification Team. Our coordinator will contact you for in-person document check within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleProviderSubmit} className="space-y-4 text-xs">
                
                {/* Personal Details */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-700">Full Name as per Aadhaar *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra Kushwah"
                    value={providerForm.fullName}
                    onChange={(e) => setProviderForm({ ...providerForm, fullName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 text-xs focus:ring-2 focus:ring-[#00c29e] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-zinc-700">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit number"
                      value={providerForm.phone}
                      onChange={(e) => setProviderForm({ ...providerForm, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-zinc-300 text-xs focus:ring-2 focus:ring-[#00c29e] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-zinc-700">WhatsApp Number</label>
                    <input
                      type="tel"
                      placeholder="Same as mobile"
                      value={providerForm.whatsapp}
                      onChange={(e) => setProviderForm({ ...providerForm, whatsapp: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-zinc-300 text-xs focus:ring-2 focus:ring-[#00c29e] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-zinc-700">Age</label>
                    <input
                      type="number"
                      placeholder="e.g. 32"
                      value={providerForm.age}
                      onChange={(e) => setProviderForm({ ...providerForm, age: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-zinc-300 text-xs focus:ring-2 focus:ring-[#00c29e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-zinc-700">Residential Locality *</label>
                    <select
                      value={providerForm.locality}
                      onChange={(e) => setProviderForm({ ...providerForm, locality: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-zinc-300 text-xs bg-white"
                    >
                      <option value="BHEL Sector 1">BHEL Sector 1</option>
                      <option value="BHEL Sector 2">BHEL Sector 2</option>
                      <option value="BHEL Sector 3">BHEL Sector 3</option>
                      <option value="Piplani">Piplani</option>
                      <option value="Govindpura">Govindpura</option>
                      <option value="Indrapuri">Indrapuri</option>
                    </select>
                  </div>
                </div>

                {/* Primary Service Selection */}
                <div className="space-y-2 pt-2 border-t border-zinc-100">
                  <label className="font-semibold text-zinc-700">Primary Services You Provide *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <label
                        key={cat.id}
                        className="flex items-center gap-2 p-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={providerForm.selectedServices.includes(cat.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProviderForm({
                                ...providerForm,
                                selectedServices: [...providerForm.selectedServices, cat.id]
                              });
                            } else {
                              setProviderForm({
                                ...providerForm,
                                selectedServices: providerForm.selectedServices.filter(s => s !== cat.id)
                              });
                            }
                          }}
                          className="rounded text-[#00c29e] accent-[#00c29e]"
                        />
                        <span className="text-zinc-800">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* KYC Section */}
                <div className="space-y-3 pt-2 border-t border-zinc-100 bg-[#f0fdf9] p-3.5 rounded-xl border border-[#99ede0]">
                  <div className="flex items-center gap-1.5 font-bold text-[#00755f]">
                    <FileCheck className="w-4 h-4 text-[#00c29e]" />
                    <span>Mandatory KYC Document Verification</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={providerForm.kycDocType}
                      onChange={(e) => setProviderForm({ ...providerForm, kycDocType: e.target.value })}
                      className="w-full p-2 rounded-xl border border-zinc-300 text-xs bg-white"
                    >
                      <option value="Aadhaar Card">Aadhaar Card</option>
                      <option value="Driving Licence">Driving Licence</option>
                      <option value="PAN Card">PAN Card</option>
                    </select>
                    <input
                      type="text"
                      required
                      placeholder="Document ID Number"
                      value={providerForm.kycNumber}
                      onChange={(e) => setProviderForm({ ...providerForm, kycNumber: e.target.value })}
                      className="w-full p-2 rounded-xl border border-zinc-300 text-xs bg-white"
                    />
                  </div>
                  <p className="text-[11px] text-[#00755f]/90">
                    * Physical document verification & selfie check will be carried out at DOIT BHEL Desk before account activation.
                  </p>
                </div>

                {/* Declarations */}
                <div className="space-y-2 pt-2 text-[11px] text-zinc-600">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={providerForm.agreedToTerms}
                      onChange={(e) => setProviderForm({ ...providerForm, agreedToTerms: e.target.checked })}
                      className="mt-0.5 rounded text-[#00c29e] accent-[#00c29e]"
                    />
                    <span>
                      I confirm that the information submitted is accurate. I understand DOIT will conduct local verification and police checks before granting job dispatches.
                    </span>
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#00c29e] hover:bg-[#00a889] text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs border border-[#00a889]"
                  >
                    Submit Provider Application
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

      {/* Dedicated 18 Gardener Services Modal for Mobile and Desktop */}
      {gardenerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Trees className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 text-base flex items-center gap-2">
                    <span>Gardener Services / माली की सेवाएँ</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      18 Services
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Trusted local home gardeners in BHEL, Bhopal • English & सरल हिंदी
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setGardenerModalOpen(false);
                  setGardenerSearchTerm('');
                }}
                className="w-8 h-8 rounded-full bg-white hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 flex items-center justify-center transition-colors shadow-2xs border border-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Search */}
            <div className="p-3.5 border-b border-zinc-100 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  value={gardenerSearchTerm}
                  onChange={(e) => setGardenerSearchTerm(e.target.value)}
                  placeholder="Search gardening service (e.g. grass, कटाई, पौधे, पानी, खाद, पेड़...)"
                  className="pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-50 border-zinc-200"
                />
              </div>
            </div>

            {/* All 18 Services List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {(() => {
                const gardenerCat = categories.find(c => c.id === 'gardener');
                const list = gardenerCat?.subServices || [];
                const filtered = list.filter(item => 
                  !gardenerSearchTerm.trim() || item.toLowerCase().includes(gardenerSearchTerm.trim().toLowerCase())
                );

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-8 text-zinc-500 text-xs">
                      No service found matching "{gardenerSearchTerm}". Try another keyword like "cleaning", "कटाई", or "पौधे".
                    </div>
                  );
                }

                return filtered.map((serviceName, idx) => {
                  const originalIndex = list.indexOf(serviceName) + 1;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-zinc-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center shrink-0">
                          {originalIndex}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-zinc-900 leading-snug">
                            {serviceName}
                          </p>
                          <p className="text-[11px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3 h-3 text-zinc-400" />
                            <span>Estimated: 2–3 Hours</span>
                            <span>•</span>
                            <span className="font-semibold text-emerald-700">₹350 / Per Visit</span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setGardenerModalOpen(false);
                          setGardenerSearchTerm('');
                          onSelectCategoryForBooking('gardener', serviceName);
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-[#00c29e] text-white text-xs font-semibold shrink-0 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
              <span>All 18 services delivered by verified BHEL gardeners</span>
              <button
                type="button"
                onClick={() => {
                  setGardenerModalOpen(false);
                  setGardenerSearchTerm('');
                }}
                className="px-3 py-1 rounded-lg bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated 20 Maid Services (घर की सफाई की सेवाएँ) Modal */}
      {maidModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between bg-sky-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 text-base flex items-center gap-2">
                    <span>Maid Services / घर की सफाई की सेवाएँ</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold">
                      20 Services
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Verified domestic house helpers in BHEL, Bhopal • English & सरल हिंदी
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMaidModalOpen(false);
                  setMaidSearchTerm('');
                }}
                className="w-8 h-8 rounded-full bg-white hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 flex items-center justify-center transition-colors shadow-2xs border border-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Search */}
            <div className="p-3.5 border-b border-zinc-100 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  value={maidSearchTerm}
                  onChange={(e) => setMaidSearchTerm(e.target.value)}
                  placeholder="Search cleaning service (e.g. kitchen, झाड़ू-पोंछा, बर्तन, कपड़े, बाथरूम, पंखा...)"
                  className="pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-50 border-zinc-200"
                />
              </div>
            </div>

            {/* All 20 Services List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {(() => {
                const maidCat = categories.find(c => c.id === 'maid');
                const list = maidCat?.subServices || [];
                const filtered = list.filter(item => 
                  !maidSearchTerm.trim() || item.toLowerCase().includes(maidSearchTerm.trim().toLowerCase())
                );

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-8 text-zinc-500 text-xs">
                      No service found matching "{maidSearchTerm}". Try another keyword like "cleaning", "झाड़ू", or "kitchen".
                    </div>
                  );
                }

                return filtered.map((serviceName, idx) => {
                  const originalIndex = list.indexOf(serviceName) + 1;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-zinc-200 hover:border-sky-500 hover:bg-sky-50/40 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 text-xs font-black flex items-center justify-center shrink-0">
                          {originalIndex}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-zinc-900 leading-snug">
                            {serviceName}
                          </p>
                          <p className="text-[11px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3 h-3 text-zinc-400" />
                            <span>Estimated: 1.5–2.5 Hours</span>
                            <span>•</span>
                            <span className="font-semibold text-sky-700">₹250 / Per Visit</span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setMaidModalOpen(false);
                          setMaidSearchTerm('');
                          onSelectCategoryForBooking('maid', serviceName);
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-[#00c29e] text-white text-xs font-semibold shrink-0 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
              <span>All 20 services delivered by verified BHEL domestic helpers</span>
              <button
                type="button"
                onClick={() => {
                  setMaidModalOpen(false);
                  setMaidSearchTerm('');
                }}
                className="px-3 py-1 rounded-lg bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated 17 Caretaker Services (देखभाल की सेवाएँ) Modal */}
      {caretakerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between bg-amber-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 text-base flex items-center gap-2">
                    <span>Caretaker Services / देखभाल की सेवाएँ</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                      17 Services
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Compassionate elderly, patient & home care assistants in Bhopal • English & सरल हिंदी
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCaretakerModalOpen(false);
                  setCaretakerSearchTerm('');
                }}
                className="w-8 h-8 rounded-full bg-white hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 flex items-center justify-center transition-colors shadow-2xs border border-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Search */}
            <div className="p-3.5 border-b border-zinc-100 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  value={caretakerSearchTerm}
                  onChange={(e) => setCaretakerSearchTerm(e.target.value)}
                  placeholder="Search care service (e.g. elderly care, मरीज़, बच्चे, दवाई, hospital, companion...)"
                  className="pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-50 border-zinc-200"
                />
              </div>
            </div>

            {/* All 17 Services List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {(() => {
                const caretakerCat = categories.find(c => c.id === 'caretaker');
                const list = caretakerCat?.subServices || [];
                const filtered = list.filter(item => 
                  !caretakerSearchTerm.trim() || item.toLowerCase().includes(caretakerSearchTerm.trim().toLowerCase())
                );

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-8 text-zinc-500 text-xs">
                      No service found matching "{caretakerSearchTerm}". Try another keyword like "elderly", "मरीज़", or "care".
                    </div>
                  );
                }

                return filtered.map((serviceName, idx) => {
                  const originalIndex = list.indexOf(serviceName) + 1;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-zinc-200 hover:border-amber-500 hover:bg-amber-50/40 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 text-xs font-black flex items-center justify-center shrink-0">
                          {originalIndex}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-zinc-900 leading-snug">
                            {serviceName}
                          </p>
                          <p className="text-[11px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3 h-3 text-zinc-400" />
                            <span>Estimated: Flexible shifts</span>
                            <span>•</span>
                            <span className="font-semibold text-amber-700">₹600 / Per Day</span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setCaretakerModalOpen(false);
                          setCaretakerSearchTerm('');
                          onSelectCategoryForBooking('caretaker', serviceName);
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-[#00c29e] text-white text-xs font-semibold shrink-0 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
              <span>All 17 care services delivered by verified caregivers in Bhopal</span>
              <button
                type="button"
                onClick={() => {
                  setCaretakerModalOpen(false);
                  setCaretakerSearchTerm('');
                }}
                className="px-3 py-1 rounded-lg bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated 18 Painter Services (पेंट करने की सेवाएँ) Modal */}
      {painterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between bg-violet-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
                  <Paintbrush className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 text-base flex items-center gap-2">
                    <span>Painter Services / पेंट करने की सेवाएँ</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 font-bold">
                      18 Services
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Professional interior, exterior & wall painting in Bhopal • English & सरल हिंदी
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPainterModalOpen(false);
                  setPainterSearchTerm('');
                }}
                className="w-8 h-8 rounded-full bg-white hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 flex items-center justify-center transition-colors shadow-2xs border border-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Search */}
            <div className="p-3.5 border-b border-zinc-100 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  value={painterSearchTerm}
                  onChange={(e) => setPainterSearchTerm(e.target.value)}
                  placeholder="Search painting service (e.g. wall, पुट्टी, छत, दरवाजा, waterproof, texture...)"
                  className="pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-50 border-zinc-200"
                />
              </div>
            </div>

            {/* All 18 Services List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {(() => {
                const painterCat = categories.find(c => c.id === 'painter');
                const list = painterCat?.subServices || [];
                const filtered = list.filter(item => 
                  !painterSearchTerm.trim() || item.toLowerCase().includes(painterSearchTerm.trim().toLowerCase())
                );

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-8 text-zinc-500 text-xs">
                      No service found matching "{painterSearchTerm}". Try another keyword like "painting", "दीवार", or "putty".
                    </div>
                  );
                }

                return filtered.map((serviceName, idx) => {
                  const originalIndex = list.indexOf(serviceName) + 1;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-zinc-200 hover:border-violet-500 hover:bg-violet-50/40 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-full bg-violet-100 text-violet-800 text-xs font-black flex items-center justify-center shrink-0">
                          {originalIndex}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-zinc-900 leading-snug">
                            {serviceName}
                          </p>
                          <p className="text-[11px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3 h-3 text-zinc-400" />
                            <span>Estimated: 1 - 3 Days</span>
                            <span>•</span>
                            <span className="font-semibold text-violet-700">Starting From ₹499</span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setPainterModalOpen(false);
                          setPainterSearchTerm('');
                          onSelectCategoryForBooking('painter', serviceName);
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-[#00c29e] text-white text-xs font-semibold shrink-0 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
              <span>All 18 painting services provided with surface prep and neat finish</span>
              <button
                type="button"
                onClick={() => {
                  setPainterModalOpen(false);
                  setPainterSearchTerm('');
                }}
                className="px-3 py-1 rounded-lg bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated 18 Pest Control Technician Services (कीड़े-मकौड़े से बचाव की सेवाएँ) Modal */}
      {pestControlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between bg-rose-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 text-base flex items-center gap-2">
                    <span>Pest Control Services / कीड़े-मकौड़े से बचाव की सेवाएँ</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                      18 Services
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Child & pet-safe pest eradication in Bhopal • English & सरल हिंदी
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPestControlModalOpen(false);
                  setPestControlSearchTerm('');
                }}
                className="w-8 h-8 rounded-full bg-white hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 flex items-center justify-center transition-colors shadow-2xs border border-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Search */}
            <div className="p-3.5 border-b border-zinc-100 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  value={pestControlSearchTerm}
                  onChange={(e) => setPestControlSearchTerm(e.target.value)}
                  placeholder="Search pest control (e.g. cockroach, कॉकरोच, दीमक, termite, चूहा, bed bug, मच्छर...)"
                  className="pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-50 border-zinc-200"
                />
              </div>
            </div>

            {/* All 18 Services List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {(() => {
                const pestCat = categories.find(c => c.id === 'pest_control');
                const list = pestCat?.subServices || [];
                const filtered = list.filter(item => 
                  !pestControlSearchTerm.trim() || item.toLowerCase().includes(pestControlSearchTerm.trim().toLowerCase())
                );

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-8 text-zinc-500 text-xs">
                      No service found matching "{pestControlSearchTerm}". Try another keyword like "cockroach", "दीमक", or "pest".
                    </div>
                  );
                }

                return filtered.map((serviceName, idx) => {
                  const originalIndex = list.indexOf(serviceName) + 1;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-zinc-200 hover:border-rose-500 hover:bg-rose-50/40 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-full bg-rose-100 text-rose-800 text-xs font-black flex items-center justify-center shrink-0">
                          {originalIndex}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-zinc-900 leading-snug">
                            {serviceName}
                          </p>
                          <p className="text-[11px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3 h-3 text-zinc-400" />
                            <span>Estimated: 1 - 2 Hours</span>
                            <span>•</span>
                            <span className="font-semibold text-rose-700">Fixed Price From ₹699</span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setPestControlModalOpen(false);
                          setPestControlSearchTerm('');
                          onSelectCategoryForBooking('pest_control', serviceName);
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-[#00c29e] text-white text-xs font-semibold shrink-0 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
              <span>All 18 pest control services delivered using child & pet-safe certified products</span>
              <button
                type="button"
                onClick={() => {
                  setPestControlModalOpen(false);
                  setPestControlSearchTerm('');
                }}
                className="px-3 py-1 rounded-lg bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated 6 Sanitation Worker Services (सफाई की सेवाएँ) Modal */}
      {sanitationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between bg-teal-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 text-base flex items-center gap-2">
                    <span>Sanitation Worker Services / सफाई की सेवाएँ</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold">
                      6 Services
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Drain, sewer, septic tank & outdoor waste clearance in Bhopal • English & सरल हिंदी
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSanitationModalOpen(false);
                  setSanitationSearchTerm('');
                }}
                className="w-8 h-8 rounded-full bg-white hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 flex items-center justify-center transition-colors shadow-2xs border border-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Search */}
            <div className="p-3.5 border-b border-zinc-100 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  value={sanitationSearchTerm}
                  onChange={(e) => setSanitationSearchTerm(e.target.value)}
                  placeholder="Search sanitation service (e.g. drain, नाली, सीवर, sewer, septic, कचरा...)"
                  className="pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-50 border-zinc-200"
                />
              </div>
            </div>

            {/* All 6 Services List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {(() => {
                const sanitCat = categories.find(c => c.id === 'sanitation');
                const list = sanitCat?.subServices || [];
                const filtered = list.filter(item => 
                  !sanitationSearchTerm.trim() || item.toLowerCase().includes(sanitationSearchTerm.trim().toLowerCase())
                );

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-8 text-zinc-500 text-xs">
                      No service found matching "{sanitationSearchTerm}". Try another keyword like "drain", "नाली", or "cleaning".
                    </div>
                  );
                }

                return filtered.map((serviceName, idx) => {
                  const originalIndex = list.indexOf(serviceName) + 1;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-zinc-200 hover:border-teal-500 hover:bg-teal-50/40 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 text-xs font-black flex items-center justify-center shrink-0">
                          {originalIndex}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-zinc-900 leading-snug">
                            {serviceName}
                          </p>
                          <p className="text-[11px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3 h-3 text-zinc-400" />
                            <span>Estimated: 2 - 3 Hours</span>
                            <span>•</span>
                            <span className="font-semibold text-teal-700">Per Job: Starting From ₹450</span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSanitationModalOpen(false);
                          setSanitationSearchTerm('');
                          onSelectCategoryForBooking('sanitation', serviceName);
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-[#00c29e] text-white text-xs font-semibold shrink-0 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
              <span>All 6 sanitation services performed with dedicated safety gear and heavy-duty disposal</span>
              <button
                type="button"
                onClick={() => {
                  setSanitationModalOpen(false);
                  setSanitationSearchTerm('');
                }}
                className="px-3 py-1 rounded-lg bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated 19 Labour Services (मजदूर की सेवाएँ) Modal */}
      {labourModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between bg-orange-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                  <Hammer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 text-base flex items-center gap-2">
                    <span>Labour Services / मजदूर की सेवाएँ</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold">
                      19 Services
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Loading, shifting, construction, digging & general labour in Bhopal • English & सरल हिंदी
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLabourModalOpen(false);
                  setLabourSearchTerm('');
                }}
                className="w-8 h-8 rounded-full bg-white hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 flex items-center justify-center transition-colors shadow-2xs border border-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Search */}
            <div className="p-3.5 border-b border-zinc-100 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  value={labourSearchTerm}
                  onChange={(e) => setLabourSearchTerm(e.target.value)}
                  placeholder="Search labour service (e.g. loading, shifting, निर्माण, ईंट, digging, debris, सामान...)"
                  className="pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-50 border-zinc-200"
                />
              </div>
            </div>

            {/* All 19 Services List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {(() => {
                const labourCat = categories.find(c => c.id === 'labour');
                const list = labourCat?.subServices || [];
                const filtered = list.filter(item => 
                  !labourSearchTerm.trim() || item.toLowerCase().includes(labourSearchTerm.trim().toLowerCase())
                );

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-8 text-zinc-500 text-xs">
                      No service found matching "{labourSearchTerm}". Try another keyword like "loading", "shifting", or "मदद".
                    </div>
                  );
                }

                return filtered.map((serviceName, idx) => {
                  const originalIndex = list.indexOf(serviceName) + 1;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-zinc-200 hover:border-orange-500 hover:bg-orange-50/40 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-800 text-xs font-black flex items-center justify-center shrink-0">
                          {originalIndex}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-zinc-900 leading-snug">
                            {serviceName}
                          </p>
                          <p className="text-[11px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3 h-3 text-zinc-400" />
                            <span>Estimated: 4 - 8 Hours</span>
                            <span>•</span>
                            <span className="font-semibold text-orange-700">Per Day: Starting From ₹550</span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setLabourModalOpen(false);
                          setLabourSearchTerm('');
                          onSelectCategoryForBooking('labour', serviceName);
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-[#00c29e] text-white text-xs font-semibold shrink-0 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
              <span>All 19 labour services carried out by verified, physically strong local workers in Bhopal</span>
              <button
                type="button"
                onClick={() => {
                  setLabourModalOpen(false);
                  setLabourSearchTerm('');
                }}
                className="px-3 py-1 rounded-lg bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated 9 Helper Services (मदद के काम) Modal */}
      {helperModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between bg-amber-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <HandHelping className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 text-base flex items-center gap-2">
                    <span>Helper Services / मदद के काम</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                      9 Services
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Household, moving, packing, shifting & general task assistance in Bhopal • English & सरल हिंदी
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setHelperModalOpen(false);
                  setHelperSearchTerm('');
                }}
                className="w-8 h-8 rounded-full bg-white hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 flex items-center justify-center transition-colors shadow-2xs border border-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Search */}
            <div className="p-3.5 border-b border-zinc-100 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  value={helperSearchTerm}
                  onChange={(e) => setHelperSearchTerm(e.target.value)}
                  placeholder="Search helper service (e.g. household, घर के काम, moving, सामान, packing, shifting...)"
                  className="pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-50 border-zinc-200"
                />
              </div>
            </div>

            {/* All 9 Services List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {(() => {
                const helperCat = categories.find(c => c.id === 'helper');
                const list = helperCat?.subServices || [];
                const filtered = list.filter(item => 
                  !helperSearchTerm.trim() || item.toLowerCase().includes(helperSearchTerm.trim().toLowerCase())
                );

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-8 text-zinc-500 text-xs">
                      No service found matching "{helperSearchTerm}". Try another keyword like "help", "सामान", or "मदद".
                    </div>
                  );
                }

                return filtered.map((serviceName, idx) => {
                  const originalIndex = list.indexOf(serviceName) + 1;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-zinc-200 hover:border-amber-500 hover:bg-amber-50/40 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 text-xs font-black flex items-center justify-center shrink-0">
                          {originalIndex}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-zinc-900 leading-snug">
                            {serviceName}
                          </p>
                          <p className="text-[11px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3 h-3 text-zinc-400" />
                            <span>Estimated: Min 2 Hours</span>
                            <span>•</span>
                            <span className="font-semibold text-amber-700">Hourly: Starting From ₹150</span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setHelperModalOpen(false);
                          setHelperSearchTerm('');
                          onSelectCategoryForBooking('helper', serviceName);
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-[#00c29e] text-white text-xs font-semibold shrink-0 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
              <span>All 9 helper services focused on assisting you with household chores and lifting support</span>
              <button
                type="button"
                onClick={() => {
                  setHelperModalOpen(false);
                  setHelperSearchTerm('');
                }}
                className="px-3 py-1 rounded-lg bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated 20 Driver Services (ड्राइवर की सेवाएँ) Modal */}
      {driverModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between bg-indigo-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 text-base flex items-center gap-2">
                    <span>Driver Services / ड्राइवर की सेवाएँ</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">
                      20 Services
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Personal, outstation, local, office & 24/7 on-demand drivers in Bhopal • English & सरल हिंदी
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDriverModalOpen(false);
                  setDriverSearchTerm('');
                }}
                className="w-8 h-8 rounded-full bg-white hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 flex items-center justify-center transition-colors shadow-2xs border border-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Search */}
            <div className="p-3.5 border-b border-zinc-100 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  value={driverSearchTerm}
                  onChange={(e) => setDriverSearchTerm(e.target.value)}
                  placeholder="Search driver service (e.g. personal, outstation, airport, ऑफिस, स्कूल, शादी, रात...)"
                  className="pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-50 border-zinc-200"
                />
              </div>
            </div>

            {/* All 20 Services List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {(() => {
                const driverCat = categories.find(c => c.id === 'driver');
                const list = driverCat?.subServices || [];
                const filtered = list.filter(item => 
                  !driverSearchTerm.trim() || item.toLowerCase().includes(driverSearchTerm.trim().toLowerCase())
                );

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-8 text-zinc-500 text-xs">
                      No service found matching "{driverSearchTerm}". Try another keyword like "driver", "गाड़ी", or "ड्राइवर".
                    </div>
                  );
                }

                return filtered.map((serviceName, idx) => {
                  const originalIndex = list.indexOf(serviceName) + 1;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-zinc-200 hover:border-indigo-500 hover:bg-indigo-50/40 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black flex items-center justify-center shrink-0">
                          {originalIndex}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-zinc-900 leading-snug">
                            {serviceName}
                          </p>
                          <p className="text-[11px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3 h-3 text-zinc-400" />
                            <span>Estimated: 4 - 8 Hours</span>
                            <span>•</span>
                            <span className="font-semibold text-indigo-700">Trip / Daily: Starting From ₹400</span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setDriverModalOpen(false);
                          setDriverSearchTerm('');
                          onSelectCategoryForBooking('driver', serviceName);
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-[#00c29e] text-white text-xs font-semibold shrink-0 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
              <span>All 20 driver services focused strictly on driving vehicles safely and punctually</span>
              <button
                type="button"
                onClick={() => {
                  setDriverModalOpen(false);
                  setDriverSearchTerm('');
                }}
                className="px-3 py-1 rounded-lg bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern Marketplace Footer */}
      <PublicFooter
        onSelectCategoryForBooking={onSelectCategoryForBooking}
        onOpenCustomerApp={onOpenCustomerApp}
        onOpenProviderOnboarding={() => {
          if (onOpenProviderOnboarding) {
            onOpenProviderOnboarding();
          }
          setShowProviderModal(true);
        }}
        onOpenProviderApp={onOpenProviderApp}
        onOpenAdminDashboard={onOpenAdminDashboard}
        onOpenAboutPage={onOpenAboutPage}
        cmsContent={cmsContent}
      />

      {/* Interactive Google Map Location Selector Modal */}
      <LocationSelectorMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        selectedLocality={selectedLocality}
        onSelectLocality={(loc) => {
          if (onSelectLocality) {
            onSelectLocality(loc);
          }
        }}
      />

    </div>
  );
};
