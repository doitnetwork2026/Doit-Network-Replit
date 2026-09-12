import React, { useState, useMemo } from 'react';
import { 
  CalendarCheck, 
  Search, 
  Filter, 
  UserCheck, 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  MoreVertical, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ChevronRight, 
  UserPlus, 
  RotateCcw, 
  Ban,
  FileText,
  Phone,
  CreditCard,
  Send,
  Eye
} from 'lucide-react';
import { Booking, Provider, ServiceCategory, PaymentStatus, BookingStatus } from '../../types/doit';

interface AdminBookingsTabProps {
  bookings: Booking[];
  providers: Provider[];
  categories: ServiceCategory[];
  onAssignProvider: (bookingId: string, providerId: string) => void;
  onUpdateBookingStatus: (bookingId: string, newStatus: BookingStatus) => void;
  onRescheduleBooking: (bookingId: string, date: string, time: string) => void;
  onCancelBooking: (bookingId: string, reason: string) => void;
  onRefundBooking?: (bookingId: string, amount: number, reason: string) => void;
  theme: 'light' | 'dark';
}

export const AdminBookingsTab: React.FC<AdminBookingsTabProps> = ({
  bookings,
  providers,
  categories,
  onAssignProvider,
  onUpdateBookingStatus,
  onRescheduleBooking,
  onCancelBooking,
  onRefundBooking,
  theme
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');
  
  // Modals & Drawers
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [assignModalBooking, setAssignModalBooking] = useState<Booking | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [rescheduleBooking, setRescheduleBooking] = useState<Booking | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [refundModalBooking, setRefundModalBooking] = useState<Booking | null>(null);
  const [refundAmount, setRefundAmount] = useState(0);
  const [refundReason, setRefundReason] = useState('Customer dissatisfaction');

  // Internal admin notes
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [bookingNotes, setBookingNotes] = useState<Record<string, string[]>>({});

  const isDark = theme === 'dark';

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      // Search
      const search = searchTerm.toLowerCase();
      const matchSearch = !search || 
        b.id.toLowerCase().includes(search) ||
        b.customerName.toLowerCase().includes(search) ||
        b.customerPhone.includes(search) ||
        (b.assignedProviderName && b.assignedProviderName.toLowerCase().includes(search)) ||
        b.locality.toLowerCase().includes(search) ||
        b.categoryName.toLowerCase().includes(search);

      if (!matchSearch) return false;

      // Status
      if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;

      // Category
      if (categoryFilter !== 'ALL' && b.categoryId !== categoryFilter) return false;

      // Payment
      if (paymentFilter !== 'ALL' && b.paymentStatus !== paymentFilter) return false;

      return true;
    });
  }, [bookings, searchTerm, statusFilter, categoryFilter, paymentFilter]);

  const handleAddNote = (bookingId: string) => {
    if (!adminNoteInput.trim()) return;
    setBookingNotes(prev => ({
      ...prev,
      [bookingId]: [...(prev[bookingId] || []), `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${adminNoteInput.trim()}`]
    }));
    setAdminNoteInput('');
  };

  const handleConfirmAssign = () => {
    if (!assignModalBooking || !selectedProviderId) return;
    onAssignProvider(assignModalBooking.id, selectedProviderId);
    setAssignModalBooking(null);
    setSelectedProviderId('');
  };

  const handleConfirmReschedule = () => {
    if (!rescheduleBooking || !newDate) return;
    onRescheduleBooking(rescheduleBooking.id, newDate, newTime);
    setRescheduleBooking(null);
  };

  const handleConfirmCancel = () => {
    if (!cancelModalBooking) return;
    onCancelBooking(cancelModalBooking.id, cancelReason || 'Cancelled by Operations Desk');
    setCancelModalBooking(null);
    setCancelReason('');
  };

  const handleConfirmRefund = () => {
    if (!refundModalBooking || !onRefundBooking) return;
    onRefundBooking(refundModalBooking.id, refundAmount, refundReason);
    setRefundModalBooking(null);
  };

  return (
    <div className="space-y-5">
      {/* Header & Stats summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            Bookings Management
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Monitor, assign, reschedule, and manage customer service appointments in real-time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-3 py-1.5 rounded-xl border font-bold ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-700 shadow-2xs'
          }`}>
            Showing {filteredBookings.length} of {bookings.length} Bookings
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className={`p-4 rounded-2xl border space-y-3 ${
        isDark ? 'bg-zinc-900/70 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
      }`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by ID, customer, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border ${
                isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
              }`}
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl text-xs border cursor-pointer ${
                isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
              }`}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING_MATCH">Pending Match</option>
              <option value="MATCHED">Matched</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="ARRIVED">Arrived</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED_BY_CUSTOMER">Cancelled by Customer</option>
              <option value="CANCELLED_BY_PROVIDER">Cancelled by Provider</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl text-xs border cursor-pointer ${
                isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
              }`}
            >
              <option value="ALL">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl text-xs border cursor-pointer ${
                isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
              }`}
            >
              <option value="ALL">All Payments</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
        </div>

        {/* Active filter badges & reset */}
        {(searchTerm || statusFilter !== 'ALL' || categoryFilter !== 'ALL' || paymentFilter !== 'ALL') && (
          <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
            <span className="text-zinc-400 font-semibold">Active filters:</span>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
                setCategoryFilter('ALL');
                setPaymentFilter('ALL');
              }}
              className="text-[#00876e] dark:text-[#00c29e] hover:underline font-bold cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Bookings Table */}
      <div className={`rounded-2xl border overflow-hidden ${
        isDark ? 'bg-zinc-900/70 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                isDark ? 'border-zinc-800 text-zinc-400 bg-zinc-950/40' : 'border-zinc-200 text-zinc-500 bg-zinc-50'
              }`}>
                <th className="py-3 px-3">Booking ID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Service</th>
                <th className="py-3 px-3">Professional</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Scheduled Time</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-zinc-800' : 'divide-zinc-100'}`}>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-zinc-400">
                    No bookings found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const isUnassigned = !b.assignedProviderId || b.status === 'PENDING_MATCH';
                  return (
                    <tr key={b.id} className={`transition-colors ${isDark ? 'hover:bg-zinc-800/40' : 'hover:bg-zinc-50'}`}>
                      <td className="py-3 px-3 font-mono font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                        {b.id}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                          {b.customerName}
                        </div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          {b.customerPhone}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-medium text-zinc-800 dark:text-zinc-300">
                        {b.categoryName}
                      </td>
                      <td className="py-3 px-3">
                        {isUnassigned ? (
                          <button
                            type="button"
                            onClick={() => {
                              setAssignModalBooking(b);
                              setSelectedProviderId(providers[0]?.id || '');
                            }}
                            className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 hover:bg-amber-200 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <UserPlus className="w-3 h-3" />
                            <span>Assign Partner</span>
                          </button>
                        ) : (
                          <div className="font-medium text-zinc-900 dark:text-zinc-200 whitespace-nowrap">
                            {b.assignedProviderName}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                        {b.locality}
                      </td>
                      <td className="py-3 px-3 text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                        <div>{b.scheduledDate}</div>
                        <div className="text-[11px] text-zinc-400">{b.scheduledTime}</div>
                      </td>
                      <td className="py-3 px-3 font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                        ₹{b.pricingBreakdown?.totalPayable || b.estimatedCost || 350}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          b.paymentStatus === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : b.paymentStatus === 'REFUNDED'
                              ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400'
                              : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}>
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          b.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : b.status === 'PENDING_MATCH'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                              : b.status.includes('CANCELLED')
                                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                                : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                        }`}>
                          {b.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedBooking(b)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                            title="View Full Booking Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRescheduleBooking(b);
                              setNewDate(b.scheduledDate);
                              setNewTime(b.scheduledTime);
                            }}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                            title="Reschedule Appointment"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setCancelModalBooking(b)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                            title="Cancel Booking"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOOKING DETAIL DRAWER */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
          <div className={`w-full max-w-lg h-full p-6 overflow-y-auto border-l shadow-2xl transition-all ${
            isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <span className="text-[10px] font-bold text-[#00876e] dark:text-[#00c29e] uppercase tracking-wider">
                  Booking Dossier
                </span>
                <h3 className="text-lg font-black">{selectedBooking.id}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-5 text-xs">
              {/* Status Banner */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div>
                  <span className="text-zinc-400 text-[10px] uppercase font-bold block">Current Status</span>
                  <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {selectedBooking.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                  selectedBooking.paymentStatus === 'PAID'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                }`}>
                  Payment: {selectedBooking.paymentStatus}
                </span>
              </div>

              {/* Customer Information */}
              <div className="space-y-2">
                <h4 className="font-bold text-zinc-400 uppercase tracking-wider text-[11px]">
                  Customer Details
                </h4>
                <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Name:</span>
                    <span className="font-bold">{selectedBooking.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Phone:</span>
                    <a href={`tel:${selectedBooking.customerPhone}`} className="font-bold text-[#00876e] dark:text-[#00c29e] hover:underline">
                      {selectedBooking.customerPhone}
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Address:</span>
                    <span className="font-medium text-right max-w-[240px]">{selectedBooking.customerAddress || `${selectedBooking.locality}, Bhopal`}</span>
                  </div>
                </div>
              </div>

              {/* Assigned Partner */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-zinc-400 uppercase tracking-wider text-[11px]">
                    Assigned Professional
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setAssignModalBooking(selectedBooking);
                      setSelectedProviderId(providers[0]?.id || '');
                    }}
                    className="text-[#00876e] dark:text-[#00c29e] hover:underline font-bold cursor-pointer text-[11px]"
                  >
                    Change Partner
                  </button>
                </div>
                <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  {selectedBooking.assignedProviderName ? (
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Name:</span>
                        <span className="font-bold">{selectedBooking.assignedProviderName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Partner ID:</span>
                        <span className="font-mono">{selectedBooking.assignedProviderId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Phone:</span>
                        <span className="font-bold">{selectedBooking.assignedProviderPhone || '+91 98930 11223'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2 text-amber-600 dark:text-amber-400 font-medium">
                      No partner assigned yet. Click "Assign Partner" to dispatch.
                    </div>
                  )}
                </div>
              </div>

              {/* Service & Pricing Details */}
              <div className="space-y-2">
                <h4 className="font-bold text-zinc-400 uppercase tracking-wider text-[11px]">
                  Service & Pricing Breakdown
                </h4>
                <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Service:</span>
                    <span className="font-bold">{selectedBooking.categoryName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Base Fare:</span>
                    <span>₹{selectedBooking.pricingBreakdown?.basePrice || 350}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">DOIT Platform Fee:</span>
                    <span>₹{selectedBooking.pricingBreakdown?.platformFee || 35}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800 font-bold">
                    <span>Total Amount:</span>
                    <span className="text-sm text-[#00876e] dark:text-[#00c29e]">
                      ₹{selectedBooking.pricingBreakdown?.totalPayable || selectedBooking.estimatedCost || 385}
                    </span>
                  </div>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="space-y-2">
                <h4 className="font-bold text-zinc-400 uppercase tracking-wider text-[11px]">
                  Internal Admin Notes
                </h4>
                <div className="space-y-2">
                  {(bookingNotes[selectedBooking.id] || []).map((note, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-[11px]">
                      {note}
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add an internal operations note..."
                      value={adminNoteInput}
                      onChange={(e) => setAdminNoteInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddNote(selectedBooking.id)}
                      className={`flex-1 px-3 py-1.5 rounded-xl border text-xs ${
                        isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddNote(selectedBooking.id)}
                      className="px-3 py-1.5 rounded-xl bg-[#00c29e] hover:bg-[#00a889] text-white font-bold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions inside Drawer */}
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onUpdateBookingStatus(selectedBooking.id, 'COMPLETED');
                    setSelectedBooking(null);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer transition-colors"
                >
                  Mark Completed
                </button>
                {onRefundBooking && (
                  <button
                    type="button"
                    onClick={() => {
                      setRefundModalBooking(selectedBooking);
                      setRefundAmount(selectedBooking.pricingBreakdown?.totalPayable || selectedBooking.estimatedCost || 350);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer transition-colors"
                  >
                    Process Refund
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ASSIGN PROVIDER MODAL */}
      {assignModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`max-w-md w-full p-6 rounded-2xl border shadow-xl ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-bold">Assign Partner to {assignModalBooking.id}</h3>
              <button
                type="button"
                onClick={() => setAssignModalBooking(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-4 space-y-3 text-xs">
              <p className="text-zinc-500">
                Service: <strong className="text-zinc-900 dark:text-white">{assignModalBooking.categoryName}</strong> in {assignModalBooking.locality}
              </p>

              <div>
                <label className="block text-zinc-500 font-bold mb-1">Select Verified Professional:</label>
                <select
                  value={selectedProviderId}
                  onChange={(e) => setSelectedProviderId(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-xs ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300'
                  }`}
                >
                  {providers.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.serviceName}) - Rating: {p.rating} ★
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setAssignModalBooking(null)}
                  className="flex-1 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAssign}
                  className="flex-1 py-2 rounded-xl bg-[#00c29e] hover:bg-[#00a889] text-white font-bold cursor-pointer"
                >
                  Dispatch Partner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {rescheduleBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`max-w-md w-full p-6 rounded-2xl border shadow-xl ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-bold">Reschedule Appointment</h3>
              <button
                type="button"
                onClick={() => setRescheduleBooking(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-4 space-y-3 text-xs">
              <div>
                <label className="block text-zinc-500 font-bold mb-1">New Service Date:</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-xs ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-zinc-500 font-bold mb-1">Preferred Time Slot:</label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-xs ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300'
                  }`}
                >
                  <option value="09:00 AM">09:00 AM (Morning)</option>
                  <option value="11:00 AM">11:00 AM (Mid-Morning)</option>
                  <option value="02:00 PM">02:00 PM (Afternoon)</option>
                  <option value="04:30 PM">04:30 PM (Evening)</option>
                </select>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setRescheduleBooking(null)}
                  className="flex-1 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReschedule}
                  className="flex-1 py-2 rounded-xl bg-[#00c29e] hover:bg-[#00a889] text-white font-bold cursor-pointer"
                >
                  Confirm Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL MODAL */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`max-w-md w-full p-6 rounded-2xl border shadow-xl ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-rose-600">Cancel Booking {cancelModalBooking.id}</h3>
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-4 space-y-3 text-xs">
              <p className="text-zinc-500">
                Are you sure you want to cancel this booking? The customer and provider will be notified.
              </p>

              <div>
                <label className="block text-zinc-500 font-bold mb-1">Reason for cancellation:</label>
                <input
                  type="text"
                  placeholder="e.g., Customer requested via phone, Provider unavailable"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-xs ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300'
                  }`}
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setCancelModalBooking(null)}
                  className="flex-1 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold cursor-pointer"
                >
                  Abort
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REFUND MODAL */}
      {refundModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`max-w-md w-full p-6 rounded-2xl border shadow-xl ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-rose-600">Issue Refund for {refundModalBooking.id}</h3>
              <button
                type="button"
                onClick={() => setRefundModalBooking(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-4 space-y-3 text-xs">
              <div>
                <label className="block text-zinc-500 font-bold mb-1">Refund Amount (₹):</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  className={`w-full p-2.5 rounded-xl border text-xs ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-zinc-500 font-bold mb-1">Refund Justification:</label>
                <input
                  type="text"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-xs ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300'
                  }`}
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setRefundModalBooking(null)}
                  className="flex-1 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRefund}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                >
                  Authorize Refund
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
