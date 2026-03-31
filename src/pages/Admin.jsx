import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Users, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const u = await base44.auth.me();
        setUser(u);

        // Adjust this depending on how Base44 stores roles
        const role = u?.role || u?.user_role || u?.metadata?.role;

        if (role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          setTimeout(() => navigate('/'), 1200);
        }
      } catch (err) {
        console.error('Admin auth check failed:', err);
        setIsAdmin(false);
        setTimeout(() => navigate('/'), 1200);
      }

      setLoading(false);
    };

    load();
  }, [navigate]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center max-w-sm px-6">
          <Shield className="w-12 h-12 mx-auto text-red-400 mb-4" />
          <h1 className="text-xl font-bold mb-2">Access Denied</h1>
          <p className="text-sm text-muted-foreground">
            Redirecting to home...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>

          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Admin Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border bg-card">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-primary" />
              <h2 className="font-semibold">Users</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Manage platform users and roles
            </p>
          </div>

          <div className="p-4 rounded-2xl border bg-card">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="font-semibold">Subscriptions</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              View and manage active plans
            </p>
          </div>

          <div className="p-4 rounded-2xl border bg-card">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-primary" />
              <h2 className="font-semibold">System</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Platform settings & controls
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}