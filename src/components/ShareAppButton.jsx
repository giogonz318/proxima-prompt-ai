import { useState } from 'react';
import { Share2, X, Twitter, Facebook, Mail, Instagram, Link2, Send, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const APP_URL = window.location.origin;
const APP_TEXT = 'Check out Proxima — an AI assistant with cosmic capabilities!';

export default function ShareAppButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(APP_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shares = [
    {
      label: 'Twitter/X',
      icon: Twitter,
      color: 'hover:bg-sky-500/20 hover:text-sky-400',
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(APP_TEXT)}&url=${encodeURIComponent(APP_URL)}`, '_blank'),
    },
    {
      label: 'Facebook',
      icon: Facebook,
      color: 'hover:bg-blue-600/20 hover:text-blue-400',
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(APP_URL)}`, '_blank'),
    },
    {
      label: 'Instagram',
      icon: Instagram,
      color: 'hover:bg-pink-500/20 hover:text-pink-400',
      action: () => window.open(`https://www.instagram.com/`, '_blank'),
    },
    {
      label: 'Telegram',
      icon: Send,
      color: 'hover:bg-sky-400/20 hover:text-sky-300',
      action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(APP_URL)}&text=${encodeURIComponent(APP_TEXT)}`, '_blank'),
    },
    {
      label: 'Email',
      icon: Mail,
      color: 'hover:bg-purple-500/20 hover:text-purple-400',
      action: () => window.open(`mailto:?subject=${encodeURIComponent('Try Proxima AI')}&body=${encodeURIComponent(APP_TEXT + '\n\n' + APP_URL)}`, '_blank'),
    },
    {
      label: 'SMS',
      icon: MessageSquare,
      color: 'hover:bg-emerald-500/20 hover:text-emerald-400',
      action: () => window.open(`sms:?body=${encodeURIComponent(APP_TEXT + ' ' + APP_URL)}`, '_blank'),
    },
    {
      label: copied ? 'Copied!' : 'Copy Link',
      icon: Link2,
      color: 'hover:bg-muted hover:text-foreground',
      action: copyLink,
    },
  ];

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-1.5 mb-2"
          >
            {shares.map((s) => (
              <button
                key={s.label}
                onClick={s.action}
                title={s.label}
                className={`w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground transition-colors ${s.color}`}
              >
                <s.icon className="w-4 h-4" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors shadow-lg"
        title="Share Proxima"
      >
        {open ? <X className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
      </button>
    </div>
  );
}