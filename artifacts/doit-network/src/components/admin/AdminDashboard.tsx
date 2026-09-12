import React, { useState, useMemo } from 'react';
import type { 
  Booking, 
  Provider, 
  ServiceCategory, 
  AuditLog, 
  BookingStatus,
  KycStatus,
  ServiceArea,
  ProviderPayout,
  SupportTicket,
  CMSContent,
  NotificationItem,
  AdminTabType
} from '../../types/doit';
import { INITIAL_CMS_CONTENT } from '../../data/mockDoitData';

// Admin Architecture Sub-components
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { AdminLoginView } from './AdminLoginView';
import { AdminOverviewTab } from './AdminOverviewTab';
import { AdminBookingsTab } from './AdminBookingsTab';
import { AdminPaymentsTab } from './AdminPaymentsTab';
import { AdminReviewsTab } from './AdminReviewsTab';
import { AdminNotificationsTab } from './AdminNotificationsTab';
import { AdminPromotionsTab } from './AdminPromotionsTab';
import { AdminAnalyticsTab } from './AdminAnalyticsTab';
import { AdminReportsTab } from './AdminReportsTab';
import { AdminSettingsTab } from './AdminSettingsTab';
import { AdminAuditLogsTab } from './AdminAuditLogsTab';

// Specialized Tabs
import { AdminProvidersTab } from './AdminProvidersTab';
import { AdminCustomersTab } from './AdminCustomersTab';
import { AdminCategoriesTab } from './AdminCategoriesTab';
import { AdminServiceAreasTab } from './AdminServiceAreasTab';
import { AdminPayoutsTab } from './AdminPayoutsTab';
import { AdminTicketsTab } from './AdminTicketsTab';
import { AdminCmsTab } from './AdminCmsTab';
import { AdminStaffRolesTab } from './AdminStaffRolesTab';
import { AdminRiskOperationsTab } from './AdminRiskOperationsTab';
import { AdminRefundsTab } from './AdminRefundsTab';
import { BookingLocationMap } from '../maps/BookingLocationMap';

import { X } from 'lucide-react';

interface AdminDashboardProps {
  bookings: Booking[];
  providers: Provider[];
  categories: ServiceCategory[];
  auditLogs: AuditLog[];
  serviceAreas?: ServiceArea[];
  payouts?: ProviderPayout[];
  supportTickets?: SupportTicket[];
  cmsContent?: CMSContent;
  onAssignProvider: (bookingId: string, providerId: string, backupProviderId?: string) => void;
  onGenerateQuote?: (bookingId: string, quote: NonNullable<Booking['quote']>) => void;
  onUpdateBookingStatus: (bookingId: string, nextStatus: BookingStatus) => void;
  onUpdateKycStatus: (providerId: string, status: KycStatus, notes?: string) => void;
  onUpdateProviderStatus?: (providerId: string, status: Provider['status'], reason?: string) => void;
  onUpdateCategoryPrice: (categoryId: string, startingPrice: number, doitCommissionPct: number) => void;
  onResolveComplaint: (bookingId: string, resolution: string, refundAmount?: number) => void;
  onUpdateCmsContent?: (newContent: CMSContent) => void;
  onAddNewCategory?: (cat: ServiceCategory) => void;
  onAddNewArea?: (area: ServiceArea) => void;
  onOpenNewProviderModal?: () => void;
  onNavigateWebsite?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings,
  providers,
  categories,
  auditLogs,
  serviceAreas = [],
  payouts = [],
  supportTickets = [],
  cmsContent = INITIAL_CMS_CONTENT,
  onAssignProvider,
  onGenerateQuote,
  onUpdateBookingStatus,
  onUpdateKycStatus,
  onUpdateProviderStatus,
  onUpdateCategoryPrice,
  onResolveComplaint,
  onUpdateCmsContent,
  onAddNewCategory,
  onAddNewArea,
  onOpenNewProviderModal,
  onNavigateWebsite
}) => {
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Auth Session State
  const [adminSession, setAdminSession] = useState<{
    email: string;
    role: string;
    permissions: string[];
  } | null>(() => {
    try {
      const cached = localStorage.getItem('doit_verified_admin_session');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return {
      email: 'rrichi336@gmail.com',
      role: 'SUPER_ADMIN',
      permissions: [
        'manage_admins', 'disable_admin', 'change_roles', 'approve_kyc',
        'reject_kyc', 'approve_payout', 'approve_refund', 'approve_deletion',
        'override_commission', 'adjust_wallet', 'view_audit_logs', 'edit_pricing', 'edit_cms'
      ]
    };
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<AdminTabType>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals & Map Inspection State
  const [mapModalBooking, setMapModalBooking] = useState<Booking | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'N-1',
      recipientId: 'BROADCAST',
      recipientRole: 'admin',
      title: 'Monsoon Service Surge in Sector 2',
      message: 'High demand for gardening and tree trimming reported near Habibganj.',
      channel: 'in_app',
      type: 'booking_created',
      isRead: false,
      createdAt: '10 mins ago'
    },
    {
      id: 'N-2',
      recipientId: 'BROADCAST',
      recipientRole: 'admin',
      title: 'New Provider KYC Uploaded',
      message: 'Police verification certificate submitted by Suresh Kumar (Electrician).',
      channel: 'in_app',
      type: 'kyc_submitted',
      isRead: false,
      createdAt: '35 mins ago'
    }
  ]);

  // Derived Badges for Sidebar and Header
  const unassignedBookingsCount = useMemo(() => {
    return bookings.filter(b => b.status === 'PENDING_MATCH' || b.status === 'REQUESTED').length;
  }, [bookings]);

  const pendingKycCount = useMemo(() => {
    return providers.filter(p => p.kycStatus === 'PENDING' || p.kycStatus === 'UNDER_REVIEW').length;
  }, [providers]);

  const openTicketsCount = useMemo(() => {
    return supportTickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED').length +
      bookings.filter(b => b.complaint && b.complaint.status !== 'RESOLVED').length;
  }, [supportTickets, bookings]);

  // Reschedule, Cancel, and Refund handlers
  const handleRescheduleBooking = (bookingId: string, date: string, time: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.scheduledDate = date;
      booking.scheduledTime = time;
      onUpdateBookingStatus(bookingId, booking.status);
    }
  };

  const handleCancelBooking = (bookingId: string, reason: string) => {
    onUpdateBookingStatus(bookingId, 'CANCELLED_BY_PROVIDER');
  };

  const handleRefundBooking = (bookingId: string, amount: number, reason: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.paymentStatus = 'REFUNDED';
      onResolveComplaint(bookingId, `Refund issued: ₹${amount} - ${reason}`, amount);
    }
  };

  const handleSendNotification = (notif: Partial<NotificationItem>) => {
    const item: NotificationItem = {
      id: notif.id || `N-${Date.now()}`,
      recipientId: notif.recipientId || 'ALL',
      recipientRole: notif.recipientRole === 'customer' || notif.recipientRole === 'provider' ? notif.recipientRole : 'admin',
      title: notif.title || 'Notification',
      message: notif.message || '',
      channel: notif.channel || 'in_app',
      type: notif.type || 'booking_created',
      isRead: false,
      createdAt: 'Just now'
    };
    setNotifications(prev => [item, ...prev]);
  };

  const handleLogout = () => {
    setAdminSession(null);
    try {
      localStorage.removeItem('doit_verified_admin_session');
    } catch (e) {}
  };

  // If Admin not logged in, show Auth Gate
  if (!adminSession) {
    return (
      <AdminLoginView
        onSuccess={(admin) => {
          setAdminSession(admin);
          try {
            localStorage.setItem('doit_verified_admin_session', JSON.stringify(admin));
          } catch (e) {}
        }}
        onBackToWebsite={onNavigateWebsite}
        theme={theme}
      />
    );
  }

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50/70 text-zinc-900'
    }`}>
      
      {/* 1. TOP RESPONSIVE ADMIN HEADER */}
      <AdminHeader
        currentTab={activeTab}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        onOpenSearch={() => setActiveTab('bookings')}
        adminSession={adminSession}
        onLogout={handleLogout}
        onViewWebsite={onNavigateWebsite || (() => { window.location.hash = ''; })}
        notifications={notifications}
        pendingKycCount={pendingKycCount}
        unassignedBookingsCount={unassignedBookingsCount}
      />

      {/* 2. BODY LAYOUT: SIDEBAR + MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR NAVIGATION */}
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          theme={theme}
          onLogout={handleLogout}
          unassignedBookingsCount={unassignedBookingsCount}
          pendingKycCount={pendingKycCount}
          openTicketsCount={openTicketsCount}
        />

        {/* MAIN WORKSPACE CANVAS */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* TAB: DASHBOARD / OVERVIEW */}
            {activeTab === 'dashboard' && (
              <AdminOverviewTab
                bookings={bookings}
                providers={providers}
                categories={categories}
                tickets={supportTickets}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenBookingDetail={(b) => {
                  setMapModalBooking(b);
                }}
                theme={theme}
              />
            )}

            {/* TAB: BOOKINGS */}
            {activeTab === 'bookings' && (
              <AdminBookingsTab
                bookings={bookings}
                providers={providers}
                categories={categories}
                onAssignProvider={onAssignProvider}
                onUpdateBookingStatus={onUpdateBookingStatus}
                onRescheduleBooking={handleRescheduleBooking}
                onCancelBooking={handleCancelBooking}
                onRefundBooking={handleRefundBooking}
                theme={theme}
              />
            )}

            {/* TAB: SERVICES / CATEGORIES */}
            {activeTab === 'services' && (
              <AdminCategoriesTab
                categories={categories}
                onUpdatePrice={onUpdateCategoryPrice}
                onAddNewCategory={onAddNewCategory}
              />
            )}

            {/* TAB: PROFESSIONALS / PROVIDERS */}
            {activeTab === 'providers' && (
              <AdminProvidersTab
                providers={providers}
                categories={categories}
                onUpdateKycStatus={onUpdateKycStatus}
                onUpdateProviderStatus={onUpdateProviderStatus}
                onOpenNewProviderModal={onOpenNewProviderModal}
              />
            )}

            {/* TAB: CUSTOMERS */}
            {activeTab === 'customers' && (
              <AdminCustomersTab bookings={bookings} />
            )}

            {/* TAB: PAYMENTS */}
            {activeTab === 'payments' && (
              <AdminPaymentsTab
                bookings={bookings}
                payouts={payouts}
                theme={theme}
              />
            )}

            {/* TAB: PAYOUTS */}
            {activeTab === 'payouts' && (
              <AdminPayoutsTab
                providers={providers}
                payouts={payouts}
                bookings={bookings}
              />
            )}

            {/* TAB: REVENUE OVERVIEW */}
            {activeTab === 'revenue' && (
              <AdminAnalyticsTab
                bookings={bookings}
                providers={providers}
                theme={theme}
              />
            )}

            {/* TAB: REVIEWS & FEEDBACK */}
            {activeTab === 'reviews' && (
              <AdminReviewsTab theme={theme} />
            )}

            {/* TAB: SERVICE AREAS */}
            {activeTab === 'service-areas' && (
              <AdminServiceAreasTab
                serviceAreas={serviceAreas}
                onAddNewArea={onAddNewArea}
              />
            )}

            {/* TAB: SUPPORT & COMPLAINTS */}
            {activeTab === 'support' && (
              <AdminTicketsTab
                supportTickets={supportTickets}
                bookings={bookings}
                onResolveComplaint={onResolveComplaint}
              />
            )}

            {/* TAB: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <AdminNotificationsTab
                notifications={notifications}
                onSendNotification={handleSendNotification}
                theme={theme}
              />
            )}

            {/* TAB: PROMOTIONS */}
            {activeTab === 'promotions' && (
              <AdminPromotionsTab theme={theme} />
            )}

            {/* TAB: ANALYTICS */}
            {activeTab === 'analytics' && (
              <AdminAnalyticsTab
                bookings={bookings}
                providers={providers}
                theme={theme}
              />
            )}

            {/* TAB: REPORTS */}
            {activeTab === 'reports' && (
              <AdminReportsTab
                bookings={bookings}
                providers={providers}
                payouts={payouts}
                theme={theme}
              />
            )}

            {/* TAB: CONTENT MANAGEMENT / CMS */}
            {activeTab === 'content' && (
              <AdminCmsTab
                cmsContent={cmsContent}
                onUpdateCmsContent={onUpdateCmsContent || (() => {})}
              />
            )}

            {/* TAB: SETTINGS */}
            {activeTab === 'settings' && (
              <AdminSettingsTab
                cmsContent={cmsContent}
                onUpdateCms={onUpdateCmsContent}
                theme={theme}
              />
            )}

            {/* TAB: ROLES & PERMISSIONS */}
            {activeTab === 'roles' && (
              <AdminStaffRolesTab />
            )}

            {/* TAB: AUDIT LOGS */}
            {activeTab === 'audit-logs' && (
              <AdminAuditLogsTab
                auditLogs={auditLogs}
                theme={theme}
              />
            )}

            {/* TAB: RISK OPERATIONS */}
            {activeTab === 'risk' && (
              <AdminRiskOperationsTab
                providers={providers}
                bookings={bookings}
                onUpdateProviderStatus={onUpdateProviderStatus}
                onUpdateBookingStatus={onUpdateBookingStatus}
              />
            )}

            {/* TAB: REFUNDS */}
            {activeTab === 'refunds' && (
              <AdminRefundsTab
                bookings={bookings}
                onResolveRefund={(bookingId, amount, note) => {
                  onResolveComplaint(bookingId, note, amount);
                }}
              />
            )}

          </div>
        </main>

      </div>

      {/* INSPECTION MAP MODAL */}
      {mapModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <div className="text-[10px] uppercase font-bold text-[#00c29e] tracking-wider">
                  Service Inspection Map
                </div>
                <h3 className="text-base font-bold">
                  {mapModalBooking.customerName} • {mapModalBooking.categoryName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMapModalBooking(null)}
                className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <BookingLocationMap
              booking={mapModalBooking}
              provider={providers.find(p => p.id === mapModalBooking.assignedProviderId)}
              height="340px"
            />

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setMapModalBooking(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-800 text-white font-bold text-xs hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
