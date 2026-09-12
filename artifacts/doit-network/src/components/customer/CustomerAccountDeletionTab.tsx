import React, { useState } from 'react';
import { Booking } from '../../types/doit';
import { UserX, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

interface CustomerAccountDeletionTabProps {
  bookings: Booking[];
  customerEmail?: string;
  customerPhone?: string;
}

export const CustomerAccountDeletionTab: React.FC<CustomerAccountDeletionTabProps> = ({
  bookings,
  customerEmail = 'resident.bhel@example.com',
  customerPhone = '+91 94250 12345'
}) => {
  const [reason, setReason] = useState('Relocating outside BHEL Bhopal township');
  const [additionalComments, setAdditionalComments] = useState('');
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState<string | null>(() => {
    return localStorage.getItem('doit_customer_deletion_request_status');
  });

  const activeBookings = bookings.filter(b => 
    b.status !== 'COMPLETED' && b.status !== 'CANCELLED'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeBookings.length > 0) {
      alert('You have active service bookings. Please wait until they are completed or cancel them before requesting account deletion.');
      return;
    }
    if (!confirmChecked) {
      alert('Please acknowledge that financial and tax records will be retained for legal compliance.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API submission
      await new Promise(r => setTimeout(r, 600));
      localStorage.setItem('doit_customer_deletion_request_status', 'UNDER_REVIEW');
      setSubmittedStatus('UNDER_REVIEW');
    } catch (err: any) {
      alert('Failed to submit deletion request: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelRequest = () => {
    if (confirm('Cancel your account deletion request and keep your DOIT account active?')) {
      localStorage.removeItem('doit_customer_deletion_request_status');
      setSubmittedStatus(null);
    }
  };

  if (submittedStatus) {
    return (
      <div className="max-w-xl mx-auto py-8 px-4 space-y-6">
        <Card className="border-amber-200 bg-amber-50/30">
          <CardHeader className="text-center pb-2">
            <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-2">
              <UserX className="w-6 h-6" />
            </div>
            <CardTitle className="text-lg font-bold text-zinc-900">
              Account Deletion Request Under Review
            </CardTitle>
            <p className="text-xs text-zinc-600">
              Submitted for <b>{customerEmail}</b> ({customerPhone})
            </p>
          </CardHeader>
          <CardContent className="space-y-4 text-xs text-zinc-700">
            <div className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-amber-800">Current Status: UNDER REVIEW</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Pending Safety Check</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Our operations team verifies that there are zero unfulfilled service appointments or pending payment adjustments. Once approved, all personal data is permanently anonymized.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={handleCancelRequest}
              className="w-full text-xs h-10 border-zinc-300 cursor-pointer"
            >
              Cancel Deletion Request & Retain Account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-6 px-4 space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
          <UserX className="w-5 h-5 text-rose-600" />
          Delete DOIT Account
        </h2>
        <p className="text-xs text-zinc-500">
          Request permanent deletion of your profile, address records, and login credentials.
        </p>
      </div>

      {activeBookings.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-900">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Active Bookings Detected ({activeBookings.length})</p>
            <p className="text-[11px] text-rose-700 mt-0.5">
              You currently have scheduled bookings in progress. You must complete or cancel these bookings before submitting an account deletion request.
            </p>
          </div>
        </div>
      )}

      <Card className="border-zinc-200">
        <CardContent className="pt-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 space-y-1.5">
            <p className="font-bold text-zinc-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00c29e]" />
              What happens when you delete your account:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-zinc-600">
              <li>Your name, phone number, saved addresses, and passwords will be permanently deleted.</li>
              <li>You will no longer be able to log in to this account.</li>
              <li>Past booking financial invoices and payment receipts are retained in an anonymized format for statutory tax compliance.</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">Reason for leaving</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 bg-white font-medium"
              >
                <option value="Relocating outside BHEL Bhopal township">Relocating outside BHEL Bhopal township</option>
                <option value="No longer require home services">No longer require home services</option>
                <option value="Unhappy with service quality">Unhappy with service quality</option>
                <option value="Privacy / Data concerns">Privacy / Data concerns</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">Additional Feedback (Optional)</label>
              <textarea
                rows={3}
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
                placeholder="Help us understand how we could have done better..."
                className="w-full p-3 text-xs rounded-xl border border-zinc-200 font-medium"
              />
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer pt-2">
              <input
                type="checkbox"
                required
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
                className="mt-0.5 rounded text-[#00c29e] focus:ring-[#00c29e]"
              />
              <span className="text-[11px] text-zinc-600 leading-snug">
                I understand this action is permanent. My personal details will be sanitized, and any unused wallet credits will be forfeited.
              </span>
            </label>

            <Button
              type="submit"
              disabled={activeBookings.length > 0 || isSubmitting || !confirmChecked}
              variant="destructive"
              className="w-full h-11 text-xs font-bold cursor-pointer"
            >
              {isSubmitting ? 'Submitting Request...' : 'Submit Account Deletion Request'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
