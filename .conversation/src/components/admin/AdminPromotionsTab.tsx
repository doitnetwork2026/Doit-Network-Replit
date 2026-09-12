import React, { useState } from 'react';
import { 
  Tag, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  X, 
  TrendingUp, 
  Copy, 
  Check, 
  Percent, 
  DollarSign 
} from 'lucide-react';
import { PromotionCoupon } from '../../types/doit';
import { INITIAL_PROMOTIONS } from '../../data/mockDoitData';

interface AdminPromotionsTabProps {
  theme: 'light' | 'dark';
}

export const AdminPromotionsTab: React.FC<AdminPromotionsTabProps> = ({ theme }) => {
  const [coupons, setCoupons] = useState<PromotionCoupon[]>(INITIAL_PROMOTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New Coupon Form
  const [newCode, setNewCode] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FLAT'>('FLAT');
  const [discountValue, setDiscountValue] = useState(50);
  const [minBookingAmount, setMinBookingAmount] = useState(300);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState(100);
  const [usageLimit, setUsageLimit] = useState(500);
  const [description, setDescription] = useState('');

  const isDark = theme === 'dark';

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleStatus = (id: string) => {
    setCoupons(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: c.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE'
        };
      }
      return c;
    }));
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const newCoupon: PromotionCoupon = {
      id: `CPN-${Date.now().toString().slice(-3)}`,
      code: newCode.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minBookingAmount: Number(minBookingAmount),
      maxDiscountAmount: discountType === 'PERCENTAGE' ? Number(maxDiscountAmount) : undefined,
      applicableCategory: 'all',
      applicableArea: 'all',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      usageLimit: Number(usageLimit),
      usedCount: 0,
      status: 'ACTIVE',
      description: description.trim() || 'DOIT Promotional Discount'
    };

    setCoupons([newCoupon, ...coupons]);
    setIsCreateModalOpen(false);
    setNewCode('');
    setDescription('');
  };

  const filteredCoupons = coupons.filter(c => 
    !searchTerm || 
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            Promotions & Coupons Management
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Configure promotional codes and localized subsidies for BHEL Township households.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#00c29e] hover:bg-[#00a889] shadow-2xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className={`rounded-2xl border overflow-hidden ${
        isDark ? 'bg-zinc-900/70 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
      }`}>
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="relative w-full max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400" />
            <input
              type="text"
              placeholder="Search coupon code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border ${
                isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
              }`}
            />
          </div>
          <span className="text-xs text-zinc-400 font-semibold">
            {coupons.length} Active Promotions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                isDark ? 'border-zinc-800 text-zinc-400 bg-zinc-950/40' : 'border-zinc-200 text-zinc-500 bg-zinc-50'
              }`}>
                <th className="py-3 px-3">Coupon Code</th>
                <th className="py-3 px-3">Discount Type</th>
                <th className="py-3 px-3">Value</th>
                <th className="py-3 px-3">Min Booking</th>
                <th className="py-3 px-3">Usage Limit</th>
                <th className="py-3 px-3">Redemptions</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-zinc-800' : 'divide-zinc-100'}`}>
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className={isDark ? 'hover:bg-zinc-800/40' : 'hover:bg-zinc-50'}>
                  <td className="py-3 px-3 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700">
                        {coupon.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(coupon.code)}
                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                        title="Copy code"
                      >
                        {copiedCode === coupon.code ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {coupon.description && (
                      <p className="text-[10px] text-zinc-400 font-sans font-normal mt-0.5 max-w-[200px] truncate">
                        {coupon.description}
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-3 font-medium">
                    {coupon.discountType === 'PERCENTAGE' ? 'Percentage (%)' : 'Flat (₹)'}
                  </td>
                  <td className="py-3 px-3 font-bold text-zinc-900 dark:text-zinc-100">
                    {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                  </td>
                  <td className="py-3 px-3 text-zinc-600 dark:text-zinc-400">
                    ₹{coupon.minBookingAmount}
                  </td>
                  <td className="py-3 px-3 text-zinc-600 dark:text-zinc-400">
                    {coupon.usageLimit}
                  </td>
                  <td className="py-3 px-3 font-semibold text-zinc-800 dark:text-zinc-200">
                    {coupon.usedCount} used
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      coupon.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : coupon.status === 'SCHEDULED'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                          : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}>
                      {coupon.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(coupon.id)}
                      className={`text-xs font-bold hover:underline cursor-pointer ${
                        coupon.status === 'ACTIVE'
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {coupon.status === 'ACTIVE' ? 'Disable' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE COUPON MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`max-w-md w-full p-6 rounded-2xl border shadow-xl ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-bold">Create New Promotion Coupon</h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="pt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">Coupon Code:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DIWALI100"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  className={`w-full p-2.5 rounded-xl border font-mono font-bold ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">Discount Type:</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className={`w-full p-2.5 rounded-xl border ${
                      isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                    }`}
                  >
                    <option value="FLAT">Flat (₹)</option>
                    <option value="PERCENTAGE">Percentage (%)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                    Value {discountType === 'PERCENTAGE' ? '(%)' : '(₹)'}:
                  </label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className={`w-full p-2.5 rounded-xl border ${
                      isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">Min Order (₹):</label>
                  <input
                    type="number"
                    required
                    value={minBookingAmount}
                    onChange={(e) => setMinBookingAmount(Number(e.target.value))}
                    className={`w-full p-2.5 rounded-xl border ${
                      isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">Usage Limit:</label>
                  <input
                    type="number"
                    required
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className={`w-full p-2.5 rounded-xl border ${
                      isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">Description:</label>
                <input
                  type="text"
                  placeholder="e.g. Flat ₹50 off on gardening for BHEL residents"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                  }`}
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#00c29e] hover:bg-[#00a889] text-white font-bold cursor-pointer"
                >
                  Create Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
