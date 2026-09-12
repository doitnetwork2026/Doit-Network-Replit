import React, { useState } from 'react';
import { DoitLogo } from '../common/DoitLogo';
import { CmsPoliciesModal } from '../common/CmsPoliciesModal';
import { INITIAL_CMS_CONTENT } from '../../data/mockDoitData';
import { CMSContent, ServiceCategoryId } from '../../types/doit';
import { 
  MapPin, 
  Mail, 
  Smartphone, 
  Instagram, 
  Facebook, 
  Linkedin, 
  ShieldCheck, 
  X, 
  Briefcase, 
  PhoneCall, 
  Clock, 
  Copy, 
  Check, 
  ArrowUpRight 
} from 'lucide-react';

interface PublicFooterProps {
  onSelectCategoryForBooking?: (categoryId: ServiceCategoryId) => void;
  onOpenCustomerApp?: () => void;
  onOpenProviderOnboarding?: () => void;
  onOpenProviderApp?: () => void;
  onOpenAdminDashboard?: () => void;
  onOpenAboutPage?: () => void;
  cmsContent?: CMSContent;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({
  onSelectCategoryForBooking,
  onOpenCustomerApp,
  onOpenProviderOnboarding,
  onOpenProviderApp,
  onOpenAdminDashboard,
  onOpenAboutPage,
  cmsContent = INITIAL_CMS_CONTENT,
}) => {
  const currentYear = new Date().getFullYear();

  // Configurable App Store Links (null = display Coming Soon badge without fake link)
  const appLinks: { googlePlay: string | null; indusAppstore: string | null } = {
    googlePlay: null,
    indusAppstore: null,
  };

  // Modals state
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<keyof CMSContent['legalPages']>('termsAndConditions');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isCareersModalOpen, setIsCareersModalOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleOpenLegal = (tab: keyof CMSContent['legalPages']) => {
    setLegalTab(tab);
    setIsLegalModalOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText('doitnetworksupport@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <footer 
      className="bg-zinc-950 text-zinc-400 pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/80"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">Footer</h2>

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 text-xs">
          
          {/* COLUMN 1: Brand, Tagline, Description & Operations Desk (Wider: 4 of 12 columns) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <DoitLogo className="w-8 h-8" />
              <span className="font-black text-xl text-white tracking-tight">
                DOIT Network
              </span>
            </div>

            <p className="text-xs font-semibold text-[#00c29e] tracking-wide">
              Your Complete Hyperlocal Home Services Partner.
            </p>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              DOIT connects customers with verified local professionals for reliable home services across BHEL Bhopal and nearby areas.
            </p>

            {/* Operations Desk (Visually secondary as requested) */}
            <div className="pt-2 text-zinc-500 border-t border-zinc-900 space-y-1">
              <div className="flex items-start gap-1.5 text-xs text-zinc-400">
                <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <span className="font-semibold text-zinc-300">Operations Desk:</span>
                  <p className="text-[11px] text-zinc-500 leading-snug mt-0.5">
                    Kasturba Hospital Road, Near Gate 1, BHEL, Bhopal – 462022
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Company */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-200">
              Company
            </h3>
            <nav aria-label="Company navigation">
              <ul className="space-y-2">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenAboutPage) {
                        onOpenAboutPage();
                      } else {
                        scrollToSection('why-doit');
                      }
                    }}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    About DOIT
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('how-it-works')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    How DOIT Works
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsContactModalOpen(true)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsCareersModalOpen(true)}
                    className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
                  >
                    <span>Careers</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#00c29e]/15 text-[#00c29e] border border-[#00c29e]/25 font-semibold">
                      Hiring
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpenLegal('termsAndConditions')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpenLegal('privacyPolicy')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* COLUMN 3: For Customers */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-200">
              For Customers
            </h3>
            <nav aria-label="Customer navigation">
              <ul className="space-y-2">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectCategoryForBooking) {
                        onSelectCategoryForBooking('gardener');
                      } else if (onOpenCustomerApp) {
                        onOpenCustomerApp();
                      }
                    }}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Book a Service
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenCustomerApp) {
                        onOpenCustomerApp();
                      }
                    }}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    My Bookings
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('service-area')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Service Areas
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsContactModalOpen(true)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Help & Support
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* COLUMN 4: For Professionals */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-200">
              For Professionals
            </h3>
            <nav aria-label="Professional navigation">
              <ul className="space-y-2">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenProviderOnboarding) {
                        onOpenProviderOnboarding();
                      }
                    }}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Become a Professional
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenProviderApp) {
                        onOpenProviderApp();
                      }
                    }}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Provider Login
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenProviderApp) {
                        onOpenProviderApp();
                      } else {
                        setIsContactModalOpen(true);
                      }
                    }}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Provider Support
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* COLUMN 5: Connect With Us */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-200">
              Connect With Us
            </h3>
            
            {/* Email Contact */}
            <div className="space-y-1">
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">Email</span>
              <div>
                <a
                  href="mailto:doitnetworksupport@gmail.com"
                  className="text-xs text-zinc-300 hover:text-[#00c29e] transition-colors break-all flex items-center gap-1.5"
                  title="Send email to DOIT Support"
                >
                  <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" aria-hidden="true" />
                  <span>doitnetworksupport@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Accessible Social Media Icons (Disabled state with clean accessible indicator as per requirements) */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">Social</span>
              <div className="flex items-center gap-2">
                <a
                  href="#social-instagram"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  aria-label="Instagram (DOIT Network official page coming soon)"
                  aria-disabled="true"
                  title="Official Instagram page launching soon"
                  className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-default"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                <a
                  href="#social-facebook"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  aria-label="Facebook (DOIT Network official page coming soon)"
                  aria-disabled="true"
                  title="Official Facebook page launching soon"
                  className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-default"
                >
                  <Facebook className="w-4 h-4" />
                </a>

                <a
                  href="#social-linkedin"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  aria-label="LinkedIn (DOIT Network official page coming soon)"
                  aria-disabled="true"
                  title="Official LinkedIn page launching soon"
                  className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-default"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Mobile App Section: Google Play & Indus Appstore — Coming Soon */}
            <div className="space-y-2 pt-2 border-t border-zinc-900">
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">Mobile App</span>
              <div className="space-y-1.5">
                {/* Google Play Badge */}
                {appLinks.googlePlay ? (
                  <a
                    href={appLinks.googlePlay}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Get DOIT on Google Play"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800/80 hover:border-zinc-700 flex items-center justify-between gap-2 text-[11px] transition-all min-h-[40px] group focus:outline-none focus:ring-2 focus:ring-[#00c29e]/50"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src="/assets/google_play_logo_white.svg"
                        alt="Get DOIT on Google Play"
                        className="h-4 w-auto max-w-[84px] object-contain shrink-0"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-[10px] text-zinc-400 group-hover:text-white bg-zinc-800/90 px-1.5 py-0.5 rounded border border-zinc-700/60 font-medium whitespace-nowrap">
                      Install
                    </span>
                  </a>
                ) : (
                  <div 
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800/80 flex items-center justify-between gap-2 text-[11px] min-h-[40px]"
                    title="Google Play application in development"
                    aria-label="Google Play: Coming Soon"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src="/assets/google_play_logo_white.svg"
                        alt="Get DOIT on Google Play"
                        className="h-4 w-auto max-w-[84px] object-contain shrink-0"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-[10px] text-zinc-400 bg-zinc-800/90 px-1.5 py-0.5 rounded border border-zinc-700/60 font-medium whitespace-nowrap">
                      Coming Soon
                    </span>
                  </div>
                )}

                {/* Indus Appstore Badge */}
                {appLinks.indusAppstore ? (
                  <a
                    href={appLinks.indusAppstore}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Get DOIT on Indus Appstore"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800/80 hover:border-zinc-700 flex items-center justify-between gap-2 text-[11px] transition-all min-h-[40px] group focus:outline-none focus:ring-2 focus:ring-[#00c29e]/50"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src="/assets/indus_appstore_logo.svg"
                        alt="Get DOIT on Indus Appstore"
                        className="h-4.5 w-auto max-w-[88px] object-contain shrink-0"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-[10px] text-zinc-400 group-hover:text-white bg-zinc-800/90 px-1.5 py-0.5 rounded border border-zinc-700/60 font-medium whitespace-nowrap">
                      Install
                    </span>
                  </a>
                ) : (
                  <div 
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800/80 flex items-center justify-between gap-2 text-[11px] min-h-[40px]"
                    title="Indus Appstore application in development"
                    aria-label="Indus Appstore: Coming Soon"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src="/assets/indus_appstore_logo.svg"
                        alt="Get DOIT on Indus Appstore"
                        className="h-4.5 w-auto max-w-[88px] object-contain shrink-0"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-[10px] text-zinc-400 bg-zinc-800/90 px-1.5 py-0.5 rounded border border-zinc-700/60 font-medium whitespace-nowrap">
                      Coming Soon
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Subtle Divider before Bottom Bar */}
        <div className="border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p className="text-center sm:text-left">
            © {currentYear} DOIT Network. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-zinc-400">
            <button
              type="button"
              onClick={() => handleOpenLegal('privacyPolicy')}
              className="hover:text-white transition-colors cursor-pointer text-xs"
            >
              Privacy Policy
            </button>
            <span className="text-zinc-700 select-none">•</span>
            <button
              type="button"
              onClick={() => handleOpenLegal('termsAndConditions')}
              className="hover:text-white transition-colors cursor-pointer text-xs"
            >
              Terms & Conditions
            </button>
            <span className="text-zinc-700 select-none">•</span>
            <button
              type="button"
              onClick={() => setIsContactModalOpen(true)}
              className="hover:text-white transition-colors cursor-pointer text-xs"
            >
              Contact Us
            </button>

            {onOpenAdminDashboard && (
              <>
                <span className="text-zinc-700 select-none">•</span>
                <button
                  type="button"
                  onClick={onOpenAdminDashboard}
                  className="hover:text-[#00c29e] transition-colors cursor-pointer text-xs flex items-center gap-1 text-zinc-500"
                  title="Internal Operations Console"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Operations Console</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 1. Legal Policies Modal */}
      <CmsPoliciesModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        cmsContent={cmsContent}
        initialTab={legalTab}
      />

      {/* 2. Contact Us Modal */}
      {isContactModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
        >
          <div 
            className="bg-white text-zinc-900 w-full max-w-md rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-white">
                  <Mail className="w-4 h-4 text-[#00c29e]" />
                </div>
                <div>
                  <h3 id="contact-modal-title" className="text-sm font-bold text-zinc-900">
                    Contact DOIT Network
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    BHEL Bhopal Operations & Grievance Desk
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsContactModalOpen(false)}
                aria-label="Close modal"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-[#00755f] tracking-wider">
                  Support Email
                </span>
                <div className="flex items-center justify-between gap-2">
                  <a 
                    href="mailto:doitnetworksupport@gmail.com" 
                    className="font-semibold text-zinc-900 hover:text-[#00755f] transition-colors break-all"
                  >
                    doitnetworksupport@gmail.com
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="px-2 py-1 rounded-md bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 flex items-center gap-1 text-[11px] shrink-0 cursor-pointer shadow-2xs"
                    title="Copy email to clipboard"
                  >
                    {copiedEmail ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-800">Physical Operations Desk</span>
                    <p className="text-zinc-500 leading-relaxed mt-0.5">
                      Kasturba Hospital Road, Near Gate 1, BHEL, Bhopal – 462022
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <PhoneCall className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-800">Helpline / WhatsApp Assistance</span>
                    <p className="text-zinc-500 mt-0.5">+91 755 244 8900</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-800">Operational Hours</span>
                    <p className="text-zinc-500 mt-0.5">Monday to Sunday: 8:00 AM – 8:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex justify-end">
              <button
                type="button"
                onClick={() => setIsContactModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Careers Modal */}
      {isCareersModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="careers-modal-title"
        >
          <div 
            className="bg-white text-zinc-900 w-full max-w-lg rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#00c29e]/15 border border-[#00c29e]/30 flex items-center justify-center text-[#00755f]">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="careers-modal-title" className="text-sm font-bold text-zinc-900">
                    Careers at DOIT Network
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Building Bhopal's premier hyperlocal services infrastructure
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsCareersModalOpen(false)}
                aria-label="Close modal"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              <p className="text-zinc-600 leading-relaxed">
                We are actively expanding our operations, quality assurance, and community onboarding teams across BHEL Township and surrounding Bhopal sectors.
              </p>

              <div className="space-y-2.5">
                <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wider">
                  Open Positions
                </h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-zinc-900">Township Area Supervisor</p>
                      <p className="text-[11px] text-zinc-500">BHEL Sectors (Piplani / Barkhera / Govindpura)</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                      Full-time
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-zinc-900">Service Partner Onboarding Officer</p>
                      <p className="text-[11px] text-zinc-500">Bhopal Operations Desk</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                      Full-time
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-zinc-900">Customer Support Associate</p>
                      <p className="text-[11px] text-zinc-500">Bhopal / Remote Support</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                      Hybrid
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#00c29e]/10 border border-[#00c29e]/30 space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#00755f] tracking-wider">
                  How to Apply
                </span>
                <p className="text-zinc-700 leading-relaxed">
                  Send your resume and a brief introduction indicating your preferred role to:
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href="mailto:doitnetworksupport@gmail.com?subject=Job%20Application%20-%20DOIT%20Network"
                    className="font-bold text-[#00755f] hover:underline flex items-center gap-1"
                  >
                    <span>doitnetworksupport@gmail.com</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex justify-end">
              <button
                type="button"
                onClick={() => setIsCareersModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </footer>
  );
};
