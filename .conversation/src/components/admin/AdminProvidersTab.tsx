import React, { useState } from 'react';
import { Provider, ServiceCategory, KycStatus } from '../../types/doit';
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  UserCheck, 
  UserX,
  Plus,
  Clock,
  Sparkles
} from 'lucide-react';

interface AdminProvidersTabProps {
  providers: Provider[];
  categories: ServiceCategory[];
  onUpdateProviderStatus: (providerId: string, status: Provider['status'], reason?: string) => void;
  onUpdateKycStatus: (providerId: string, status: KycStatus, notes?: string) => void;
  onOpenNewProviderModal?: () => void;
}

export const AdminProvidersTab: React.FC<AdminProvidersTabProps> = ({
  providers,
  categories,
  onUpdateProviderStatus,
  onUpdateKycStatus,
  onOpenNewProviderModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [suspendModalProvider, setSuspendModalProvider] = useState<Provider | null>(null);
  const [suspendReason, setSuspendReason] = useState('');

  const filteredProviders = providers.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.residentialLocality?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' ? true : 
      statusFilter === 'KYC_PENDING' ? (p.kycStatus === 'PENDING' || p.kycStatus === 'UNDER_REVIEW') :
      p.status === statusFilter;

    const matchesCategory = categoryFilter === 'ALL' ? true :
      p.categories.includes(categoryFilter as any);

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleConfirmSuspend = () => {
    if (!suspendModalProvider) return;
    onUpdateProviderStatus(suspendModalProvider.id, 'SUSPENDED', suspendReason || 'Quality review / suspension');
    setSuspendModalProvider(null);
    setSuspendReason('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-2xs">
        
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search partner by name, phone, ID..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-zinc-200 rounded-xl bg-white focus:border-[#00c29e] focus:outline-none"
          >
            <option value="ALL">All Account Statuses</option>
            <option value="ACTIVE">Active & Dispatched</option>
            <option value="KYC_PENDING">Pending KYC Verification</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="APPLICATION_SUBMITTED">Application Submitted</option>
          </select>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-zinc-200 rounded-xl bg-white focus:border-[#00c29e] focus:outline-none"
          >
            <option value="ALL">All Service Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Add Provider Button */}
        {onOpenNewProviderModal && (
          <button
            onClick={onOpenNewProviderModal}
            className="px-4 py-2 rounded-xl bg-[#00c29e] hover:bg-[#00a887] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard New Partner</span>
          </button>
        )}
      </div>

      {/* Providers Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-700 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Partner</th>
                <th className="py-3 px-4">Category & Skills</th>
                <th className="py-3 px-4">BHEL Locality</th>
                <th className="py-3 px-4">KYC Status</th>
                <th className="py-3 px-4">Account</th>
                <th className="py-3 px-4">Rating & Jobs</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium">
              {filteredProviders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-400">
                    No service partners found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProviders.map(p => (
                  <tr key={p.id} className="hover:bg-zinc-50/70 transition-colors">
                    
                    {/* Partner info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={p.photo} 
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-cover border border-zinc-200 shrink-0" 
                        />
                        <div>
                          <span className="font-bold text-zinc-900 block">{p.name}</span>
                          <span className="text-[10px] text-zinc-400 font-mono">{p.id} • {p.phone}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category & Skills */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-zinc-800 capitalize block">
                          {p.categories.join(', ')}
                        </span>
                        <span className="text-[10px] text-zinc-400 line-clamp-1">
                          {p.skills.slice(0, 2).join(', ')}
                        </span>
                      </div>
                    </td>

                    {/* Locality */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-zinc-700">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="line-clamp-1">{p.residentialLocality || p.locality || 'BHEL Bhopal'}</span>
                      </div>
                    </td>

                    {/* KYC Status */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${
                        p.kycStatus === 'VERIFIED'
                          ? 'bg-[#e6faf6] text-[#00755f] border-[#99ede0]'
                          : p.kycStatus === 'UNDER_REVIEW' || p.kycStatus === 'PENDING'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : p.kycStatus === 'RESUBMISSION_REQUIRED'
                              ? 'bg-orange-50 text-orange-700 border-orange-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        <ShieldCheck className="w-3 h-3" />
                        {p.kycStatus}
                      </span>
                    </td>

                    {/* Account Status */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'ACTIVE' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : p.status === 'SUSPENDED' 
                            ? 'bg-rose-50 text-rose-700' 
                            : 'bg-zinc-100 text-zinc-600'
                      }`}>
                        {p.status}
                      </span>
                    </td>

                    {/* Rating & Jobs */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-zinc-900 font-bold">
                          <Star className="w-3.5 h-3.5 fill-[#00c29e] text-[#00c29e]" />
                          <span>{p.rating}</span>
                        </div>
                        <span className="text-[10px] text-zinc-400 block">
                          {p.completedJobsCount} jobs completed
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedProvider(p)}
                          className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                          title="View Full Profile & KYC"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {p.status === 'ACTIVE' ? (
                          <button
                            onClick={() => setSuspendModalProvider(p)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Suspend Partner"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => onUpdateProviderStatus(p.id, 'ACTIVE', 'Admin approved')}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Activate Partner"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provider Details Modal */}
      {selectedProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div 
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[85vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedProvider.photo} 
                  alt={selectedProvider.name}
                  referrerPolicy="no-referrer" 
                  className="w-12 h-12 rounded-xl object-cover border border-zinc-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">{selectedProvider.name}</h4>
                  <span className="text-[11px] text-zinc-500 font-mono">{selectedProvider.id} • {selectedProvider.phone}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProvider(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              
              {/* KYC Details */}
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#00c29e]" />
                    Identification & Police Record
                  </span>
                  <span className="font-bold text-[#00755f] bg-[#e6faf6] px-2 py-0.5 rounded-full border border-[#99ede0] text-[10px]">
                    {selectedProvider.kycStatus}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-zinc-600">
                  <div>
                    <span className="text-zinc-400 block">Doc Type:</span>
                    <span className="font-semibold text-zinc-800">{selectedProvider.kycDoc.type}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Masked ID:</span>
                    <span className="font-semibold font-mono text-zinc-800">{selectedProvider.kycDoc.number}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-zinc-400 block">Police Clearance Note:</span>
                    <span className="text-zinc-700 italic">
                      "{selectedProvider.kycDoc.policeVerificationNote || 'No adverse record. Local station verified.'}"
                    </span>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="space-y-1.5">
                <span className="font-bold text-zinc-900 block">Assigned Categories & Skills</span>
                <p className="text-zinc-700">{selectedProvider.skills.join(', ')}</p>
                <p className="text-zinc-500 text-[11px]">Experience: {selectedProvider.experienceYears} years • Max travel: {selectedProvider.maxTravelDistanceKm} KM</p>
              </div>

              {/* Ratings breakdown */}
              {selectedProvider.ratingsBreakdown && (
                <div className="space-y-1.5 pt-2 border-t border-zinc-100">
                  <span className="font-bold text-zinc-900 block">Performance Breakdown</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex justify-between p-2 rounded-lg bg-zinc-50">
                      <span className="text-zinc-500">Professionalism:</span>
                      <span className="font-bold text-zinc-800">{selectedProvider.ratingsBreakdown.professionalism} / 5.0</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-zinc-50">
                      <span className="text-zinc-500">Punctuality:</span>
                      <span className="font-bold text-zinc-800">{selectedProvider.ratingsBreakdown.punctuality} / 5.0</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-zinc-50">
                      <span className="text-zinc-500">Work Quality:</span>
                      <span className="font-bold text-zinc-800">{selectedProvider.ratingsBreakdown.quality} / 5.0</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-zinc-50">
                      <span className="text-zinc-500">Behaviour:</span>
                      <span className="font-bold text-zinc-800">{selectedProvider.ratingsBreakdown.behaviour} / 5.0</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick status change */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-zinc-500 text-[11px]">Current Status: <b className="text-zinc-800">{selectedProvider.status}</b></span>
                <div className="flex gap-2">
                  {selectedProvider.status !== 'ACTIVE' ? (
                    <button
                      onClick={() => {
                        onUpdateProviderStatus(selectedProvider.id, 'ACTIVE', 'Reactivated by admin');
                        setSelectedProvider(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                    >
                      Set Active
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSuspendModalProvider(selectedProvider);
                        setSelectedProvider(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                    >
                      Suspend
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Suspend Confirmation Modal */}
      {suspendModalProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div 
            className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-zinc-200 p-5 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="text-sm font-bold text-zinc-900">Suspend Service Partner</h4>
            </div>
            <p className="text-xs text-zinc-600">
              Are you sure you want to suspend <span className="font-bold text-zinc-800">{suspendModalProvider.name}</span> ({suspendModalProvider.id})? They will no longer receive booking dispatches.
            </p>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700">Reason for Suspension *</label>
              <textarea
                rows={2}
                value={suspendReason}
                onChange={e => setSuspendReason(e.target.value)}
                placeholder="e.g. Quality complaint or repeated tardiness..."
                className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:border-rose-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSuspendModalProvider(null)}
                className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSuspend}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              >
                Confirm Suspension
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
