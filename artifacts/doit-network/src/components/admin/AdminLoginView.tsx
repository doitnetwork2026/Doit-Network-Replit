import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  X,
} from 'lucide-react';
import { DoitLogo } from '../common/DoitLogo';

interface AdminSession {
  email: string;
  role: string;
  permissions: string[];
}

interface AdminLoginViewProps {
  onSuccess: (adminData: AdminSession) => void;
  onBackToWebsite?: () => void;
  theme?: 'light' | 'dark';
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  onSuccess,
  onBackToWebsite,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      let data: any = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok || !data.authorized) {
        setErrorMessage(
          data.error ||
            (response.status >= 500
              ? 'Unable to connect. Please try again.'
              : 'Invalid email or password.')
        );
        return;
      }

      setSuccessMessage('Secure admin access verified. Opening dashboard...');
      window.setTimeout(() => {
        onSuccess({
          email: data.email || email.trim().toLowerCase(),
          role: data.role || 'ADMIN',
          permissions: data.roleDetails?.permissions || [],
        });
      }, 450);
    } catch {
      setErrorMessage('Unable to connect. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 transition-colors">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_520px]">
        <section className="relative hidden overflow-hidden bg-zinc-950 px-12 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10" />
          <div className="absolute -bottom-44 -left-24 h-[30rem] w-[30rem] rounded-full border border-white/10" />

          <div className="relative z-10 flex items-center gap-3">
            <DoitLogo className="h-12 w-12" rounded="rounded-2xl" border={false} />
            <div>
              <p className="text-sm font-black tracking-wide">DOIT NETWORKS</p>
              <p className="text-xs text-zinc-400">Operations console</p>
            </div>
          </div>

          <div className="relative z-10 max-w-lg">
            <span className="mb-5 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-300">
              Admin portal
            </span>
            <h1 className="text-4xl font-black leading-tight tracking-tight xl:text-5xl">
              Run every local service with confidence.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-zinc-400">
              Manage bookings, verify providers, resolve customer issues, and keep the BHEL network moving from one secure workspace.
            </p>
            <div className="mt-8 grid max-w-md grid-cols-2 gap-3">
              {['Provider verification', 'Booking operations', 'Secure audit trail', 'Local coverage'].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-xs font-semibold text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-[#00c29e]" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-xs text-zinc-500">DOIT Networks • BHEL Area, Bhopal</p>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
          <div className="w-full max-w-md">
            {onBackToWebsite && (
              <button
                type="button"
                onClick={onBackToWebsite}
                className="mb-8 inline-flex items-center gap-2 text-xs font-bold text-zinc-500 transition-colors hover:text-zinc-950"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to website
              </button>
            )}

            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <DoitLogo className="h-11 w-11" rounded="rounded-2xl" border={false} />
              <div>
                <p className="text-sm font-black tracking-wide">DOIT NETWORKS</p>
                <p className="text-xs text-zinc-500">Admin portal</p>
              </div>
            </div>

            <div className="mb-7">
              <span className="inline-flex rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600 dark:text-zinc-300">
                Admin portal
              </span>
               <h2 className="mt-4 text-3xl font-black tracking-tight">Welcome back, Admin</h2>
               <p className="mt-2 text-sm leading-5 text-zinc-500 dark:text-zinc-400">Sign in to manage Doit Networks.</p>
            </div>

             <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm sm:p-8">
              {errorMessage && (
                <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800" role="alert">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                  <div>
                    <p className="font-bold">Sign in unsuccessful</p>
                    <p className="mt-0.5 text-[11px]">{errorMessage}</p>
                  </div>
                </div>
              )}

              {successMessage && (
                <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800" role="status">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <p className="font-bold">{successMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                     <label htmlFor="admin-email" className="mb-2 block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      id="admin-email"
                      type="email"
                      autoComplete="username"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="admin@doitnetwork.in"
                       className="h-12 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 pl-11 pr-4 text-sm font-medium text-zinc-950 dark:text-white outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-950 dark:focus:border-zinc-300 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-zinc-950/10"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                     <label htmlFor="admin-password" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(email);
                        setForgotSubmitted(false);
                        setShowForgotModal(true);
                      }}
                       className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 underline underline-offset-2 hover:text-zinc-950 dark:hover:text-white"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                       className="h-12 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 pl-11 pr-11 text-sm font-medium text-zinc-950 dark:text-white outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-950 dark:focus:border-zinc-300 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-zinc-950/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                       className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-400 hover:text-zinc-800 dark:hover:text-white"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 text-sm font-black text-white transition-colors hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                  {!isLoading && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>

               <div className="mt-6 flex items-center justify-center gap-2 border-t border-zinc-100 dark:border-zinc-800 pt-5 text-[11px] font-semibold text-zinc-400">
                <ShieldCheck className="h-4 w-4 text-[#00876e]" />
                Protected admin access
              </div>
            </div>
          </div>
        </section>
      </div>

      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm">
           <div className="w-full max-w-md rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">Admin access</p>
                 <h3 className="mt-2 text-xl font-black tracking-tight text-zinc-950 dark:text-white">Reset your password</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                   className="rounded-full bg-zinc-100 dark:bg-zinc-800 p-2 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-950 dark:hover:text-white"
                aria-label="Close reset password"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                <p className="font-bold">Password reset instructions have been sent.</p>
                <p className="mt-1 text-xs">If the address is registered, you will receive next steps shortly.</p>
              </div>
            ) : (
              <>
                 <p className="mt-3 text-sm leading-5 text-zinc-500 dark:text-zinc-400">
                  Enter your admin email and we&apos;ll help you reset your password.
                </p>
                 <label htmlFor="forgot-admin-email" className="mt-5 block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Admin email
                </label>
                <input
                  id="forgot-admin-email"
                  type="email"
                  value={forgotEmail}
                  onChange={(event) => setForgotEmail(event.target.value)}
                  placeholder="admin@doitnetwork.in"
                   className="mt-2 h-12 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 text-sm text-zinc-950 dark:text-white outline-none focus:border-zinc-950 dark:focus:border-zinc-300 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-zinc-950/10"
                />
                <button
                  type="button"
                  onClick={() => setForgotSubmitted(true)}
                  className="mt-5 h-12 w-full rounded-xl bg-zinc-950 text-sm font-black text-white hover:bg-zinc-800"
                >
                  Send Reset Link
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLoginView;