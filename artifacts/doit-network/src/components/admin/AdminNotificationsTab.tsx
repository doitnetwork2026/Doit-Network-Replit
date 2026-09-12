import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  Users, 
  Wrench, 
  ShieldCheck, 
  CheckCircle2, 
  Smartphone, 
  Mail, 
  Clock,
  Filter
} from 'lucide-react';
import { NotificationItem } from '../../types/doit';

interface AdminNotificationsTabProps {
  notifications: NotificationItem[];
  onSendNotification?: (notif: Partial<NotificationItem>) => void;
  theme: 'light' | 'dark';
}

export const AdminNotificationsTab: React.FC<AdminNotificationsTabProps> = ({
  notifications: initialNotifications,
  onSendNotification,
  theme
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipientRole, setRecipientRole] = useState<'all' | 'customer' | 'provider' | 'admin'>('all');
  const [channel, setChannel] = useState<'in_app' | 'sms' | 'email'>('in_app');
  const [type, setType] = useState<string>('service_update');
  const [sentSuccess, setSentSuccess] = useState(false);

  const isDark = theme === 'dark';

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      recipientId: recipientRole === 'all' ? 'BROADCAST-ALL' : `ALL-${recipientRole.toUpperCase()}S`,
      recipientRole: recipientRole === 'all' ? 'customer' : recipientRole,
      title: title.trim(),
      message: message.trim(),
      channel,
      type: type as any,
      isRead: false,
      createdAt: 'Just now'
    };

    setNotifications([newNotif, ...notifications]);
    if (onSendNotification) {
      onSendNotification(newNotif);
    }

    setTitle('');
    setMessage('');
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            Notifications & Broadcast Center
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Dispatch urgent service advisories, weather updates, and announcements to customers and providers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: Broadcast Composer Form */}
        <div className={`lg:col-span-1 p-5 rounded-2xl border h-fit space-y-4 ${
          isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
        }`}>
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <Send className="w-4 h-4 text-[#00c29e]" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Dispatch New Broadcast
            </h3>
          </div>

          {sentSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Broadcast dispatched successfully!</span>
            </div>
          )}

          <form onSubmit={handleBroadcast} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">Target Audience:</label>
              <select
                value={recipientRole}
                onChange={(e) => setRecipientRole(e.target.value as any)}
                className={`w-full p-2.5 rounded-xl border ${
                  isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                }`}
              >
                <option value="all">Everyone (All Customers & Partners)</option>
                <option value="customer">Registered Customers Only</option>
                <option value="provider">Active Service Partners Only</option>
                <option value="admin">Operations Desk & Admins</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">Delivery Channel:</label>
              <div className="grid grid-cols-3 gap-2">
                {(['in_app', 'sms', 'email'] as const).map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setChannel(ch)}
                    className={`py-2 px-2 rounded-xl border text-center font-bold capitalize transition-all cursor-pointer ${
                      channel === ch
                        ? 'bg-[#00c29e] text-white border-[#00c29e]'
                        : isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-600'
                    }`}
                  >
                    {ch.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">Notification Title:</label>
              <input
                type="text"
                required
                placeholder="e.g., Heavy Rain Advisory in BHEL Area"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full p-2.5 rounded-xl border ${
                  isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                }`}
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">Message Body:</label>
              <textarea
                required
                rows={4}
                placeholder="Type the message contents..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`w-full p-2.5 rounded-xl border ${
                  isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#00c29e] hover:bg-[#00a889] text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 mt-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Broadcast</span>
            </button>
          </form>
        </div>

        {/* RIGHT: Notifications Log */}
        <div className={`lg:col-span-2 p-5 rounded-2xl border space-y-4 ${
          isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Recent Sent Notifications ({notifications.length})
            </h3>
            <span className="text-xs text-zinc-400">Real-time log</span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[500px]">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-xl border transition-colors ${
                  isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200/80'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                    {notif.title}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {notif.channel}
                    </span>
                    <span className="text-[10px] text-zinc-400">{notif.createdAt}</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  {notif.message}
                </p>

                <div className="mt-2 text-[10px] text-zinc-400 flex items-center justify-between">
                  <span>Target: <strong>{notif.recipientRole}</strong></span>
                  <span>ID: {notif.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
