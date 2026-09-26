import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, CheckCircle } from 'lucide-react';

interface WhatsAppFloatingButtonProps {
  onOpenBookingForCategory?: (categoryId: string) => void;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setMessage('');
      setIsOpen(false);
    }, 2000);
  };

  return (
    <div className="fixed bottom-28 sm:bottom-24 lg:bottom-6 right-3 sm:right-6 z-40 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="mb-3 w-[calc(100vw-1.5rem)] max-w-80 sm:w-88 rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200/90 dark:border-zinc-800 overflow-hidden text-zinc-900 dark:text-zinc-100 origin-bottom-right pointer-events-auto"
          >
            {/* Header */}
            <div className="bg-[#00c29e] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold tracking-tight">DOIT WhatsApp Coordinator</h4>
                  <p className="text-[11px] text-white/90">BHEL Operations Desk • Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1.5 rounded-lg transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 bg-zinc-50/60 dark:bg-zinc-800/60 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/70 dark:border-zinc-700 shadow-2xs space-y-1 text-zinc-700 dark:text-zinc-300">
                <p className="font-semibold text-zinc-900 dark:text-white">Namaste! How can we assist you?</p>
                <p className="text-zinc-500 dark:text-zinc-400 text-[11px] leading-relaxed">
                  Connect directly with our BHEL coordinator for immediate gardener, maid, painter, or driver dispatches.
                </p>
              </div>

              {sent ? (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 bg-[#e6faf6] border border-[#99ede0] rounded-xl text-[#00755f] flex items-center gap-2 text-xs"
                >
                  <CheckCircle className="w-4 h-4 text-[#00c29e] shrink-0" />
                  <span>Message received at BHEL Desk. A coordinator is responding via WhatsApp!</span>
                </motion.div>
              ) : (
                <form onSubmit={handleSend} className="space-y-2">
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="E.g., I need a gardener in Sector 2 tomorrow at 10 AM..."
                    className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#00c29e] transition-all resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-400">Avg reply ~ 5 mins</span>
                    <motion.button
                      type="submit"
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00c29e] hover:bg-[#00a889] text-white font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
                    >
                      <span>Send</span>
                      <Send className="w-3 h-3" />
                    </motion.button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Pill */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full bg-[#00c29e] hover:bg-[#00a889] text-white shadow-lg hover:shadow-xl transition-shadow group cursor-pointer border border-white/20 pointer-events-auto"
        aria-label="Contact DOIT on WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="hidden sm:inline text-xs font-bold tracking-wide">WhatsApp Desk</span>
      </motion.button>
    </div>
  );
};

export default WhatsAppFloatingButton;
