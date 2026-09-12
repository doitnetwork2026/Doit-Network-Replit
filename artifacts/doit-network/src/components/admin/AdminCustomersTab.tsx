import React, { useState } from 'react';
import { Booking } from '../../types/doit';
import { Search, Users, Phone, MapPin, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';

interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  locality: string;
  quarterHouse: string;
  totalBookings: number;
  lastBookingDate: string;
  status: 'ACTIVE' | 'FLAGGED';
}

interface AdminCustomersTabProps {
  bookings: Booking[];
}

export const AdminCustomersTab: React.FC<AdminCustomersTabProps> = ({ bookings }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique customers from bookings
  const customerMap = new Map<string, CustomerRecord>();

  // Default seed customers
  const seedCustomers: CustomerRecord[] = [
    {
      id: 'CUST-8910',
      name: 'Prof. S. K. Verma',
      phone: '94250 11223',
      locality: 'BHEL Sector 1',
      quarterHouse: 'Qtr No. 24/A, Type 2',
      totalBookings: 3,
      lastBookingDate: 'Today',
      status: 'ACTIVE'
    },
    {
      id: 'CUST-3321',
      name: 'Ritu Saxena',
      phone: '98260 44556',
      locality: 'BHEL Sector 2',
      quarterHouse: 'House 14/B, Piplani Gate',
      totalBookings: 2,
      lastBookingDate: 'Yesterday',
      status: 'ACTIVE'
    },
    {
      id: 'CUST-7742',
      name: 'Rajesh Bhargava',
      phone: '94250 88991',
      locality: 'BHEL Sector 3',
      quarterHouse: 'Type-3 Officers Colony',
      totalBookings: 1,
      lastBookingDate: '06 Sept',
      status: 'ACTIVE'
    },
    {
      id: 'CUST-4419',
      name: 'Anand Murthy',
      phone: '98930 22334',
      locality: 'Govindpura Industrial Link',
      quarterHouse: 'Indrapuri C-Sector, Flat 204',
      totalBookings: 2,
      lastBookingDate: '05 Sept',
      status: 'ACTIVE'
    }
  ];

  seedCustomers.forEach(c => customerMap.set(c.id, c));

  // Merge any dynamic bookings
  bookings.forEach(b => {
    if (b.customerId && !customerMap.has(b.customerId)) {
      customerMap.set(b.customerId, {
        id: b.customerId,
        name: b.customerName,
        phone: b.customerPhone,
        locality: b.locality,
        quarterHouse: b.houseFlatNumber || b.address,
        totalBookings: 1,
        lastBookingDate: 'Recent',
        status: 'ACTIVE'
      });
    }
  });

  const customersList = Array.from(customerMap.values()).filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    c.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-2xs">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search customer by name, phone, ID..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Users className="w-4 h-4 text-[#00c29e]" />
          <span>Total Verified Customers: <b className="text-zinc-900">{customerMap.size}</b></span>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-700 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Primary Township Address</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium">
              {customersList.map(c => (
                <tr key={c.id} className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <span className="font-bold text-zinc-900 block">{c.name}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">{c.id}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-zinc-800">
                      <Phone className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="font-mono text-[11px]">+91 {c.phone}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-zinc-800 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span>{c.locality}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 block pl-4.5">{c.quarterHouse}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 font-bold text-[11px]">
                      {c.totalBookings} bookings
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-zinc-500 text-[11px]">
                    {c.lastBookingDate}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                      {c.status}
                    </span>
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
