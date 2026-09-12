import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  DollarSign, 
  Users, 
  Wrench 
} from 'lucide-react';
import { Booking, Provider, ProviderPayout } from '../../types/doit';

interface AdminReportsTabProps {
  bookings: Booking[];
  providers: Provider[];
  payouts?: ProviderPayout[];
  theme: 'light' | 'dark';
}

export const AdminReportsTab: React.FC<AdminReportsTabProps> = ({
  bookings,
  providers,
  payouts = [],
  theme
}) => {
  const [downloadingReport, setDownloadingReport] = useState<string | null>(null);
  const isDark = theme === 'dark';

  const downloadCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(e => e.map(cell => `"${cell}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportBookings = () => {
    setDownloadingReport('bookings');
    setTimeout(() => {
      const headers = ['Booking ID', 'Customer Name', 'Phone', 'Locality', 'Service', 'Provider', 'Date', 'Time', 'Amount (INR)', 'Payment Status', 'Booking Status'];
      const rows = bookings.map(b => [
        b.id,
        b.customerName,
        b.customerPhone,
        b.locality,
        b.categoryName,
        b.assignedProviderName || 'Unassigned',
        b.scheduledDate,
        b.scheduledTime,
        b.pricingBreakdown?.totalPayable || b.estimatedCost || 350,
        b.paymentStatus,
        b.status
      ]);
      downloadCSV('doit_bookings_report', headers, rows);
      setDownloadingReport(null);
    }, 400);
  };

  const handleExportRevenue = () => {
    setDownloadingReport('revenue');
    setTimeout(() => {
      const headers = ['Booking ID', 'Customer', 'Gross Amount', 'Platform Fee (10%)', 'Provider Payout', 'Payment Status'];
      const rows = bookings.map(b => {
        const gross = b.pricingBreakdown?.totalPayable || b.estimatedCost || 350;
        const fee = b.pricingBreakdown?.platformFee || Math.round(gross * 0.1);
        const payout = gross - fee;
        return [b.id, b.customerName, gross, fee, payout, b.paymentStatus];
      });
      downloadCSV('doit_revenue_report', headers, rows);
      setDownloadingReport(null);
    }, 400);
  };

  const handleExportProviders = () => {
    setDownloadingReport('providers');
    setTimeout(() => {
      const headers = ['Provider ID', 'Name', 'Phone', 'Service Category', 'Rating', 'Jobs Completed', 'KYC Status', 'Verification State'];
      const rows = providers.map(p => [
        p.id,
        p.name,
        p.phone,
        p.serviceName,
        p.rating,
        p.completedJobsCount,
        p.kycStatus?.status || 'SUBMITTED',
        p.isVerified ? 'VERIFIED' : 'PENDING'
      ]);
      downloadCSV('doit_providers_directory', headers, rows);
      setDownloadingReport(null);
    }, 400);
  };

  const handleExportPayouts = () => {
    setDownloadingReport('payouts');
    setTimeout(() => {
      const headers = ['Payout ID', 'Provider Name', 'Booking ID', 'Gross Amount', 'Platform Fee', 'Final Payout', 'UTR Number', 'Status'];
      const rows = payouts.map(p => [
        p.id,
        p.providerName,
        p.bookingId,
        p.customerAmount,
        p.platformFee,
        p.finalPayout,
        p.utrNumber || 'PENDING',
        p.status
      ]);
      downloadCSV('doit_payouts_statement', headers, rows);
      setDownloadingReport(null);
    }, 400);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
          Reports & Data Export (CSV)
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Generate audit-ready spreadsheets for accounting, operations, and compliance filing.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* REPORT 1: Bookings */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
          isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
        }`}>
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-[#e6faf6] dark:bg-[#00755f]/20 text-[#00755f] dark:text-[#99ede0] w-fit">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Bookings Master Report</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Full log of all customer appointments, locations, assigned providers, and current status.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExportBookings}
            disabled={downloadingReport === 'bookings'}
            className="mt-5 w-full py-2.5 px-3 rounded-xl bg-[#00c29e] hover:bg-[#00a889] text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadingReport === 'bookings' ? 'Exporting...' : 'Download CSV'}</span>
          </button>
        </div>

        {/* REPORT 2: Revenue */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
          isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
        }`}>
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 w-fit">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Revenue & Commission</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Breakdown of gross booking billings, platform retention, and provider disbursements.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExportRevenue}
            disabled={downloadingReport === 'revenue'}
            className="mt-5 w-full py-2.5 px-3 rounded-xl bg-[#00c29e] hover:bg-[#00a889] text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadingReport === 'revenue' ? 'Exporting...' : 'Download CSV'}</span>
          </button>
        </div>

        {/* REPORT 3: Providers */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
          isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
        }`}>
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 w-fit">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Provider Verification Log</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              List of onboarded professionals, ratings, jobs completed, and KYC document statuses.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExportProviders}
            disabled={downloadingReport === 'providers'}
            className="mt-5 w-full py-2.5 px-3 rounded-xl bg-[#00c29e] hover:bg-[#00a889] text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadingReport === 'providers' ? 'Exporting...' : 'Download CSV'}</span>
          </button>
        </div>

        {/* REPORT 4: Payouts */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
          isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
        }`}>
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 w-fit">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Payouts & Bank UTR</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Settlement history, bank reference numbers, approved payments, and dates.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExportPayouts}
            disabled={downloadingReport === 'payouts'}
            className="mt-5 w-full py-2.5 px-3 rounded-xl bg-[#00c29e] hover:bg-[#00a889] text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadingReport === 'payouts' ? 'Exporting...' : 'Download CSV'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
