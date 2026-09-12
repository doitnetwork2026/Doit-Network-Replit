import React, { useEffect } from 'react';
import { 
  ArrowRight, 
  MapPin, 
  ShieldCheck, 
  Search, 
  CalendarClock, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft,
  Briefcase,
  Layers,
  HeartHandshake,
  Compass,
  Building2
} from 'lucide-react';
import { ServiceCategory, ServiceCategoryId, CMSContent } from '../../types/doit';
import { HowItWorksSection } from './HowItWorksSection';
import { WhyChooseDoitSection } from './WhyChooseDoitSection';
import { PublicFooter } from './PublicFooter';

interface AboutDoitPageProps {
  categories: ServiceCategory[];
  onSelectCategoryForBooking: (categoryId: ServiceCategoryId) => void;
  onOpenCustomerApp: () => void;
  onOpenProviderOnboarding: () => void;
  onOpenProviderApp?: () => void;
  onOpenAdminDashboard?: () => void;
  onNavigateHome: () => void;
  cmsContent?: CMSContent;
}

export const AboutDoitPage: React.FC<AboutDoitPageProps> = ({
  categories,
  onSelectCategoryForBooking,
  onOpenCustomerApp,
  onOpenProviderOnboarding,
  onOpenProviderApp,
  onOpenAdminDashboard,
  onNavigateHome,
  cmsContent,
}) => {
  // Update document title and meta description dynamically for /about
  useEffect(() => {
    const originalTitle = document.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc ? metaDesc.getAttribute('content') : '';

    document.title = 'About DOIT | Your Complete Hyperlocal Home Services Partner';
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Learn about DOIT, a hyperlocal home-services platform connecting customers with local service professionals across BHEL Bhopal and nearby areas.'
      );
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    return () => {
      document.title = originalTitle;
      if (metaDesc && originalDesc) {
        metaDesc.setAttribute('content', originalDesc);
      }
    };
  }, []);

  const bhelLocalities = [
    { name: 'Kasturba Hospital Road', desc: 'Central Operations & Near Gate 1' },
    { name: 'Sector A, B & C (BHEL)', desc: 'Residential Townships & Quarters' },
    { name: 'Piplani & Subhash Nagar', desc: 'Active Hubs & Market Zone' },
    { name: 'Awadhpuri & BDA Colony', desc: 'High-Demand Service Clusters' },
    { name: 'Govindpura & Industrial Area', desc: 'Caretakers & General Labour' },
    { name: 'Indrapuri & Sonagiri', desc: 'Residential & Commercial Blocks' },
    { name: 'Ayodhya Bypass & Anand Nagar', desc: 'Rapidly Growing Localities' },
    { name: 'Berkheda & Habibganj Road', desc: 'Dedicated Local Coverage' }
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9] text-zinc-900 selection:bg-[#00c29e]/30 selection:text-zinc-950 font-sans">
      
      {/* Top Breadcrumb / Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onNavigateHome}
              className="p-2 -ml-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Return to Home"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </button>
            <div className="h-4 w-px bg-zinc-300 hidden sm:block" />
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-zinc-500">
              <button 
                type="button" 
                onClick={onNavigateHome}
                className="hover:text-zinc-900 transition-colors cursor-pointer"
              >
                Home
              </button>
              <span>/</span>
              <span className="text-zinc-900 font-semibold" aria-current="page">About DOIT</span>
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenCustomerApp}
              className="px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Book a Service
            </button>
            <button
              type="button"
              onClick={onOpenProviderOnboarding}
              className="hidden sm:inline-flex px-3.5 py-1.5 rounded-full bg-[#00c29e]/10 hover:bg-[#00c29e]/20 text-[#008f75] border border-[#00c29e]/30 text-xs font-semibold transition-colors cursor-pointer"
            >
              Join as Partner
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-zinc-200/80 pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c29e]/10 border border-[#00c29e]/25 text-[#008f75] text-[11px] font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            ABOUT DOIT
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 leading-[1.15]">
            Your Complete Hyperlocal Home Services Partner.
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed max-w-2xl mx-auto">
            DOIT is building a simpler way for people to find and connect with local professionals for their everyday home-service needs.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('about-services');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else onOpenCustomerApp();
              }}
              className="px-6 py-3 rounded-full bg-[#00c29e] hover:bg-[#00a889] text-white font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenProviderOnboarding}
              className="px-6 py-3 rounded-full bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-300 font-semibold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-[#00c29e]" />
              <span>Become a Professional</span>
            </button>
          </div>
        </div>
      </section>

      {/* Section 1 — Who We Are */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="space-y-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-semibold uppercase tracking-wider">
            Our Foundation
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
            Who We Are
          </h2>
          <div className="space-y-4 text-zinc-600 text-sm sm:text-base leading-relaxed max-w-3xl">
            <p>
              DOIT is a hyperlocal home-services platform designed to connect customers with local service professionals through one simple and organized experience.
            </p>
            <p>
              Instead of relying on scattered contacts or informal referrals, DOIT brings service discovery, requests, coordination and service management into a single platform.
            </p>
            <p>
              Starting with BHEL Bhopal and nearby areas, DOIT is focused on making everyday home services easier to access while building a structured local network of professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2 — What DOIT Does */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-y border-zinc-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-semibold uppercase tracking-wider">
              Platform Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              What DOIT Does
            </h2>
            <p className="text-sm text-zinc-600">
              A structured solution designed to solve the real challenges of hiring and delivering local home services.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 01 */}
            <div className="p-6 rounded-2xl bg-[#fafaf9] border border-zinc-200/80 space-y-4 hover:border-zinc-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-900 font-bold text-sm shadow-2xs">
                01
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-zinc-900">Find Local Professionals</h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  Customers can discover services and connect with professionals serving their local area.
                </p>
              </div>
            </div>

            {/* Card 02 */}
            <div className="p-6 rounded-2xl bg-[#fafaf9] border border-zinc-200/80 space-y-4 hover:border-zinc-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-900 font-bold text-sm shadow-2xs">
                02
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-zinc-900">Request a Service</h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  Customers can share their requirements, preferred timing and location through the platform.
                </p>
              </div>
            </div>

            {/* Card 03 */}
            <div className="p-6 rounded-2xl bg-[#fafaf9] border border-zinc-200/80 space-y-4 hover:border-zinc-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-900 font-bold text-sm shadow-2xs">
                03
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-zinc-900">Simple Coordination</h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  DOIT helps organize the service request and coordination between customers and professionals.
                </p>
              </div>
            </div>

            {/* Card 04 */}
            <div className="p-6 rounded-2xl bg-[#fafaf9] border border-zinc-200/80 space-y-4 hover:border-zinc-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-900 font-bold text-sm shadow-2xs">
                04
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-zinc-900">Build Local Trust</h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  DOIT is designed around a more organized and transparent experience for both customers and service professionals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — Our Services */}
      <section id="about-services" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c29e]/10 border border-[#00c29e]/25 text-[#008f75] text-xs font-semibold uppercase tracking-wider">
            Service Catalog
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
            Home Services, All in One Place
          </h2>
          <p className="text-sm sm:text-base text-zinc-600">
            DOIT brings different everyday home-service needs together on one platform.
          </p>
        </div>

        {/* Existing Service Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-zinc-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between p-6 space-y-5 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="px-3 py-1 rounded-full bg-zinc-900 text-white text-xs font-bold">
                    {cat.name}
                  </span>
                  <span className="text-xs font-bold text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-lg">
                    ₹{cat.startingPrice} <span className="text-[10px] font-normal text-zinc-500">/ {cat.pricingModel}</span>
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed line-clamp-2">
                  {cat.shortDesc}
                </p>

                {cat.subServices && cat.subServices.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cat.subServices.slice(0, 3).map((sub, idx) => (
                      <span key={idx} className="text-[10px] text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-md font-medium">
                        {sub}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onSelectCategoryForBooking(cat.id as ServiceCategoryId)}
                  className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Book {cat.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4 — Why Would You Choose DOIT? */}
      <div className="bg-white border-y border-zinc-200/80">
        <WhyChooseDoitSection onSelectCategoryForBooking={onSelectCategoryForBooking} />
      </div>

      {/* Section 5 — How DOIT Works */}
      <HowItWorksSection onSelectCategoryForBooking={onSelectCategoryForBooking} />

      {/* Section 6 — Our Local Approach */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-semibold uppercase tracking-wider">
            Hyperlocal Focus
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
            Built for Local Communities
          </h2>
          <div className="space-y-3 text-sm sm:text-base text-zinc-600 leading-relaxed">
            <p>
              DOIT is starting with BHEL Bhopal and nearby areas, with a focus on making local home services easier to discover and coordinate.
            </p>
            <p>
              Our approach is hyperlocal: understand the needs of the area, connect customers with professionals who serve that area, and build a dependable local service network over time.
            </p>
          </div>
        </div>

        {/* Local Area Coverage Visual Grid */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
            <div>
              <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#00c29e]" />
                <span>Active Coverage Sectors & Localities</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                BHEL Bhopal Township and contiguous residential clusters
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#00c29e]" />
              <span>Operations Desk: Kasturba Hospital Road, Near Gate 1, Sector A, BHEL, Bhopal - 462022</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bhelLocalities.map((loc, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl bg-[#fafaf9] border border-zinc-200/70 hover:border-zinc-300 transition-colors"
              >
                <div className="flex items-center gap-2 text-zinc-900 font-semibold text-xs sm:text-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00c29e] shrink-0" />
                  <span>{loc.name}</span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1 pl-5.5">
                  {loc.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7 — For Customers & Professionals */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-y border-zinc-200/80">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-semibold uppercase tracking-wider">
              Two-Sided Ecosystem
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              Built for Both Sides of the Network
            </h2>
            <p className="text-sm text-zinc-600">
              Creating mutual value and transparency for household customers and local service professionals alike.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Customers */}
            <div className="p-8 rounded-3xl bg-[#fafaf9] border border-zinc-200/80 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-sm">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900">For Customers</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Find local professionals for everyday home-service needs through a simple digital experience.
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={onOpenCustomerApp}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Book a Service</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* For Professionals */}
            <div className="p-8 rounded-3xl bg-[#fafaf9] border border-zinc-200/80 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#00c29e] text-white flex items-center justify-center font-bold text-sm">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900">For Professionals</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Join the DOIT network and connect with customers looking for local home services.
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={onOpenProviderOnboarding}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#00c29e] hover:bg-[#00a889] text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Become a Professional</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8 — Our Vision */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-semibold uppercase tracking-wider">
          Long-Term Commitment
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
          Our Vision
        </h2>
        <div className="space-y-4 text-sm sm:text-base text-zinc-600 leading-relaxed max-w-3xl mx-auto">
          <p>
            Our vision is to build a trusted and accessible hyperlocal network where customers can easily find the right professionals for their everyday service needs, while local professionals have a structured platform to connect with more customers.
          </p>
          <p>
            DOIT is starting locally, with the goal of creating a better and more organized experience for home services as the network grows.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-zinc-950 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Need a Local Home Service?
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed max-w-xl mx-auto">
            Explore DOIT and find the service you need from professionals serving your area.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
            <button
              type="button"
              onClick={onOpenCustomerApp}
              className="px-6 py-3 rounded-full bg-[#00c29e] hover:bg-[#00a889] text-white font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onOpenProviderOnboarding}
              className="px-6 py-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-[#00c29e]" />
              <span>Become a Professional</span>
            </button>
          </div>
        </div>
      </section>

      {/* Modern Marketplace Footer */}
      <PublicFooter
        onSelectCategoryForBooking={onSelectCategoryForBooking}
        onOpenCustomerApp={onOpenCustomerApp}
        onOpenProviderOnboarding={onOpenProviderOnboarding}
        onOpenProviderApp={onOpenProviderApp}
        onOpenAdminDashboard={onOpenAdminDashboard}
        onOpenAboutPage={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cmsContent={cmsContent}
      />

    </div>
  );
};
