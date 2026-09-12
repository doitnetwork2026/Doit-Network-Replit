import React, { useState } from 'react';
import { Provider } from '../../types/doit';
import { DollarSign, AlertTriangle, ArrowUpRight, CheckCircle2, ShieldAlert, RotateCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface ProviderEarningsLedgerProps {
  provider: Provider;
}

export const ProviderEarningsLedger: React.FC<ProviderEarningsLedgerProps> = ({ provider }) => {
  const [codBalance, setCodBalance] = useState<number>(provider.codCashInHand || 850);
  const [commissionOwed, setCommissionOwed] = useState<number>(provider.commissionOwed || Math.round(850 * 0.15));
  const [isPaying, setIsPaying] = useState(false);

  const debtLimit = 1500;
  const isNearLimit = commissionOwed >= debtLimit * 0.8;
  const isSuspendedRisk = commissionOwed >= debtLimit;

  const handleRemitCommission = async () => {
    setIsPaying(true);
    await new Promise(r => setTimeout(r, 600));
    alert(`Payment of ₹${commissionOwed} initiated via UPI Gateway. Settlement marked pending verification.`);
    setCommissionOwed(0);
    setCodBalance(0);
    setIsPaying(false);
  };

  return (
    <div className="space-y-6">
      {/* Risk Alert if Debt Cap Exceeded */}
      {isSuspendedRisk && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-900 text-xs">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">COD Commission Debt Cap Reached (₹{debtLimit})</p>
            <p className="text-rose-700 mt-0.5">
              Your account has exceeded the permissible cash-on-delivery commission ceiling. New dispatch assignments are temporarily paused until commission is remitted.
            </p>
          </div>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
          <span className="text-xs text-zinc-400 font-medium">Gross Billings (This Month)</span>
          <div className="text-2xl font-black text-zinc-900">
            ₹{provider.earningsThisMonth.gross.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-zinc-500">Across all completed township bookings</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
          <span className="text-xs text-zinc-400 font-medium">COD Cash Collected in Hand</span>
          <div className="text-2xl font-black text-amber-700">
            ₹{codBalance.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-zinc-500">Physical cash received from residents</span>
        </div>

        <div className={`p-5 rounded-2xl border shadow-2xs space-y-1 ${
          isNearLimit ? 'bg-rose-50/50 border-rose-200' : 'bg-white border-zinc-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">15% DOIT Platform Debt</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 font-bold">
              Cap: ₹{debtLimit}
            </span>
          </div>
          <div className="text-2xl font-black text-rose-600">
            ₹{commissionOwed.toLocaleString('en-IN')}
          </div>
          <div className="pt-2">
            <Button
              size="sm"
              disabled={commissionOwed === 0 || isPaying}
              onClick={handleRemitCommission}
              className="w-full h-8 text-xs font-bold bg-[#00c29e] hover:bg-[#00a889] text-white cursor-pointer"
            >
              <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
              {isPaying ? 'Processing...' : 'Remit Commission via UPI'}
            </Button>
          </div>
        </div>
      </div>

      {/* Penalties & Deductions Breakdown */}
      <Card className="border-zinc-200 shadow-2xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-zinc-900">
              Penalties & Policy Audit Log
            </CardTitle>
            <span className="text-xs text-zinc-400">Section 14 Fair Practice Code</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-zinc-800">Late Cancellation Fee (₹150)</span>
              <p className="text-[11px] text-zinc-500">Booking DOIT-2026-000003 cancelled with &lt; 2 hours notice</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="destructive">-₹150</Badge>
              <button
                onClick={() => alert('Dispute form submitted to BHEL Operations Coordinator. Resolution in 24h.')}
                className="text-[11px] text-[#00876e] font-semibold underline cursor-pointer"
              >
                Dispute
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#00c29e]/5 border border-[#00c29e]/20 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-[#00876e]">Prompt Attendance Bonus (+₹100)</span>
              <p className="text-[11px] text-zinc-500">On-time arrival in Sector 1 for 5 consecutive bookings</p>
            </div>
            <Badge variant="success">+₹100</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
