import React from 'react';
import { Bell, CheckCircle2, Clock, ShieldCheck, ArrowRight, MessageSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

export const CustomerNotificationsTab: React.FC = () => {
  const notifications = [
    {
      id: 'NOTIF-01',
      title: 'Partner Dispatched to BHEL Sector 1',
      message: 'Sunil Sen (Gardener, 4.9★) is on the way. Expected arrival: 10:15 AM.',
      channel: 'WHATSAPP & SMS',
      time: '15 mins ago',
      unread: true
    },
    {
      id: 'NOTIF-02',
      title: 'Formal Quote Ready for Approval',
      message: 'DOIT Operations has provided transparent pricing of ₹450 for Deep Kitchen Scrubbing.',
      channel: 'SMS',
      time: 'Yesterday, 3:30 PM',
      unread: false
    },
    {
      id: 'NOTIF-03',
      title: 'Service Completed & Tax Invoice Ready',
      message: 'Booking DOIT-2026-000001 completed. Thank you for rating our BHEL partner 5 stars!',
      channel: 'EMAIL & IN-APP',
      time: 'Sep 7, 2026',
      unread: false
    }
  ];

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#00c29e]" />
            Notifications & Township Alerts
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Automated SMS, WhatsApp and in-app updates for appointments and dispatch status.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <Card key={n.id} className={`border-zinc-200 ${n.unread ? 'bg-[#00c29e]/5 border-[#00c29e]/30' : ''}`}>
            <CardContent className="p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center shrink-0 mt-0.5 text-[#00876e]">
                <MessageSquare className="w-4 h-4" />
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-900">{n.title}</h4>
                  <span className="text-[10px] text-zinc-400 font-medium">{n.time}</span>
                </div>
                <p className="text-xs text-zinc-600">{n.message}</p>
                <div className="pt-1">
                  <Badge variant="outline" className="text-[9px] font-mono">
                    {n.channel}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
