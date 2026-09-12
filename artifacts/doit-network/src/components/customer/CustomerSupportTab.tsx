import React, { useState } from 'react';
import { HelpCircle, Phone, MessageSquare, ShieldCheck, Mail, Send } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export const CustomerSupportTab: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      alert('Support ticket created. A BHEL Operations coordinator will call or message you within 15 minutes.');
      setSubject('');
      setMessage('');
      setIsSent(false);
    }, 500);
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#00c29e]" />
          Township Resident Support Desk
        </h2>
        <p className="text-xs text-zinc-500 mt-0.5">
          Direct assistance from our dedicated BHEL Bhopal operations team.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00c29e]/15 text-[#00876e] flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-900">BHEL Resident Helpline</h4>
            <p className="text-sm font-bold text-[#00876e] font-mono mt-0.5">+91 755 244 0000</p>
            <span className="text-[10px] text-zinc-400">Available 7:00 AM - 9:00 PM Daily</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-900">WhatsApp Coordinator</h4>
            <p className="text-sm font-bold text-sky-600 font-mono mt-0.5">+91 94250 99881</p>
            <span className="text-[10px] text-zinc-400">Instant Chat & Dispatch Tracking</span>
          </div>
        </div>
      </div>

      <Card className="border-zinc-200 shadow-2xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-zinc-900">
            Submit a Support Request
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-zinc-700">Subject / Service Issue</label>
              <Input
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Inquire about electrical rewiring or reschedule visit"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-700">Detailed Message</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your question or requirement..."
                className="w-full p-3 rounded-xl border border-zinc-200 text-xs font-medium"
              />
            </div>

            <Button
              type="submit"
              disabled={isSent}
              className="w-full h-10 text-xs font-bold bg-[#00c29e] hover:bg-[#00a889] text-white cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              {isSent ? 'Submitting...' : 'Send Request to Operations Desk'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
