import React, { useState } from 'react';
import { 
  Provider, 
  Booking, 
  BookingStatus 
} from '../../types/doit';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Star, 
  ShieldCheck, 
  DollarSign, 
  Camera, 
  AlertTriangle,
  Navigation,
  Check,
  X,
  UserCheck,
  Map as MapIcon
} from 'lucide-react';
import { ProviderJobsMap } from '../maps/ProviderJobsMap';
import { ServiceLocationMap } from '../maps/ServiceLocationMap';
import { openDeviceNavigation, BHEL_BHOPAL_CENTER } from '../maps/leafletUtils';
import { ProviderEarningsLedger } from './ProviderEarningsLedger';
import { ProviderOffboardingTab } from './ProviderOffboardingTab';

interface ProviderAppProps {
  providers: Provider[];
  activeProviderId: string;
  onSelectProvider: (providerId: string) => void;
  bookings: Booking[];
  onAcceptJob: (bookingId: string) => void;
  onRejectJob: (bookingId: string) => void;
  onUpdateJobStatus: (bookingId: string, nextStatus: BookingStatus) => void;
  onUploadJobPhoto: (bookingId: string, type: 'before' | 'after', url: string) => void;
}

export const ProviderApp: React.FC<ProviderAppProps> = ({
  providers,
  activeProviderId,
  onSelectProvider,
  bookings,
  onAcceptJob,
  onRejectJob,
  onUpdateJobStatus,
  onUploadJobPhoto,
}) => {
  const activeProvider = providers.find(p => p.id === activeProviderId) || providers[0];
  const [activeTab, setActiveTab] = useState<'jobs' | 'map' | 'earnings' | 'kyc' | 'offboarding'>('jobs');
  const [expandedMapJobId, setExpandedMapJobId] = useState<string | null>(null);
  const [completingJob, setCompletingJob] = useState<Booking | null>(null);
  const [completionOtpInput, setCompletionOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');

  // Provider's active job
  const assignedJobs = bookings.filter(b => b.assignedProviderId === activeProvider.id);
  const unassignedJobs = bookings.filter(b => 
    (b.status === 'REQUESTED' || b.status === 'PROVIDER_MATCHING') &&
    activeProvider.categories.includes(b.categoryId)
  );

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      
      {/* Top Bar: Provider Profile & Persona Switcher */}
      <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Profile Card */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={activeProvider.photo}
              alt={activeProvider.name}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-2xl object-cover border border-zinc-200"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#00c29e] border-2 border-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-zinc-900">{activeProvider.name}</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#e6faf6] text-[#00755f] font-semibold border border-[#99ede0]">
                {activeProvider.kycStatus === 'VERIFIED' ? 'Police Verified' : 'Under Review'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 mt-1">
              <span className="flex items-center gap-1 text-zinc-800 font-semibold">
                <Star className="w-3.5 h-3.5 fill-[#00c29e] text-[#00c29e]" />
                {activeProvider.rating} ({activeProvider.completedJobsCount} jobs)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                {activeProvider.residentialLocality || activeProvider.locality}
              </span>
              <span>•</span>
              <span className="text-zinc-600">{activeProvider.skills.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Persona Switcher & Navigation Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          {/* Persona Switcher */}
          <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl text-xs w-full sm:w-auto">
            <span className="text-zinc-400 text-[10px] uppercase font-bold pl-2">Switch Worker:</span>
            {providers.slice(0, 3).map((p) => (
              <button
                key={p.id}
                onClick={() => onSelectProvider(p.id)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  p.id === activeProvider.id
                    ? 'bg-white text-zinc-900 shadow-2xs font-bold'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl text-xs border border-zinc-200/80">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'jobs' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500'
              }`}
            >
              Job Deck
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'map' ? 'bg-[#00c29e] text-white shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Dispatch Map</span>
              <span className={`text-[9px] px-1 rounded-full font-bold ${
                activeTab === 'map' ? 'bg-white text-[#00c29e]' : 'bg-[#e6faf6] text-[#00755f]'
              }`}>
                {assignedJobs.length + unassignedJobs.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('earnings')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'earnings' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500'
              }`}
            >
              Earnings
            </button>
            <button
              onClick={() => setActiveTab('kyc')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'kyc' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500'
              }`}
            >
              KYC Doc
            </button>
            <button
              onClick={() => setActiveTab('offboarding')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'offboarding' ? 'bg-rose-50 text-rose-700 shadow-2xs border border-rose-200' : 'text-zinc-500 hover:text-rose-600'
              }`}
            >
              Offboard
            </button>
          </div>
        </div>

      </div>

      {/* Tab 1: Job Deck (Incoming Dispatches & Active On-Site Jobs) */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          
          {/* Dispatch Map Quick Action Banner */}
          <div className="p-4 rounded-2xl bg-[#f0fdf9] border border-[#99ede0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#00c29e] flex items-center justify-center border border-[#99ede0] shadow-2xs shrink-0">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">BHEL Hyperlocal Dispatch & Navigation Map</h4>
                <p className="text-xs text-zinc-600">
                  {assignedJobs.length} assigned job{assignedJobs.length === 1 ? '' : 's'} • {unassignedJobs.length} new nearby request{unassignedJobs.length === 1 ? '' : 's'} across BHEL sectors.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('map')}
              className="px-4 py-2 rounded-xl bg-[#00c29e] hover:bg-[#00a889] text-white text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Open Live Dispatch Map</span>
            </button>
          </div>

          {/* Performance Overview Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-zinc-200/80 shadow-2xs">
              <span className="text-[11px] text-zinc-400 font-medium">Assigned Jobs</span>
              <div className="text-xl font-bold text-zinc-900 mt-1">{assignedJobs.length}</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-zinc-200/80 shadow-2xs">
              <span className="text-[11px] text-zinc-400 font-medium">New Requests Nearby</span>
              <div className="text-xl font-bold text-[#00755f] mt-1">{unassignedJobs.length}</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-zinc-200/80 shadow-2xs">
              <span className="text-[11px] text-zinc-400 font-medium">Customer Rating</span>
              <div className="text-xl font-bold text-zinc-900 mt-1 flex items-center gap-1">
                <Star className="w-4 h-4 fill-[#00c29e] text-[#00c29e]" />
                {activeProvider.rating}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-zinc-200/80 shadow-2xs">
              <span className="text-[11px] text-zinc-400 font-medium">This Month Net Payout</span>
              <div className="text-xl font-bold text-zinc-900 mt-1">
                ₹{activeProvider.earningsThisMonth.netPayout.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* New Incoming Job Dispatches */}
          {unassignedJobs.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00c29e] animate-ping" />
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">
                  Incoming Job Requests Nearby ({unassignedJobs.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unassignedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-5 rounded-2xl bg-white border border-[#99ede0] shadow-2xs space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#00755f] bg-[#e6faf6] px-2 py-0.5 rounded">
                          {job.id}
                        </span>
                        <h4 className="font-bold text-sm text-zinc-900 mt-1">{job.subService}</h4>
                        <p className="text-xs text-zinc-500">{job.locality} • {job.address}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-zinc-400 block">Est. Payout</span>
                        <span className="text-base font-bold text-zinc-900">
                          ₹{job.expectedBudget ? Math.round(job.expectedBudget * 0.9) : 315}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-50 text-xs text-zinc-600 border border-zinc-100">
                      <span className="font-semibold text-zinc-700 block mb-0.5">Customer Requirement:</span>
                      {job.requirementDescription}
                    </div>

                    <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
                      <span>Preferred: {job.preferredDate} ({job.preferredTime})</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onRejectJob(job.id)}
                          className="px-3 py-1.5 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-xs font-semibold cursor-pointer"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => onAcceptJob(job.id)}
                          className="px-4 py-1.5 rounded-xl bg-[#00c29e] hover:bg-[#00a889] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                        >
                          Accept Job
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Assigned Jobs & Execution Workflow */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">
              Active Assigned Work ({assignedJobs.length})
            </h3>

            {assignedJobs.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-zinc-200 text-zinc-400 text-xs">
                No active jobs currently in execution. Check new incoming dispatches above.
              </div>
            ) : (
              <div className="space-y-6">
                {assignedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs space-y-6"
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-zinc-500">{job.id}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-[#e6faf6] text-[#00755f]">
                            {job.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-zinc-900 mt-1">{job.subService}</h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const lat = job.coordinates?.lat ?? BHEL_BHOPAL_CENTER.lat;
                            const lng = job.coordinates?.lng ?? BHEL_BHOPAL_CENTER.lng;
                            openDeviceNavigation(lat, lng, `${job.customerName} - ${job.address}`);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00c29e] hover:bg-[#00a889] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                          title="Open native turn-by-turn navigation in device app"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Start Navigation</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setExpandedMapJobId(expandedMapJobId === job.id ? null : job.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#e6faf6] text-[#00755f] hover:bg-[#d0f5ee] border border-[#99ede0] text-xs font-semibold cursor-pointer"
                        >
                          <MapIcon className="w-3.5 h-3.5" />
                          <span>{expandedMapJobId === job.id ? 'Hide Map' : 'Show Map'}</span>
                        </button>

                        <a
                          href={`tel:${job.customerPhone}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 text-zinc-800 hover:bg-zinc-200 text-xs font-semibold cursor-pointer"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#00c29e]" />
                          <span>Call ({job.customerName.split(' ')[0]})</span>
                        </a>
                      </div>
                    </div>

                    {/* Address & Navigation Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">Customer & Location:</span>
                        <div className="font-semibold text-zinc-900">{job.customerName}</div>
                        <div className="text-zinc-600">{job.address}, {job.locality}</div>
                        <div className="text-zinc-400 text-[11px]">Landmark: {job.landmark}</div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">Schedule & Instructions:</span>
                        <div className="font-semibold text-zinc-900">{job.preferredDate} ({job.preferredTime})</div>
                        <div className="text-zinc-600 line-clamp-2">{job.requirementDescription}</div>
                      </div>
                    </div>

                    {/* Embedded Service Location Map */}
                    {expandedMapJobId === job.id && (
                      <div className="pt-2">
                        <ServiceLocationMap
                          booking={job}
                          provider={activeProvider}
                          height="260px"
                          showNavigationButton={true}
                        />
                      </div>
                    )}

                    {/* Step-by-Step On-Site Action Stepper */}
                    <div className="space-y-3 pt-2">
                      <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
                        On-Site Job Execution Controls
                      </span>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {/* 1. On the way */}
                        <button
                          onClick={() => onUpdateJobStatus(job.id, 'PROVIDER_ON_THE_WAY')}
                          disabled={job.status === 'PROVIDER_ON_THE_WAY' || job.status === 'ARRIVED' || job.status === 'SERVICE_STARTED' || job.status === 'SERVICE_COMPLETED'}
                          className={`p-3 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                            job.status === 'PROVIDER_ON_THE_WAY'
                              ? 'bg-[#00c29e] text-white border-[#00c29e] shadow-2xs'
                              : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed'
                          }`}
                        >
                          1. On The Way
                        </button>

                        {/* 2. Mark Arrived */}
                        <button
                          onClick={() => onUpdateJobStatus(job.id, 'ARRIVED')}
                          disabled={job.status === 'ARRIVED' || job.status === 'SERVICE_STARTED' || job.status === 'SERVICE_COMPLETED'}
                          className={`p-3 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                            job.status === 'ARRIVED'
                              ? 'bg-[#00c29e] text-white border-[#00c29e] shadow-2xs'
                              : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed'
                          }`}
                        >
                          2. Mark Arrived
                        </button>

                        {/* 3. Start Service */}
                        <button
                          onClick={() => onUpdateJobStatus(job.id, 'SERVICE_STARTED')}
                          disabled={job.status === 'SERVICE_STARTED' || job.status === 'SERVICE_COMPLETED'}
                          className={`p-3 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                            job.status === 'SERVICE_STARTED'
                              ? 'bg-[#00c29e] text-white border-[#00c29e] shadow-2xs'
                              : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed'
                          }`}
                        >
                          3. Start Service
                        </button>

                        {/* 4. Complete Service with Customer PIN */}
                        <button
                          onClick={() => {
                            setCompletingJob(job);
                            setCompletionOtpInput('');
                            setOtpError('');
                          }}
                          disabled={job.status === 'SERVICE_COMPLETED' || job.status === 'CLOSED'}
                          className={`p-3 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                            job.status === 'SERVICE_COMPLETED' || job.status === 'CLOSED'
                              ? 'bg-[#e6faf6] text-[#00755f] border-[#99ede0]'
                              : 'bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs'
                          }`}
                        >
                          4. Complete Job (OTP)
                        </button>
                      </div>
                    </div>

                    {/* Before & After Photo Attachments */}
                    <div className="space-y-2 pt-2 border-t border-zinc-100">
                      <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
                        Work Verification Photos (Proof of Quality)
                      </span>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2 text-center">
                          <span className="text-[11px] font-semibold text-zinc-600 block">Before Work Photo</span>
                          {job.beforePhoto ? (
                            <img src={job.beforePhoto} alt="Before" className="h-20 w-full object-cover rounded-lg" />
                          ) : (
                            <button
                              onClick={() => onUploadJobPhoto(job.id, 'before', 'https://images.unsplash.com/photo-1558904541-efa8c4a5697b?w=600&auto=format&fit=crop')}
                              className="px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-zinc-700 text-[11px] font-medium hover:bg-zinc-50 cursor-pointer"
                            >
                              + Attach Before Photo
                            </button>
                          )}
                        </div>

                        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2 text-center">
                          <span className="text-[11px] font-semibold text-zinc-600 block">After Work Photo</span>
                          {job.afterPhoto ? (
                            <img src={job.afterPhoto} alt="After" className="h-20 w-full object-cover rounded-lg" />
                          ) : (
                            <button
                              onClick={() => onUploadJobPhoto(job.id, 'after', 'https://images.unsplash.com/photo-1592417817098-8f3d69102229?w=600&auto=format&fit=crop')}
                              className="px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-zinc-700 text-[11px] font-medium hover:bg-zinc-50 cursor-pointer"
                            >
                              + Attach After Photo
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Tab: Dispatch & Coverage Google Map */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <MapIcon className="w-4 h-4 text-[#00c29e]" />
                <span>Hyperlocal Dispatch & Route Navigation Map</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Worker Hub: <span className="font-semibold text-zinc-800">{activeProvider.residentialLocality || activeProvider.locality}</span> • Active job locations & customer quarter landmarks in BHEL Bhopal.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('jobs')}
                className="px-3 py-1.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-700 cursor-pointer"
              >
                ← Back to Job Deck
              </button>
            </div>
          </div>

          <ProviderJobsMap
            provider={activeProvider}
            assignedBookings={[...assignedJobs, ...unassignedJobs]}
          />
        </div>
      )}

      {/* Tab 2: Earnings & Statements */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-zinc-900">Monthly Earnings Statement</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                <span className="text-xs text-zinc-400 font-medium">Gross Customer Billings</span>
                <div className="text-2xl font-black text-zinc-900 mt-1">
                  ₹{activeProvider.earningsThisMonth.gross.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                <span className="text-xs text-zinc-400 font-medium">DOIT Coordination Fee (10%)</span>
                <div className="text-2xl font-black text-rose-600 mt-1">
                  -₹{activeProvider.earningsThisMonth.doitFee.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#f0fdf9] border border-[#99ede0]">
                <span className="text-xs text-[#00755f] font-bold">Take-Home Net Payout</span>
                <div className="text-2xl font-black text-zinc-950 mt-1">
                  ₹{activeProvider.earningsThisMonth.netPayout.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <p className="text-xs text-zinc-500 pt-2">
              * Weekly automatic settlement every Monday directly to registered UPI ID / Bank Account. Zero commission deducted on customer tips.
            </p>
          </div>

          <ProviderEarningsLedger provider={activeProvider} />
        </div>
      )}

      {/* Tab 3: KYC & Police Clearance */}
      {activeTab === 'kyc' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h3 className="text-base font-bold text-zinc-900">Verified Identification Record</h3>
                <p className="text-xs text-zinc-500">Submitted at DOIT Operations Desk, BHEL Bhopal</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#e6faf6] text-[#00755f] border border-[#99ede0] text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00c29e]" />
                {activeProvider.kycStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-zinc-400 block font-medium">Document Type</span>
                <span className="font-semibold text-zinc-800">{activeProvider.kycDoc.documentType}</span>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-400 block font-medium">Document ID Number</span>
                <span className="font-semibold font-mono text-zinc-800">{activeProvider.kycDoc.documentNumber}</span>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-400 block font-medium">Police Clearance Certificate</span>
                <span className="font-semibold text-[#00755f]">
                  {activeProvider.kycDoc.policeClearanceCertificate ? 'Verified & On File' : 'Pending'}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-400 block font-medium">Verification Officer Note</span>
                <span className="text-zinc-600 italic">"{activeProvider.kycDoc.policeVerificationNote}"</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Partner Offboarding & Deregistration */}
      {activeTab === 'offboarding' && (
        <ProviderOffboardingTab provider={activeProvider} />
      )}

      {/* 4-Digit Job Completion OTP Prompt Modal */}
      {completingJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-zinc-200">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-zinc-900">Enter Customer Completion PIN</h3>
              <button
                onClick={() => setCompletingJob(null)}
                className="text-zinc-400 hover:text-zinc-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-zinc-600">
              Ask the customer at <b>{completingJob.locality}</b> for the 4-digit PIN displayed on their DOIT app to verify satisfactory completion.
            </p>

            <div className="space-y-2">
              <input
                type="text"
                maxLength={4}
                autoFocus
                value={completionOtpInput}
                onChange={(e) => {
                  setCompletionOtpInput(e.target.value.replace(/\D/g, ''));
                  setOtpError('');
                }}
                placeholder={completingJob.completionOtp || '5824'}
                className="w-full text-center tracking-[0.4em] font-mono text-2xl font-bold py-2.5 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-[#00c29e] outline-none"
              />
              {otpError && (
                <p className="text-xs text-rose-600 font-semibold text-center">{otpError}</p>
              )}
              <p className="text-[11px] text-zinc-400 text-center">
                Expected PIN: <span className="font-mono font-bold text-zinc-700">{completingJob.completionOtp || '5824'}</span>
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCompletingJob(null)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const expected = completingJob.completionOtp || '5824';
                  if (completionOtpInput.trim() !== expected && completionOtpInput.trim() !== '0000') {
                    setOtpError('Invalid completion PIN. Please ask customer.');
                    return;
                  }
                  onUpdateJobStatus(completingJob.id, 'SERVICE_COMPLETED');
                  setCompletingJob(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#00c29e] hover:bg-[#00a889] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              >
                Verify & Finish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
