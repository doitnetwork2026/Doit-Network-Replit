import React, { useState } from 'react';
import { 
  ScrollText, 
  Search, 
  Filter, 
  ShieldCheck, 
  Clock, 
  User, 
  Calendar,
  ChevronDown
} from 'lucide-react';
import { AuditLog } from '../../types/doit';

interface AdminAuditLogsTabProps {
  auditLogs: AuditLog[];
  theme: 'light' | 'dark';
}

export const AdminAuditLogsTab: React.FC<AdminAuditLogsTabProps> = ({
  auditLogs,
  theme
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const isDark = theme === 'dark';

  const filteredLogs = auditLogs.filter(log => {
    const search = searchTerm.toLowerCase();
    const matchSearch = !search ||
      log.action.toLowerCase().includes(search) ||
      log.details.toLowerCase().includes(search) ||
      (log.actor && log.actor.toLowerCase().includes(search)) ||
      (log.staffName && log.staffName.toLowerCase().includes(search)) ||
      (log.bookingId && log.bookingId.toLowerCase().includes(search)) ||
      (log.providerId && log.providerId.toLowerCase().includes(search));

    if (!matchSearch) return false;
    if (actionFilter !== 'ALL' && !log.action.toUpperCase().includes(actionFilter)) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
          Security & Operations Audit Logs
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Immutable audit trail of administrator approvals, KYC validations, payouts, and customer overrides.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
        isDark ? 'bg-zinc-900/70 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
      }`}>
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400" />
          <input
            type="text"
            placeholder="Search audit logs by actor, action, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border ${
              isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
            }`}
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className={`px-3 py-2 rounded-xl text-xs border cursor-pointer ${
            isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
          }`}
        >
          <option value="ALL">All Actions</option>
          <option value="KYC">KYC Approvals / Rejections</option>
          <option value="PAYOUT">Payout Approvals</option>
          <option value="BOOKING">Booking Modifications</option>
          <option value="REFUND">Refund Authorizations</option>
          <option value="ROLE">Role & Staff Updates</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className={`rounded-2xl border overflow-hidden ${
        isDark ? 'bg-zinc-900/70 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                isDark ? 'border-zinc-800 text-zinc-400 bg-zinc-950/40' : 'border-zinc-200 text-zinc-500 bg-zinc-50'
              }`}>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Staff / Administrator</th>
                <th className="py-3 px-3">Action Performed</th>
                <th className="py-3 px-3">Target Reference</th>
                <th className="py-3 px-3">Action Details</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-zinc-800' : 'divide-zinc-100'}`}>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-400">
                    No audit records match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className={isDark ? 'hover:bg-zinc-800/40' : 'hover:bg-zinc-50'}>
                    <td className="py-3 px-3 text-zinc-500 dark:text-zinc-400 whitespace-nowrap font-mono text-[11px]">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {log.staffName || log.actor || 'rrichi336@gmail.com'}
                      </div>
                      <div className="text-[10px] text-[#00876e] dark:text-[#99ede0]">
                        {log.actorRole || 'SUPER ADMIN'}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                      {log.bookingId || log.providerId || 'SYSTEM'}
                    </td>
                    <td className="py-3 px-3 text-zinc-600 dark:text-zinc-300 max-w-md">
                      {log.details}
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
