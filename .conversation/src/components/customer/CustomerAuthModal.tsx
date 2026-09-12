import React, { useState, useEffect } from 'react';
import { CustomerProfile, SavedAddress } from '../../types/doit';
import { 
  X, 
  Phone, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  User, 
  Mail, 
  Plus, 
  Check,
  Clock,
  Sparkles
} from 'lucide-react';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerProfile: CustomerProfile;
  onUpdateProfile: (updatedProfile: CustomerProfile) => void;
  onAuthSuccess?: (phone: string) => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  customerProfile,
  onUpdateProfile,
  onAuthSuccess
}) => {
  const [authStep, setAuthStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phoneNumber, setPhoneNumber] = useState(customerProfile.phone || '94250 11223');
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [timerSeconds, setTimerSeconds] = useState<number>(30);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  // Profile fields
  const [name, setName] = useState(customerProfile.name || '');
  const [email, setEmail] = useState(customerProfile.email || '');
  const [altPhone, setAltPhone] = useState('');

  // Demo OTP constant
  const DEMO_OTP = '782410';

  useEffect(() => {
    let interval: any = null;
    if (isTimerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timerSeconds]);

  if (!isOpen) return null;

  const handleSendOtp = () => {
    if (phoneNumber.replace(/\D/g, '').length < 10) {
      setOtpError('Please enter a valid 10-digit mobile number');
      return;
    }
    setOtpError(null);
    setAuthStep('otp');
    setTimerSeconds(30);
    setIsTimerActive(true);
    setOtpValues(['', '', '', '', '', '']);
  };

  const handleFillDemoOtp = () => {
    setOtpValues(DEMO_OTP.split(''));
    setOtpError(null);
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otpValues.join('');
    if (enteredOtp.length < 6) {
      setOtpError('Please enter the complete 6-digit OTP');
      return;
    }
    // Allow demo OTP or any 6-digit number in prototype
    if (enteredOtp === DEMO_OTP || enteredOtp.length === 6) {
      setOtpError(null);
      setAuthStep('profile');
      if (onAuthSuccess) {
        onAuthSuccess(phoneNumber);
      }
    } else {
      setOtpError('Invalid OTP. Please try demo code 782410');
    }
  };

  const handleSaveProfile = () => {
    const updated: CustomerProfile = {
      ...customerProfile,
      name: name || 'Customer',
      phone: phoneNumber,
      email: email || customerProfile.email
    };
    onUpdateProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00c29e] flex items-center justify-center text-white font-black text-sm shadow-xs">
              D
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">
                {authStep === 'profile' ? 'Customer Profile' : 'Customer Sign In / Register'}
              </h3>
              <p className="text-[11px] text-zinc-500">Hyperlocal BHEL Township Services</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          
          {/* STEP 1: Phone Input */}
          {authStep === 'phone' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-[#e6faf6] border border-[#99ede0] text-[#00755f] flex items-center justify-center mx-auto mb-2">
                  <Phone className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-zinc-900">Enter your Mobile Number</h4>
                <p className="text-xs text-zinc-500">
                  We will send a 6-digit verification code to access your bookings & addresses.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">Mobile Number</label>
                <div className="flex rounded-xl border border-zinc-200 bg-white overflow-hidden focus-within:border-[#00c29e] focus-within:ring-2 focus-within:ring-[#00c29e]/20 transition-all">
                  <div className="bg-zinc-50 px-3 py-2.5 border-r border-zinc-200 text-xs font-semibold text-zinc-600 flex items-center gap-1">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="98260 12345"
                    maxLength={14}
                    className="w-full px-3 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none"
                    autoFocus
                  />
                </div>
                {otpError && (
                  <p className="text-[11px] text-rose-600 font-medium">{otpError}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#00c29e] hover:bg-[#00a887] text-white font-bold text-xs shadow-md shadow-[#00c29e]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Send Verification Code</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-[11px] text-amber-800 space-y-1">
                <p className="font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Instant Prototype Login
                </p>
                <p className="text-amber-700">
                  Default BHEL customer account (Prof. S. K. Verma) with active sample bookings is loaded automatically.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: OTP Verification */}
          {authStep === 'otp' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-[#e6faf6] border border-[#99ede0] text-[#00755f] flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-zinc-900">Verify OTP Code</h4>
                <p className="text-xs text-zinc-500">
                  Sent to <span className="font-semibold text-zinc-800">+91 {phoneNumber}</span>
                  <button 
                    onClick={() => setAuthStep('phone')} 
                    className="text-[#00c29e] ml-1 font-semibold hover:underline"
                  >
                    Edit
                  </button>
                </p>
              </div>

              {/* 6-digit OTP boxes */}
              <div className="flex justify-center items-center gap-2">
                {otpValues.map((val, idx) => (
                  <input
                    key={idx}
                    id={`otp-box-${idx}`}
                    type="text"
                    maxLength={1}
                    value={val}
                    onChange={(e) => {
                      const v = e.target.value;
                      const next = [...otpValues];
                      next[idx] = v;
                      setOtpValues(next);
                      if (v && idx < 5) {
                        const nextInput = document.getElementById(`otp-box-${idx + 1}`);
                        nextInput?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otpValues[idx] && idx > 0) {
                        const prevInput = document.getElementById(`otp-box-${idx - 1}`);
                        prevInput?.focus();
                      }
                    }}
                    className="w-11 h-12 text-center text-lg font-bold border border-zinc-200 rounded-xl bg-zinc-50/50 focus:bg-white focus:border-[#00c29e] focus:ring-2 focus:ring-[#00c29e]/20 outline-none transition-all"
                  />
                ))}
              </div>

              {otpError && (
                <p className="text-center text-[11px] text-rose-600 font-medium">{otpError}</p>
              )}

              {/* Demo Auto-Fill button */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={handleFillDemoOtp}
                  className="text-[11px] font-semibold text-[#00755f] bg-[#e6faf6] hover:bg-[#d0f5ee] border border-[#99ede0] px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  Auto-fill demo OTP ({DEMO_OTP})
                </button>

                <div className="text-[11px] text-zinc-500">
                  {isTimerActive ? (
                    <span className="flex items-center gap-1 text-zinc-500">
                      <Clock className="w-3 h-3 text-zinc-400" /> Resend in {timerSeconds}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsTimerActive(true);
                        setTimerSeconds(30);
                      }}
                      className="text-[#00c29e] font-semibold hover:underline cursor-pointer"
                    >
                      Resend Code
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#00c29e] hover:bg-[#00a887] text-white font-bold text-xs shadow-md shadow-[#00c29e]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify & Proceed</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Customer Profile View / Edit */}
          {authStep === 'profile' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Your Account Info</h4>
                  <p className="text-[11px] text-zinc-500">ID: {customerProfile.id || 'CUST-8910'}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#e6faf6] text-[#00755f] font-bold border border-[#99ede0] flex items-center gap-1">
                  <Check className="w-3 h-3" /> Verified Phone
                </span>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Prof. S. K. Verma"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700">Mobile Phone (Verified)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={phoneNumber}
                      disabled
                      className="w-full pl-9 pr-3 py-2 text-xs border border-zinc-200 bg-zinc-50 text-zinc-600 rounded-xl cursor-not-allowed font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700">Email Address (Optional)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="skverma.bhel@gmail.com"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700">Alternate / WhatsApp Phone</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={altPhone}
                      onChange={e => setAltPhone(e.target.value)}
                      placeholder="e.g. 98930 00000"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-zinc-200 rounded-xl focus:border-[#00c29e] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Saved addresses summary */}
              <div className="pt-2 border-t border-zinc-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#00c29e]" />
                    Saved Quarters & Houses ({customerProfile.savedAddresses?.length || 0})
                  </span>
                </div>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {customerProfile.savedAddresses?.map((addr, idx) => (
                    <div 
                      key={idx}
                      className="p-2 rounded-xl bg-zinc-50 border border-zinc-100 text-[11px] flex items-start justify-between gap-2"
                    >
                      <div>
                        <span className="font-bold text-zinc-800">{addr.label || addr.houseFlatNumber}</span>
                        <p className="text-zinc-500 text-[10px] line-clamp-1">{addr.address}</p>
                      </div>
                      {addr.isDefault && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#e6faf6] text-[#00755f] font-bold">
                          Default
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#00c29e] hover:bg-[#00a887] text-white font-bold text-xs shadow-md shadow-[#00c29e]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Profile & Return</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
