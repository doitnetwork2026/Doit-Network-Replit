import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  Booking, 
  BookingStatus, 
  Provider, 
  ServiceCategory, 
  ServiceCategoryId,
  AuditLog, 
  KycStatus,
  ServiceArea,
  ProviderPayout,
  SupportTicket,
  CMSContent
} from './types/doit';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_PROVIDERS, 
  INITIAL_BOOKINGS, 
  INITIAL_AUDIT_LOGS,
  INITIAL_SERVICE_AREAS,
  INITIAL_PAYOUTS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_CMS_CONTENT
} from './data/mockDoitData';
import { RoleSwitcherHeader } from './components/common/RoleSwitcherHeader';
import { WhatsAppFloatingButton } from './components/common/WhatsAppFloatingButton';
import { BottomNav } from './components/common/BottomNav';
import { motion, AnimatePresence } from 'motion/react';
import { PublicWebsite } from './components/public/PublicWebsite';
import { AboutDoitPage } from './components/public/AboutDoitPage';
import { CustomerApp } from './components/customer/CustomerApp';
import { ProviderApp } from './components/provider/ProviderApp';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthPortalModal, AuthUserType } from './components/auth/AuthPortalModal';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    if (typeof window === 'undefined') return 'public';
    const path = window.location.pathname;
    if (path.startsWith('/admin/')) return 'admin';
    if (path.startsWith('/provider/')) return 'provider';
    if (path.startsWith('/customer')) return 'customer';
    return 'public';
  });
  const [selectedLocality, setSelectedLocality] = useState<string>('BHEL Area, Bhopal');
  
  // Central application state
  const [categories, setCategories] = useState<ServiceCategory[]>(INITIAL_CATEGORIES);
  const [providers, setProviders] = useState<Provider[]>(INITIAL_PROVIDERS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>(INITIAL_SERVICE_AREAS);
  const [payouts, setPayouts] = useState<ProviderPayout[]>(INITIAL_PAYOUTS);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [cmsContent, setCmsContent] = useState<CMSContent>(INITIAL_CMS_CONTENT);
  
  // Selected category to pass into customer booking modal if launched from public landing
  const [initialCategoryForCustomer, setInitialCategoryForCustomer] = useState<ServiceCategoryId | null>(null);
  const [initialSubServiceForCustomer, setInitialSubServiceForCustomer] = useState<string | null>(null);
  const [customerActiveTab, setCustomerActiveTab] = useState<'explore' | 'bookings' | 'recurring' | 'payments' | 'refunds' | 'notifications' | 'support' | 'account_deletion'>('explore');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.location.pathname === '/login' || window.location.pathname === '/provider/login';
  });
  const [authInitialType, setAuthInitialType] = useState<AuthUserType>(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/provider/login') {
      return 'provider';
    }
    return 'customer';
  });

  // Active Provider simulated in Provider Portal (Defaults to Rahul Sharma)
  const [activeProviderId, setActiveProviderId] = useState<string>('PRV-00124');

  // Lightweight route synchronization for /about and deep linking
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      if (path === '/login' || path === '/provider/login') {
        setAuthInitialType(path === '/provider/login' ? 'provider' : 'customer');
        setIsAuthModalOpen(true);
      } else {
        setIsAuthModalOpen(false);
      }
      if (path.startsWith('/admin/')) setCurrentRole('admin');
      else if (path.startsWith('/provider/')) setCurrentRole('provider');
      else if (path.startsWith('/customer')) setCurrentRole('customer');
      else if (path === '/') setCurrentRole('public');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  // Toast notification for user feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Global role switcher with instant scroll restoration
  const handleSelectRole = (role: UserRole, targetTab?: string) => {
    setCurrentRole(role);
    if (role === 'customer' && targetTab) {
      setCustomerActiveTab(targetTab as any);
    }
    // If switching role while on /about, reset pathname cleanly
    if (currentPath === '/about' && role !== 'public') {
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/');
      }
      setCurrentPath('/');
    }
    // Guarantee window is scrolled to top so the selected view is immediately in viewport
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleOpenLogin = (initialType: AuthUserType = 'customer') => {
    setAuthInitialType(initialType);
    setIsAuthModalOpen(true);
    navigateTo(initialType === 'provider' ? '/provider/login' : '/login');
  };

  // Scroll to top automatically whenever currentRole changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentRole]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLoginSuccess = (type: AuthUserType, userData: { name: string; phone: string; email: string }) => {
    handleSelectRole(type);
    navigateTo(type === 'provider' ? '/provider/dashboard' : '/customer');
    showToast(`Welcome back, ${userData.name}!`);
  };

  // Helper to log audit actions
  const logAudit = (action: string, actor: string, details: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-5)}`,
      timestamp: 'Just now',
      action,
      actor,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // 1. Customer: Create New Booking
  const handleNewBooking = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
    logAudit(
      'NEW_BOOKING_CREATED',
      'Customer',
      `Booking ${newBooking.id} created for ${newBooking.subService} in ${newBooking.locality}`
    );
    showToast(`Service request ${newBooking.id} submitted! Matching local provider...`);
  };

  // 2. Lifecycle Status Updates
  const handleUpdateBookingStatus = (bookingId: string, nextStatus: BookingStatus) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: nextStatus,
          timeline: [
            ...b.timeline,
            {
              timestamp: 'Just now',
              title: `Status Changed to ${nextStatus.replace(/_/g, ' ')}`,
              actor: currentRole === 'admin' ? 'DOIT Coordinator' : currentRole === 'provider' ? 'Provider' : 'Customer',
              description: `Advanced booking lifecycle to ${nextStatus}`
            }
          ]
        };
      }
      return b;
    }));
    logAudit('STATUS_UPDATED', currentRole, `Booking ${bookingId} advanced to ${nextStatus}`);
    showToast(`Booking ${bookingId} status: ${nextStatus.replace(/_/g, ' ')}`);
  };

  // 3. Customer: Accept Quote
  const handleAcceptQuote = (bookingId: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'BOOKED',
          timeline: [
            ...b.timeline,
            {
              timestamp: 'Just now',
              title: 'Quotation Approved',
              actor: 'Customer',
              description: `Approved ₹${b.quote?.totalAmount} transparent quote`
            }
          ]
        };
      }
      return b;
    }));
    logAudit('QUOTE_ACCEPTED', 'Customer', `Customer approved quote for booking ${bookingId}`);
    showToast('Quote accepted! Professional is notified to commence travel.');
  };

  // 4. Customer: Pay
  const handlePayBooking = (bookingId: string, method: 'UPI' | 'Cash') => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          payment: {
            method,
            status: 'SUCCESS',
            amount: b.quote?.totalAmount || b.expectedBudget || 350,
            transactionId: method === 'UPI' ? `UPI-${Math.floor(100000 + Math.random() * 900000)}` : undefined
          },
          timeline: [
            ...b.timeline,
            {
              timestamp: 'Just now',
              title: `Payment Mode: ${method}`,
              actor: 'Customer',
              description: `Payment confirmed via ${method}`
            }
          ]
        };
      }
      return b;
    }));
    logAudit('PAYMENT_RECORDED', 'Customer', `Booking ${bookingId} payment via ${method}`);
    showToast(`Payment recorded via ${method}!`);
  };

  // 5. Customer: Review & Rating
  const handleSubmitReview = (bookingId: string, rating: NonNullable<Booking['rating']>) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          rating,
          status: 'CLOSED',
          timeline: [
            ...b.timeline,
            {
              timestamp: 'Just now',
              title: `Rated ${rating.stars} Stars`,
              actor: 'Customer',
              description: rating.feedbackText
            }
          ]
        };
      }
      return b;
    }));
    logAudit('REVIEW_SUBMITTED', 'Customer', `Booking ${bookingId} rated ${rating.stars} stars`);
    showToast('Thank you for rating your service experience!');
  };

  // 6. Customer: Complaint
  const handleSubmitComplaint = (bookingId: string, complaint: NonNullable<Booking['complaint']>) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          complaint,
          timeline: [
            ...b.timeline,
            {
              timestamp: 'Just now',
              title: `Dispute Logged: ${complaint.category}`,
              actor: 'Customer',
              description: complaint.description
            }
          ]
        };
      }
      return b;
    }));
    logAudit('COMPLAINT_FILED', 'Customer', `Complaint filed on booking ${bookingId}`);
    showToast('Dispute logged! A DOIT coordinator is reviewing your request.');
  };

  // 7. Provider: Accept Job
  const handleAcceptJob = (bookingId: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          assignedProviderId: activeProviderId,
          status: 'PROVIDER_ASSIGNED',
          timeline: [
            ...b.timeline,
            {
              timestamp: 'Just now',
              title: 'Provider Accepted Dispatch',
              actor: 'Provider',
              description: `Assigned to ${providers.find(p => p.id === activeProviderId)?.name}`
            }
          ]
        };
      }
      return b;
    }));
    logAudit('JOB_ACCEPTED', 'Provider', `Provider ${activeProviderId} accepted booking ${bookingId}`);
    showToast('Job accepted! Customer notified.');
  };

  // 8. Provider: Reject Job
  const handleRejectJob = (bookingId: string) => {
    showToast('Job request declined.');
    logAudit('JOB_DECLINED', 'Provider', `Provider ${activeProviderId} declined booking ${bookingId}`);
  };

  // 9. Provider: Upload Job Photos
  const handleUploadJobPhoto = (bookingId: string, type: 'before' | 'after', url: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          beforePhoto: type === 'before' ? url : b.beforePhoto,
          afterPhoto: type === 'after' ? url : b.afterPhoto,
          timeline: [
            ...b.timeline,
            {
              timestamp: 'Just now',
              title: `${type === 'before' ? 'Before' : 'After'} Photo Uploaded`,
              actor: 'Provider',
              description: 'Verification photo attached to job records'
            }
          ]
        };
      }
      return b;
    }));
    showToast(`${type === 'before' ? 'Before' : 'After'} photo attached!`);
  };

  // 10. Admin: Assign Provider
  const handleAssignProvider = (bookingId: string, providerId: string, backupProviderId?: string) => {
    const prov = providers.find(p => p.id === providerId);
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          assignedProviderId: providerId,
          backupProviderId,
          status: 'PROVIDER_ASSIGNED',
          timeline: [
            ...b.timeline,
            {
              timestamp: 'Just now',
              title: `Coordinator Assigned ${prov?.name}`,
              actor: 'DOIT Coordinator',
              description: `Matched provider with ${prov?.rating} star rating`
            }
          ]
        };
      }
      return b;
    }));
    logAudit('MANUAL_ASSIGNMENT', 'DOIT Admin', `Assigned ${prov?.name} to ${bookingId}`);
    showToast(`Provider assigned to ${bookingId}!`);
  };

  // 11. Admin: Generate Quote
  const handleGenerateQuote = (bookingId: string, quote: NonNullable<Booking['quote']>) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          quote,
          status: 'QUOTE_GENERATED',
          timeline: [
            ...b.timeline,
            {
              timestamp: 'Just now',
              title: 'Official Quote Generated',
              actor: 'DOIT Desk',
              description: `Total quote amount ₹${quote.totalAmount}`
            }
          ]
        };
      }
      return b;
    }));
    logAudit('QUOTE_GENERATED', 'DOIT Admin', `Issued quotation of ₹${quote.totalAmount} for ${bookingId}`);
    showToast('Quote sent to customer for review and approval!');
  };

  // 12. Admin: KYC Update
  const handleUpdateKycStatus = (providerId: string, status: KycStatus, notes?: string) => {
    setProviders(prev => prev.map(p => {
      if (p.id === providerId) {
        return {
          ...p,
          kycStatus: status,
          isActive: status === 'VERIFIED',
          kycDoc: {
            ...p.kycDoc,
            verifiedAt: status === 'VERIFIED' ? new Date().toISOString() : undefined,
            policeVerificationNote: notes || p.kycDoc.policeVerificationNote
          }
        };
      }
      return p;
    }));
    logAudit('KYC_STATUS_CHANGED', 'DOIT Admin', `Provider ${providerId} KYC set to ${status}`);
    showToast(`Provider KYC status updated to ${status}!`);
  };

  // 13. Admin: Update Pricing
  const handleUpdateCategoryPrice = (categoryId: string, startingPrice: number, doitCommissionPct: number) => {
    setCategories(prev => prev.map(c => {
      if (c.id === categoryId) {
        return { ...c, startingPrice, doitCommissionPct };
      }
      return c;
    }));
    logAudit('PRICING_UPDATED', 'DOIT Admin', `Updated pricing for ${categoryId}: ₹${startingPrice}, ${doitCommissionPct}% fee`);
    showToast(`Pricing updated for ${categoryId}!`);
  };

  // 14. Admin: Resolve Complaint
  const handleResolveComplaint = (bookingId: string, resolution: string, refundAmount = 0) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId && b.complaint) {
        return {
          ...b,
          complaint: {
            ...b.complaint,
            status: 'RESOLVED',
            resolutionNote: resolution,
            refundAmount: refundAmount > 0 ? refundAmount : undefined
          },
          timeline: [
            ...b.timeline,
            {
              timestamp: 'Just now',
              title: 'Dispute Resolved by Operations Lead',
              actor: 'DOIT Desk',
              description: resolution
            }
          ]
        };
      }
      return b;
    }));
    logAudit('COMPLAINT_RESOLVED', 'DOIT Admin', `Resolved dispute on ${bookingId}`);
    showToast('Complaint resolved and recorded.');
  };

  // Reset to initial prototype data
  const handleResetData = () => {
    setCategories(INITIAL_CATEGORIES);
    setProviders(INITIAL_PROVIDERS);
    setBookings(INITIAL_BOOKINGS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    showToast('Prototype state restored to clean initial data.');
  };

  // Pending counts for notifications & badges
  const pendingKycCount = providers.filter(p => p.kycStatus === 'PENDING' || p.kycStatus === 'UNDER_REVIEW').length;
  const unassignedBookingsCount = bookings.filter(b => b.status === 'REQUESTED' || b.status === 'PROVIDER_MATCHING').length;
  const activeCustomerBookingsCount = bookings.filter(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED').length;

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col font-sans text-zinc-900">
      
      {/* Toast popup */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-zinc-950 text-white text-xs px-4 py-2.5 rounded-2xl shadow-xl border border-zinc-800 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#00c29e]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Master Header with Role Switcher & Locality Selector */}
      {!currentPath.startsWith('/admin/') && (
        <RoleSwitcherHeader
          currentRole={currentRole}
          onSelectRole={handleSelectRole}
          selectedLocality={selectedLocality}
          onSelectLocality={setSelectedLocality}
          pendingKycCount={pendingKycCount}
          unassignedBookingsCount={unassignedBookingsCount}
          onResetData={handleResetData}
          onOpenLogin={() => handleOpenLogin()}
        />
      )}

      {/* Role-Specific View Rendering with smooth Framer Motion transitions */}
      <main className="flex-1 pb-24 sm:pb-28 lg:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRole}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="w-full"
          >
            {/* 1. Public Portal (Landing Page or About DOIT Page) */}
            {currentRole === 'public' && (
              currentPath === '/about' ? (
                <AboutDoitPage
                  categories={categories}
                  onSelectCategoryForBooking={(catId) => {
                    navigateTo('/');
                    setInitialCategoryForCustomer(catId);
                    setCustomerActiveTab('explore');
                    handleSelectRole('customer');
                  }}
                  onOpenCustomerApp={() => {
                    navigateTo('/');
                    handleSelectRole('customer', 'explore');
                  }}
                  onOpenProviderApp={() => {
                    navigateTo('/');
                    handleSelectRole('provider');
                  }}
                  onOpenAdminDashboard={() => {
                    navigateTo('/admin/login');
                    handleSelectRole('admin');
                  }}
                  onOpenProviderOnboarding={() => {
                    navigateTo('/');
                    handleSelectRole('public');
                  }}
                  onNavigateHome={() => navigateTo('/')}
                  cmsContent={cmsContent}
                />
              ) : (
                <PublicWebsite
                  categories={categories}
                  providers={providers}
                  selectedLocality={selectedLocality}
                  onSelectLocality={setSelectedLocality}
                  onSelectCategoryForBooking={(catId, subService) => {
                    setInitialCategoryForCustomer(catId);
                    setInitialSubServiceForCustomer(subService || null);
                    setCustomerActiveTab('explore');
                    handleSelectRole('customer');
                  }}
                  onOpenCustomerApp={() => handleSelectRole('customer', 'explore')}
                  onOpenProviderApp={() => handleSelectRole('provider')}
                   onOpenAdminDashboard={() => {
                     navigateTo('/admin/login');
                     handleSelectRole('admin');
                   }}
                  onOpenProviderOnboarding={() => {
                    handleSelectRole('public');
                  }}
                  onOpenAboutPage={() => navigateTo('/about')}
                  cmsContent={cmsContent}
                />
              )
            )}

            {/* 2. Customer Application View */}
            {currentRole === 'customer' && (
              <CustomerApp
                categories={categories}
                bookings={bookings}
                providers={providers}
                selectedLocality={selectedLocality}
                initialSelectedCategory={initialCategoryForCustomer}
                initialSelectedSubService={initialSubServiceForCustomer}
                initialTab={customerActiveTab}
                onTabChange={setCustomerActiveTab}
                onNewBooking={handleNewBooking}
                onUpdateBookingStatus={handleUpdateBookingStatus}
                onAcceptQuote={handleAcceptQuote}
                onPayBooking={handlePayBooking}
                onSubmitReview={handleSubmitReview}
                onSubmitComplaint={handleSubmitComplaint}
              />
            )}

            {/* 3. Provider Portal View (Rahul Sharma / Anita Devi) */}
            {currentRole === 'provider' && (
              <ProviderApp
                providers={providers}
                activeProviderId={activeProviderId}
                onSelectProvider={setActiveProviderId}
                bookings={bookings}
                onAcceptJob={handleAcceptJob}
                onRejectJob={handleRejectJob}
                onUpdateJobStatus={handleUpdateBookingStatus}
                onUploadJobPhoto={handleUploadJobPhoto}
              />
            )}

            {/* 4. Admin Operations Hub (Section 111 & Central Engine) */}
            {currentRole === 'admin' && (
              <AdminDashboard
                bookings={bookings}
                providers={providers}
                categories={categories}
                auditLogs={auditLogs}
                serviceAreas={serviceAreas}
                payouts={payouts}
                supportTickets={supportTickets}
                cmsContent={cmsContent}
                onAssignProvider={handleAssignProvider}
                onGenerateQuote={handleGenerateQuote}
                onUpdateBookingStatus={handleUpdateBookingStatus}
                onUpdateKycStatus={handleUpdateKycStatus}
                onUpdateCategoryPrice={handleUpdateCategoryPrice}
                onResolveComplaint={handleResolveComplaint}
                onAddNewArea={(newArea) => {
                  setServiceAreas(prev => [newArea, ...prev]);
                  showToast(`Added coverage zone: ${newArea.name || newArea.locality}`);
                }}
                onAddNewCategory={(newCat) => {
                  setCategories(prev => [...prev, newCat]);
                  showToast(`Added service category: ${newCat.name}`);
                }}
                onUpdateCmsContent={(updatedCms) => {
                  setCmsContent(updatedCms);
                  showToast('CMS Content updated successfully');
                }}
                onNavigateAdminDashboard={() => navigateTo('/admin/dashboard')}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile & Tablet Bottom Navigation Bar (Visible on mobile & tablet, hidden on lg:) */}
      {!currentPath.startsWith('/admin/') && (
        <BottomNav
          currentRole={currentRole}
          onSelectRole={handleSelectRole}
          pendingKycCount={pendingKycCount}
          activeBookingsCount={activeCustomerBookingsCount}
          onOpenLogin={() => handleOpenLogin()}
        />
      )}

      {/* Persistent WhatsApp Floating Desk */}
      <WhatsAppFloatingButton />

      {/* Shared customer/provider login and registration flow */}
      <AuthPortalModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          if (currentPath === '/login' || currentPath === '/provider/login') navigateTo('/');
        }}
        initialType={authInitialType}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
