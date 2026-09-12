import React, { useState } from 'react';
import { 
  Provider, 
  ServiceCategory, 
  ServiceCategoryId, 
  KycDocument 
} from '../../types/doit';
import { 
  X, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Upload, 
  FileText, 
  User, 
  MapPin, 
  Briefcase, 
  Check,
  AlertCircle,
  Phone,
  Sparkles
} from 'lucide-react';

interface ProviderOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ServiceCategory[];
  onRegisterSuccess: (newProvider: Provider) => void;
}

export const ProviderOnboardingModal: React.FC<ProviderOnboardingModalProps> = ({
  isOpen,
  onClose,
  categories,
  onRegisterSuccess
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [generatedRefId, setGeneratedRefId] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Basic Details
    name: '',
    phone: '',
    whatsapp: '',
    gender: 'Male' as 'Male' | 'Female',
    age: 32,
    dob: '1994-05-12',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',

    // Step 2: Address
    houseFlatNumber: '',
    street: '',
    landmark: '',
    locality: 'BHEL Sector 1',
    pincode: '462022',
    city: 'Bhopal',
    state: 'Madhya Pradesh',

    // Step 3: Service Details
    primaryCategory: 'gardener' as ServiceCategoryId,
    secondaryCategories: [] as ServiceCategoryId[],
    skillsText: 'Lawn mowing, hedge trimming, plant feeding',
    experienceYears: 4,
    serviceAreas: ['BHEL Sector 1', 'BHEL Sector 2', 'Piplani'],
    maxTravelDistanceKm: 6,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    workingHours: '8:00 AM - 6:00 PM',

    // Step 4: Professional Details
    employmentType: 'Individual' as 'Individual' | 'Agency',
    agencyName: '',
    references: 'Reference: S. K. Dubey, BHEL Works contractor (98260 00000)',
    certifications: 'Basic landscaping & garden maintenance experience',

    // Step 5: KYC Verification
    aadhaarNumber: 'XXXX-XXXX-9921',
    panNumber: 'ABCDE1234F',
    hasPoliceVerification: true,
    agreedToTerms: true
  });

  if (!isOpen) return null;

  const handleNextStep = () => {
    if (currentStep === 1 && (!formData.name || !formData.phone)) {
      alert('Please fill in your name and mobile number.');
      return;
    }
    if (currentStep === 2 && !formData.houseFlatNumber) {
      alert('Please enter your quarter / house number.');
      return;
    }
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmitApplication();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmitApplication = () => {
    const newId = `PRV-${Math.floor(10000 + Math.random() * 90000)}`;
    const refNum = `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedRefId(refNum);

    const newProvider: Provider = {
      id: newId,
      name: formData.name || 'New Service Partner',
      phone: formData.phone || '98260 00000',
      whatsapp: formData.whatsapp || formData.phone || '98260 00000',
      photo: formData.photoUrl,
      age: Number(formData.age) || 30,
      gender: formData.gender,
      dob: formData.dob,
      residentialLocality: `${formData.locality}, Bhopal`,
      address: {
        houseFlatNumber: formData.houseFlatNumber,
        street: formData.street,
        landmark: formData.landmark,
        locality: formData.locality,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      },
      categories: [formData.primaryCategory, ...formData.secondaryCategories],
      skills: formData.skillsText.split(',').map(s => s.trim()).filter(Boolean),
      experienceYears: Number(formData.experienceYears) || 3,
      serviceAreas: formData.serviceAreas,
      maxTravelDistanceKm: formData.maxTravelDistanceKm,
      canTravelOutside: true,
      workingDays: formData.workingDays,
      workingHours: formData.workingHours,
      employmentType: formData.employmentType,
      references: formData.references,
      isAcceptingJobs: false, // Inactive until KYC is approved by Admin
      coordinates: { lat: 23.2385, lng: 77.4720 },
      isEmergencyAvailable: false,
      pricingRateText: 'Standard DOIT Rate Card',
      kycStatus: 'PENDING',
      kycDoc: {
        id: `KYC-${Date.now().toString().slice(-4)}`,
        type: 'Aadhaar Card',
        number: formData.aadhaarNumber,
        rawNumber: formData.aadhaarNumber,
        documentUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
        selfieUrl: formData.photoUrl,
        nameAsPerDoc: formData.name,
        dob: formData.dob,
        addressAsPerDoc: `${formData.houseFlatNumber}, ${formData.locality}, Bhopal`,
        status: 'PENDING',
        uploadedAt: new Date().toISOString().split('T')[0],
        policeVerificationNote: formData.hasPoliceVerification ? 'Applicant declared local police clearance.' : undefined
      },
      panDoc: {
        id: `PAN-${Date.now().toString().slice(-4)}`,
        type: 'PAN Card',
        number: formData.panNumber,
        rawNumber: formData.panNumber,
        documentUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
        status: 'PENDING',
        uploadedAt: new Date().toISOString().split('T')[0]
      },
      rating: 5.0,
      ratingsBreakdown: {
        professionalism: 5.0,
        punctuality: 5.0,
        quality: 5.0,
        behaviour: 5.0
      },
      completedJobsCount: 0,
      cancellationRate: 0,
      noShowRate: 0,
      onTimeRate: 100,
      acceptanceRate: 100,
      complaintCount: 0,
      earningsThisMonth: {
        gross: 0,
        doitFee: 0,
        netPayout: 0
      },
      status: 'APPLICATION_SUBMITTED',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    onRegisterSuccess(newProvider);
    setIsSubmitted(true);
  };

  const autofillDemoData = () => {
    setFormData({
      name: 'Kailash Prasad Soni',
      phone: '98269 44332',
      whatsapp: '98269 44332',
      gender: 'Male',
      age: 36,
      dob: '1988-11-24',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      houseFlatNumber: 'Qtr No. 33/C, Type-3',
      street: 'Sector 3 Main Avenue',
      landmark: 'Near BHEL Community Hall',
      locality: 'BHEL Sector 3',
      pincode: '462022',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      primaryCategory: 'gardener',
      secondaryCategories: ['sanitation'],
      skillsText: 'Lawn mower operation, terrace pot grafting, tree pruning, drain clearing',
      experienceYears: 7,
      serviceAreas: ['BHEL Sector 1', 'BHEL Sector 2', 'BHEL Sector 3', 'Govindpura'],
      maxTravelDistanceKm: 8,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      workingHours: '8:00 AM - 6:00 PM',
      employmentType: 'Individual',
      agencyName: '',
      references: 'Former maintenance team at BHEL Township Nursery',
      certifications: 'Vocational gardening certificate',
      aadhaarNumber: 'XXXX-XXXX-7719',
      panNumber: 'KPSSB****J',
      hasPoliceVerification: true,
      agreedToTerms: true
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col my-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00c29e] flex items-center justify-center text-white font-black text-sm shadow-xs">
              D
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Join as a DOIT Service Professional</h3>
              <p className="text-[11px] text-zinc-500">Hyperlocal Home Service Partner Onboarding (BHEL Bhopal)</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator */}
        {!isSubmitted && (
          <div className="px-6 py-3 bg-zinc-50/50 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(step => (
                <div key={step} className="flex items-center gap-1.5">
                  <div 
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                      currentStep === step 
                        ? 'bg-[#00c29e] text-white shadow-xs' 
                        : currentStep > step 
                          ? 'bg-[#e6faf6] text-[#00755f]' 
                          : 'bg-zinc-200 text-zinc-500'
                    }`}
                  >
                    {currentStep > step ? <Check className="w-3.5 h-3.5" /> : step}
                  </div>
                  {step < 5 && <span className="w-4 sm:w-8 h-0.5 bg-zinc-200" />}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={autofillDemoData}
                className="text-[10px] font-bold text-[#00755f] bg-[#e6faf6] hover:bg-[#d0f5ee] border border-[#99ede0] px-2 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" /> Auto-Fill Demo Partner
              </button>
              <span className="text-xs font-bold text-zinc-500">Step {currentStep} of 5</span>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          
          {/* SUCCESS SCREEN */}
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-[#e6faf6] border-2 border-[#99ede0] text-[#00c29e] flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-zinc-900">Application Submitted Successfully!</h4>
                <p className="text-xs text-zinc-600 mt-1">
                  Reference ID: <span className="font-mono font-bold text-zinc-900">{generatedRefId}</span>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-left text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-zinc-800">
                  <ShieldCheck className="w-4 h-4 text-[#00c29e]" />
                  What happens next?
                </div>
                <ul className="list-disc list-inside space-y-1 text-zinc-600 text-[11px]">
                  <li>Our BHEL KYC Verification Desk will review your Aadhaar and PAN documents within 24 hours.</li>
                  <li>Local police verification certificate will be validated.</li>
                  <li>Once approved, you will receive an SMS alert and your profile will be activated to accept nearby service dispatches.</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-[#00c29e] hover:bg-[#00a887] text-white font-bold text-xs shadow-md shadow-[#00c29e]/20 transition-all cursor-pointer"
              >
                Return to Portal
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              
              {/* STEP 1: Basic Details */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">Step 1: Personal Information</h4>
                    <p className="text-xs text-zinc-500">Enter your name as per government Aadhaar card</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700">Full Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Kailash Prasad Soni"
                        className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700">Mobile Number (Calling) *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="98260 12345"
                        className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700">WhatsApp Number</label>
                      <input
                        type="tel"
                        value={formData.whatsapp}
                        onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                        placeholder="Same as calling number"
                        className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none bg-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={e => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700">Age (Years)</label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Address in Bhopal/BHEL */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">Step 2: Residential Address</h4>
                    <p className="text-xs text-zinc-500">Provide your residential address in or around BHEL township</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-zinc-700">Quarter / House / Flat No. *</label>
                      <input
                        type="text"
                        value={formData.houseFlatNumber}
                        onChange={e => setFormData({ ...formData, houseFlatNumber: e.target.value })}
                        placeholder="e.g. Qtr No. 33/C, Type-3, or House 14"
                        className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700">Street / Road</label>
                      <input
                        type="text"
                        value={formData.street}
                        onChange={e => setFormData({ ...formData, street: e.target.value })}
                        placeholder="e.g. Sector 3 Main Avenue"
                        className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700">Landmark</label>
                      <input
                        type="text"
                        value={formData.landmark}
                        onChange={e => setFormData({ ...formData, landmark: e.target.value })}
                        placeholder="e.g. Near Community Hall / Dispensary"
                        className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700">Locality / Sector</label>
                      <select
                        value={formData.locality}
                        onChange={e => setFormData({ ...formData, locality: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none bg-white"
                      >
                        <option value="BHEL Sector 1">BHEL Sector 1</option>
                        <option value="BHEL Sector 2">BHEL Sector 2</option>
                        <option value="BHEL Sector 3">BHEL Sector 3</option>
                        <option value="BHEL Sector 4">BHEL Sector 4</option>
                        <option value="BHEL Sector 5">BHEL Sector 5</option>
                        <option value="BHEL Sector 6">BHEL Sector 6</option>
                        <option value="Piplani">Piplani</option>
                        <option value="Govindpura">Govindpura</option>
                        <option value="Indrapuri">Indrapuri</option>
                        <option value="Berkheda">Berkheda</option>
                        <option value="Awadhpuri">Awadhpuri</option>
                        <option value="Ayodhya Nagar">Ayodhya Nagar</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700">Pincode</label>
                      <input
                        type="text"
                        value={formData.pincode}
                        onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                        placeholder="462022"
                        className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Service Details */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">Step 3: Service Categories & Skills</h4>
                    <p className="text-xs text-zinc-500">Select what services you provide in BHEL Bhopal</p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700">Primary Category *</label>
                      <select
                        value={formData.primaryCategory}
                        onChange={e => setFormData({ ...formData, primaryCategory: e.target.value as ServiceCategoryId })}
                        className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none bg-white font-medium"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name} ({cat.pricingModel})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700">Specific Skills (comma separated)</label>
                      <textarea
                        rows={2}
                        value={formData.skillsText}
                        onChange={e => setFormData({ ...formData, skillsText: e.target.value })}
                        placeholder="e.g. Lawn mowing, hedge trimming, weed removal"
                        className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-700">Years of Experience</label>
                        <input
                          type="number"
                          value={formData.experienceYears}
                          onChange={e => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                          className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-700">Max Travel Distance (KM)</label>
                        <input
                          type="number"
                          value={formData.maxTravelDistanceKm}
                          onChange={e => setFormData({ ...formData, maxTravelDistanceKm: Number(e.target.value) })}
                          className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Professional Details */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">Step 4: Professional Background & References</h4>
                    <p className="text-xs text-zinc-500">Provide past working experience or BHEL references</p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700">Employment Type</label>
                      <div className="flex gap-4 pt-1">
                        <label className="flex items-center gap-2 text-xs font-medium text-zinc-800 cursor-pointer">
                          <input
                            type="radio"
                            name="empType"
                            checked={formData.employmentType === 'Individual'}
                            onChange={() => setFormData({ ...formData, employmentType: 'Individual' })}
                          />
                          Individual Professional
                        </label>
                        <label className="flex items-center gap-2 text-xs font-medium text-zinc-800 cursor-pointer">
                          <input
                            type="radio"
                            name="empType"
                            checked={formData.employmentType === 'Agency'}
                            onChange={() => setFormData({ ...formData, employmentType: 'Agency' })}
                          />
                          Agency / Contractor Team
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700">Past Experience / References</label>
                      <textarea
                        rows={2}
                        value={formData.references}
                        onChange={e => setFormData({ ...formData, references: e.target.value })}
                        placeholder="e.g. Worked with BHEL township horticulture or house cleaning contractor..."
                        className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: KYC Verification */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">Step 5: KYC Documents & Declaration</h4>
                    <p className="text-xs text-zinc-500">Government identity verification required for platform security</p>
                  </div>

                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700">Aadhaar Card Number *</label>
                      <input
                        type="text"
                        value={formData.aadhaarNumber}
                        onChange={e => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                        placeholder="XXXX-XXXX-1234"
                        className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700">PAN Card Number *</label>
                      <input
                        type="text"
                        value={formData.panNumber}
                        onChange={e => setFormData({ ...formData, panNumber: e.target.value })}
                        placeholder="ABCDE1234F"
                        className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none font-mono uppercase"
                      />
                    </div>

                    <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                      <label className="flex items-start gap-2 text-xs text-zinc-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.hasPoliceVerification}
                          onChange={e => setFormData({ ...formData, hasPoliceVerification: e.target.checked })}
                          className="mt-0.5"
                        />
                        <span>I confirm I possess a clean police record and agree to provide local police verification certificate if requested.</span>
                      </label>

                      <label className="flex items-start gap-2 text-xs text-zinc-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.agreedToTerms}
                          onChange={e => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                          className="mt-0.5"
                        />
                        <span>I agree to DOIT Network Partner Terms, quality standards, and transparent fee policies.</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                ) : <div />}

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-5 py-2.5 rounded-xl bg-[#00c29e] hover:bg-[#00a887] text-white font-bold text-xs shadow-md shadow-[#00c29e]/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{currentStep === 5 ? 'Submit Application' : 'Continue'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
