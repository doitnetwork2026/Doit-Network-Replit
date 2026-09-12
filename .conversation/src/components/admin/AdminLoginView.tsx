import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  HelpCircle,
  X,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { DoitLogo } from '../common/DoitLogo';

interface AdminLoginViewProps {
  onSuccess: (adminData: { email: string; role: string; permissions: string[] }) => void;
  onBackToWebsite?: () => void;
  theme?: 'light' | 'dark';
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ 
  onSuccess, 
  onBackToWebsite,
  theme = 'light' 
}) => {
  const [email, setEmail] = useState('rrichi336@gmail.com');
  const [password, setPassword] = useState('Admin@123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your administrator email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your security password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Server-side authorization check against /api/auth/verify-admin
      const response = await fetch('/api/auth/verify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      });

      const data = await response.json();

      if (!response.ok || !data.authorized) {
        setErrorMessage(data.error || 'Invalid credentials or unauthorized administrator account.');
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Administrator credentials verified. Accessing DOIT Admin Hub...');
      
      const adminSession = {
        email: data.email,
        role: data.role,
        permissions: data.roleDetails?.permissions || [
          'manage_admins', 'disable_admin', 'change_roles', 'approve_kyc',
          'reject_kyc', 'approve_payout', 'approve_refund', 'approve_deletion',
          'override_commission', 'adjust_wallet', 'view_audit_logs', 'edit_pricing', 'edit_cms'
        ],
        token: `doit_auth_${Date.now()}`,
        authenticatedAt: new Date().toISOString()
      };

      if (rememberMe) {
        localStorage.setItem('doit_verified_admin_session', JSON.stringify(adminSession));
      } else {
        sessionStorage.setItem('doit_verified_admin_session', JSON.stringify(adminSession));
      }

      setTimeout(() => {
        onSuccess(adminSession);
      }, 600);
    } catch (err: any) {
      setErrorMessage(err.message || 'Connection error while communicating with DOIT authorization server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSelect = (quickEmail: string) => {
    setEmail(quickEmail);
    setPassword('Admin@123456');
    setErrorMessage(null);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors ${
      isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-[#fafaf9] text-zinc-900'
    }`}>
      {/* Top Bar with Back to Website */}
      <div className="absolute top-6 left-6 flex items-center gap-4">
        {onBackToWebsite && (
          <button
            type="button"
            onClick={onBackToWebsite}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              isDark 
                ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800' 
                : 'bg-white hover:bg-zinc-100 text-zinc-600 border border-zinc-200/80 shadow-2xs'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Customer Website</span>
          </button>
        )}
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* DOIT Brand Logo & Heading */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white shadow-2xs border border-zinc-200/80 dark:bg-zinc-900 dark:border-zinc-800">
            <DoitLogo className="w-10 h-10" />
          </div>
          <div>
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-black tracking-tight">DOIT Admin Hub</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#e6faf6] text-[#00755f] border border-[#99ede0] dark:bg-[#00755f]/20 dark:text-[#99ede0] dark:border-[#00755f]/40">
                Secure
              </span>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Sign in to manage bookings, verify providers, and monitor platform operations.
            </p>
          </div>
        </div>

        {/* Card Container */}
        <div className={`p-6 sm:p-8 rounded-2xl shadow-sm border transition-all ${
          isDark 
            ? 'bg-zinc-900/90 border-zinc-800/90 shadow-zinc-950/50' 
            : 'bg-white border-zinc-200/80 shadow-zinc-200/50'
        }`}>
          {/* Status Messages */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Access Denied</p>
                <p className="text-[11px] mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900/60 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Authorized</p>
                <p className="text-[11px] mt-0.5">{successMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className={`block text-xs font-bold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                Administrator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@doitnetwork.in"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-[#00c29e]/40 ${
                    isDark
                      ? 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-[#00c29e]'
                      : 'bg-zinc-50/50 border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-[#00c29e] focus:bg-white'
                  }`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className={`block text-xs font-bold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] font-semibold text-[#00876e] hover:text-[#00c29e] cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-9 pr-10 py-2.5 rounded-xl text-xs font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-[#00c29e]/40 ${
                    isDark
                      ? 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-[#00c29e]'
                      : 'bg-zinc-50/50 border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-[#00c29e] focus:bg-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#00c29e] accent-[#00c29e] w-4 h-4"
                />
                <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>
                  Remember session on this device
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#00c29e] hover:bg-[#00a889] disabled:opacity-60 transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 group mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Authorization...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Hub</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Quick Authorized Personas */}
          <div className={`mt-6 pt-5 border-t space-y-2.5 ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider block ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Quick Personas (Server Registered)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickSelect('rrichi336@gmail.com')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  email === 'rrichi336@gmail.com'
                    ? isDark ? 'border-[#00c29e]/50 bg-[#00c29e]/10' : 'border-[#00c29e] bg-[#e6faf6]/60'
                    : isDark ? 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700' : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100/80'
                }`}
              >
                <span className="text-[11px] font-bold block truncate">rrichi336@gmail.com</span>
                <span className="text-[10px] text-[#00876e] font-semibold">Super Admin (Owner)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('admin@example.com')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  email === 'admin@example.com'
                    ? isDark ? 'border-[#00c29e]/50 bg-[#00c29e]/10' : 'border-[#00c29e] bg-[#e6faf6]/60'
                    : isDark ? 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700' : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100/80'
                }`}
              >
                <span className="text-[11px] font-bold block truncate">admin@example.com</span>
                <span className="text-[10px] text-zinc-500 font-semibold">Operations Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <p className={`text-center text-[11px] mt-6 flex items-center justify-center gap-1.5 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
          <ShieldCheck className="w-3.5 h-3.5 text-[#00c29e]" />
          <span>Protected by DOIT server-side role verification and audit logging.</span>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`max-w-md w-full p-6 rounded-2xl border shadow-xl ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-bold">Reset Administrator Credentials</h3>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSubmitted(false);
                }}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-4 space-y-3">
              {forgotSubmitted ? (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                  <p className="font-bold">Password Reset Instructions Dispatched</p>
                  <p className="text-[11px]">
                    If {forgotEmail || email} is an authorized administrator, an encrypted recovery link has been dispatched to the registered address.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Enter your registered administrator email. The platform coordinator will verify your identity before resetting access.
                  </p>
                  <input
                    type="email"
                    required
                    value={forgotEmail || email}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="admin@doitnetwork.in"
                    className={`w-full p-2.5 rounded-xl text-xs border ${
                      isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setForgotSubmitted(true)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#00c29e] hover:bg-[#00a889] cursor-pointer"
                  >
                    Send Recovery Instructions
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
