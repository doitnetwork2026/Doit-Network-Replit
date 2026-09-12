import React from 'react';
import { ArrowRight } from 'lucide-react';
import {
  Step1Illustration,
  Step2Illustration,
  Step3Illustration,
  Step4Illustration,
  Step5Illustration
} from './HowItWorksIllustrations';

interface Step {
  number: string;
  stepLabel: string;
  title: string;
  description: string;
  illustration: React.ComponentType<{ className?: string }>;
  badgeText: string;
}

const STEPS: Step[] = [
  {
    number: '01',
    stepLabel: 'Step 1',
    title: '01 Tell Us What You Need',
    description: 'Select your service, BHEL sector, preferred date and time, and share photos or additional details if needed.',
    illustration: Step1Illustration,
    badgeText: 'Share Details & Photos'
  },
  {
    number: '02',
    stepLabel: 'Step 2',
    title: '02 Choose Your Service',
    description: 'Select the service you need, choose your location or BHEL sector, and provide your preferred date and time.',
    illustration: Step2Illustration,
    badgeText: 'Select & Schedule'
  },
  {
    number: '03',
    stepLabel: 'Step 3',
    title: '03 Get Matched With a Local Professional',
    description: 'DOIT connects your request with a suitable verified professional available in your area and preferred time slot.',
    illustration: Step3Illustration,
    badgeText: 'Verified Match'
  },
  {
    number: '04',
    stepLabel: 'Step 4',
    title: '04 — Confirm & Get the Service',
    description: 'Review the booking details and applicable charges before confirming. Your selected professional arrives at the scheduled time and completes the service.',
    illustration: Step4Illustration,
    badgeText: 'On-Time Doorstep'
  },
  {
    number: '05',
    stepLabel: 'Step 5',
    title: '05 Review & Pay',
    description: 'Once the service is completed, confirm the job and pay securely through UPI or Cash. Share your feedback and help us maintain a trusted service network.',
    illustration: Step5Illustration,
    badgeText: 'UPI / Cash & Review'
  }
];

interface HowItWorksSectionProps {
  onSelectCategoryForBooking?: (categoryId: any) => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
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
      id="how-it-works" 
      aria-labelledby="how-it-works-title"
      className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-y border-zinc-200/80 relative"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <header className="text-center max-w-3xl mx-auto space-y-3">
          <h2 
            id="how-it-works-title" 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900"
          >
            How DOIT Makes Home Services Simple
          </h2>

          <p className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed max-w-2xl mx-auto">
            From finding the right professional to completing the service, DOIT keeps every step clear, local, and easy to manage.
          </p>
        </header>

        {/* 5-STEP GRID DESIGN WITH ILLUSTRATED IMAGES CENTERED AT TOP */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-stretch"
          aria-label="How it works step by step journey"
        >
          {STEPS.map((step) => {
            const IllustrationComponent = step.illustration;

            return (
              <article 
                key={step.number}
                className="group flex flex-col bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200/80 hover:border-[#00c29e]/60 shadow-2xs hover:shadow-md transition-all duration-200"
              >
                {/* Image Container: Centered at top using Flexbox and Grid */}
                <div className="w-full pt-2 pb-4 grid place-items-center">
                  <div className="w-full flex items-center justify-center">
                    <div className="relative transform transition-transform duration-300 group-hover:scale-105">
                      <IllustrationComponent className="w-28 h-28 sm:w-32 sm:h-32 drop-shadow-xs" />
                    </div>
                  </div>
                </div>

                {/* Step Sub-label */}
                <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-zinc-100">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#00755f] bg-[#e6faf6] px-2 py-0.5 rounded-md border border-[#99ede0]">
                    {step.stepLabel}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400 font-semibold">
                    {step.number} / 05
                  </span>
                </div>

                {/* Card Title & Content */}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2 text-center sm:text-left">
                    <h3 className="text-sm sm:text-base font-bold text-zinc-900 leading-snug group-hover:text-zinc-950 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                      {step.description}
                    </p>
                  </div>

                  {/* Micro Badge / Highlight */}
                  <div className="pt-2">
                    <span className="inline-block w-full text-center text-[11px] font-medium text-zinc-700 bg-zinc-50 group-hover:bg-[#e6faf6] group-hover:text-[#00755f] px-2.5 py-1 rounded-lg border border-zinc-200/70 transition-colors">
                      {step.badgeText}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom Call to Action strip */}
        <div className="pt-4 text-center">
          <button
            onClick={scrollToServices}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 hover:bg-[#00c29e] text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs border border-zinc-900 hover:border-[#00c29e]"
          >
            <span>Book Your Local Service Now</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};
