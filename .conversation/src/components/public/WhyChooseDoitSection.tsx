import React from 'react';
import { ShieldCheck, MapPin, Headphones, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Benefit {
  number: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  highlight: string;
}

const BENEFITS: Benefit[] = [
  {
    number: '01',
    title: 'Verified Professionals',
    description: "Every service provider goes through DOIT’s onboarding and identity verification process before being made available to customers.",
    icon: ShieldCheck,
    highlight: 'Screened & Onboarded'
  },
  {
    number: '02',
    title: 'Truly Hyperlocal',
    description: 'Connect with professionals serving the BHEL area and nearby localities, helping make service coordination faster and more convenient.',
    icon: MapPin,
    highlight: 'Local Neighbourhoods'
  },
  {
    number: '03',
    title: 'Reliable Service Support',
    description: 'If a provider is unavailable or an issue comes up, the DOIT support team helps coordinate the next step and keeps your service request on track.',
    icon: Headphones,
    highlight: 'Operational Assistance'
  }
];

interface WhyChooseDoitSectionProps {
  onSelectCategoryForBooking?: (categoryId: any) => void;
}

export const WhyChooseDoitSection: React.FC<WhyChooseDoitSectionProps> = ({
  onSelectCategoryForBooking
}) => {
  const scrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    } else if (onSelectCategoryForBooking) {
      onSelectCategoryForBooking('maid');
    }
  };

  return (
    <section 
      id="why-doit" 
      aria-labelledby="why-doit-heading"
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* LEFT COLUMN: Section Anchor & Narrative */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6faf6] border border-[#99ede0] text-[#00755f] text-[11px] font-bold tracking-wider uppercase">
            <span>WHY DOIT</span>
          </div>

          <div className="space-y-2">
            <h2 
              id="why-doit-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900 leading-tight"
            >
              Why Would You Choose DOIT?
            </h2>
            <h3 className="text-base sm:text-lg font-semibold text-[#00755f]">
              Trusted Local Service, Made Simple
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            DOIT brings together verified local professionals and BHEL residents through a simple, reliable, and transparent home-service experience.
          </p>

          {/* Value Micro-Points */}
          <div className="pt-2 space-y-2.5">
            {[
              'Direct resident-to-professional connection',
              'Upfront pricing with zero hidden charges',
              'Coordination desk to resolve unexpected issues'
            ].map((point, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-zinc-700">
                <CheckCircle2 className="w-4 h-4 text-[#00c29e] shrink-0" aria-hidden="true" />
                <span>{point}</span>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button
              onClick={scrollToServices}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-[#00c29e] text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs border border-zinc-900 hover:border-[#00c29e]"
            >
              <span>Explore Verified Services</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Three Key Benefits Stack — Compact, shortened length and width */}
        <div className="lg:col-span-6 lg:col-start-7 space-y-3 sm:space-y-3.5 max-w-xl mx-auto lg:max-w-none w-full">
          {BENEFITS.map((benefit) => {
            const IconComponent = benefit.icon;

            return (
              <article 
                key={benefit.number}
                className="group relative bg-white rounded-xl p-4 sm:p-4.5 border border-zinc-200/80 hover:border-[#00c29e]/60 shadow-2xs hover:shadow-xs transition-all duration-200"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      className="w-9 h-9 rounded-lg bg-[#e6faf6] text-[#00755f] border border-[#99ede0] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                      aria-hidden="true"
                    >
                      <IconComponent className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 block leading-tight">
                        Benefit {benefit.number}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-zinc-900 group-hover:text-zinc-950 transition-colors truncate">
                        {benefit.title}
                      </h4>
                    </div>
                  </div>

                  <span 
                    className="font-mono text-lg sm:text-xl font-black text-zinc-300 group-hover:text-[#00755f] transition-colors shrink-0"
                    aria-label={`Benefit number ${benefit.number}`}
                  >
                    {benefit.number}
                  </span>
                </div>

                <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed">
                  {benefit.description}
                </p>

                <div className="mt-2.5 pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                  <span className="inline-flex items-center gap-1 font-medium text-zinc-700 bg-zinc-50 px-2 py-0.5 rounded-full border border-zinc-200/70 text-[10.5px]">
                    {benefit.highlight}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium">Verified by DOIT</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
