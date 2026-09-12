import React from 'react';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Users, 
  Wrench, 
  Briefcase, 
  MapPin, 
  CreditCard, 
  Wallet, 
  TrendingUp, 
  Star, 
  LifeBuoy, 
  Bell, 
  Tag, 
  BarChart3, 
  FileSpreadsheet, 
  FileText, 
  Settings, 
  ShieldCheck, 
  ScrollText, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle
} from 'lucide-react';
import { DoitLogo } from '../common/DoitLogo';
import { AdminTabType } from '../../types/doit';

interface AdminSidebarProps {
  activeTab: AdminTabType;
  onSelectTab: (tab: AdminTabType) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  theme: 'light' | 'dark';
  onLogout: () => void;
  unassignedBookingsCount?: number;
  pendingKycCount?: number;
  openTicketsCount?: number;
}

interface NavItem {
  id: AdminTabType;
  label: string;
  icon: React.ElementType;
  badge?: number | string | null;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  theme,
  onLogout,
  unassignedBookingsCount = 0,
  pendingKycCount = 0,
  openTicketsCount = 0,
}) => {
  const isDark = theme === 'dark';

  const navSections: NavSection[] = [
    {
      title: 'MAIN',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'OPERATIONS',
      items: [
        { 
          id: 'bookings', 
          label: 'Bookings', 
          icon: CalendarCheck, 
          badge: unassignedBookingsCount > 0 ? unassignedBookingsCount : null,
          badgeColor: 'bg-[#00c29e]'
        },
        { id: 'customers', label: 'Customers', icon: Users },
        { 
          id: 'providers', 
          label: 'Service Professionals', 
          icon: Wrench,
          badge: pendingKycCount > 0 ? pendingKycCount : null,
          badgeColor: 'bg-amber-500'
        },
        { id: 'services', label: 'Services', icon: Briefcase },
        { id: 'service-areas', label: 'Service Areas', icon: MapPin }
      ]
    },
    {
      title: 'FINANCE',
      items: [
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'payouts', label: 'Payouts', icon: Wallet },
        { id: 'revenue', label: 'Revenue Overview', icon: TrendingUp }
      ]
    },
    {
      title: 'ENGAGEMENT',
      items: [
        { id: 'reviews', label: 'Reviews & Feedback', icon: Star },
        { 
          id: 'support', 
          label: 'Support & Complaints', 
          icon: LifeBuoy,
          badge: openTicketsCount > 0 ? openTicketsCount : null,
          badgeColor: 'bg-rose-500'
        },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'promotions', label: 'Promotions / Coupons', icon: Tag }
      ]
    },
    {
      title: 'ANALYTICS',
      items: [
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'reports', label: 'Reports & Export', icon: FileSpreadsheet }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'content', label: 'Content Management', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'roles', label: 'Admin Roles', icon: ShieldCheck },
        { id: 'audit-logs', label: 'Audit Logs', icon: ScrollText }
      ]
    }
  ];

  const handleNavClick = (tabId: AdminTabType) => {
    onSelectTab(tabId);
    if (isMobileOpen) {
      onCloseMobile();
    }
  };

  const renderContent = () => (
    <div className="h-full flex flex-col justify-between">
      {/* Top Header inside Sidebar */}
      <div>
        <div className="p-4 flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <DoitLogo className="w-8 h-8 shrink-0" />
            {!isCollapsed && (
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-sm tracking-tight text-zinc-900 dark:text-white">
                    DOIT Network
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#e6faf6] text-[#00755f] border border-[#99ede0] dark:bg-[#00755f]/20 dark:text-[#99ede0]">
                    Hub
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                  BHEL Township Ops
                </p>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              {!isCollapsed && (
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-2 block">
                  {section.title}
                </span>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#00c29e] text-white shadow-2xs'
                        : isDark
                          ? 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                          : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                      {!isCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </div>
                    {!isCollapsed && item.badge && (
                      <span className={`text-[10px] font-bold text-white px-1.5 py-0.2 rounded-full shrink-0 ${
                        isActive ? 'bg-white/20' : item.badgeColor || 'bg-zinc-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Logout Button */}
      <div className="p-3 border-t border-zinc-200/80 dark:border-zinc-800/80">
        <button
          type="button"
          onClick={onLogout}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="Sign out of Admin Hub"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside
        className={`hidden lg:block fixed inset-y-0 left-0 z-40 transition-all duration-200 border-r ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isDark 
            ? 'bg-zinc-950 border-zinc-800/80 text-zinc-100' 
            : 'bg-white border-zinc-200/80 text-zinc-900'
        }`}
      >
        {renderContent()}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-200 ease-in-out lg:hidden border-r shadow-2xl ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isDark 
            ? 'bg-zinc-950 border-zinc-800 text-zinc-100' 
            : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        {renderContent()}
      </aside>
    </>
  );
};
