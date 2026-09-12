import React, { useState } from 'react';
import { UserX, AlertCircle, CheckCircle2, XCircle, ShieldAlert, FileText, HelpCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export interface AccountDeletionRequest {
  id: string;
  userId: string;
  userName: string;
  role: 'CUSTOMER' | 'PROVIDER';
  email: string;
  phone: string;
  requestDate: string;
  reason: string;
  status: 'REQUESTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  hasActiveBookings: boolean;
  outstandingDebt: number;
  pendingPayouts: number;
  reviewerNotes?: string;
}

const INITIAL_DELETION_REQUESTS: AccountDeletionRequest[] = [
  {
    id: 'DEL-2026-001',
    userId: 'CUST-0099',
    userName: 'Deepak Malviya',
    role: 'CUSTOMER',
    email: 'deepak.m@example.com',
    phone: '+91 94250 33441',
    requestDate: '2026-09-08 14:20',
    reason: 'Relocating outside BHEL Bhopal to Indore',
    status: 'REQUESTED',
    hasActiveBookings: false,
    outstandingDebt: 0,
    pendingPayouts: 0
  },
  {
    id: 'DEL-2026-002',
    userId: 'PRV-00130',
    userName: 'Mahesh Contractor',
    role: 'PROVIDER',
    email: 'mahesh.labour@example.com',
    phone: '+91 98260 99881',
    requestDate: '2026-09-07 09:15',
    reason: 'Taking full-time government job at BHEL Foundry',
    status: 'UNDER_REVIEW',
    hasActiveBookings: false,
    outstandingDebt: 450, // Has unpaid commission debt!
    pendingPayouts: 0
  }
];

export const AdminAccountDeletionsTab: React.FC = () => {
  const [requests, setRequests] = useState<AccountDeletionRequest[]>(INITIAL_DELETION_REQUESTS);
  const [selectedReq, setSelectedReq] = useState<AccountDeletionRequest | null>(null);
  const [rejectModal, setRejectModal] = useState<AccountDeletionRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = (req: AccountDeletionRequest) => {
    // Safety check
    if (req.outstandingDebt > 0) {
      alert(`Cannot delete account: User has ₹${req.outstandingDebt} in unpaid platform debt. Debt must be settled before deletion.`);
      return;
    }
    if (req.hasActiveBookings) {
      alert('Cannot delete account: Active service bookings are currently scheduled.');
      return;
    }

    if (!confirm(`Are you sure you want to approve deletion for ${req.userName}? Personal identity will be anonymized while financial and booking records are preserved for legal compliance.`)) {
      return;
    }

    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'APPROVED' } : r));
    alert(`Account deletion approved for ${req.userName}. Personal data anonymized. Ledger preserved.`);
  };

  const handleReject = () => {
    if (!rejectModal) return;
    setRequests(prev => prev.map(r => r.id === rejectModal.id ? {
      ...r,
      status: 'REJECTED',
      reviewerNotes: rejectionReason || 'Outstanding obligations exist'
    } : r));
    setRejectModal(null);
    setRejectionReason('');
    alert(`Account deletion request rejected.`);
  };

  return (
    <div className="space-y-6">
      {/* Safety Policy Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900">
          <p className="font-bold">Controlled Account Deletion & Anonymization Policy</p>
          <p className="mt-0.5 text-amber-800">
            Accounts are never immediately purged. Approving deletion initiates an anonymization protocol that sanitizes personal identifiers (PII) while strictly retaining financial audit logs, GST/tax transaction receipts, and booking references as mandated by Indian legal and accounting compliance.
          </p>
        </div>
      </div>

      <Card className="border-zinc-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <UserX className="w-5 h-5 text-[#00c29e]" />
            Account Deletion Requests Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-zinc-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-600 font-bold border-b border-zinc-200">
                <tr>
                  <th className="p-3">Request ID</th>
                  <th className="p-3">User & Role</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Pre-Conditions (Safety Check)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-zinc-50/50">
                    <td className="p-3 font-mono font-bold text-zinc-800">{req.id}</td>
                    <td className="p-3">
                      <div className="font-bold text-zinc-900">{req.userName}</div>
                      <Badge variant={req.role === 'CUSTOMER' ? 'secondary' : 'default'} className="mt-0.5 text-[10px]">
                        {req.role}
                      </Badge>
                    </td>
                    <td className="p-3 text-zinc-600">
                      <div>{req.email}</div>
                      <div className="font-mono text-[11px] text-zinc-400">{req.phone}</div>
                    </td>
                    <td className="p-3 max-w-xs text-zinc-700 truncate" title={req.reason}>
                      {req.reason}
                    </td>
                    <td className="p-3">
                      <div className="space-y-1 text-[11px]">
                        {req.outstandingDebt > 0 ? (
                          <span className="flex items-center gap-1 text-rose-600 font-bold">
                            <XCircle className="w-3.5 h-3.5" /> Debt: ₹{req.outstandingDebt}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-emerald-600 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> No Unpaid Debt
                          </span>
                        )}
                        {req.hasActiveBookings ? (
                          <span className="flex items-center gap-1 text-rose-600 font-bold">
                            <XCircle className="w-3.5 h-3.5" /> Active Bookings Open
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-emerald-600 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Zero Active Bookings
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={
                          req.status === 'APPROVED'
                            ? 'success'
                            : req.status === 'REJECTED'
                            ? 'destructive'
                            : 'warning'
                        }
                      >
                        {req.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      {req.status === 'REQUESTED' || req.status === 'UNDER_REVIEW' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-[11px] text-rose-600 hover:bg-rose-50 border-rose-200 cursor-pointer"
                            onClick={() => {
                              setRejectModal(req);
                              setRejectionReason(req.outstandingDebt > 0 ? `Unsettled commission of ₹${req.outstandingDebt} exists.` : '');
                            }}
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            className="h-7 text-[11px] bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                            onClick={() => handleApprove(req)}
                          >
                            Approve & Anonymize
                          </Button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-zinc-400 font-medium">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Rejection Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-zinc-200">
            <h3 className="text-base font-bold text-zinc-900">
              Reject Deletion Request ({rejectModal.id})
            </h3>
            <p className="text-xs text-zinc-500">
              Provide the official justification why {rejectModal.userName}'s account cannot be deleted at this time.
            </p>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-zinc-200"
              placeholder="e.g. Unpaid COD platform commission of ₹450 remains outstanding..."
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRejectModal(null)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleReject}
                className="cursor-pointer"
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
