import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User, 
  Wrench, 
  Lock, 
  Mail, 
  Phone, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Briefcase,
  ChevronDown
} from 'lucide-react';
import { DoitLogo } from '../common/DoitLogo';
import { ServiceCategoryId } from '../../types/doit';

export type AuthUserType = 'customer' | 'provider';
export type AuthMode = 'login' | 'register';

interface AuthPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: AuthUserType;
  initialMode?: AuthMode;
  onLoginSuccess: (type: AuthUserType, userData: { name: string; phone: string; email: string }) => void;
}

export const AuthPortalModal: React.FC<AuthPortalModalProps> = ({
  isOpen,
  onClose,
  initialType = 'customer',
  initialMode = 'login',
  onLoginSuccess
}) => {
  const [userType, setUserType] = useState<AuthUserType>(initialType);
  const [mode, setMode] = useState<AuthMode>(initialMode);
  
  // Form fields
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [selectedTrade, setSelectedTrade] = useState<ServiceCategoryId>('gardener');
  const [rememberMe, setRememberMe] = useState(true);

  // Status & validation feedback
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state if props change when opening
  React.useEffect(() => {
    if (isOpen) {
      setUserType(initialType);
      setMode(initialMode);
      setErrorMsg(null);
      setIsSubmitting(false);
    }
  }, [isOpen, initialType, initialMode]);

  if (!isOpen) return null;

  const handleQuickDemo = (type: AuthUserType) => {
    setUserType(type);
    setMode('login');
    setErrorMsg(null);
    if (type === 'customer') {
      setEmailOrPhone('rohan.verma@bhel.in');
      setPassword('doit@123');
    } else {
      setEmailOrPhone('rahul.gardener@doit.in');
      setPassword('partner@123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (mode === 'login') {
      if (!emailOrPhone.trim()) {
        setErrorMsg('Please enter your Email or Mobile Number');
        return;
      }
      if (!password.trim()) {
        setErrorMsg('Please enter your password');
        return;
      }
    } else {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name');
        return;
      }
      if (!phoneNumber.trim() || phoneNumber.length < 10) {
        setErrorMsg('Please enter a valid 10-digit mobile number');
        return;
      }
      if (!password.trim() || password.length < 4) {
        setErrorMsg('Password should be at least 4 characters');
        return;
      }
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const displayName = mode === 'register' 
        ? fullName.trim() 
        : (userType === 'customer' ? 'Rohan Verma' : 'Rahul Sharma');
      const contactPhone = mode === 'register' ? phoneNumber : '94250 11223';
      const contactEmail = mode === 'register' ? emailAddress : (emailOrPhone.includes('@') ? emailOrPhone : 'user@doit.in');

      onLoginSuccess(userType, {
        name: displayName,
        phone: contactPhone,
        email: contactEmail
      });
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Dark blurred backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-zinc-950/70 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="relative w-full max-w-md my-8 z-10 flex flex-col items-center"
        >
          {/* Top Floating Squircle Emblem (Direct Reference to attached screenshot) */}
          <div className="relative -mb-10 z-20">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-[28px] bg-[#00c29e] shadow-xl shadow-[#00c29e]/30 border-4 border-white flex items-center justify-center p-3"
            >
              {/* Use the real DN logo from the project assets. */}
              <DoitLogo
                className="w-full h-full"
                rounded="rounded-[20px]"
                border={false}
              />
            </motion.div>
          </div>

          {/* Main login card */}
          <div className="w-full bg-white rounded-[32px] pt-14 pb-8 px-6 sm:px-8 shadow-2xl border border-zinc-200 text-zinc-900 relative overflow-hidden">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/15 hover:bg-black/25 text-zinc-900 hover:text-black flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Quick Demo Fill Helper Tag */}
            <div className="absolute top-4 left-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-black/10 px-2.5 py-1 rounded-full text-zinc-900">
                Bhopal Verified
              </span>
            </div>

            {/* Header Title (as in screenshot "Admin Panel", here "Customer Portal" or "Service Provider Portal") */}
            <div className="text-center mt-2 mb-4">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
                {userType === 'customer' ? 'Customer Portal' : 'Provider Portal'}
              </h2>
              <p className="text-xs font-semibold text-zinc-900/80 mt-1">
                {userType === 'customer' ? 'ग्राहक पोर्टल • Doit Network' : 'सर्विस प्रोवाइडर पोर्टल • पार्टनर नेटवर्क'}
              </p>
            </div>

            {/* Two Type Option Selector (Login as Customer vs Login as Service Provider) */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-black/15 rounded-full mb-4">
              <button
                type="button"
                onClick={() => {
                  setUserType('customer');
                  setErrorMsg(null);
                }}
                className={`py-2 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  userType === 'customer'
                    ? 'bg-white text-zinc-950 shadow-md scale-[1.02]'
                    : 'text-zinc-900/80 hover:text-zinc-950 hover:bg-black/5'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>As Customer</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setUserType('provider');
                  setErrorMsg(null);
                }}
                className={`py-2 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  userType === 'provider'
                    ? 'bg-white text-zinc-950 shadow-md scale-[1.02]'
                    : 'text-zinc-900/80 hover:text-zinc-950 hover:bg-black/5'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>As Provider</span>
              </button>
            </div>

            {/* Mode Switcher: Sign In vs Create Profile / Register */}
            <div className="flex items-center justify-center gap-4 mb-5 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                }}
                className={`pb-1 transition-all border-b-2 cursor-pointer ${
                  mode === 'login'
                    ? 'border-zinc-950 text-zinc-950 font-black'
                    : 'border-transparent text-zinc-900/70 hover:text-zinc-950'
                }`}
              >
                Sign In (लॉगिन)
              </button>
              <span className="text-zinc-900/40">•</span>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg(null);
                }}
                className={`pb-1 transition-all border-b-2 cursor-pointer ${
                  mode === 'register'
                    ? 'border-zinc-950 text-zinc-950 font-black'
                    : 'border-transparent text-zinc-900/70 hover:text-zinc-950'
                }`}
              >
                Create Profile / Register (नया खाता)
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -6 }} 
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-2.5 rounded-2xl bg-rose-500 text-white text-xs font-bold text-center shadow-sm"
              >
                {errorMsg}
              </motion.div>
            )}

            {/* Form Fields — Styled as exact rounded white pill inputs as in reference screenshot */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {mode === 'register' && (
                <>
                  <div>
                    <input
                      type="text"
                      placeholder="Full Name (पूरा नाम)"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-12 px-6 rounded-full bg-white text-zinc-900 text-sm placeholder:text-zinc-400 font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-zinc-950 transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="10-Digit Mobile Number (मोबाइल नंबर)"
                      value={phoneNumber}
                      maxLength={10}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      className="w-full h-12 px-6 rounded-full bg-white text-zinc-900 text-sm placeholder:text-zinc-400 font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-zinc-950 transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address (ईमेल पता)"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="w-full h-12 px-6 rounded-full bg-white text-zinc-900 text-sm placeholder:text-zinc-400 font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-zinc-950 transition-all"
                    />
                  </div>

                  {userType === 'provider' && (
                    <div className="relative">
                      <select
                        value={selectedTrade}
                        onChange={(e) => setSelectedTrade(e.target.value as ServiceCategoryId)}
                        className="w-full h-12 px-6 rounded-full bg-white text-zinc-900 text-sm font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-zinc-950 appearance-none cursor-pointer"
                      >
                        <option value="gardener">Gardener Services (माली की सेवाएँ)</option>
                        <option value="maid">Maid / Housekeeping (सफाई व घरेलू काम)</option>
                        <option value="caretaker">Caretaker Services (देखभाल की सेवाएँ)</option>
                        <option value="painter">Painter Services (पेंटर की सेवाएँ)</option>
                        <option value="pest_control">Pest Control (कीड़े-मकौड़ों से बचाव)</option>
                        <option value="sanitation">Sanitation Worker (सफाई की सेवाएँ)</option>
                        <option value="labour">Labour Services (मजदूर की सेवाएँ)</option>
                        <option value="helper">Helper Services (मदद के काम)</option>
                        <option value="driver">Driver Services (ड्राइवर की सेवाएँ)</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-zinc-500 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  )}
                </>
              )}

              {mode === 'login' && (
                <>
                  <div>
                    <input
                      type="text"
                      placeholder="Email or Phone (ईमेल या फोन)"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      className="w-full h-13 px-6 rounded-full bg-white text-zinc-900 text-sm placeholder:text-zinc-400 font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-zinc-950 transition-all"
                    />
                  </div>
                </>
              )}

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={mode === 'login' ? 'Password (पासवर्ड)' : 'Create Password (पासवर्ड बनाएं)'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-13 px-6 pr-12 rounded-full bg-white text-zinc-900 text-sm placeholder:text-zinc-400 font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-zinc-950 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Remember Me & Help Link */}
              <div className="flex items-center justify-between px-2 text-xs font-semibold text-zinc-950">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-zinc-900 focus:ring-zinc-900 cursor-pointer accent-zinc-950"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleQuickDemo(userType)}
                  className="underline hover:text-zinc-800 cursor-pointer font-bold"
                >
                  Quick Demo Login
                </button>
              </div>

              {/* The Website Themed Sign In / Register Button (Matching screenshot's bold pill) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-13 rounded-full bg-zinc-950 hover:bg-zinc-900 text-white font-black text-sm uppercase tracking-widest transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 border border-zinc-900"
                >
                  {isSubmitting ? (
                    <span className="inline-block animate-pulse">
                      AUTHENTICATING...
                    </span>
                  ) : (
                    <span>
                      {mode === 'login' ? 'SIGN IN' : 'CREATE PROFILE'}
                    </span>
                  )}
                </button>
              </div>

            </form>

            {/* Quick Persona Test Buttons */}
            <div className="mt-5 pt-4 border-t border-black/10 flex flex-wrap items-center justify-center gap-2">
              <span className="text-[11px] font-bold text-zinc-900/80 w-full text-center">
                1-Click Quick Demo Sign In:
              </span>
              <button
                type="button"
                onClick={() => {
                  handleQuickDemo('customer');
                  setTimeout(() => {
                    onLoginSuccess('customer', {
                      name: 'Rohan Verma',
                      phone: '94250 11223',
                      email: 'rohan.verma@bhel.in'
                    });
                    onClose();
                  }, 200);
                }}
                className="px-3 py-1.5 rounded-full bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-950 text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-[#00755f]" />
                <span>Customer (Rohan)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  handleQuickDemo('provider');
                  setTimeout(() => {
                    onLoginSuccess('provider', {
                      name: 'Rahul Sharma',
                      phone: '98260 44556',
                      email: 'rahul.gardener@doit.in'
                    });
                    onClose();
                  }, 200);
                }}
                className="px-3 py-1.5 rounded-full bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-950 text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Wrench className="w-3.5 h-3.5 text-[#00755f]" />
                <span>Provider (Rahul)</span>
              </button>
            </div>

            {/* Footer Assurance */}
            <p className="text-[11px] text-zinc-950/80 text-center font-medium mt-4">
              Secured Hyperlocal Gateway • BHEL Area, Bhopal
            </p>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
