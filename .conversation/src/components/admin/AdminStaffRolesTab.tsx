import React, { useState } from 'react';
import { ShieldCheck, User, Check, X, Plus } from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Super Admin' | 'Operations Manager' | 'KYC Verification Officer' | 'Customer Support Lead';
  permissions: string[];
  status: 'ACTIVE' | 'INACTIVE';
}

export const AdminStaffRolesTab: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffMember[]>([
    {
      id: 'STAFF-01',
      name: 'Aditya Srivastava',
      email: 'aditya.ops@doit-bhopal.in',
      phone: '98260 11001',
      role: 'Super Admin',
      permissions: ['All Permissions', 'Database & Config', 'Payouts', 'KYC', 'Disputes'],
      status: 'ACTIVE'
    },
    {
      id: 'STAFF-02',
      name: 'Pooja Tiwari',
      email: 'pooja.kyc@doit-bhopal.in',
      phone: '94250 33441',
      role: 'KYC Verification Officer',
      permissions: ['KYC Review', 'Police Document Verify', 'Provider Status'],
      status: 'ACTIVE'
    },
    {
      id: 'STAFF-03',
      name: 'Manish Chouhan',
      email: 'manish.dispatch@doit-bhopal.in',
      phone: '98930 55662',
      role: 'Operations Manager',
      permissions: ['Live Dispatch', 'Manual Assignment', 'Quotes Generation', 'Area Coverage'],
      status: 'ACTIVE'
    },
    {
      id: 'STAFF-04',
      name: 'Sneha Pandey',
      email: 'sneha.support@doit-bhopal.in',
      phone: '98260 77883',
      role: 'Customer Support Lead',
      permissions: ['Complaints & Tickets', 'Refund Recommendation', 'Customer Communication'],
      status: 'ACTIVE'
    }
  ]);

  const permissionMatrix = [
    { feature: 'Live Dispatch & Manual Matching', superAdmin: true, opsManager: true, kycOfficer: false, support: false },
    { feature: 'Provider KYC Document Approval/Rejection', superAdmin: true, opsManager: false, kycOfficer: true, support: false },
    { feature: 'Rate Card & Commission Modification', superAdmin: true, opsManager: true, kycOfficer: false, support: false },
    { feature: 'Partner Payout Release & Banking Approval', superAdmin: true, opsManager: false, kycOfficer: false, support: false },
    { feature: 'Customer Complaint Resolution & Refunds', superAdmin: true, opsManager: true, kycOfficer: false, support: true },
    { feature: 'CMS Content & Policy Editing', superAdmin: true, opsManager: false, kycOfficer: false, support: false },
    { feature: 'System Audit Logs Inspection', superAdmin: true, opsManager: true, kycOfficer: true, support: false }
  ];

  return (
    <div className="space-y-6">
      
      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">DOIT Operations Staff Directory</h3>
            <p className="text-xs text-zinc-500">Personnel managing BHEL township logistics, KYC verification, and support desk.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-700 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Role Title</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Core Privileges</th>
                <th className="py-3 px-4">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium">
              {staffList.map(s => (
                <tr key={s.id} className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-700 flex items-center justify-center font-bold text-xs">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-zinc-900 block">{s.name}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">{s.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-[#e6faf6] text-[#00755f] font-bold text-[11px] border border-[#99ede0]">
                      {s.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5 text-[11px]">
                      <span className="text-zinc-800 block">{s.email}</span>
                      <span className="text-zinc-400 font-mono">+91 {s.phone}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-zinc-600 text-[11px]">{s.permissions.join(', ')}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RBAC Permission Matrix */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-zinc-100">
          <h3 className="text-sm font-bold text-zinc-900">Role-Based Access Control (RBAC) Matrix</h3>
          <p className="text-xs text-zinc-500">Separation of duties enforced across customer data, KYC records, and payments.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-700 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Operational Privilege</th>
                <th className="py-3 px-4 text-center">Super Admin</th>
                <th className="py-3 px-4 text-center">Ops Manager</th>
                <th className="py-3 px-4 text-center">KYC Officer</th>
                <th className="py-3 px-4 text-center">Support Lead</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium">
              {permissionMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-3 px-4 font-semibold text-zinc-800">{item.feature}</td>
                  <td className="py-3 px-4 text-center">
                    {item.superAdmin ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-zinc-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.opsManager ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-zinc-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.kycOfficer ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-zinc-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.support ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-zinc-300 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
