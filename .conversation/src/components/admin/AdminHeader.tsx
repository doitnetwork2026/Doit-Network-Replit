import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Menu, 
  LogOut, 
  ShieldCheck, 
  User, 
  Settings, 
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Clock,
  X
} from 'lucide-react';
import { DoitLogo } from '../common/DoitLogo';
import { NotificationItem } from '../../types/doit';

interface AdminHeaderProps {
  currentTab: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenMobileSidebar: () => void;
  onOpenSearch: () => void;
  adminSession: {
    email: string;
    role: string;
    permissions: string[];
  };
  onLogout: () => void;
  onViewWebsite: () => void;
  notifications?: NotificationItem[];
  pendingKycCount?: number;
  unassignedBookingsCount?: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentTab,
  theme,
  onToggleTheme,
  onOpenMobileSidebar,
  onOpenSearch,
  adminSession,
  onLogout,
  onViewWebsite,
  notifications = [],
  pendingKycCount = 0,
  unassignedBookingsCount = 0,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';

  // Format tab title
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Admin Dashboard';
      case 'bookings': return 'Bookings Management';
      case 'customers': return 'Customer CRM';
      case 'providers': return 'Service Professionals';
      case 'services': return 'Services & Pricing';
      case 'service-areas': return 'Service Areas & Coverage';
      case 'payments': return 'Payments & Transactions';
      case 'payouts': return 'Provider Payouts';
      case 'revenue': return 'Revenue & Sales';
      case 'reviews': return 'Reviews & Moderation';
      case 'support': return 'Support & Complaints';
      case 'notifications': return 'Notifications Center';
      case 'promotions': return 'Promotions & Coupons';
      case 'analytics': return 'Growth Analytics';
      case 'reports': return 'Reports & Exports';
      case 'content': return 'Content Management (CMS)';
      case 'settings': return 'Admin Settings';
      case 'roles': return 'Staff Roles & Permissions';
      case 'audit-logs': return 'Audit Logs';
      case 'risk': return 'Risk & Operations Desk';
      case 'refunds': return 'Refunds Desk';
      default: return 'Admin Operations';
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalAlerts = pendingKycCount + unassignedBookingsCount;

  return (
    <header className={`sticky top-0 z-30 transition-colors border-b ${
      isDark 
        ? 'bg-zinc-950/95 border-zinc-800/80 backdrop-blur-md text-zinc-100' 
        : 'bg-white/95 border-zinc-200/80 backdrop-blur-md text-zinc-900'
    }`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Mobile hamburger & Active Section Title */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={onOpenMobileSidebar}
              className={`lg:hidden p-2 rounded-xl transition-colors cursor-pointer ${
                isDark ? 'hover:bg-zinc-900 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-600'
              }`}
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand in Header (Mobile/Tablet) */}
            <div className="lg:hidden flex items-center gap-2">
              <DoitLogo className="w-7 h-7" />
              <span className="font-extrabold text-sm tracking-tight text-[#00876e] dark:text-[#00c29e]">
                Admin
              </span>
            </div>

            {/* Desktop Section Title */}
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight truncate">
                  {getTabTitle(currentTab)}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#e6faf6] text-[#00755f] border border-[#99ede0] dark:bg-[#00755f]/20 dark:text-[#99ede0] dark:border-[#00755f]/40 hidden md:inline-block">
                  BHEL Bhopal
                </span>
              </div>
            </div>
          </div>

          {/* Center/Right: Global Search bar trigger */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-md justify-end sm:justify-center">
            <button
              type="button"
              onClick={onOpenSearch}
              className={`w-full max-w-[260px] sm:max-w-xs flex items-center justify-between px-3 py-1.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                isDark 
                  ? 'bg-zinc-900/90 border-zinc-800 text-zinc-400 hover:border-zinc-700' 
                  : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100/70 hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Search bookings, customers, partners...</span>
              </div>
              <kbd className={`hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-white border-zinc-300 text-zinc-500'
              }`}>
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right: Actions (View Website, Theme toggle, Notifications, Profile) */}
          <div className="flex items-center gap-2">
            {/* View Website Link */}
            <button
              type="button"
              onClick={onViewWebsite}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                isDark 
                  ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800' 
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
              }`}
              title="Switch to customer-facing website"
            >
              <span>Customer Site</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={onToggleTheme}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isDark 
                  ? 'bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-zinc-800' 
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications Menu */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className={`relative p-2 rounded-xl transition-colors cursor-pointer ${
                  isDark 
                    ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800' 
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                }`}
                title="Admin Notifications"
              >
                <Bell className="w-4 h-4" />
                {totalAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00c29e] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                    {totalAlerts}
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {showNotifMenu && (
                <div className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border shadow-xl p-3 z-50 transition-all ${
                  isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
                }`}>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-[#00c29e]" />
                      <h3 className="text-xs font-bold">Admin Notifications</h3>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-semibold">
                      {totalAlerts} active alerts
                    </span>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {unassignedBookingsCount > 0 && (
                      <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2 text-xs">
                        <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-amber-900 dark:text-amber-300">
                            {unassignedBookingsCount} Bookings Need Matching
                          </p>
                          <p className="text-[11px] text-amber-800/80 dark:text-amber-400">
                            New customer service requests waiting for provider dispatch in Sector 1 & 2.
                          </p>
                        </div>
                      </div>
                    )}

                    {pendingKycCount > 0 && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-2 text-xs">
                        <ShieldCheck className="w-4 h-4 text-[#00c29e] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-emerald-900 dark:text-emerald-300">
                            {pendingKycCount} Providers Awaiting KYC Review
                          </p>
                          <p className="text-[11px] text-emerald-800/80 dark:text-emerald-400">
                            Government ID and address documents submitted for verification.
                          </p>
                        </div>
                      </div>
                    )}

                    {notifications.slice(0, 3).map((n) => (
                      <div 
                        key={n.id} 
                        className={`p-2.5 rounded-xl border text-xs space-y-0.5 ${
                          isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200/80'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold">{n.title}</span>
                          <span className="text-[10px] text-zinc-400">{n.createdAt}</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                          {n.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border transition-colors cursor-pointer ${
                  isDark 
                    ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' 
                    : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100/80'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-[#00c29e] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  {adminSession.email.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="text-xs font-bold block truncate max-w-[120px]">
                    {adminSession.email}
                  </span>
                  <span className="text-[10px] text-[#00876e] dark:text-[#99ede0] font-semibold block -mt-0.5">
                    {adminSession.role}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className={`absolute right-0 mt-2 w-56 rounded-2xl border shadow-xl p-2 z-50 transition-all ${
                  isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
                }`}>
                  <div className="p-2.5 border-b border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs font-bold truncate">{adminSession.email}</p>
                    <p className="text-[10px] text-zinc-400 font-medium">
                      Role: <span className="text-[#00876e] dark:text-[#99ede0]">{adminSession.role}</span>
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      {adminSession.permissions.length} active permissions
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onViewWebsite();
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                        isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                      }`}
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Customer Portal</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onToggleTheme();
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                        isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                      }`}
                    >
                      {isDark ? <Sun className="w-3.5 h-3.5 text-zinc-400" /> : <Moon className="w-3.5 h-3.5 text-zinc-400" />}
                      <span>{isDark ? 'Light Appearance' : 'Dark Appearance'}</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
