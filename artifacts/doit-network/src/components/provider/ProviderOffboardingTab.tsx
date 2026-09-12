import React, { useState } from 'react';
import { Provider } from '../../types/doit';
import { UserX, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';

interface ProviderOffboardingTabProps {
  provider: Provider;
}

export const ProviderOffboardingTab: React.FC<ProviderOffboardingTabProps> = ({ provider }) => {
  const [reason, setReason] = useState('Found full-time industrial employment in BHEL');
  const [comments, setComments] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(() => {
    return localStorage.getItem(`doit_provider_offboarding_${provider.id}`);
  });

  const commissionDebt = provider.commissionOwed || 0;
  const hasDebt = commissionDebt > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasDebt) {
      alert(`You have an outstanding COD commission balance of ₹${commissionDebt}. Please settle this before submitting an offboarding request.`);
      return;
    }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    localStorage.setItem(`doit_provider_offboarding_${provider.id}`, 'SUBMITTED');
    setStatus('SUBMITTED');
    setIsSubmitting(false);
  };

  if (status) {
    return (
      <div className="max-w-xl mx-auto py-8 px-4 space-y-6">
        <Card className="border-amber-200 bg-amber-50/30">
          <CardHeader className="text-center pb-2">
            <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-2">
              <UserX className="w-6 h-6" />
            </div>
            <CardTitle className="text-lg font-bold text-zinc-900">
              Partner Offboarding Request Submitted
            </CardTitle>
            <p className="text-xs text-zinc-600">
              Professional: <b>{provider.name}</b> ({provider.phone})
            </p>
          </CardHeader>
          <CardContent className="space-y-4 text-xs text-zinc-700">
            <div className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-amber-800">Status: PENDING AUDIT</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Section 35 Clearance</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                The DOIT Operations Desk will verify completion of all past quarter dispatches, tool returns (if issued), and final payment release. Your profile will be archived once cleared.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem(`doit_provider_offboarding_${provider.id}`);
                setStatus(null);
              }}
              className="w-full text-xs h-10 border-zinc-300 cursor-pointer"
            >
              Withdraw Request & Remain Active Partner
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
          Partner Offboarding & Account Deletion
        </h2>
        <p className="text-xs text-zinc-500">
          Submit request to deregister from the DOIT BHEL Township service partner network.
        </p>
      </div>

      {hasDebt && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-900">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Outstanding COD Debt (₹{commissionDebt})</p>
            <p className="text-[11px] text-rose-700 mt-0.5">
              You must remit all pending platform commission fees before your account can be closed.
            </p>
          </div>
        </div>
      )}

      <Card className="border-zinc-200">
        <CardContent className="pt-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 space-y-1.5">
            <p className="font-bold text-zinc-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00c29e]" />
              Offboarding Terms:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-zinc-600">
              <li>Your KYC identity documents and police clearance records will be archived securely.</li>
              <li>You will stop receiving new customer dispatch pings.</li>
              <li>Any positive pending wallet balance will be remitted to your bank account within 3 business days.</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-700">Reason for Offboarding</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white font-medium"
              >
                <option value="Found full-time industrial employment in BHEL">Found full-time industrial employment in BHEL</option>
                <option value="Relocating outside Bhopal">Relocating outside Bhopal</option>
                <option value="Personal / Health reasons">Personal / Health reasons</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-zinc-700">Additional Remarks (Optional)</label>
              <textarea
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Share any feedback about your experience with DOIT..."
                className="w-full p-3 rounded-xl border border-zinc-200 font-medium"
              />
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer pt-2">
              <input
                type="checkbox"
                required
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-0.5 rounded text-[#00c29e] focus:ring-[#00c29e]"
              />
              <span className="text-[11px] text-zinc-600 leading-snug">
                I verify that I have completed all customer work orders assigned to me and have returned any DOIT equipment or materials.
              </span>
            </label>

            <Button
              type="submit"
              disabled={hasDebt || isSubmitting || !confirmed}
              variant="destructive"
              className="w-full h-11 text-xs font-bold cursor-pointer"
            >
              {isSubmitting ? 'Submitting Offboarding...' : 'Request Partner Offboarding'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
