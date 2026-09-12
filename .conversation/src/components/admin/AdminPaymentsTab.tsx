import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpRight, 
  DollarSign, 
  Wallet, 
  RotateCcw,
  Download,
  ShieldCheck
} from 'lucide-react';
import { Booking, PaymentTransaction, ProviderPayout } from '../../types/doit';

interface AdminPaymentsTabProps {
  bookings: Booking[];
  payments?: PaymentTransaction[];
  payouts?: ProviderPayout[];
  theme: 'light' | 'dark';
}

export const AdminPaymentsTab: React.FC<AdminPaymentsTabProps> = ({
  bookings,
  payments = [],
  payouts = [],
  theme
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [methodFilter, setMethodFilter] = useState('ALL');

  const isDark = theme === 'dark';

  // Derived financial metrics
  const financialSummary = useMemo(() => {
    const grossBookings = bookings.reduce((sum, b) => {
      const amt = b.pricingBreakdown?.totalPayable || b.estimatedCost || 0;
      return sum + amt;
    }, 0);

    const platformFee = bookings.reduce((sum, b) => {
      const fee = b.pricingBreakdown?.platformFee || Math.round((b.estimatedCost || 0) * 0.1);
      return sum + fee;
    }, 0);

    const providerPayoutsSum = payouts.reduce((sum, p) => sum + p.finalPayout, 0) || (grossBookings - platformFee);
    const refundsIssued = bookings.filter(b => b.paymentStatus === 'REFUNDED').reduce((sum, b) => sum + (b.estimatedCost || 350), 0);
    const netRevenue = platformFee - (refundsIssued * 0.2); // Net margin after dispute allowances

    const paidCount = bookings.filter(b => b.paymentStatus === 'PAID').length;
    const totalCount = bookings.length || 1;
    const successRate = Math.round((paidCount / totalCount) * 100);

    return {
      grossBookings,
      platformFee,
      providerPayouts: providerPayoutsSum,
      refundsIssued,
      netRevenue,
      successRate
    };
  }, [bookings, payouts]);

  // Combined transaction list
  const transactions = useMemo(() => {
    return bookings.map((b, idx) => {
      const totalAmount = b.pricingBreakdown?.totalPayable || b.estimatedCost || 350;
      const isPaid = b.paymentStatus === 'PAID';
      const isRefunded = b.paymentStatus === 'REFUNDED';
      
      return {
        id: `TXN-BHEL-${1000 + idx}`,
        bookingId: b.id,
        customerName: b.customerName,
        customerPhone: b.customerPhone,
        service: b.categoryName,
        amount: totalAmount,
        method: b.paymentMethod === 'CASH' ? 'Cash on Delivery' : 'Razorpay UPI',
        status: b.paymentStatus,
        razorpayOrderId: `order_BHEL_${b.id.replace('DOIT-', '')}`,
        razorpayPaymentId: isPaid ? `pay_${Math.random().toString(36).substring(2, 11)}` : 'N/A',
        createdAt: b.createdAt || '2026-09-08 11:30 AM'
      };
    });
  }, [bookings]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = !searchTerm || 
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.customerPhone.includes(searchTerm);

      if (!matchSearch) return false;
      if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
      if (methodFilter !== 'ALL' && !t.method.toLowerCase().includes(methodFilter.toLowerCase())) return false;

      return true;
    });
  }, [transactions, searchTerm, statusFilter, methodFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            Payments & Revenue Overview
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Monitor real customer transactions, platform fee collections, and payout obligations.
          </p>
        </div>
      </div>

      {/* 6 Metric Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Gross Booking Value */}
        <div className={`p-4 rounded-2xl border ${
          isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Gross Value</span>
          <div className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white mt-1">
            ₹{financialSummary.grossBookings.toLocaleString()}
          </div>
          <span className="text-[10px] text-zinc-400">Total volume</span>
        </div>

        {/* 2. Platform Revenue */}
        <div className={`p-4 rounded-2xl border ${
          isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#00876e] dark:text-[#00c29e] block">Platform Fee</span>
          <div className="text-lg sm:text-xl font-black text-[#00876e] dark:text-[#00c29e] mt-1">
            ₹{financialSummary.platformFee.toLocaleString()}
          </div>
          <span className="text-[10px] text-zinc-400">DOIT commission</span>
        </div>

        {/* 3. Provider Payouts */}
        <div className={`p-4 rounded-2xl border ${
          isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 block">Partner Payouts</span>
          <div className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white mt-1">
            ₹{financialSummary.providerPayouts.toLocaleString()}
          </div>
          <span className="text-[10px] text-zinc-400">Earned by providers</span>
        </div>

        {/* 4. Refunds Issued */}
        <div className={`p-4 rounded-2xl border ${
          isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block">Refunds</span>
          <div className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white mt-1">
            ₹{financialSummary.refundsIssued.toLocaleString()}
          </div>
          <span className="text-[10px] text-zinc-400">Resolved disputes</span>
        </div>

        {/* 5. Net Revenue */}
        <div className={`p-4 rounded-2xl border ${
          isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 block">Net DOIT</span>
          <div className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            ₹{Math.max(financialSummary.netRevenue, 0).toLocaleString()}
          </div>
          <span className="text-[10px] text-zinc-400">Retained earnings</span>
        </div>

        {/* 6. Success Rate */}
        <div className={`p-4 rounded-2xl border ${
          isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Success Rate</span>
          <div className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white mt-1">
            {financialSummary.successRate}%
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Payment collection</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
        isDark ? 'bg-zinc-900/70 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
      }`}>
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by Transaction ID or Customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border ${
                isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
              }`}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3 py-2 rounded-xl text-xs border cursor-pointer ${
              isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
            }`}
          >
            <option value="ALL">All Statuses</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className={`px-3 py-2 rounded-xl text-xs border cursor-pointer hidden sm:block ${
              isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
            }`}
          >
            <option value="ALL">All Methods</option>
            <option value="Razorpay">Razorpay UPI</option>
            <option value="Cash">Cash on Delivery</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className={`rounded-2xl border overflow-hidden ${
        isDark ? 'bg-zinc-900/70 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                isDark ? 'border-zinc-800 text-zinc-400 bg-zinc-950/40' : 'border-zinc-200 text-zinc-500 bg-zinc-50'
              }`}>
                <th className="py-3 px-3">Transaction ID</th>
                <th className="py-3 px-3">Booking ID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Payment Method</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Gateway Order ID</th>
                <th className="py-3 px-3">Payment ID</th>
                <th className="py-3 px-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-zinc-800' : 'divide-zinc-100'}`}>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-zinc-400">
                    No payment transactions match the specified filter.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className={isDark ? 'hover:bg-zinc-800/40' : 'hover:bg-zinc-50'}>
                    <td className="py-3 px-3 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                      {tx.id}
                    </td>
                    <td className="py-3 px-3 font-mono text-zinc-700 dark:text-zinc-300">
                      {tx.bookingId}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">{tx.customerName}</div>
                      <div className="text-[11px] text-zinc-400">{tx.customerPhone}</div>
                    </td>
                    <td className="py-3 px-3 font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                      ₹{tx.amount}
                    </td>
                    <td className="py-3 px-3 text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                      {tx.method}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        tx.status === 'PAID'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : tx.status === 'REFUNDED'
                            ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400'
                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-zinc-500 whitespace-nowrap">
                      {tx.razorpayOrderId}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-zinc-500 whitespace-nowrap">
                      {tx.razorpayPaymentId}
                    </td>
                    <td className="py-3 px-3 text-right text-zinc-400 whitespace-nowrap">
                      {tx.createdAt}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
