import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  User,
  Wrench,
  X,
} from 'lucide-react';
import { DoitLogo } from '../common/DoitLogo';

export type AuthUserType = 'customer' | 'provider';
export type AuthMode = 'login' | 'register';

interface AuthPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: AuthUserType;
  initialMode?: AuthMode;
  onLoginSuccess: (
    type: AuthUserType,
    userData: { name: string; phone: string; email: string }
  ) => void;
}

const OTP_LENGTH = 6;

const getDemoProfile = (userType: AuthUserType, phone: string) => ({
  name: userType === 'customer' ? 'Rohan Verma' : 'Rahul Sharma',
  phone,
  email: userType === 'customer' ? 'rohan.verma@bhel.in' : 'rahul.gardener@doit.in',
});

export const AuthPortalModal: React.FC<AuthPortalModalProps> = ({
  isOpen,
  onClose,
  initialType = 'customer',
  onLoginSuccess,
}) => {
  const [userType, setUserType] = useState<AuthUserType>(initialType);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!isOpen) return;
    setUserType(initialType);
    setStep('phone');
    setPhone('');
    setOtp(Array(OTP_LENGTH).fill(''));
    setErrorMsg(null);
    setIsSubmitting(false);
    setResendIn(0);
  }, [isOpen, initialType]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setInterval(() => {
      setResendIn((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendIn]);

  if (!isOpen) return null;

  const isCustomer = userType === 'customer';
  const cleanPhone = phone.replace(/\D/g, '');
  const maskedPhone = cleanPhone
    ? `+91 ${cleanPhone.slice(0, 2)}${'•'.repeat(Math.max(0, cleanPhone.length - 4))}${cleanPhone.slice(-2)}`
    : '+91 XXXXX XXXXX';

  const selectUserType = (nextType: AuthUserType) => {
    setUserType(nextType);
    setStep('phone');
    setOtp(Array(OTP_LENGTH).fill(''));
    setErrorMsg(null);
  };

  const handlePhoneSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg(null);

    if (!cleanPhone) {
      setErrorMsg('Please enter your mobile number.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setStep('otp');
    setOtp(Array(OTP_LENGTH).fill(''));
    setResendIn(30);
    window.setTimeout(() => otpRefs.current[0]?.focus(), 50);
  };

  const handleOtpChange = (index: number, value: string) => {
    setErrorMsg(null);
    const digits = value.replace(/\D/g, '');

    if (digits.length > 1) {
      const pastedOtp = digits.slice(0, OTP_LENGTH).split('');
      setOtp((current) => {
        const next = [...current];
        pastedOtp.forEach((digit, offset) => {
          if (index + offset < OTP_LENGTH) next[index + offset] = digit;
        });
        return next;
      });
      otpRefs.current[Math.min(index + pastedOtp.length, OTP_LENGTH - 1)]?.focus();
      return;
    }

    setOtp((current) => {
      const next = [...current];
      next[index] = digits;
      return next;
    });
    if (digits && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (event.key === 'ArrowLeft' && index > 0) otpRefs.current[index - 1]?.focus();
    if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const enteredOtp = otp.join('');

    if (enteredOtp.length !== OTP_LENGTH) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(userType, getDemoProfile(userType, cleanPhone));
      onClose();
    }, 500);
  };

  const resendOtp = () => {
    if (resendIn > 0) return;
    setOtp(Array(OTP_LENGTH).fill(''));
    setErrorMsg(null);
    setResendIn(30);
    window.setTimeout(() => otpRefs.current[0]?.focus(), 50);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-zinc-950/70 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-dialog-title"
          className="relative z-10 my-8 w-full max-w-md"
        >
          <div className="relative overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between px-6 pt-6">
              <div className="flex items-center gap-3">
                <DoitLogo className="h-12 w-12" rounded="rounded-2xl" border={false} />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                    Doit Networks
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-zinc-500">
                    BHEL Area, Bhopal
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-950"
                aria-label="Close login"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 pb-7 pt-6 sm:px-8">
              <div className="mb-5">
                <p className="mb-2 hidden sm:inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                  <CheckCircle2 className="h-3 w-3 text-[#00876e]" />
                  Bhopal verified
                </p>
                <h2 id="auth-dialog-title" className="text-2xl font-black tracking-tight text-zinc-950">
                  {step === 'otp'
                    ? 'Verify your number'
                    : isCustomer
                      ? 'Welcome to Doit'
                      : 'Welcome back'}
                </h2>
                <p className="mt-1.5 max-w-sm text-sm leading-5 text-zinc-500">
                  {step === 'otp'
                    ? "We've sent a verification code to your mobile number."
                    : isCustomer
                      ? 'Book trusted local services, whenever you need them.'
                      : 'Manage your services and bookings with Doit.'}
                </p>
                {step === 'phone' && isCustomer && (
                  <p className="mt-1 text-xs font-medium text-zinc-400">अपने पास भरोसेमंद सेवा पाएं</p>
                )}
              </div>

              <div className="mb-6 grid grid-cols-2 gap-1 rounded-2xl bg-zinc-100 p-1">
                <button
                  type="button"
                  onClick={() => selectUserType('customer')}
                  className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-xs font-bold transition-all ${
                    isCustomer ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  <User className="h-4 w-4" />
                  As Customer
                </button>
                <button
                  type="button"
                  onClick={() => selectUserType('provider')}
                  className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-xs font-bold transition-all ${
                    !isCustomer ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  <Wrench className="h-4 w-4" />
                  As Provider
                </button>
              </div>

              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-semibold text-rose-700"
                  role="alert"
                >
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}

              {step === 'phone' ? (
                <form onSubmit={handlePhoneSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="auth-phone" className="mb-2 block text-xs font-bold text-zinc-700">
                      Mobile number
                    </label>
                    <div className="flex h-14 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 transition-colors focus-within:border-zinc-950 focus-within:bg-white focus-within:ring-2 focus-within:ring-zinc-950/10">
                      <span className="flex items-center border-r border-zinc-200 px-4 text-sm font-bold text-zinc-700">
                        +91
                      </span>
                      <input
                        id="auth-phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(event) => setPhone(event.target.value.replace(/\D/g, ''))}
                        placeholder="Enter mobile number"
                        className="min-w-0 flex-1 bg-transparent px-4 text-sm font-semibold text-zinc-950 outline-none placeholder:text-zinc-400"
                      />
                      <span className="flex items-center pr-4 text-zinc-400">
                        <Smartphone className="h-4 w-4" />
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 text-sm font-black text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] font-medium text-zinc-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#00876e]" />
                    Secure one-time password login
                  </div>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit} className="space-y-5">
                  <div className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Code sent to</p>
                      <p className="mt-0.5 text-sm font-bold text-zinc-800">{maskedPhone}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setStep('phone');
                        setErrorMsg(null);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-zinc-600 underline underline-offset-2 hover:text-zinc-950"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Edit
                    </button>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-zinc-700" htmlFor="otp-0">
                      Enter 6-digit OTP
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          ref={(element) => {
                            otpRefs.current[index] = element;
                          }}
                          type="text"
                          inputMode="numeric"
                          autoComplete={index === 0 ? 'one-time-code' : 'off'}
                          maxLength={OTP_LENGTH}
                          value={digit}
                          onChange={(event) => handleOtpChange(index, event.target.value)}
                          onKeyDown={(event) => handleOtpKeyDown(index, event)}
                          aria-label={`OTP digit ${index + 1}`}
                          className="h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 text-center text-xl font-black text-zinc-950 outline-none transition-colors focus:border-zinc-950 focus:bg-white focus:ring-2 focus:ring-zinc-950/10"
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 text-sm font-black text-white transition-colors hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2"
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify'}
                    {!isSubmitting && <CheckCircle2 className="h-4 w-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={resendOtp}
                    disabled={resendIn > 0}
                    className="mx-auto flex items-center gap-1.5 text-xs font-bold text-zinc-600 transition-colors hover:text-zinc-950 disabled:cursor-not-allowed disabled:text-zinc-400"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend OTP'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthPortalModal;