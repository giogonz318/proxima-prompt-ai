import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const TIER_LIMITS = {
  kuiper:    { images: 5,         advancedCode: 5         },
  centauri:  { images: 12,        advancedCode: 20        },
  andromeda: { images: 50,        advancedCode: Infinity  },
  admin:     { images: Infinity,  advancedCode: Infinity  },
};

export function useSubscription() {
  const [tier, setTier] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // 🔥 Get current user
        const user = await base44.auth.me();

        if (!user) {
          setTier('kuiper');
          setLoading(false);
          return;
        }

        // 🔥 Admin check
        if (user.role === 'admin') {
          setIsAdmin(true);
          setTier('admin');
          setLoading(false);
          return;
        }

        // 🔥 Get subscription
        const subs = await base44.entities.Subscription.filter({
          userId: user.id,
          status: 'active',
        });

        if (subs && subs.length > 0) {
          setTier(subs[0].plan || 'kuiper');
        } else {
          setTier('kuiper'); // default free tier
        }

      } catch (err) {
        console.error('Subscription error:', err);
        setTier('kuiper');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const limits = TIER_LIMITS[tier] || TIER_LIMITS.kuiper;

  return { tier, isAdmin, limits, loading };
}