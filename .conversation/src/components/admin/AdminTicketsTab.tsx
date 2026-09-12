import React, { useState } from 'react';
import { SupportTicket, Booking } from '../../types/doit';
import { AlertCircle, CheckCircle2, Clock, MessageSquare, Search, Filter, ShieldCheck, DollarSign } from 'lucide-react';

interface AdminTicketsTabProps {
  tickets: SupportTicket[];
  bookings: Booking[];
  onResolveTicket?: (ticketId: string, resolution: string, refund?: number) => void;
}

export const AdminTicketsTab: React.FC<AdminTicketsTabProps> = ({
  tickets: initialTickets,
  bookings,
  onResolveTicket
}) => {
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [refundAmount, setRefundAmount] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredTickets = tickets.filter(t => 
    statusFilter === 'ALL' ? true : t.status === statusFilter
  );

  const handleResolve = () => {
    if (!selectedTicket) return;
    const updated = tickets.map(t => 
      t.id === selectedTicket.id 
        ? { ...t, status: 'RESOLVED' as const, resolutionNotes: resolutionNotes || 'Resolved as per township policy', resolvedAt: 'Today' }
        : t
    );
    setTickets(updated);
    if (onResolveTicket) {
      onResolveTicket(selectedTicket.id, resolutionNotes || 'Resolved as per township policy', refundAmount);
    }
    setSelectedTicket(null);
    setResolutionNotes('');
    setRefundAmount(0);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-2xs">
        <div>
          <h3 className="text-sm font-bold text-zinc-900">Disputes & Support Grievances</h3>
          <p className="text-xs text-zinc-500">Manage customer complaints, billing discrepancies, service quality issues, and refund requests.</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-zinc-200 rounded-xl bg-white focus:outline-none focus:border-[#00c29e]"
          >
            <option value="ALL">All Ticket Statuses</option>
            <option value="OPEN">Open (Needs Attention)</option>
            <option value="IN_PROGRESS">Under Review</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-700 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Subject & Category</th>
                <th className="py-3 px-4">Customer & Order</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Reported</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium">
              {filteredTickets.map(t => (
                <tr key={t.id} className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-zinc-900">{t.id}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-zinc-900 block">{t.subject || t.category}</span>
                    <span className="text-[10px] text-zinc-400">{t.category}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-zinc-800 block">{t.customerName || t.userName || 'BHEL Resident'}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">Ref: {t.bookingId}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.priority === 'HIGH' ? 'bg-rose-50 text-rose-700' :
                      t.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-700' :
                      'bg-zinc-100 text-zinc-600'
                    }`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      t.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400 text-[11px]">{t.createdAt}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedTicket(t);
                        setResolutionNotes(t.resolutionNotes || '');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[11px] cursor-pointer"
                    >
                      {t.status === 'RESOLVED' ? 'View Details' : 'Resolve'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Details & Resolution Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div 
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-zinc-200 p-6 space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <span className="text-[10px] text-zinc-400 font-mono block">TICKET: {selectedTicket.id}</span>
                <h4 className="text-sm font-bold text-zinc-900">{selectedTicket.subject}</h4>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-zinc-400 hover:text-zinc-700">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="text-zinc-400 font-medium block text-[11px]">Customer Grievance</span>
                <p className="text-zinc-800 font-medium leading-relaxed">{selectedTicket.description}</p>
                <div className="flex items-center justify-between pt-2 text-[10px] text-zinc-400 border-t border-zinc-200/60">
                  <span>Customer: {selectedTicket.customerName}</span>
                  <span>Booking: {selectedTicket.bookingId}</span>
                </div>
              </div>

              {selectedTicket.status !== 'RESOLVED' ? (
                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700">Resolution Decision / Note *</label>
                    <textarea
                      rows={3}
                      value={resolutionNotes}
                      onChange={e => setResolutionNotes(e.target.value)}
                      placeholder="Detail the investigation outcome, provider counsel, or rework agreement..."
                      className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700">Issue Refund to Customer (₹ - Optional)</label>
                    <input
                      type="number"
                      value={refundAmount}
                      onChange={e => setRefundAmount(Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
                    <button
                      onClick={() => setSelectedTicket(null)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleResolve}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                    >
                      Mark Resolved & Close Ticket
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Ticket Resolved
                  </div>
                  <p className="text-[11px] text-emerald-700">{selectedTicket.resolutionNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
