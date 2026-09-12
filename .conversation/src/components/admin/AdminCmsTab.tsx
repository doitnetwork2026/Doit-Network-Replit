import React, { useState } from 'react';
import { CMSContent } from '../../types/doit';
import { FileText, Save, Check, Globe, HelpCircle } from 'lucide-react';

interface AdminCmsTabProps {
  cmsContent: CMSContent;
  onUpdateCmsContent: (newContent: CMSContent) => void;
}

export const AdminCmsTab: React.FC<AdminCmsTabProps> = ({
  cmsContent,
  onUpdateCmsContent
}) => {
  const [formData, setFormData] = useState<CMSContent>(cmsContent);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onUpdateCmsContent(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-2xs">
        <div>
          <h3 className="text-sm font-bold text-zinc-900">Website CMS & Public Content Manager</h3>
          <p className="text-xs text-zinc-500">Edit homepage messaging, BHEL service guarantees, FAQ accordion, and support contacts.</p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-[#00c29e] hover:bg-[#00a887] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? 'Changes Saved!' : 'Save CMS Updates'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Section 1: Hero Messaging */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
            <Globe className="w-4 h-4 text-[#00c29e]" />
            <h4 className="text-sm font-bold text-zinc-900">Homepage Hero Section</h4>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-zinc-700">Hero Main Headline</label>
              <input
                type="text"
                value={formData.heroHeadline}
                onChange={e => setFormData({ ...formData, heroHeadline: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-700">Hero Subheadline</label>
              <textarea
                rows={3}
                value={formData.heroSubheadline}
                onChange={e => setFormData({ ...formData, heroSubheadline: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Primary CTA Label</label>
                <input
                  type="text"
                  value={formData.primaryCtaText}
                  onChange={e => setFormData({ ...formData, primaryCtaText: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Secondary CTA Label</label>
                <input
                  type="text"
                  value={formData.secondaryCtaText}
                  onChange={e => setFormData({ ...formData, secondaryCtaText: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Township Operational Desk */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
            <FileText className="w-4 h-4 text-[#00c29e]" />
            <h4 className="text-sm font-bold text-zinc-900">BHEL Operations Contact Information</h4>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-zinc-700">Support Phone / Helpline</label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-700">Official Grievance Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-700">BHEL Township Hub Address</label>
              <input
                type="text"
                value={formData.addressBhopal}
                onChange={e => setFormData({ ...formData, addressBhopal: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: FAQ Accordion Editor */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#00c29e]" />
              <h4 className="text-sm font-bold text-zinc-900">Frequently Asked Questions (FAQ)</h4>
            </div>
            <span className="text-xs text-zinc-400">{formData.faqs.length} items published</span>
          </div>

          <div className="space-y-3">
            {formData.faqs.map((faq, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-zinc-500 text-[10px] uppercase">Question #{idx + 1}</span>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={e => {
                      const updatedFaqs = [...formData.faqs];
                      updatedFaqs[idx] = { ...updatedFaqs[idx], question: e.target.value };
                      setFormData({ ...formData, faqs: updatedFaqs });
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#00c29e]"
                  />
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-zinc-500 text-[10px] uppercase">Answer</span>
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={e => {
                      const updatedFaqs = [...formData.faqs];
                      updatedFaqs[idx] = { ...updatedFaqs[idx], answer: e.target.value };
                      setFormData({ ...formData, faqs: updatedFaqs });
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-700 focus:outline-none focus:border-[#00c29e]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
