import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import CosmosBackground from '../components/chat/CosmosBackground';
import { motion } from 'framer-motion';

export default function PaymentSuccess() {
  const urlParams = new URLSearchParams(window.location.search);
  const tier = urlParams.get('tier') || 'centauri';
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const activate = async () => {
      try {
        const user = await base44.auth.me();

        const today = new Date().toISOString();
        const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

        const existing = await base44.entities.Subscription.filter({
          user_email: user.email,
          status: 'active',
        });

        if (existing && existing.length > 0) {
          await base44.entities.Subscription.update(existing[0].id, {
            tier,
            status: 'active',
            started_date: today,
            expires_date: expires,
          });
        } else {
          await base44.entities.Subscription.create({
            user_email: user.email,
            tier,
            status: 'active',
            started_date: today,
            expires_date: expires,
          });
        }

        setActivated(true);
      } catch (err) {
        console.error('Subscription activation failed:', err);
      }
    };

    activate();
  }, [tier]);

  const tierNames = {
    centauri: 'Centauri',
    andromeda: 'Andromeda',
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center relative">
      <CosmosBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 text-center max-w-md mx-auto px-6"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </div>

        <h1 className="text-3xl font-bold mb-3">Payment Successful!</h1>

        <p className="text-muted-foreground mb-2">
          Welcome to the{' '}
          <span className="text-primary font-semibold capitalize">
            {tierNames[tier] || tier}
          </span>{' '}
          tier.
        </p>

        {activated ? (
          <p className="text-sm text-emerald-400 mb-8 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Your subscription is now active
          </p>
        ) : (
          <p className="text-sm text-muted-foreground mb-8">
            Activating your subscription...
          </p>
        )}

        <Link to="/">
          <Button className="w-full bg-primary hover:bg-primary/90">
            Start Exploring
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}