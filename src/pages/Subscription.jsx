import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Sparkles, Star, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CosmosBackground from '../components/chat/CosmosBackground';
import { motion } from 'framer-motion';

const TIERS = [
  {
    id: 'kuiper',
    name: 'Kuiper',
    subtitle: 'Kuiper Belt — The outer frontier',
    price: 'Free',
    period: 'forever',
    icon: Star,
    color: 'from-slate-500 to-slate-400',
    border: 'border-slate-500/30',
    highlight: false,
    features: [
      'Unlimited basic chat',
      '5 image generations / day',
      '5 advanced code generations / day',
      'Web search enabled',
      'Conversation history',
    ],
  },
  {
    id: 'centauri',
    name: 'Centauri',
    subtitle: 'Alpha Centauri — The nearest star system',
    price: '$19',
    period: '/month',
    icon: Sparkles,
    color: 'from-primary to-accent',
    border: 'border-primary/50',
    highlight: true,
    features: [
      'Everything in Kuiper',
      '12 image generations / day',
      '20 advanced code generations / day',
      'Adaptive AI memory',
      'Priority responses',
    ],
  },
  {
    id: 'andromeda',
    name: 'Andromeda',
    subtitle: 'Andromeda Galaxy — The farthest reach',
    price: '$39',
    period: '/month',
    icon: Zap,
    color: 'from-accent to-purple-400',
    border: 'border-accent/50',
    highlight: false,
    features: [
      'Everything in Centauri',
      '50 image generations / day',
      'Unlimited advanced code',
      'Deep learning memory profile',
      'Early access to new features',
    ],
  },
];

export default function Subscription() {
  const navigate = useNavigate();

  const [currentSub, setCurrentSub] = useState(null);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const u = await base44.auth.me();
        setUser(u);

        if (!u?.email) return;

        const subs = await base44.entities.Subscription.filter({
          user_email: u.email,
          status: 'active',
        });

        if (subs?.length > 0) {
          setCurrentSub(subs[0]);
        }
      } catch (err) {
        console.error('Failed to load subscription:', err);

        // optional safety redirect
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleCheckout = async (tierId) => {
    if (tierId === 'kuiper') {
      return handleSelect(tierId);
    }

    setCheckoutLoading(tierId);

    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: tierId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Checkout failed');
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Could not start checkout.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleSelect = async (tierId) => {
    if (!user?.email || selecting) return;

    setSelecting(tierId);

    try {
      const now = new Date();
      const expires = new Date(Date.now() + 30 * 86400000);

      const payload = {
        tier: tierId,
        status: 'active',
        started_date: now.toISOString(),
        expires_date: expires.toISOString(),
      };

      if (currentSub?.id) {
        const updated = await base44.entities.Subscription.update(
          currentSub.id,
          payload
        );
        setCurrentSub(updated);
      } else {
        const created = await base44.entities.Subscription.create({
          user_email: user.email,
          ...payload,
        });
        setCurrentSub(created);
      }
    } catch (err) {
      console.error('Failed to activate plan:', err);
      alert('Failed to activate plan.');
    } finally {
      setSelecting(null);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Button onClick={() => navigate('/login')}>
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      <CosmosBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-2">
          <Link to="/">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-3"
          >
            Choose Your Orbit
          </motion.h1>

          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            From the edge of the solar system to the farthest galaxy — pick your tier.
          </p>

          {currentSub && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary">
              <Sparkles className="w-4 h-4" />
              Current plan: <strong className="capitalize">{currentSub.tier}</strong>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier, i) => {
            const Icon = tier.icon;
            const isActive = currentSub?.tier === tier.id;

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl border ${tier.border} bg-card p-6 flex flex-col gap-5 ${
                  tier.highlight
                    ? 'ring-2 ring-primary/40 shadow-lg shadow-primary/10'
                    : ''
                }`}
              >
                <div>
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-3`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  <h2 className="text-xl font-bold">{tier.name}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {tier.subtitle}
                  </p>
                </div>

                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  <span className="text-sm text-muted-foreground mb-1">
                    {tier.period}
                  </span>
                </div>

                <ul className="space-y-2.5 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleCheckout(tier.id)}
                  disabled={
                    isActive ||
                    checkoutLoading === tier.id ||
                    selecting === tier.id
                  }
                  className={`w-full ${
                    tier.highlight ? 'bg-primary hover:bg-primary/90' : ''
                  }`}
                  variant={tier.highlight ? 'default' : 'outline'}
                >
                  {checkoutLoading === tier.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                      Redirecting...
                    </>
                  ) : selecting === tier.id ? (
                    'Activating...'
                  ) : isActive ? (
                    'Current Plan'
                  ) : tier.id === 'kuiper' ? (
                    'Get Started Free'
                  ) : (
                    `Subscribe — ${tier.price}/mo`
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}