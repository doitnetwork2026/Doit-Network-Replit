import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  CreditCard, 
  Building, 
  Clock, 
  Percent, 
  AlertCircle 
} from 'lucide-react';
import { CMSContent } from '../../types/doit';

interface AdminSettingsTabProps {
  cmsContent: CMSContent;
  onUpdateCms?: (updated: CMSContent) => void;
  theme: 'light' | 'dark';
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  cmsContent,
  onUpdateCms,
  theme
}) => {
  const [phone, setPhone] = useState(cmsContent.contactPhone || '+91 755 244 8900');
  const [email, setEmail] = useState(cmsContent.contactEmail || 'doitnetworksupport@gmail.com');
  const [address, setAddress] = useState(cmsContent.contactAddress || 'Sector 2 Shopping Complex, Near Post Office, BHEL Township, Bhopal');
  const [commissionRate, setCommissionRate] = useState(10);
  const [operatingStart, setOperatingStart] = useState('08:00 AM');
  const [operatingEnd, setOperatingEnd] = useState('08:00 PM');
  const [cancellationWindowHours, setCancellationWindowHours] = useState(2);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isDark = theme === 'dark';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateCms) {
      onUpdateCms({
        ...cmsContent,
        contactPhone: phone,
        contactEmail: email,
        contactAddress: address
      });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            Admin & Operational Settings
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Configure township operations, commission schedules, support helplines, and gateway integrations.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Platform settings updated and persisted successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SECTION 1: Platform Profile & BHEL Desk */}
        <div className={`p-5 rounded-2xl border space-y-4 ${
          isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
        }`}>
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <Building className="w-4 h-4 text-[#00c29e]" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Township Coordination Desk
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                Support Helpline Phone:
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full p-2.5 rounded-xl border ${
                  isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                }`}
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                Official Operations Email:
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-2.5 rounded-xl border ${
                  isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                }`}
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                Physical Operations Desk Address:
              </label>
              <textarea
                rows={3}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`w-full p-2.5 rounded-xl border ${
                  isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                }`}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Operational Dispatch Rules */}
        <div className={`p-5 rounded-2xl border space-y-4 ${
          isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
        }`}>
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <Clock className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Service Windows & Cancellation
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  Start Hours:
                </label>
                <input
                  type="text"
                  value={operatingStart}
                  onChange={(e) => setOperatingStart(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                  }`}
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  Closing Hours:
                </label>
                <input
                  type="text"
                  value={operatingEnd}
                  onChange={(e) => setOperatingEnd(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                Free Customer Cancellation Window (Hours prior to slot):
              </label>
              <input
                type="number"
                value={cancellationWindowHours}
                onChange={(e) => setCancellationWindowHours(Number(e.target.value))}
                className={`w-full p-2.5 rounded-xl border ${
                  isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                }`}
              />
              <span className="text-[10px] text-zinc-400 mt-0.5 block">
                Cancellations within this window incur a ₹50 provider travel compensation fee.
              </span>
            </div>

            <div>
              <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                Standard Platform Commission (%):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className={`w-full p-2.5 rounded-xl border ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                  }`}
                />
                <span className="font-bold text-zinc-500">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Payment Gateway Status (Razorpay) */}
        <div className={`p-5 rounded-2xl border space-y-4 lg:col-span-2 ${
          isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Payment Gateway Configuration
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
              Active & Operational
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="text-zinc-400 text-[10px] uppercase font-bold block">Gateway Provider</span>
              <span className="font-bold text-sm">Razorpay (India UPI / Cards / Net Banking)</span>
              <p className="text-[11px] text-zinc-500">Connected to DOIT Bhopal Corporate Escrow Account</p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="text-zinc-400 text-[10px] uppercase font-bold block">Key Identifier</span>
              <span className="font-mono font-bold text-xs">rzp_test_904838483928</span>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Secret keys securely vaulted server-side.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-[#00c29e] hover:bg-[#00a889] text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
