import React, { useState } from 'react';
import { Booking } from '../../types/doit';
import { RotateCcw, CheckCircle2, Clock, AlertCircle, Sparkles, Plus, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface CustomerRefundsTabProps {
  bookings: Booking[];
}

export const CustomerRefundsTab: React.FC<CustomerRefundsTabProps> = ({ bookings }) => {
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [claimReason, setClaimReason] = useState<'PROVIDER_NOSHOW' | 'QUALITY_DISPUTE' | 'CANCELLATION'>('PROVIDER_NOSHOW');
  const [claimDescription, setClaimDescription] = useState('');

  const completedOrCancelledBookings = bookings.filter(b => 
    b.status === 'COMPLETED' || b.status === 'CANCELLED'
  );

  const [customerRefunds, setCustomerRefunds] = useState<any[]>([
    {
      id: 'REF-2026-001',
      bookingId: 'DOIT-2026-000003',
      subService: 'Lawn Mowing & Weeding',
      amount: 500,
      reason: 'Partner No-Show',
      status: 'APPROVED',
      resolution: '100% Direct UPI Refund credited to customer bank account.',
      date: 'Today'
    }
  ]);

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId) {
      alert('Please select a booking to claim refund on.');
      return;
    }

    const booking = bookings.find(b => b.id === selectedBookingId);
    const amount = booking?.quote?.totalAmount || booking?.expectedBudget || 350;

    const newClaim = {
      id: `REF-2026-00${customerRefunds.length + 1}`,
      bookingId: selectedBookingId,
      subService: booking?.subService || 'Service Booking',
      amount,
      reason: claimReason === 'PROVIDER_NOSHOW' ? 'Partner No-Show' : 'Quality Dispute',
      status: 'UNDER_REVIEW',
      resolution: 'Our Operations Coordinator is verifying with partner. Free re-visit or credit will be issued.',
      date: 'Just now'
    };

    setCustomerRefunds([newClaim, ...customerRefunds]);
    setIsClaimModalOpen(false);
    setSelectedBookingId('');
    setClaimDescription('');
    alert('Your refund claim has been submitted to the DOIT Operations Desk.');
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-[#00c29e]" />
            Refunds & Dispute Resolution
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            100% fair guarantee. No-shows get full refund; quality issues receive free priority re-visit or wallet credits.
          </p>
        </div>

        <Button
          onClick={() => setIsClaimModalOpen(true)}
          className="h-10 text-xs font-bold bg-[#00c29e] hover:bg-[#00a889] text-white cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Request Refund or Re-visit
        </Button>
      </div>

      {/* Refunds List */}
      <div className="space-y-3">
        {customerRefunds.map((ref) => (
          <Card key={ref.id} className="border-zinc-200 shadow-2xs">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-zinc-900">{ref.id}</span>
                  <Badge variant={ref.status === 'APPROVED' ? 'success' : 'warning'}>
                    {ref.status}
                  </Badge>
                  <span className="text-[11px] text-zinc-400 font-mono">{ref.bookingId}</span>
                </div>
                <h4 className="text-xs font-bold text-zinc-900">
                  {ref.subService} — Claim Reason: {ref.reason}
                </h4>
                <p className="text-[11px] text-zinc-600">
                  {ref.resolution}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-zinc-400 block">Claim Amount</span>
                <span className="text-base font-bold text-zinc-900">₹{ref.amount}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Request Refund Modal */}
      {isClaimModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-zinc-200">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-zinc-900">Request Refund or Re-visit</h3>
              <button
                onClick={() => setIsClaimModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitClaim} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-zinc-700">Select Booking</label>
                <select
                  required
                  value={selectedBookingId}
                  onChange={(e) => setSelectedBookingId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white"
                >
                  <option value="">-- Choose past booking --</option>
                  {completedOrCancelledBookings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.id} — {b.subService} (₹{b.quote?.totalAmount || b.expectedBudget})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700">Reason</label>
                <select
                  value={claimReason}
                  onChange={(e: any) => setClaimReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white"
                >
                  <option value="PROVIDER_NOSHOW">Partner did not show up (100% Refund)</option>
                  <option value="QUALITY_DISPUTE">Service unsatisfactory (Free Re-visit / Partial Refund)</option>
                  <option value="CANCELLATION">Cancelled with lead time</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700">Describe the issue</label>
                <textarea
                  rows={3}
                  required
                  value={claimDescription}
                  onChange={(e) => setClaimDescription(e.target.value)}
                  placeholder="Provide clear details so our BHEL coordinator can assist you..."
                  className="w-full p-3 rounded-xl border border-zinc-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsClaimModalOpen(false)}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#00c29e] hover:bg-[#00a889] text-white cursor-pointer"
                >
                  Submit Claim
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
