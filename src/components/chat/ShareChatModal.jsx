import { useState } from 'react';
import { X, Twitter, Facebook, Mail, MessageSquare, Link2, Send, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShareChatModal({ isOpen, onClose, messages }) {
  const [copied, setCopied] = useState(false);

  const chatText = messages
    .slice(-10)
    .map((m) => `${m.role === 'user' ? 'You' : 'Proxima'}: ${m.content}`)
    .join('\n\n');

  const shortText = messages.find((m) => m.role === 'user')?.content?.slice(0, 100) || 'Check out this conversation with Proxima AI!';
  const shareText = `"${shortText}..." — conversation with Proxima AI`;
  const shareUrl = window.location.href;

  const copyChat = () => {
    navigator.clipboard.writeText(chatText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const options = [
    {
      label: 'Twitter/X',
      icon: Twitter,
      color: 'bg-sky-500/10 text-sky-400 hover:bg-sky-500/20',
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank'),
    },
    {
      label: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600/10 text-blue-400 hover:bg-blue-600/20',
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank'),
    },
    {
      label: 'WhatsApp',
      icon: MessageSquare,
      color: 'bg-green-500/10 text-green-400 hover:bg-green-500/20',
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`, '_blank'),
    },
    {
      label: 'Telegram',
      icon: Send,
      color: 'bg-sky-400/10 text-sky-300 hover:bg-sky-400/20',
      action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank'),
    },
    {
      label: 'Email',
      icon: Mail,
      color: 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20',
      action: () => window.open(`mailto:?subject=${encodeURIComponent('Proxima AI Conversation')}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`, '_blank'),
    },
    {
      label: 'SMS',
      icon: MessageSquare,
      color: 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20',
      action: () => window.open(`sms:?body=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank'),
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 z-50" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md"
          >
            <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-foreground">Share This Chat</h2>
                </div>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {options.map((o) => (
                  <button
                    key={o.label}
                    onClick={o.action}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border border-border transition-colors ${o.color}`}
                  >
                    <o.icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{o.label}</span>
                  </button>
                ))}
              </div>

              <Button variant="outline" className="w-full gap-2" onClick={copyChat}>
                <Link2 className="w-4 h-4" />
                {copied ? 'Copied to clipboard!' : 'Copy Chat Text'}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}