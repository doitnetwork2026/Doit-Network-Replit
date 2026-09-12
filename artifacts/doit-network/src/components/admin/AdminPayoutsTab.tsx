import React, { useState } from 'react';
import { ProviderPayout, Provider } from '../../types/doit';
import { DollarSign, CheckCircle2, Clock, Check, ArrowRight } from 'lucide-react';

interface AdminPayoutsTabProps {
  payouts: ProviderPayout[];
  providers: Provider[];
  onApprovePayout?: (payoutId: string) => void;
  onMarkPayoutPaid?: (payoutId: string, ref: string) => void;
}

export const AdminPayoutsTab: React.FC<AdminPayoutsTabProps> = ({
  payouts: initialPayouts,
  providers,
  onApprovePayout,
  onMarkPayoutPaid
}) => {
  const [payouts, setPayouts] = useState<ProviderPayout[]>(initialPayouts);

  const totalGross = payouts.reduce((sum, p) => sum + (p.grossBillings ?? p.customerAmount ?? 0), 0);
  const totalPlatformFees = payouts.reduce((sum, p) => sum + (p.platformFeeDeducted ?? p.platformFee ?? 0), 0);
  const totalFinalPayouts = payouts.reduce((sum, p) => sum + (p.finalPayout ?? 0), 0);
  const pendingAmount = payouts.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + (p.finalPayout ?? 0), 0);

  const handleApprove = (id: string) => {
    setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: 'APPROVED' } : p));
    if (onApprovePayout) onApprovePayout(id);
  };

  const handleMarkPaid = (id: string) => {
    const ref = `UPI-BHEL-${Math.floor(100000 + Math.random() * 900000)}`;
    setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: 'PAID', paymentReference: ref, processedAt: 'Today' } : p));
    if (onMarkPayoutPaid) onMarkPayoutPaid(id, ref);
  };

  return (
    <div className="space-y-6">
      
      {/* 4 Financial KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Gross Billings Billed</span>
          <div className="text-2xl font-black text-zinc-900">₹{totalGross.toLocaleString('en-IN')}</div>
          <p className="text-[10px] text-zinc-400">Total customer collections</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#f0fdf9] border border-[#99ede0] shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#00755f]">DOIT Platform Net</span>
          <div className="text-2xl font-black text-zinc-950">₹{totalPlatformFees.toLocaleString('en-IN')}</div>
          <p className="text-[10px] text-[#00755f]">10% platform fee retained</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Total Provider Payouts</span>
          <div className="text-2xl font-black text-emerald-600">₹{totalFinalPayouts.toLocaleString('en-IN')}</div>
          <p className="text-[10px] text-zinc-400">Calculated net to partners</p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Pending Approval</span>
          <div className="text-2xl font-black text-amber-800">₹{pendingAmount.toLocaleString('en-IN')}</div>
          <p className="text-[10px] text-amber-700">Scheduled Monday settlement</p>
        </div>
      </div>

      {/* Payout Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-900">Partner Settlement & Payout Queue</h3>
          <span className="text-xs text-zinc-500 font-medium">BHEL Weekly Auto-Batch (Direct UPI / Bank Transfer)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-700 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Payout ID</th>
                <th className="py-3 px-4">Partner</th>
                <th className="py-3 px-4">Cycle Period</th>
                <th className="py-3 px-4">Jobs</th>
                <th className="py-3 px-4">Gross Billings</th>
                <th className="py-3 px-4">DOIT Fee (10%)</th>
                <th className="py-3 px-4">Net Payout</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium">
              {payouts.map(p => (
                <tr key={p.id} className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-zinc-900">{p.id}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-zinc-900 block">{p.providerName}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">{p.providerId}</span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-600">{p.period || p.payoutDate || 'Current Cycle'}</td>
                  <td className="py-3.5 px-4 font-semibold text-zinc-800">{p.completedJobsCount ?? 1}</td>
                  <td className="py-3.5 px-4 font-mono">₹{(p.grossBillings ?? p.customerAmount ?? 0).toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 font-mono text-rose-600">-₹{(p.platformFeeDeducted ?? p.platformFee ?? 0).toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">₹{(p.finalPayout ?? 0).toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      p.status === 'APPROVED' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {p.status === 'PENDING' && (
                      <button
                        onClick={() => handleApprove(p.id)}
                        className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] cursor-pointer"
                      >
                        Approve
                      </button>
                    )}
                    {p.status === 'APPROVED' && (
                      <button
                        onClick={() => handleMarkPaid(p.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] cursor-pointer"
                      >
                        Process UPI
                      </button>
                    )}
                    {p.status === 'PAID' && (
                      <span className="text-[10px] text-zinc-400 font-mono">{p.paymentReference || 'Settled'}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
