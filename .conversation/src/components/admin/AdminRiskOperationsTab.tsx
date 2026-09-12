import React, { useState, useEffect } from 'react';
import { Booking, Provider } from '../../types/doit';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  DollarSign, 
  UserX, 
  HelpCircle,
  TrendingDown,
  RefreshCw,
  Eye,
  Ban
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface AdminRiskOperationsTabProps {
  bookings: Booking[];
  providers: Provider[];
  onSuspendProvider?: (providerId: string, reason: string) => void;
}

export const AdminRiskOperationsTab: React.FC<AdminRiskOperationsTabProps> = ({
  bookings,
  providers,
  onSuspendProvider
}) => {
  const [penaltyEntries, setPenaltyEntries] = useState<any[]>([]);
  const [isLoadingPenalties, setIsLoadingPenalties] = useState(false);

  // Compute mock overdue COD entries
  const codCompletedBookings = bookings.filter(b => b.paymentMethod === 'COD' && b.status === 'COMPLETED');

  useEffect(() => {
    fetchCalculatedPenalties();
  }, [providers.length]);

  const fetchCalculatedPenalties = async () => {
    setIsLoadingPenalties(true);
    try {
      // Build sample provider overdue profiles
      const payload = providers.slice(0, 5).map((p, idx) => ({
        providerId: p.id,
        providerName: p.name,
        unpaidCommission: idx === 1 ? 450 : idx === 3 ? 820 : 0,
        daysOverdue: idx === 1 ? 2 : idx === 3 ? 8 : 0
      }));

      const res = await fetch('/api/policy/calculate-penalties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ overdueEntries: payload })
      });

      if (res.ok) {
        const data = await res.json();
        setPenaltyEntries(data.entries || []);
      }
    } catch (e) {
      console.warn('Penalty engine fallback:', e);
    } finally {
      setIsLoadingPenalties(false);
    }
  };

  // Mock Payment Discrepancies
  const paymentDiscrepancies = [
    {
      id: 'DISC-001',
      bookingId: 'DOIT-2026-000001',
      providerId: 'PRV-00124',
      providerName: 'Ramprasad Kushwaha',
      customerName: 'Shalini Verma',
      quotedAmount: 500,
      customerConfirmedPaid: 650,
      discrepancy: 150,
      status: 'MANUAL_REVIEW_REQUIRED',
      date: 'Today, 2:30 PM'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Operations Center Header & 4 Status Standard Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">GREEN</span>
            <p className="text-xs font-bold">Good & Healthy</p>
            <span className="text-[11px] text-emerald-700">18 Providers Active</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">YELLOW</span>
            <p className="text-xs font-bold">Needs Attention</p>
            <span className="text-[11px] text-amber-700">1 Discrepancy Flag</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-800">RED</span>
            <p className="text-xs font-bold">Overdue / Debt Risk</p>
            <span className="text-[11px] text-rose-700">1 Overdue Commission</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-white flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center shrink-0 border border-zinc-700">
            <Ban className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">BLACK</span>
            <p className="text-xs font-bold">Suspended</p>
            <span className="text-[11px] text-zinc-400">1 Account on Hold</span>
          </div>
        </div>
      </div>

      {/* Overdue COD Commission & Penalty Policy Engine */}
      <Card className="border-zinc-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#00c29e]" />
              COD Commission & Overdue Debt Engine
            </CardTitle>
            <p className="text-xs text-zinc-500 mt-0.5">
              Deterministic policy: Day 0: 0% interest; Day 1–6: 1% daily penalty; Day 7+: Eligible for suspension.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCalculatedPenalties}
            disabled={isLoadingPenalties}
            className="text-xs h-8 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoadingPenalties ? 'animate-spin' : ''}`} />
            Recalculate
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-zinc-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-600 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3">Partner</th>
                  <th className="p-3">Principal Unpaid</th>
                  <th className="p-3">Days Overdue</th>
                  <th className="p-3">Calculated Penalty (1%/day)</th>
                  <th className="p-3">Total Outstanding</th>
                  <th className="p-3">Financial Status</th>
                  <th className="p-3 text-right">Operational Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {penaltyEntries.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/50">
                    <td className="p-3 font-semibold text-zinc-900">
                      <div>{entry.providerName}</div>
                      <span className="text-[10px] text-zinc-400 font-mono">{entry.providerId}</span>
                    </td>
                    <td className="p-3 font-bold text-zinc-900">₹{entry.principalCommission}</td>
                    <td className="p-3">
                      <span className={`font-mono font-bold ${entry.daysOverdue > 6 ? 'text-rose-600' : entry.daysOverdue > 0 ? 'text-amber-600' : 'text-zinc-500'}`}>
                        {entry.daysOverdue} Days
                      </span>
                    </td>
                    <td className="p-3 font-medium text-rose-600">
                      +₹{entry.penalty}
                    </td>
                    <td className="p-3 font-bold text-zinc-900">
                      ₹{entry.totalDebt}
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={
                          entry.status === 'GREEN'
                            ? 'success'
                            : entry.status === 'RED / DEBT WARNING'
                            ? 'destructive'
                            : 'warning'
                        }
                      >
                        {entry.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      {entry.suspensionEligible ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onSuspendProvider?.(entry.providerId, 'Unpaid COD commission exceeded 7 days')}
                          className="h-7 text-[11px] cursor-pointer"
                        >
                          Suspend Account
                        </Button>
                      ) : (
                        <span className="text-[11px] text-zinc-400 font-medium">In Grace / Warning</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Discrepancies Detector */}
      <Card className="border-amber-200 bg-amber-50/20 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Payment Discrepancy Detection (Customer Confirmed vs Quoted)
          </CardTitle>
          <p className="text-xs text-zinc-500">
            Triggered automatically when customer confirms a cash payment differing from approved quoted amount.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paymentDiscrepancies.map((disc) => (
              <div
                key={disc.id}
                className="p-4 rounded-xl bg-white border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-800">{disc.id}</span>
                    <Badge variant="warning">{disc.status}</Badge>
                    <span className="text-[11px] text-zinc-400">{disc.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-900 mt-1">
                    Booking {disc.bookingId} — Partner: {disc.providerName}
                  </h4>
                  <div className="flex items-center gap-3 text-[11px] text-zinc-600 mt-1">
                    <span>Quoted: <b>₹{disc.quotedAmount}</b></span>
                    <span>Customer Confirmed Cash: <b>₹{disc.customerConfirmedPaid}</b></span>
                    <span className="text-rose-600 font-bold">Discrepancy: +₹{disc.discrepancy}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs cursor-pointer"
                    onClick={() => alert(`Reviewing discrepancy for ${disc.bookingId}. Coordinator contact initiated.`)}
                  >
                    Investigate
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="h-8 text-xs cursor-pointer"
                    onClick={() => alert(`Adjusted platform commission to reflect actual collected amount of ₹${disc.customerConfirmedPaid}.`)}
                  >
                    Reconcile Ledger
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
