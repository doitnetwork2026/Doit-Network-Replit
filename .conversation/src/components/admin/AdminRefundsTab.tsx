import React, { useState } from 'react';
import { Booking } from '../../types/doit';
import { 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  HelpCircle, 
  DollarSign, 
  User, 
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export interface RefundClaim {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  providerId: string;
  providerName: string;
  serviceCategory: string;
  amount: number;
  reason: 'PROVIDER_NOSHOW' | 'CANCELLATION_EARLY' | 'CANCELLATION_LATE' | 'QUALITY_DISPUTE';
  description: string;
  evidencePhoto?: string;
  status: 'REQUESTED' | 'UNDER_REVIEW' | 'APPROVED' | 'PARTIALLY_APPROVED' | 'REJECTED';
  recommendedPriority: 'PRIORITY_1_REVISIT' | 'PRIORITY_2_WALLET_CREDIT' | 'PRIORITY_3_DIRECT_REFUND';
  approvedAmount?: number;
  providerRecoveryDebit?: number;
  resolutionNote?: string;
  createdAt: string;
}

const INITIAL_REFUND_CLAIMS: RefundClaim[] = [
  {
    id: 'REF-2026-001',
    bookingId: 'DOIT-2026-000003',
    customerId: 'CUST-0089',
    customerName: 'Anil Saxena',
    customerPhone: '+91 98260 44331',
    providerId: 'PRV-00127',
    providerName: 'Sunil Sen',
    serviceCategory: 'Gardener',
    amount: 500,
    reason: 'PROVIDER_NOSHOW',
    description: 'Partner failed to arrive at BHEL Sector 3 residence. Tried calling twice, phone switched off.',
    status: 'REQUESTED',
    recommendedPriority: 'PRIORITY_3_DIRECT_REFUND',
    createdAt: 'Today, 11:15 AM'
  },
  {
    id: 'REF-2026-002',
    bookingId: 'DOIT-2026-000002',
    customerId: 'CUST-0092',
    customerName: 'Kavita Joshi',
    customerPhone: '+91 94250 88776',
    providerId: 'PRV-00125',
    providerName: 'Geeta Bai',
    serviceCategory: 'Maid',
    amount: 400,
    reason: 'QUALITY_DISPUTE',
    description: 'Deep kitchen scrubbing was incomplete. Grime behind gas stove remained untouched.',
    evidencePhoto: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=400&q=80',
    status: 'UNDER_REVIEW',
    recommendedPriority: 'PRIORITY_1_REVISIT',
    createdAt: 'Yesterday, 4:45 PM'
  }
];

export const AdminRefundsTab: React.FC = () => {
  const [claims, setClaims] = useState<RefundClaim[]>(INITIAL_REFUND_CLAIMS);
  const [selectedClaim, setSelectedClaim] = useState<RefundClaim | null>(null);
  const [actionModal, setActionModal] = useState<{
    claim: RefundClaim;
    type: 'revisit' | 'credit' | 'direct_refund' | 'reject';
  } | null>(null);
  const [resolutionText, setResolutionText] = useState('');
  const [customRefundAmount, setCustomRefundAmount] = useState(0);

  const handleResolve = () => {
    if (!actionModal) return;

    const { claim, type } = actionModal;
    let nextStatus: RefundClaim['status'] = 'APPROVED';
    let finalAmount = claim.amount;
    let providerDebit = 0;

    if (type === 'revisit') {
      nextStatus = 'PARTIALLY_APPROVED';
      finalAmount = 0;
      providerDebit = 0;
    } else if (type === 'credit') {
      nextStatus = 'APPROVED';
      finalAmount = customRefundAmount || claim.amount;
      providerDebit = claim.reason === 'PROVIDER_NOSHOW' ? finalAmount : 0;
    } else if (type === 'direct_refund') {
      nextStatus = 'APPROVED';
      finalAmount = customRefundAmount || claim.amount;
      providerDebit = claim.reason === 'PROVIDER_NOSHOW' ? finalAmount : Math.round(finalAmount * 0.5);
    } else {
      nextStatus = 'REJECTED';
      finalAmount = 0;
      providerDebit = 0;
    }

    setClaims(prev => prev.map(c => c.id === claim.id ? {
      ...c,
      status: nextStatus,
      approvedAmount: finalAmount,
      providerRecoveryDebit: providerDebit,
      resolutionNote: resolutionText || 'Resolved as per DOIT operational policy'
    } : c));

    setActionModal(null);
    alert(`Refund claim ${claim.id} processed successfully.`);
  };

  return (
    <div className="space-y-6">
      {/* Policy Priority Guidance */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
          <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">PRIORITY 1</span>
          <h4 className="text-xs font-bold text-emerald-950 mt-1">Free Re-visit / Remediation</h4>
          <p className="text-[11px] text-emerald-700 mt-0.5">
            Default for quality disputes within 24–48h. Verified partner dispatched for touch-up.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
          <span className="text-[10px] font-black uppercase text-sky-800 tracking-wider">PRIORITY 2</span>
          <h4 className="text-xs font-bold text-sky-950 mt-1">Platform Wallet Credit</h4>
          <p className="text-[11px] text-sky-700 mt-0.5">
            Applied instantly to customer wallet for next BHEL booking with bonus credits.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
          <span className="text-[10px] font-black uppercase text-purple-800 tracking-wider">PRIORITY 3</span>
          <h4 className="text-xs font-bold text-purple-950 mt-1">Direct UPI / Cash Refund</h4>
          <p className="text-[11px] text-purple-700 mt-0.5">
            100% for confirmed partner no-show. Compensating debit applied to partner ledger.
          </p>
        </div>
      </div>

      {/* Refunds Table */}
      <Card className="border-zinc-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-[#00c29e]" />
            Customer Refund & Dispute Claims Desk
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-zinc-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-600 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3">Claim ID</th>
                  <th className="p-3">Customer & Booking</th>
                  <th className="p-3">Partner</th>
                  <th className="p-3">Claim Type</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Recommended Resolution</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {claims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-zinc-50/50">
                    <td className="p-3 font-mono font-bold text-zinc-800">{claim.id}</td>
                    <td className="p-3">
                      <div className="font-bold text-zinc-900">{claim.customerName}</div>
                      <span className="text-[11px] text-zinc-500 font-mono">{claim.bookingId}</span>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-zinc-900">{claim.providerName}</div>
                      <span className="text-[10px] text-zinc-400 font-mono">{claim.providerId}</span>
                    </td>
                    <td className="p-3">
                      <Badge variant={claim.reason === 'PROVIDER_NOSHOW' ? 'destructive' : 'warning'}>
                        {claim.reason}
                      </Badge>
                    </td>
                    <td className="p-3 font-bold text-zinc-900">₹{claim.amount}</td>
                    <td className="p-3 font-medium text-[#00876e]">
                      {claim.recommendedPriority === 'PRIORITY_3_DIRECT_REFUND' ? (
                        <span className="text-rose-700 font-bold">100% Direct Refund (No-Show)</span>
                      ) : (
                        <span className="text-emerald-700 font-bold">Free Remediation Re-visit</span>
                      )}
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={
                          claim.status === 'APPROVED'
                            ? 'success'
                            : claim.status === 'REJECTED'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {claim.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      {claim.status === 'REQUESTED' || claim.status === 'UNDER_REVIEW' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-[11px] cursor-pointer"
                            onClick={() => {
                              setActionModal({ claim, type: 'revisit' });
                              setResolutionText('Coordinator verified request. Free partner re-visit scheduled.');
                              setCustomRefundAmount(0);
                            }}
                          >
                            Offer Re-visit
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            className="h-7 text-[11px] bg-[#00c29e] hover:bg-[#00a889] text-white cursor-pointer"
                            onClick={() => {
                              setActionModal({ claim, type: 'direct_refund' });
                              setResolutionText('Full refund approved due to verified provider no-show.');
                              setCustomRefundAmount(claim.amount);
                            }}
                          >
                            Approve Refund
                          </Button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-zinc-400 font-medium">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Action Resolution Modal */}
      {actionModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-zinc-200">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-zinc-900">
                Process Resolution for {actionModal.claim.id}
              </h3>
              <button
                onClick={() => setActionModal(null)}
                className="text-zinc-400 hover:text-zinc-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-1">
              <p><b>Customer:</b> {actionModal.claim.customerName}</p>
              <p><b>Issue:</b> {actionModal.claim.description}</p>
              <p><b>Claim Amount:</b> ₹{actionModal.claim.amount}</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700">Refund Amount (₹)</label>
              <input
                type="number"
                value={customRefundAmount}
                onChange={(e) => setCustomRefundAmount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700">Official Resolution Note</label>
              <textarea
                rows={3}
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-zinc-200"
                placeholder="Explain the resolution for customer notification..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActionModal(null)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleResolve}
                className="bg-[#00c29e] hover:bg-[#00a889] text-white cursor-pointer"
              >
                Confirm & Dispatch Notification
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
