import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await base44.auth.me();
        if (user) {
          navigate('/');
        }
      } catch (err) {
        // user not logged in
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      window.location.href = '/api/auth/login';
    } catch (err) {
      console.error('Login redirect failed:', err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="w-full max-w-md p-6 border rounded-2xl bg-card shadow-lg">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-semibold">Login</h1>
          </div>

          <p className="text-sm text-muted-foreground">
            Sign in to access your dashboard
          </p>
        </div>

        <Button
          onClick={handleLogin}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Redirecting...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </div>
    </div>
  );
};

export default Login;