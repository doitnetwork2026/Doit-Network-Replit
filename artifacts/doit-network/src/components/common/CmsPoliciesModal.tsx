import React, { useState } from 'react';
import { CMSContent } from '../../types/doit';
import { X, FileText, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CmsPoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  cmsContent: CMSContent;
  initialTab?: keyof CMSContent['legalPages'];
}

export const CmsPoliciesModal: React.FC<CmsPoliciesModalProps> = ({
  isOpen,
  onClose,
  cmsContent,
  initialTab = 'termsAndConditions'
}) => {
  const [activePolicy, setActivePolicy] = useState<keyof CMSContent['legalPages']>(initialTab);

  if (!isOpen) return null;

  const policyTitles: Record<keyof CMSContent['legalPages'], string> = {
    termsAndConditions: 'Terms & Conditions',
    privacyPolicy: 'Privacy Policy',
    providerTerms: 'Service Partner Agreement',
    kycConsent: 'KYC & Verification Consent',
    cancellationPolicy: 'Cancellation Policy',
    refundPolicy: 'Refund Policy'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00c29e] flex items-center justify-center text-white font-black text-sm shadow-xs">
              D
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">DOIT Network Legal & Policy Center</h3>
              <p className="text-[11px] text-zinc-500">Hyperlocal Services Platform (BHEL Area, Bhopal)</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Policy Tabs */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 border-b border-zinc-100 bg-zinc-50/40 overflow-x-auto">
          {(Object.keys(policyTitles) as Array<keyof CMSContent['legalPages']>).map((key) => (
            <button
              key={key}
              onClick={() => setActivePolicy(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activePolicy === key
                  ? 'bg-zinc-900 text-white shadow-xs font-bold'
                  : 'text-zinc-600 hover:bg-zinc-200/60'
              }`}
            >
              {policyTitles[key]}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-zinc-700 leading-relaxed">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
            <FileText className="w-4 h-4 text-[#00c29e]" />
            <h4 className="text-sm font-bold text-zinc-900">{policyTitles[activePolicy]}</h4>
          </div>

          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200/80 font-mono text-[11px] text-zinc-800 whitespace-pre-line leading-6">
            {cmsContent.legalPages[activePolicy]}
          </div>

          <div className="bg-[#f0fdf9] border border-[#99ede0] rounded-xl p-3.5 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#00755f] shrink-0 mt-0.5" />
            <div className="text-[11px] text-[#00755f] space-y-0.5">
              <p className="font-bold">Township Grievance Redressal</p>
              <p className="text-[#00755f]/90">
                For policy clarifications or consumer grievance escalation in BHEL Bhopal, write to {cmsContent.contactEmail} or call our Operations Desk at {cmsContent.contactPhone}.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
