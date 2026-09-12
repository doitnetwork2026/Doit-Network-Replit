import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  CalendarCheck, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  RotateCcw,
  Percent,
  ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { Booking, Provider } from '../../types/doit';

interface AdminAnalyticsTabProps {
  bookings: Booking[];
  providers: Provider[];
  theme: 'light' | 'dark';
}

export const AdminAnalyticsTab: React.FC<AdminAnalyticsTabProps> = ({
  bookings,
  providers,
  theme
}) => {
  const isDark = theme === 'dark';

  const sectorDemand = [
    { sector: 'Sector 1', requests: 42, fulfilled: 40 },
    { sector: 'Sector 2', requests: 35, fulfilled: 34 },
    { sector: 'Sector 3', requests: 28, fulfilled: 27 },
    { sector: 'Sector 4', requests: 22, fulfilled: 20 },
    { sector: 'Piplani', requests: 31, fulfilled: 30 },
    { sector: 'Govindpura', requests: 19, fulfilled: 18 },
  ];

  const hourlyTrends = [
    { hour: '8 AM', volume: 4 },
    { hour: '10 AM', volume: 18 },
    { hour: '12 PM', volume: 12 },
    { hour: '2 PM', volume: 8 },
    { hour: '4 PM', volume: 22 },
    { hour: '6 PM', volume: 26 },
    { hour: '8 PM', volume: 9 },
  ];

  const gridColor = isDark ? '#27272a' : '#f4f4f5';
  const axisColor = isDark ? '#71717a' : '#a1a1aa';
  const tooltipBg = isDark ? '#18181b' : '#ffffff';
  const tooltipBorder = isDark ? '#27272a' : '#e4e4e7';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
          Platform Growth & Hyperlocal Analytics
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Key operational performance indicators across BHEL township sectors.
        </p>
      </div>

      {/* 4 Deep Dive Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl border ${
          isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 block">
            Fulfillment Rate
          </span>
          <div className="text-2xl font-black text-zinc-900 dark:text-white mt-1">
            96.4%
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            Successful job completions
          </p>
        </div>

        <div className={`p-4 rounded-2xl border ${
          isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block">
            Avg Dispatch Time
          </span>
          <div className="text-2xl font-black text-zinc-900 dark:text-white mt-1">
            14 Mins
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            Booking to partner acceptance
          </p>
        </div>

        <div className={`p-4 rounded-2xl border ${
          isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 block">
            Avg Booking Value
          </span>
          <div className="text-2xl font-black text-zinc-900 dark:text-white mt-1">
            ₹425
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            Per completed service
          </p>
        </div>

        <div className={`p-4 rounded-2xl border ${
          isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500 block">
            Repeat Customer Rate
          </span>
          <div className="text-2xl font-black text-zinc-900 dark:text-white mt-1">
            38.2%
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            2+ bookings in 60 days
          </p>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sector Demand Bar Chart */}
        <div className={`p-5 rounded-2xl border ${
          isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Township Sector Demand & Fulfillment
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Total requests vs completed dispatches
              </p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorDemand} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="sector" stroke={axisColor} fontSize={11} />
                <YAxis stroke={axisColor} fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '12px' }}
                />
                <Bar dataKey="requests" fill="#3b82f6" name="Requests" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fulfilled" fill="#00c29e" name="Fulfilled" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Hours Line Chart */}
        <div className={`p-5 rounded-2xl border ${
          isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Peak Booking Hours
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Customer traffic spikes throughout the day
              </p>
            </div>
            <span className="text-xs font-bold text-[#00876e] dark:text-[#00c29e]">
              Peak: 4 PM - 7 PM
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="hour" stroke={axisColor} fontSize={11} />
                <YAxis stroke={axisColor} fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '12px' }}
                />
                <Line type="monotone" dataKey="volume" stroke="#00c29e" strokeWidth={2.5} dot={{ r: 4 }} name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
