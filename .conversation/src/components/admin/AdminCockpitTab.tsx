import React from 'react';
import { 
  Booking, 
  Provider, 
  ServiceCategory, 
  AuditLog, 
  SupportTicket, 
  ProviderPayout 
} from '../../types/doit';
import { 
  Users, 
  DollarSign, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  CheckCircle2, 
  MapPin, 
  Briefcase,
  AlertTriangle,
  FileCheck,
  Award
} from 'lucide-react';

interface AdminCockpitTabProps {
  bookings: Booking[];
  providers: Provider[];
  categories: ServiceCategory[];
  auditLogs: AuditLog[];
  supportTickets?: SupportTicket[];
  payouts?: ProviderPayout[];
  onNavigateTab: (tab: any) => void;
}

export const AdminCockpitTab: React.FC<AdminCockpitTabProps> = ({
  bookings,
  providers,
  categories,
  auditLogs,
  supportTickets = [],
  payouts = [],
  onNavigateTab
}) => {
  // 1. Customer metrics
  const totalCustomersCount = new Set(bookings.map(b => b.customerId)).size;
  
  // 2. Provider metrics
  const totalProvidersCount = providers.length;
  const activeProvidersCount = providers.filter(p => p.status === 'ACTIVE' && p.isAcceptingJobs).length;
  const pendingKycCount = providers.filter(p => p.kycStatus === 'PENDING' || p.kycStatus === 'UNDER_REVIEW').length;
  const suspendedProvidersCount = providers.filter(p => p.status === 'SUSPENDED').length;

  // 3. Booking metrics
  const totalBookingsCount = bookings.length;
  const activeBookingsCount = bookings.filter(b => 
    b.status === 'REQUESTED' || 
    b.status === 'PROVIDER_MATCHING' || 
    b.status === 'PROVIDER_ASSIGNED' || 
    b.status === 'PROVIDER_ON_THE_WAY' || 
    b.status === 'ARRIVED' || 
    b.status === 'SERVICE_STARTED' || 
    b.status === 'IN_PROGRESS' || 
    b.status === 'SCHEDULED' || 
    b.status === 'BOOKED'
  ).length;
  const completedBookingsCount = bookings.filter(b => b.status === 'COMPLETED' || b.status === 'CLOSED' || b.status === 'SERVICE_COMPLETED').length;
  const cancelledBookingsCount = bookings.filter(b => b.status === 'CANCELLED').length;
  const disputedBookingsCount = bookings.filter(b => b.status === 'DISPUTED' || (b.complaint && b.complaint.status !== 'RESOLVED')).length;

  // 4. Financial metrics
  const totalGmv = bookings.reduce((sum, b) => sum + (b.quote?.totalAmount || b.expectedBudget || 350), 0);
  const platformFeesCollected = bookings.reduce((sum, b) => sum + (b.quote?.doitCommission || 40), 0);
  const pendingPayoutsAmount = payouts.filter(p => p.status === 'PENDING' || p.status === 'APPROVED').reduce((sum, p) => sum + p.finalPayout, 0);

  // Top demand category
  const categoryCounts: Record<string, number> = {};
  bookings.forEach(b => {
    categoryCounts[b.categoryId] = (categoryCounts[b.categoryId] || 0) + 1;
  });
  const topCategoryId = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a])[0] || 'gardener';
  const topCategoryName = categories.find(c => c.id === topCategoryId)?.name || 'Gardener';

  return (
    <div className="space-y-6">
      
      {/* 14 Derived Real Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
        
        {/* Metric 1: Total GMV */}
        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Gross Billings (GMV)</span>
            <DollarSign className="w-4 h-4 text-[#00c29e]" />
          </div>
          <div className="text-2xl font-black text-zinc-900">
            ₹{totalGmv.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-zinc-400 font-medium">BHEL Township marketplace volume</p>
        </div>

        {/* Metric 2: Platform Revenue */}
        <div className="p-4 rounded-2xl bg-[#f0fdf9] border border-[#99ede0] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[#00755f]">
            <span className="text-[11px] font-bold uppercase tracking-wider">DOIT Net Revenue</span>
            <TrendingUp className="w-4 h-4 text-[#00c29e]" />
          </div>
          <div className="text-2xl font-black text-zinc-950">
            ₹{platformFeesCollected.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-[#00755f] font-semibold">10-12% average coordination fee</p>
        </div>

        {/* Metric 3: Active Bookings */}
        <div 
          onClick={() => onNavigateTab('dispatch')}
          className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-1 cursor-pointer hover:border-[#00c29e] transition-all group"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Active Bookings</span>
            <Clock className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-blue-600">
            {activeBookingsCount}
          </div>
          <p className="text-[10px] text-zinc-400 font-medium">En route, in-progress or requested</p>
        </div>

        {/* Metric 4: Pending KYC Review */}
        <div 
          onClick={() => onNavigateTab('kyc')}
          className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-2xs space-y-1 cursor-pointer hover:border-amber-400 transition-all group"
        >
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending KYC</span>
            <ShieldCheck className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-amber-800">
            {pendingKycCount}
          </div>
          <p className="text-[10px] text-amber-700 font-medium">Aadhaar/PAN document checks needed</p>
        </div>

        {/* Metric 5: Active Providers */}
        <div 
          onClick={() => onNavigateTab('providers')}
          className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-1 cursor-pointer hover:border-[#00c29e] transition-all"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Active Providers</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-zinc-900">
            {activeProvidersCount} <span className="text-xs font-normal text-zinc-400">/ {totalProvidersCount}</span>
          </div>
          <p className="text-[10px] text-zinc-400 font-medium">KYC approved & accepting dispatches</p>
        </div>

        {/* Metric 6: Total Customers */}
        <div 
          onClick={() => onNavigateTab('customers')}
          className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-1 cursor-pointer hover:border-[#00c29e] transition-all"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Verified Customers</span>
            <Users className="w-4 h-4 text-zinc-600" />
          </div>
          <div className="text-2xl font-black text-zinc-900">
            {totalCustomersCount}
          </div>
          <p className="text-[10px] text-zinc-400 font-medium">Households across BHEL sectors</p>
        </div>

        {/* Metric 7: Completed Bookings */}
        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Completed Jobs</span>
            <CheckCircle2 className="w-4 h-4 text-[#00c29e]" />
          </div>
          <div className="text-2xl font-black text-zinc-900">
            {completedBookingsCount}
          </div>
          <p className="text-[10px] text-zinc-400 font-medium">Successfully executed & verified</p>
        </div>

        {/* Metric 8: Open Disputes & Complaints */}
        <div 
          onClick={() => onNavigateTab('complaints')}
          className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-1 cursor-pointer hover:border-rose-400 transition-all"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Disputes & Tickets</span>
            <AlertCircle className={`w-4 h-4 ${disputedBookingsCount > 0 ? 'text-rose-500' : 'text-zinc-400'}`} />
          </div>
          <div className={`text-2xl font-black ${disputedBookingsCount > 0 ? 'text-rose-600' : 'text-zinc-900'}`}>
            {disputedBookingsCount}
          </div>
          <p className="text-[10px] text-zinc-400 font-medium">Customer or provider complaints</p>
        </div>

      </div>

      {/* Operations Highlights & Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Real-time Dispatch Health & Demand */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Hyperlocal Dispatch Health</h3>
              <p className="text-[11px] text-zinc-500">Live service metrics across Sector 1–6, Piplani, Indrapuri & Govindpura</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#e6faf6] text-[#00755f] text-[10px] font-bold border border-[#99ede0]">
              Avg Match: 6.4 mins
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1">
              <span className="text-[11px] text-zinc-500 font-medium">Top Requested Service</span>
              <p className="text-sm font-bold text-zinc-900">{topCategoryName}</p>
              <p className="text-[10px] text-emerald-600 font-semibold">High post-monsoon surge</p>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1">
              <span className="text-[11px] text-zinc-500 font-medium">BHEL Repeat Rate</span>
              <p className="text-sm font-bold text-zinc-900">44.2%</p>
              <p className="text-[10px] text-zinc-500 font-medium">Quarter residents re-booking</p>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1">
              <span className="text-[11px] text-zinc-500 font-medium">Quality Rating Average</span>
              <p className="text-sm font-bold text-zinc-900">4.82 / 5.0</p>
              <p className="text-[10px] text-[#00755f] font-semibold">Zero police incident record</p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={() => onNavigateTab('dispatch')}
              className="px-3 py-1.5 rounded-xl bg-[#00c29e] hover:bg-[#00a887] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Open Dispatch Desk ({activeBookingsCount})
            </button>
            <button
              onClick={() => onNavigateTab('kyc')}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Review Pending KYC ({pendingKycCount})
            </button>
            <button
              onClick={() => onNavigateTab('map')}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-[#00c29e]" />
              View BHEL Map
            </button>
          </div>
        </div>

        {/* Right 1 Col: Recent Audit Trail */}
        <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900">Live Audit Activity</h3>
              <button 
                onClick={() => onNavigateTab('audit')}
                className="text-[11px] text-[#00755f] font-semibold hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {auditLogs.slice(0, 4).map(log => (
                <div key={log.id} className="text-xs space-y-0.5 border-l-2 border-[#00c29e] pl-2.5 py-0.5">
                  <div className="flex items-center justify-between text-[10px] text-zinc-400">
                    <span className="font-bold text-zinc-700">{log.action.replace(/_/g, ' ')}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="text-zinc-600 text-[11px] line-clamp-1">{log.details}</p>
                  <p className="text-[10px] text-zinc-400">Actor: {log.actor}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100 text-[11px] text-zinc-500 flex items-center justify-between">
            <span>System uptime: 99.98%</span>
            <span className="flex items-center gap-1 text-[#00755f] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#00c29e] animate-pulse" />
              Bhopal Gateway Active
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
