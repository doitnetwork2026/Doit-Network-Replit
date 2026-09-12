import React, { useState } from 'react';
import { 
  ServiceCategory, 
  ServiceCategoryId,
  Booking,
  BookingStatus,
  Provider,
  SavedAddress
} from '../../types/doit';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  Camera, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Phone, 
  Star, 
  ShieldCheck, 
  X,
  Plus,
  RefreshCw,
  Map as MapIcon,
  Navigation,
  ChevronRight,
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
import { LiveBookingTrackerMap } from '../maps/LiveBookingTrackerMap';
import { ProviderDirectoryMap } from '../maps/ProviderDirectoryMap';
import { CustomerRefundsTab } from './CustomerRefundsTab';
import { CustomerPaymentsTab } from './CustomerPaymentsTab';
import { CustomerNotificationsTab } from './CustomerNotificationsTab';
import { CustomerSupportTab } from './CustomerSupportTab';
import { CustomerAccountDeletionTab } from './CustomerAccountDeletionTab';
import { Input } from '../ui/input';

interface CustomerAppProps {
  categories: ServiceCategory[];
  bookings: Booking[];
  providers: Provider[];
  onNewBooking: (booking) => void;
  onUpdateBookingStatus: (bookingId: string, nextStatus: BookingStatus) => void;
  onAcceptQuote: (bookingId: string) => void;
  onPayBooking: (bookingId: string, method: 'UPI' | 'Cash') => void;
  onSubmitReview: (bookingId: string, rating: NonNullable<Booking['rating']>) => void;
  onSubmitComplaint: (bookingId: string, complaint: NonNullable<Booking['complaint']>) => void;
  selectedLocality: string;
  initialSelectedCategory?: ServiceCategoryId | null;
  initialSelectedSubService?: string | null;
  initialTab?: 'explore' | 'bookings' | 'recurring' | 'payments' | 'refunds' | 'notifications' | 'support' | 'account_deletion';
  onTabChange?: (tab: 'explore' | 'bookings' | 'recurring' | 'payments' | 'refunds' | 'notifications' | 'support' | 'account_deletion') => void;
}

export const CustomerApp: React.FC<CustomerAppProps> = ({
  categories,
  bookings,
  providers,
  onNewBooking,
  onUpdateBookingStatus,
  onAcceptQuote,
  onPayBooking,
  onSubmitReview,
  onSubmitComplaint,
  selectedLocality,
  initialSelectedCategory,
  initialSelectedSubService,
  initialTab,
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState<
    'explore' | 'bookings' | 'recurring' | 'payments' | 'refunds' | 'notifications' | 'support' | 'account_deletion'
  >(initialTab || 'explore');

  // Keep internal activeTab in sync with external initialTab updates (e.g. from bottom navigation)
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabSwitch = (newTab: typeof activeTab) => {
    setActiveTab(newTab);
    if (onTabChange) {
      onTabChange(newTab);
    }
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [showExploreMap, setShowExploreMap] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(
    initialSelectedCategory ? categories.find(c => c.id === initialSelectedCategory) || null : null
  );

  // Saved Profile Address (persisted to localStorage)
  const [savedProfileAddress, setSavedProfileAddress] = useState<SavedAddress>(() => {
    try {
      const cached = localStorage.getItem('doit_saved_customer_profile_address');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return {
      label: 'Home Quarter',
      latitude: 23.2385,
      longitude: 77.4720,
      houseFlatNumber: 'Qtr No. 24/A, Type 2',
      address: 'Qtr No. 24/A, Type 2, Near Sector 1 Market',
      landmark: 'Near Sector Market & Dispensary',
      locality: 'BHEL Sector 1',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      pincode: '462022'
    };
  });

  const [isAddressManagerOpen, setIsAddressManagerOpen] = useState(false);

  // 8-Step Booking Request Flow Modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [bookingFormData, setBookingFormData] = useState({
    categoryId: 'gardener' as ServiceCategoryId,
    subService: 'Lawn Mowing & Weeding',
    requirementDescription: '',
    photos: [] as string[],
    locality: selectedLocality || 'Piplani',
    houseFlatNumber: 'Qtr No. 24/A, Type 2',
    address: 'Qtr No. 24/A, Type 2, BHEL Township',
    landmark: 'Near Sector Market & Dispensary',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    pincode: '462022',
    coordinates: { lat: 23.2385, lng: 77.4720 } as { lat: number; lng: number } | undefined,
    preferredDate: 'Tomorrow, 08 Sept',
    preferredTime: '10:00 AM',
    isFlexibleTime: true,
    recurringSchedule: 'One Time' as NonNullable<Booking['recurringSchedule']>,
    expectedBudget: 350
  });

  // Keep booking form locality in sync when customer pre-selects an area
  React.useEffect(() => {
    if (selectedLocality) {
      setBookingFormData(prev => ({
        ...prev,
        locality: selectedLocality
      }));
    }
  }, [selectedLocality]);

  const handleSaveProfileAddress = (addr: SavedAddress) => {
    setSavedProfileAddress(addr);
    try {
      localStorage.setItem('doit_saved_customer_profile_address', JSON.stringify(addr));
    } catch (e) {}
    setBookingFormData(prev => ({
      ...prev,
      locality: addr.locality,
      address: addr.address,
      landmark: addr.landmark,
      houseFlatNumber: addr.houseFlatNumber,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      coordinates: { lat: addr.latitude, lng: addr.longitude }
    }));
  };

  // Active tracking item
  const [trackedBookingId, setTrackedBookingId] = useState<string>(
    bookings[0]?.id || ''
  );

  // Review & Rating Modal state
  const [reviewModalBooking, setReviewModalBooking] = useState<Booking | null>(null);
  const [reviewForm, setReviewForm] = useState({
    stars: 5,
    quality: 5,
    punctuality: 5,
    professionalism: 5,
    behaviour: 5,
    feedbackText: 'Very punctual and skilled service in our BHEL quarter!'
  });

  // Complaint Modal state
  const [complaintModalBooking, setComplaintModalBooking] = useState<Booking | null>(null);
  const [complaintForm, setComplaintForm] = useState({
    category: 'Late Arrival',
    description: ''
  });

  const activeBooking = bookings.find(b => b.id === trackedBookingId) || bookings[0];
  const assignedProvider = providers.find(p => p.id === activeBooking?.assignedProviderId);

  // Open booking modal preselected
  const handleStartBooking = (cat: ServiceCategory, preselectedSubService?: string) => {
    setSelectedCategory(cat);
    setBookingFormData(prev => ({
      ...prev,
      categoryId: cat.id as ServiceCategoryId,
      subService: preselectedSubService || cat.subServices[0] || 'Garden Cleaning (बगीचे की सफाई)',
      expectedBudget: cat.startingPrice
    }));
    setBookingStep(1);
    setIsBookingModalOpen(true);
  };

  // Sync when initialSelectedCategory or initialSelectedSubService changes
  React.useEffect(() => {
    if (initialSelectedCategory) {
      const cat = categories.find(c => c.id === initialSelectedCategory);
      if (cat) {
        handleStartBooking(cat, initialSelectedSubService || undefined);
      }
    }
  }, [initialSelectedCategory, initialSelectedSubService, categories]);

  // Submit complete 8-step booking
  const handleCompleteBookingForm = () => {
    const newId = `DOIT-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking: Booking = {
      id: newId,
      customerId: 'CUST-CURRENT',
      customerName: 'Rohit Sharma (BHEL Resident)',
      customerPhone: '98260 99881',
      categoryId: bookingFormData.categoryId,
      subService: bookingFormData.subService,
      requirementDescription: bookingFormData.requirementDescription || `${bookingFormData.subService} requested in ${bookingFormData.locality}`,
      photos: bookingFormData.photos.length > 0 ? bookingFormData.photos : [
        categories.find(c => c.id === bookingFormData.categoryId)?.image || ''
      ],
      locality: bookingFormData.locality,
      address: bookingFormData.address,
      landmark: bookingFormData.landmark,
      houseFlatNumber: bookingFormData.houseFlatNumber,
      city: bookingFormData.city,
      state: bookingFormData.state,
      pincode: bookingFormData.pincode,
      coordinates: bookingFormData.coordinates,
      preferredDate: bookingFormData.preferredDate,
      preferredTime: bookingFormData.preferredTime,
      isFlexibleTime: bookingFormData.isFlexibleTime,
      recurringSchedule: bookingFormData.recurringSchedule,
      expectedBudget: Number(bookingFormData.expectedBudget),
      status: 'REQUESTED',
      timeline: [
        {
          timestamp: 'Just now',
          title: 'Booking Request Submitted',
          actor: 'Customer',
          description: `Requested ${bookingFormData.subService} at ${bookingFormData.locality}`
        },
        {
          timestamp: 'Just now',
          title: 'DOIT Matching Engine Triggered',
          actor: 'System',
          description: 'Shortlisting available verified providers in area'
        }
      ],
      createdAt: new Date().toISOString()
    };

    onNewBooking(newBooking);
    setIsBookingModalOpen(false);
    setTrackedBookingId(newId);
    setActiveTab('bookings');
  };

  const STATUS_STAGES: BookingStatus[] = [
    'REQUESTED',
    'PROVIDER_MATCHING',
    'QUOTE_GENERATED',
    'BOOKED',
    'PROVIDER_ON_THE_WAY',
    'ARRIVED',
    'SERVICE_STARTED',
    'SERVICE_COMPLETED',
    'CLOSED'
  ];

  const getStatusIndex = (st: BookingStatus) => {
    const idx = STATUS_STAGES.indexOf(st);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      
      {/* Customer Header & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Customer Services
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#e6faf6] text-[#00755f] border border-[#99ede0] text-xs font-semibold">
              BHEL Township
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Book local home services, approve transparent quotes, and track verified providers live.
          </p>
        </div>

        {/* Top Right: Average Response Badge & Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center items-start gap-2.5 sm:gap-3">
          {/* Average response < 8 mins badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e6faf6] text-[#00755f] border border-[#99ede0] text-xs font-semibold shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-[#00c29e]" />
            <span>Average response &lt; 8 mins</span>
          </div>

          {/* Minimal Navigation Tabs */}
          <div className="flex items-center gap-1 bg-zinc-100/90 p-1 rounded-xl border border-zinc-200/80 overflow-x-auto max-w-full scrollbar-thin">
            <button
              onClick={() => handleTabSwitch('explore')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'explore'
                  ? 'bg-white text-zinc-900 shadow-2xs border border-zinc-200/60'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Explore & Book
            </button>
            <button
              onClick={() => handleTabSwitch('bookings')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'bookings'
                  ? 'bg-white text-zinc-900 shadow-2xs border border-zinc-200/60'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <span>My Bookings</span>
              {bookings.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#00c29e] text-white text-[10px] font-bold flex items-center justify-center">
                  {bookings.length}
                </span>
              )}
            </button>
            <button
              onClick={() => handleTabSwitch('recurring')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'recurring'
                  ? 'bg-white text-zinc-900 shadow-2xs border border-zinc-200/60'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Recurring Plans
            </button>
            <button
              onClick={() => handleTabSwitch('payments')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'payments'
                  ? 'bg-white text-zinc-900 shadow-2xs border border-zinc-200/60'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Payments
            </button>
            <button
              onClick={() => handleTabSwitch('refunds')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'refunds'
                  ? 'bg-white text-zinc-900 shadow-2xs border border-zinc-200/60'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Refunds
            </button>
            <button
              onClick={() => handleTabSwitch('notifications')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-white text-zinc-900 shadow-2xs border border-zinc-200/60'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Alerts
            </button>
            <button
              onClick={() => handleTabSwitch('support')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'support'
                  ? 'bg-white text-zinc-900 shadow-2xs border border-zinc-200/60'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Support
            </button>
            <button
              onClick={() => handleTabSwitch('account_deletion')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'account_deletion'
                  ? 'bg-rose-50 text-rose-700 shadow-2xs border border-rose-200'
                  : 'text-zinc-500 hover:text-rose-600'
              }`}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Explore & Book */}
      {activeTab === 'explore' && (
        <div className="space-y-8">
          
          {/* Quick Search Banner — Minimal Light Aesthetic */}
          <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
            <div className="space-y-1">
              <span className="text-xs text-[#00c29e] font-bold uppercase tracking-wider">
                Hyperlocal Dispatch Ready
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900">What service does your home need today?</h2>
              <p className="text-xs text-zinc-500">
                Average provider matching within 6 minutes in BHEL Sectors 1–6.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="w-full md:w-72 relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500 z-10" />
                <Input
                  type="text"
                  placeholder="Search gardener, maid, painter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-full bg-white text-xs text-zinc-900 border-2 border-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-800 transition-all shadow-xs"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowExploreMap(!showExploreMap)}
                className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  showExploreMap
                    ? 'bg-[#00c29e] text-white border-[#00c29e] shadow-2xs'
                    : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                }`}
                title="Toggle BHEL Service Area Map"
              >
                <MapIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{showExploreMap ? 'Hide Map' : 'Map View'}</span>
              </button>
            </div>
          </div>

          {/* Customer Saved Address Strip */}
          <div className="p-3 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#e6faf6] border border-[#99ede0] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-[#00c29e]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-900 truncate">
                    {savedProfileAddress.houseFlatNumber || 'BHEL Quarter'} • {savedProfileAddress.locality}
                  </span>
                  <span className="text-[10px] font-semibold text-[#00755f] bg-[#e6faf6] px-1.5 py-0.5 rounded border border-[#99ede0]">
                    Profile Address
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 truncate">
                  {savedProfileAddress.address} {savedProfileAddress.landmark ? `(Near ${savedProfileAddress.landmark})` : ''} • GPS: {savedProfileAddress.latitude.toFixed(4)}, {savedProfileAddress.longitude.toFixed(4)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMapModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-[#e6faf6] text-zinc-700 hover:text-[#00755f] border border-zinc-200 hover:border-[#99ede0] font-semibold text-xs transition-colors cursor-pointer shrink-0"
            >
              <MapIcon className="w-3.5 h-3.5 text-[#00c29e]" />
              <span>Change on Map</span>
            </button>
          </div>

          {/* Interactive Provider Directory Map */}
          {showExploreMap && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>📍 Showing verified home service providers in BHEL Township Bhopal</span>
                <button
                  type="button"
                  onClick={() => setShowExploreMap(false)}
                  className="text-zinc-500 hover:text-zinc-800 underline cursor-pointer"
                >
                  Close Map
                </button>
              </div>
              <ProviderDirectoryMap
                providers={providers}
                categories={categories}
                onSelectCategoryForBooking={(catId) => {
                  const cat = categories.find(c => c.id === catId);
                  if (cat) handleStartBooking(cat);
                }}
                selectedLocality={selectedLocality}
              />
            </div>
          )}

          {/* Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories
              .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((cat) => (
                <div
                  key={cat.id}
                  className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-zinc-900">{cat.name}</span>
                      <span className="text-xs font-bold text-[#00755f]">
                        ₹{cat.startingPrice} <span className="text-[10px] text-zinc-400 font-normal">/ {cat.pricingModel}</span>
                      </span>
                    </div>

                    <p className="text-xs text-zinc-500 line-clamp-2">
                      {cat.shortDesc}
                    </p>

                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                        Included Services:
                      </span>
                      {cat.id === 'gardener' ? (
                        <button
                          type="button"
                          onClick={() => handleStartBooking(cat)}
                          className="w-full text-left py-1.5 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold transition-colors flex items-center justify-between cursor-pointer border border-emerald-200"
                        >
                          <span className="flex items-center gap-1.5">
                            <Trees className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>18 Services Included (माली की 18 सेवाएँ)</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        </button>
                      ) : cat.id === 'maid' ? (
                        <button
                          type="button"
                          onClick={() => handleStartBooking(cat)}
                          className="w-full text-left py-1.5 px-2.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-900 text-[11px] font-bold transition-colors flex items-center justify-between cursor-pointer border border-sky-200"
                        >
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                            <span>20 Cleaning Services (घर की 20 सफाई सेवाएँ)</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        </button>
                      ) : cat.id === 'caretaker' ? (
                        <button
                          type="button"
                          onClick={() => handleStartBooking(cat)}
                          className="w-full text-left py-1.5 px-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-bold transition-colors flex items-center justify-between cursor-pointer border border-amber-200"
                        >
                          <span className="flex items-center gap-1.5">
                            <HeartHandshake className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>17 Care Services (देखभाल की 17 सेवाएँ)</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        </button>
                      ) : cat.id === 'painter' ? (
                        <button
                          type="button"
                          onClick={() => handleStartBooking(cat)}
                          className="w-full text-left py-1.5 px-2.5 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-900 text-[11px] font-bold transition-colors flex items-center justify-between cursor-pointer border border-violet-200"
                        >
                          <span className="flex items-center gap-1.5">
                            <Paintbrush className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                            <span>18 Painting Services (पेंट करने की 18 सेवाएँ)</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                        </button>
                      ) : cat.id === 'pest_control' ? (
                        <button
                          type="button"
                          onClick={() => handleStartBooking(cat)}
                          className="w-full text-left py-1.5 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 text-[11px] font-bold transition-colors flex items-center justify-between cursor-pointer border border-rose-200"
                        >
                          <span className="flex items-center gap-1.5">
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>18 Pest Control Services (कीड़े-मकौड़ों से बचाव की 18 सेवाएँ)</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        </button>
                      ) : cat.id === 'sanitation' ? (
                        <button
                          type="button"
                          onClick={() => handleStartBooking(cat)}
                          className="w-full text-left py-1.5 px-2.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 text-[11px] font-bold transition-colors flex items-center justify-between cursor-pointer border border-teal-200"
                        >
                          <span className="flex items-center gap-1.5">
                            <Trash2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span>6 Sanitation Services (सफाई की 6 सेवाएँ)</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        </button>
                      ) : cat.id === 'labour' ? (
                        <button
                          type="button"
                          onClick={() => handleStartBooking(cat)}
                          className="w-full text-left py-1.5 px-2.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-900 text-[11px] font-bold transition-colors flex items-center justify-between cursor-pointer border border-orange-200"
                        >
                          <span className="flex items-center gap-1.5">
                            <Hammer className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                            <span>19 Labour Services (मजदूर की 19 सेवाएँ)</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                        </button>
                      ) : cat.id === 'helper' ? (
                        <button
                          type="button"
                          onClick={() => handleStartBooking(cat)}
                          className="w-full text-left py-1.5 px-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-bold transition-colors flex items-center justify-between cursor-pointer border border-amber-200"
                        >
                          <span className="flex items-center gap-1.5">
                            <HandHelping className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>9 Helper Services (मदद के 9 काम)</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        </button>
                      ) : cat.id === 'driver' ? (
                        <button
                          type="button"
                          onClick={() => handleStartBooking(cat)}
                          className="w-full text-left py-1.5 px-2.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-[11px] font-bold transition-colors flex items-center justify-between cursor-pointer border border-indigo-200"
                        >
                          <span className="flex items-center gap-1.5">
                            <Car className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span>20 Driver Services (ड्राइवर की 20 सेवाएँ)</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        </button>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {cat.subServices.slice(0, 3).map((sub, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleStartBooking(cat, sub)}
                              className="text-[10px] px-2 py-0.5 bg-zinc-100 hover:bg-[#00c29e]/10 hover:text-[#008f75] text-zinc-700 rounded-md transition-colors text-left cursor-pointer"
                            >
                              {sub}
                            </button>
                          ))}
                          {cat.subServices.length > 3 && (
                            <button
                              type="button"
                              onClick={() => handleStartBooking(cat)}
                              className="text-[10px] px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-md transition-colors cursor-pointer"
                            >
                              +{cat.subServices.length - 3} more
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      {cat.estimatedDuration}
                    </span>
                    <button
                      onClick={() => handleStartBooking(cat)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 hover:bg-[#00c29e] text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs border border-zinc-900 hover:border-[#00c29e]"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>

        </div>
      )}

      {/* Tab 2: Bookings & Live Tracking */}
      {activeTab === 'bookings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Bookings List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Service Requests ({bookings.length})
              </span>
              <button
                onClick={() => {
                  setSelectedCategory(categories[0]);
                  setIsBookingModalOpen(true);
                }}
                className="text-xs font-semibold text-[#00c29e] hover:text-[#00a889] flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Request</span>
              </button>
            </div>

            <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
              {bookings.map((b) => {
                const cat = categories.find(c => c.id === b.categoryId);
                const isSelected = b.id === trackedBookingId;
                return (
                  <div
                    key={b.id}
                    onClick={() => setTrackedBookingId(b.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                        : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${isSelected ? 'text-[#00c29e]' : 'text-zinc-900'}`}>
                            {b.id}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            b.status === 'SERVICE_COMPLETED' || b.status === 'CLOSED'
                              ? 'bg-[#e6faf6] text-[#00755f]'
                              : b.status === 'PROVIDER_ON_THE_WAY' || b.status === 'SERVICE_STARTED'
                              ? 'bg-blue-50 text-blue-800 animate-pulse'
                              : 'bg-zinc-100 text-zinc-800'
                          }`}>
                            {b.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold mt-1">
                          {cat?.name} • {b.subService}
                        </h4>
                        <p className={`text-xs mt-0.5 ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                          {b.locality} • {b.preferredDate} at {b.preferredTime}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-zinc-900'}`}>
                          ₹{b.quote ? b.quote.totalAmount : b.expectedBudget || 350}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Live Interactive Lifecycle Tracker */}
          {activeBooking && (
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs space-y-6">
                
                {/* Header of Active Booking */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-400">Booking Ref</span>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-900">
                        {activeBooking.id}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 mt-1">
                      {categories.find(c => c.id === activeBooking.categoryId)?.name} — {activeBooking.subService}
                    </h3>
                  </div>

                  {/* Simulator button */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const currIdx = STATUS_STAGES.indexOf(activeBooking.status);
                        if (currIdx < STATUS_STAGES.length - 1) {
                          onUpdateBookingStatus(activeBooking.id, STATUS_STAGES[currIdx + 1]);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f0fdf9] border border-[#99ede0] hover:bg-[#e6faf6] text-[#00755f] text-xs font-semibold transition-colors cursor-pointer"
                      title="Advance to next stage"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Simulate Status Advance</span>
                    </button>
                  </div>
                </div>

                {/* Stepper Progress Visual */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-800">
                    <span>Lifecycle Progress</span>
                    <span className="text-[#00c29e] uppercase tracking-wide">
                      {activeBooking.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#00c29e] h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(15, (getStatusIndex(activeBooking.status) + 1) / STATUS_STAGES.length * 100))}%`
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-zinc-400 pt-1">
                    <span>Requested</span>
                    <span>Provider Matched</span>
                    <span>Quote Approved</span>
                    <span>On The Way</span>
                    <span>Completed</span>
                  </div>
                </div>

                {/* Assigned Provider Card if assigned */}
                {assignedProvider && (
                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={assignedProvider.photo}
                        alt={assignedProvider.name}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-xl object-cover border border-zinc-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-zinc-900">{assignedProvider.name}</h4>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#e6faf6] text-[#00755f] font-semibold flex items-center gap-0.5 border border-[#99ede0]">
                            <ShieldCheck className="w-3 h-3 text-[#00c29e]" />
                            KYC Verified
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-500 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-0.5 text-zinc-700 font-semibold">
                            <Star className="w-3 h-3 fill-[#00c29e] text-[#00c29e]" />
                            {assignedProvider.rating} ({assignedProvider.completedJobsCount} jobs)
                          </span>
                          <span>•</span>
                          <span>{assignedProvider.phone}</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={`tel:${assignedProvider.phone}`}
                      className="p-2 rounded-xl bg-white border border-zinc-200 text-zinc-700 hover:text-[#00c29e] hover:border-[#00c29e] transition-colors shadow-2xs"
                      title="Call Provider"
                    >
                      <Phone className="w-4 h-4 text-[#00c29e]" />
                    </a>
                  </div>
                )}

                {/* Google Map Live Route & Quarter Tracking */}
                <div className="pt-1">
                  <LiveBookingTrackerMap
                    booking={activeBooking}
                    provider={assignedProvider}
                  />
                </div>

                {/* Job Completion OTP Box */}
                {(activeBooking.status === 'BOOKED' || activeBooking.status === 'PROVIDER_ON_THE_WAY' || activeBooking.status === 'ARRIVED' || activeBooking.status === 'SERVICE_STARTED') && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">JOB COMPLETION OTP</span>
                      <p className="text-xs text-emerald-950 font-medium mt-0.5">
                        Share this PIN with your partner only after work is satisfactorily finished:
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono text-xl font-black text-emerald-800 tracking-widest bg-white px-3.5 py-1.5 rounded-xl border border-emerald-300 shadow-2xs">
                        {activeBooking.completionOtp || '5824'}
                      </span>
                    </div>
                  </div>
                )}

                {/* 1. Quote review & approval */}
                {activeBooking.status === 'QUOTE_GENERATED' && activeBooking.quote && (
                  <div className="p-5 rounded-2xl bg-[#f0fdf9] border border-[#99ede0] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#00755f] uppercase tracking-wide">
                        Transparent Quotation from DOIT
                      </span>
                      <span className="text-sm font-black text-zinc-950">
                        Total ₹{activeBooking.quote.totalAmount}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-zinc-700 bg-white p-3 rounded-xl border border-[#99ede0]/60">
                      <div>
                        <span className="text-zinc-400 block text-[10px]">Labour</span>
                        <span className="font-semibold">₹{activeBooking.quote.labour}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block text-[10px]">Material</span>
                        <span className="font-semibold">₹{activeBooking.quote.material}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block text-[10px]">Travel Fee</span>
                        <span className="font-semibold">₹{activeBooking.quote.travelFee}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block text-[10px]">Discount</span>
                        <span className="font-semibold text-[#00755f]">-₹{activeBooking.quote.discount}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#00755f]">
                      <span className="font-semibold">Terms: </span>{activeBooking.quote.terms}
                    </p>

                    <button
                      onClick={() => onAcceptQuote(activeBooking.id)}
                      className="w-full py-2.5 rounded-xl bg-[#00c29e] hover:bg-[#00a889] text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                    >
                      Accept Quote & Confirm Booking
                    </button>
                  </div>
                )}

                {/* 2. Payment pending action */}
                {(activeBooking.status === 'BOOKED' || activeBooking.status === 'CUSTOMER_APPROVAL') && (
                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold text-zinc-900">Payment Option</div>
                      <p className="text-xs text-zinc-500">
                        Total Due: ₹{activeBooking.quote?.totalAmount || activeBooking.expectedBudget} • Choose instant UPI or Cash on arrival
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onPayBooking(activeBooking.id, 'UPI')}
                        className="px-3.5 py-2 rounded-xl bg-[#00c29e] hover:bg-[#00a889] text-white font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
                      >
                        Pay via UPI
                      </button>
                      <button
                        onClick={() => onPayBooking(activeBooking.id, 'Cash')}
                        className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Cash to Worker
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Rating & Confirmation on completion */}
                {activeBooking.status === 'SERVICE_COMPLETED' && !activeBooking.rating && (
                  <div className="p-5 rounded-2xl bg-[#f0fdf9] border border-[#99ede0] space-y-3">
                    <div className="flex items-center gap-2 text-[#00755f] font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-[#00c29e]" />
                      <span>The professional has marked this job completed.</span>
                    </div>
                    <p className="text-xs text-zinc-600">
                      Please confirm your satisfaction and submit a rating to release payout to the worker.
                    </p>
                    <button
                      onClick={() => setReviewModalBooking(activeBooking)}
                      className="px-4 py-2 rounded-xl bg-[#00c29e] hover:bg-[#00a889] text-white text-xs font-semibold cursor-pointer shadow-2xs"
                    >
                      Confirm Completion & Rate Service
                    </button>
                  </div>
                )}

                {/* 4. Display Existing Rating */}
                {activeBooking.rating && (
                  <div className="p-4 rounded-xl bg-[#f0fdf9] border border-[#99ede0] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-900">Your Feedback</span>
                      <div className="flex items-center gap-1 text-[#00c29e] font-bold">
                        <Star className="w-3.5 h-3.5 fill-[#00c29e]" />
                        <span>{activeBooking.rating.stars} / 5</span>
                      </div>
                    </div>
                    <p className="text-zinc-600 italic">"{activeBooking.rating.feedbackText}"</p>
                  </div>
                )}

                {/* Refund & Grievance trigger for completed bookings */}
                {(activeBooking.status === 'SERVICE_COMPLETED' || activeBooking.status === 'CLOSED') && (
                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between gap-3 text-xs">
                    <span className="text-zinc-600">Need a touch-up visit or dissatisfied with the service?</span>
                    <button
                      onClick={() => setActiveTab('refunds')}
                      className="font-bold text-rose-600 hover:text-rose-700 underline shrink-0 cursor-pointer"
                    >
                      Request Refund / Re-visit
                    </button>
                  </div>
                )}

                {/* Timeline Events Log */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                    Operational Timeline
                  </span>

                  <div className="space-y-2 border-l-2 border-zinc-200 pl-4 ml-1">
                    {activeBooking.timeline.map((ev, i) => (
                      <div key={i} className="relative space-y-0.5 text-xs">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#00c29e] border-2 border-white" />
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-900">{ev.title}</span>
                          <span className="text-[10px] text-zinc-400 font-mono">{ev.timestamp}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600">
                            {ev.actor}
                          </span>
                        </div>
                        {ev.description && (
                          <p className="text-[11px] text-zinc-500">{ev.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Issue / Complaint Button */}
                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Need coordinator assistance with this booking?</span>
                  <button
                    onClick={() => setComplaintModalBooking(activeBooking)}
                    className="text-zinc-600 hover:text-rose-600 font-semibold cursor-pointer transition-colors"
                  >
                    Report an Issue
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* Tab 3: Recurring Services */}
      {activeTab === 'recurring' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#f0fdf9] border border-[#99ede0] text-zinc-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[#00755f]">
              <Sparkles className="w-4 h-4 text-[#00c29e]" />
              <span>DOIT Routine Care Plans in BHEL</span>
            </div>
            <p className="text-xs text-zinc-600 max-w-2xl leading-relaxed">
              Never worry about finding home help repeatedly. Schedule regular gardener visits every Sunday, daily maid shifts (Mon–Sat), or monthly vacant bungalow inspections with dedicated verified professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Recurring Card 1 */}
            <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#e6faf6] text-[#00755f] border border-[#99ede0]">
                  Gardener • Weekly
                </span>
                <span className="text-xs font-bold text-zinc-900">₹1,200/mo</span>
              </div>
              <h4 className="font-bold text-sm text-zinc-900">Sunday Garden Maintenance</h4>
              <p className="text-xs text-zinc-500">
                Weekly visit for pruning, plant feeding, weeding, and balcony potted plant care.
              </p>
              <button
                onClick={() => {
                  const cat = categories.find(c => c.id === 'gardener') || categories[0];
                  handleStartBooking(cat);
                }}
                className="w-full py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-[#00c29e] transition-colors cursor-pointer"
              >
                Setup Weekly Schedule
              </button>
            </div>

            {/* Recurring Card 2 */}
            <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                  Domestic Maid • Daily
                </span>
                <span className="text-xs font-bold text-zinc-900">₹2,200/mo</span>
              </div>
              <h4 className="font-bold text-sm text-zinc-900">Morning Household Routine</h4>
              <p className="text-xs text-zinc-500">
                6 days a week sweeping, mopping, utensil washing, and kitchen counter scrubbing.
              </p>
              <button
                onClick={() => {
                  const cat = categories.find(c => c.id === 'maid') || categories[0];
                  handleStartBooking(cat);
                }}
                className="w-full py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-[#00c29e] transition-colors cursor-pointer"
              >
                Setup Monthly Routine
              </button>
            </div>

            {/* Recurring Card 3 */}
            <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200">
                  Caretaker • Bi-Weekly
                </span>
                <span className="text-xs font-bold text-zinc-900">₹800/mo</span>
              </div>
              <h4 className="font-bold text-sm text-zinc-900">Vacant Quarter Inspection</h4>
              <p className="text-xs text-zinc-500">
                Lock checks, plant watering, letter box check, and post-monsoon damp inspection.
              </p>
              <button
                onClick={() => {
                  const cat = categories.find(c => c.id === 'caretaker') || categories[0];
                  handleStartBooking(cat);
                }}
                className="w-full py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-[#00c29e] transition-colors cursor-pointer"
              >
                Setup Caretaker Checks
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Tab: Payments & Receipts */}
      {activeTab === 'payments' && (
        <CustomerPaymentsTab bookings={bookings} />
      )}

      {/* Tab: Refunds & Disputes */}
      {activeTab === 'refunds' && (
        <CustomerRefundsTab bookings={bookings} />
      )}

      {/* Tab: Alerts & Notifications */}
      {activeTab === 'notifications' && (
        <CustomerNotificationsTab />
      )}

      {/* Tab: Township Resident Support Desk */}
      {activeTab === 'support' && (
        <CustomerSupportTab />
      )}

      {/* Tab: Account Deletion Request */}
      {activeTab === 'account_deletion' && (
        <CustomerAccountDeletionTab bookings={bookings} />
      )}

      {/* 8-Step Structured Booking Modal */}
      {isBookingModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto shadow-2xl border border-zinc-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#00c29e] uppercase tracking-wide">
                    Step {bookingStep} of 8
                  </span>
                  <span className="text-zinc-300">•</span>
                  <span className="text-xs text-zinc-500 font-medium">{selectedCategory.name}</span>
                </div>
                <h3 className="text-base font-bold text-zinc-900">
                  {bookingStep === 1 && 'Select Specific Sub-Service'}
                  {bookingStep === 2 && 'Describe Your Requirement'}
                  {bookingStep === 3 && 'Upload Reference Photos (Optional)'}
                  {bookingStep === 4 && 'Service Address in BHEL, Bhopal'}
                  {bookingStep === 5 && 'Select Preferred Date'}
                  {bookingStep === 6 && 'Preferred Time Slot & Flexibility'}
                  {bookingStep === 7 && 'Frequency & Expected Budget'}
                  {bookingStep === 8 && 'Review & Submit Booking'}
                </h3>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Sub-service */}
            {bookingStep === 1 && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-zinc-700 block">Choose the specific task you need:</label>
                  <span className="text-[11px] text-zinc-500">{selectedCategory.subServices.length} options</span>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {selectedCategory.subServices.map((sub, idx) => (
                    <div
                      key={idx}
                      onClick={() => setBookingFormData({ ...bookingFormData, subService: sub })}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        bookingFormData.subService === sub
                          ? 'border-[#00c29e] bg-[#f0fdf9] font-bold text-zinc-900 ring-1 ring-[#00c29e]'
                          : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                          bookingFormData.subService === sub ? 'bg-[#00c29e] text-white' : 'bg-zinc-100 text-zinc-600'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="leading-snug">{sub}</span>
                      </div>
                      {bookingFormData.subService === sub && (
                        <CheckCircle2 className="w-4 h-4 text-[#00c29e] shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Requirement Description */}
            {bookingStep === 2 && (
              <div className="space-y-3 text-xs">
                <label className="font-semibold text-zinc-700 block">
                  Describe what needs to be done in detail:
                </label>
                <textarea
                  rows={4}
                  placeholder="Example: Need lawn mowing, front garden hedge trimming, and clearing fallen neem leaves in BHEL quarter..."
                  value={bookingFormData.requirementDescription}
                  onChange={(e) => setBookingFormData({ ...bookingFormData, requirementDescription: e.target.value })}
                  className="w-full p-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#00c29e]"
                />
                <p className="text-[11px] text-zinc-400">
                  This description is shared with short-listed professionals so they prepare necessary equipment.
                </p>
              </div>
            )}

            {/* Step 3: Photos */}
            {bookingStep === 3 && (
              <div className="space-y-4 text-xs">
                <label className="font-semibold text-zinc-700 block">
                  Attach photos of the work area:
                </label>
                <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-6 text-center space-y-2 bg-zinc-50">
                  <Camera className="w-8 h-8 mx-auto text-zinc-400" />
                  <p className="text-zinc-600 font-medium">Add photos of your wall, lawn, or rooms</p>
                  <button
                    type="button"
                    onClick={() => {
                      setBookingFormData({
                        ...bookingFormData,
                        photos: [selectedCategory.image]
                      });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-[11px] font-semibold cursor-pointer"
                  >
                    Simulate Attach Work Photo
                  </button>
                </div>
                {bookingFormData.photos.length > 0 && (
                  <div className="flex gap-2">
                    <img
                      src={bookingFormData.photos[0]}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border border-zinc-200"
                    />
                    <div className="text-[11px] text-zinc-500 self-center">
                      1 reference photo attached
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Address in BHEL Bhopal */}
            {bookingStep === 4 && (
              <div className="space-y-3.5 text-xs">
                
                {/* Saved Profile Address Quick Selection */}
                {savedProfileAddress && (
                  <div className="p-3 rounded-xl bg-[#f0fdf9] border border-[#99ede0] flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-[#00755f] uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#00c29e]" />
                        Saved Profile Address
                      </span>
                      <p className="font-semibold text-zinc-900 text-xs">
                        {savedProfileAddress.houseFlatNumber || savedProfileAddress.address}, {savedProfileAddress.locality}
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        {savedProfileAddress.landmark ? `Landmark: ${savedProfileAddress.landmark} • ` : ''}
                        {savedProfileAddress.latitude.toFixed(4)}° N, {savedProfileAddress.longitude.toFixed(4)}° E
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setBookingFormData(prev => ({
                          ...prev,
                          locality: savedProfileAddress.locality,
                          houseFlatNumber: savedProfileAddress.houseFlatNumber,
                          address: savedProfileAddress.address,
                          landmark: savedProfileAddress.landmark,
                          city: savedProfileAddress.city,
                          state: savedProfileAddress.state,
                          pincode: savedProfileAddress.pincode,
                          coordinates: { lat: savedProfileAddress.latitude, lng: savedProfileAddress.longitude }
                        }));
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#00c29e] hover:bg-[#00a889] text-white font-bold text-[11px] whitespace-nowrap cursor-pointer shadow-2xs"
                    >
                      Use Saved
                    </button>
                  </div>
                )}

                {/* Map Pinpoint CTA */}
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-zinc-900 flex items-center gap-1.5">
                      <MapIcon className="w-4 h-4 text-[#00c29e]" />
                      Interactive Leaflet Map
                    </span>
                    <p className="text-[11px] text-zinc-500">
                      Search quarter or drag marker to set exact service location in BHEL Bhopal.
                    </p>
                    {bookingFormData.coordinates && (
                      <span className="inline-block mt-1 text-[10px] font-mono font-semibold text-[#00755f] bg-white px-2 py-0.5 rounded border border-[#99ede0]">
                        GPS: {bookingFormData.coordinates.lat.toFixed(5)}, {bookingFormData.coordinates.lng.toFixed(5)}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsMapModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-[#00c29e] text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs shrink-0"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Open Interactive Map</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700">Locality / Sector *</label>
                    <select
                      value={bookingFormData.locality}
                      onChange={(e) => setBookingFormData({ ...bookingFormData, locality: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-900"
                    >
                      {/* If custom locality not in the standard list, render it at top */}
                      {![
                        'Piplani', 'Barkhera', 'Govindpura', 'A-Sector', 'B-Sector', 'C-Sector', 'D-Sector', 'E-Sector', 'F-Sector', 'Other Township Area',
                        'Awadhpuri', 'Barkheda Pathani', 'Anand Nagar', 'Ayodhya Nagar', 'Indrapuri', 'Kalpana Nagar', 'Laharpur', 'Other Nearby Area',
                        'BHEL Sector 1', 'BHEL Sector 2', 'BHEL Sector 3', 'BHEL Sector 4', 'BHEL Sector 5', 'BHEL Sector 6'
                      ].includes(bookingFormData.locality) && (
                        <option value={bookingFormData.locality}>{bookingFormData.locality}</option>
                      )}
                      
                      <optgroup label="BHEL Township (Primary Zone)">
                        <option value="Piplani">Piplani</option>
                        <option value="Barkhera">Barkhera</option>
                        <option value="Govindpura">Govindpura</option>
                        <option value="A-Sector">A-Sector</option>
                        <option value="B-Sector">B-Sector</option>
                        <option value="C-Sector">C-Sector</option>
                        <option value="D-Sector">D-Sector</option>
                        <option value="E-Sector">E-Sector</option>
                        <option value="F-Sector">F-Sector</option>
                        <option value="Other Township Area">Other Township Area</option>
                      </optgroup>

                      <optgroup label="Nearby Areas (Extended Zone)">
                        <option value="Awadhpuri">Awadhpuri</option>
                        <option value="Barkheda Pathani">Barkheda Pathani</option>
                        <option value="Anand Nagar">Anand Nagar</option>
                        <option value="Ayodhya Nagar">Ayodhya Nagar</option>
                        <option value="Indrapuri">Indrapuri</option>
                        <option value="Kalpana Nagar">Kalpana Nagar</option>
                        <option value="Laharpur">Laharpur</option>
                        <option value="Other Nearby Area">Other Nearby Area</option>
                      </optgroup>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700">Quarter / House / Flat No. *</label>
                    <input
                      type="text"
                      placeholder="e.g. Qtr No. 42/B, Type 3"
                      value={bookingFormData.houseFlatNumber}
                      onChange={(e) => setBookingFormData({ ...bookingFormData, houseFlatNumber: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-zinc-200"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">Street / Area Address *</label>
                  <input
                    type="text"
                    placeholder="e.g. Street 4, Near Sector Market, BHEL Township"
                    value={bookingFormData.address}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, address: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-zinc-200"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700">Landmark</label>
                    <input
                      type="text"
                      placeholder="e.g. Near Community Hall / Post Office"
                      value={bookingFormData.landmark}
                      onChange={(e) => setBookingFormData({ ...bookingFormData, landmark: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-zinc-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700">City & Pincode</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={bookingFormData.city}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, city: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-zinc-200 bg-zinc-50"
                        placeholder="City"
                      />
                      <input
                        type="text"
                        value={bookingFormData.pincode}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, pincode: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-zinc-200 bg-zinc-50"
                        placeholder="Pincode"
                      />
                    </div>
                  </div>
                </div>

                {/* Save to profile address option */}
                <div className="pt-1 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      handleSaveProfileAddress({
                        id: 'SAVED-ADDR-PROFILE',
                        latitude: bookingFormData.coordinates?.lat || 23.2385,
                        longitude: bookingFormData.coordinates?.lng || 77.4720,
                        houseFlatNumber: bookingFormData.houseFlatNumber,
                        address: bookingFormData.address,
                        landmark: bookingFormData.landmark,
                        locality: bookingFormData.locality,
                        city: bookingFormData.city || 'Bhopal',
                        state: bookingFormData.state || 'Madhya Pradesh',
                        pincode: bookingFormData.pincode || '462022'
                      });
                      alert('Address saved to your customer profile!');
                    }}
                    className="text-xs text-[#00755f] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00c29e]" />
                    <span>Save this address as my primary profile address</span>
                  </button>
                </div>

              </div>
            )}

            {/* Step 5: Preferred Date */}
            {bookingStep === 5 && (
              <div className="space-y-3 text-xs">
                <label className="font-semibold text-zinc-700 block">Select Preferred Date:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Today (Immediate)',
                    'Tomorrow, 08 Sept',
                    'Wednesday, 09 Sept',
                    'This Weekend (Saturday)'
                  ].map((dt, idx) => (
                    <div
                      key={idx}
                      onClick={() => setBookingFormData({ ...bookingFormData, preferredDate: dt })}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        bookingFormData.preferredDate === dt
                          ? 'border-[#00c29e] bg-[#f0fdf9] font-bold text-zinc-900 ring-1 ring-[#00c29e]'
                          : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                      }`}
                    >
                      <span>{dt}</span>
                      {bookingFormData.preferredDate === dt && (
                        <CheckCircle2 className="w-4 h-4 text-[#00c29e] shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Preferred Time */}
            {bookingStep === 6 && (
              <div className="space-y-4 text-xs">
                <label className="font-semibold text-zinc-700 block">Select Time Slot:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    '07:00 AM - 09:00 AM',
                    '09:00 AM - 12:00 PM',
                    '12:00 PM - 03:00 PM',
                    '03:00 PM - 06:00 PM',
                    '06:00 PM - 08:00 PM'
                  ].map((tm, idx) => (
                    <div
                      key={idx}
                      onClick={() => setBookingFormData({ ...bookingFormData, preferredTime: tm })}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        bookingFormData.preferredTime === tm
                          ? 'border-[#00c29e] bg-[#f0fdf9] font-bold text-zinc-900 ring-1 ring-[#00c29e]'
                          : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                      }`}
                    >
                      <span>{tm}</span>
                      {bookingFormData.preferredTime === tm && (
                        <CheckCircle2 className="w-4 h-4 text-[#00c29e] shrink-0" />
                      )}
                    </div>
                  ))}
                </div>

                <label className="flex items-center gap-2 text-zinc-700 pt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bookingFormData.isFlexibleTime}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, isFlexibleTime: e.target.checked })}
                    className="rounded text-[#00c29e] accent-[#00c29e]"
                  />
                  <span>Flexible with timing (+/- 1 hour if professional is nearby)</span>
                </label>
              </div>
            )}

            {/* Step 7: Frequency & Budget */}
            {bookingStep === 7 && (
              <div className="space-y-4 text-xs">
                <div className="space-y-2">
                  <label className="font-semibold text-zinc-700 block">Service Frequency:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['One Time', 'Weekly', 'Every 2 Weeks', 'Monthly'] as const).map((fr, idx) => (
                      <div
                        key={idx}
                        onClick={() => setBookingFormData({ ...bookingFormData, recurringSchedule: fr })}
                        className={`p-2.5 rounded-xl border cursor-pointer text-center ${
                          bookingFormData.recurringSchedule === fr
                            ? 'border-[#00c29e] bg-[#f0fdf9] font-bold text-zinc-900 ring-1 ring-[#00c29e]'
                            : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                        }`}
                      >
                        {fr}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="font-semibold text-zinc-700 block">
                    Estimated / Target Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={bookingFormData.expectedBudget}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, expectedBudget: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-zinc-200"
                  />
                  <p className="text-[11px] text-zinc-400">
                    Baseline rate is ₹{selectedCategory.startingPrice} for {selectedCategory.name}. Final quote is presented before job starts.
                  </p>
                </div>
              </div>
            )}

            {/* Step 8: Review & Submit */}
            {bookingStep === 8 && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2">
                  <div className="flex justify-between font-bold text-sm text-zinc-900 pb-2 border-b border-zinc-200">
                    <span>{selectedCategory.name}</span>
                    <span>₹{bookingFormData.expectedBudget} estimated</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-zinc-600 pt-1">
                    <div>
                      <span className="text-[10px] text-zinc-400 block">Task</span>
                      <span className="font-medium text-zinc-800">{bookingFormData.subService}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block">Frequency</span>
                      <span className="font-medium text-zinc-800">{bookingFormData.recurringSchedule}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block">Location</span>
                      <span className="font-medium text-zinc-800">{bookingFormData.locality}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block">Date & Time</span>
                      <span className="font-medium text-zinc-800">{bookingFormData.preferredDate} ({bookingFormData.preferredTime})</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#f0fdf9] rounded-xl border border-[#99ede0] text-[#00755f] text-[11px] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#00c29e] shrink-0" />
                  <span>DOIT matches only verified local workers. You pay nothing until the quote is approved.</span>
                </div>
              </div>
            )}

            {/* Modal Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-200">
              {bookingStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setBookingStep(bookingStep - 1)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 text-zinc-700 text-xs font-semibold hover:bg-zinc-50 cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {bookingStep < 8 ? (
                <button
                  type="button"
                  onClick={() => setBookingStep(bookingStep + 1)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-[#00c29e] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCompleteBookingForm}
                  className="px-6 py-2.5 rounded-full bg-[#00c29e] hover:bg-[#00a889] text-white font-bold text-xs transition-colors cursor-pointer shadow-md flex items-center gap-1.5 border border-[#00a889]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Book Now</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Review & Rating Modal */}
      {reviewModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-zinc-200">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
              <h3 className="font-bold text-sm text-zinc-900">Rate Service Quality</h3>
              <button onClick={() => setReviewModalBooking(null)} className="p-1 text-zinc-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="text-center space-y-1 py-2">
                <span className="text-zinc-500 text-[11px]">Overall Rating</span>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, stars: st })}
                      className="cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          st <= reviewForm.stars
                            ? 'text-[#00c29e] fill-[#00c29e]'
                            : 'text-zinc-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Comments & Feedback:</label>
                <textarea
                  rows={3}
                  value={reviewForm.feedbackText}
                  onChange={(e) => setReviewForm({ ...reviewForm, feedbackText: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#00c29e] focus:outline-none"
                />
              </div>

              <button
                onClick={() => {
                  onSubmitReview(reviewModalBooking.id, {
                    stars: reviewForm.stars,
                    quality: reviewForm.quality,
                    punctuality: reviewForm.punctuality,
                    professionalism: reviewForm.professionalism,
                    behaviour: reviewForm.behaviour,
                    feedbackText: reviewForm.feedbackText
                  });
                  setReviewModalBooking(null);
                }}
                className="w-full py-2.5 rounded-xl bg-[#00c29e] text-white font-bold text-xs hover:bg-[#00a889] transition-colors cursor-pointer shadow-2xs"
              >
                Submit Verified Rating
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complaint Modal */}
      {complaintModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-zinc-200">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
              <h3 className="font-bold text-sm text-zinc-900">Report an Issue (#{complaintModalBooking.id})</h3>
              <button onClick={() => setComplaintModalBooking(null)} className="p-1 text-zinc-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Issue Category:</label>
                <select
                  value={complaintForm.category}
                  onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 bg-white"
                >
                  <option value="Late Arrival">Provider Late Arrival</option>
                  <option value="Provider Did Not Arrive">Provider Did Not Arrive</option>
                  <option value="Poor Quality">Work Quality Not as Expected</option>
                  <option value="Wrong Price">Dispute Regarding Price</option>
                  <option value="Behaviour Issue">Behaviour Issue</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Describe What Happened:</label>
                <textarea
                  rows={3}
                  value={complaintForm.description}
                  onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                  placeholder="Explain the issue..."
                  className="w-full p-2.5 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#00c29e] focus:outline-none"
                />
              </div>

              <button
                onClick={() => {
                  onSubmitComplaint(complaintModalBooking.id, {
                    id: `CMP-${Date.now().toString().slice(-4)}`,
                    category: complaintForm.category,
                    description: complaintForm.description || 'Customer reported issue regarding booking',
                    status: 'OPEN'
                  });
                  setComplaintModalBooking(null);
                }}
                className="w-full py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors cursor-pointer shadow-2xs"
              >
                Submit to Operations Desk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leaflet + OpenStreetMap Location Picker Modal */}
      <LocationSelectorMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        selectedLocality={bookingFormData.locality}
        initialAddress={savedProfileAddress}
        onSelectLocality={(locality) => {
          setBookingFormData(prev => ({
            ...prev,
            locality
          }));
        }}
        onSaveFullAddress={(savedAddr) => {
          handleSaveProfileAddress(savedAddr);
        }}
      />

    </div>
  );
};
