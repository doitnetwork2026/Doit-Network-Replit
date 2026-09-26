import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertCircle, ArrowRight, CheckCircle2, UserCheck, Key } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

interface AdminAuthGateProps {
  onAuthorized: (adminData: { email: string; role: string; permissions: string[] }) => void;
}

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({ onAuthorized }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleVerifyAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please provide an administrator email');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/auth/verify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await response.json();

      if (!response.ok || !data.authorized) {
        setErrorMessage(data.error || 'Unauthorized. This email does not have administrator privileges.');
        setIsLoading(false);
        return;
      }

      // Authorization succeeded on server
      onAuthorized({
        email: data.email,
        role: data.role,
        permissions: data.roleDetails?.permissions || []
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Server connection error during authorization');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-zinc-200/80 shadow-lg">
        <CardHeader className="text-center space-y-2 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#00c29e]/15 border border-[#00c29e]/30 flex items-center justify-center mx-auto text-[#00876e]">
            <Lock className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl font-black tracking-tight text-zinc-900">
            DOIT Admin Access Gateway
          </CardTitle>
          <CardDescription className="text-xs text-zinc-500">
            Protected endpoint. Every action is verified server-side against authorized administrator credentials.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Access Denied</p>
                <p className="text-[11px] text-rose-700">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleVerifyAdmin} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 flex items-center gap-1">
                Admin Email Address
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 flex items-center gap-1">
                Security Password / Token
              </label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="font-medium"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 text-xs font-bold bg-[#00c29e] hover:bg-[#00a889] text-white shadow-sm cursor-pointer"
            >
              {isLoading ? (
                <span>Verifying Server Permissions...</span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>Sign In as Authorized Administrator</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

        </CardContent>
      </Card>
    </div>
  );
};
