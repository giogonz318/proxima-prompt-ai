import { useLocation, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, ShieldAlert } from 'lucide-react';

export default function PageNotFound() {
  const location = useLocation();
  const navigate = useNavigate();

  const pageName = location.pathname.substring(1);

  const { data: authData, isFetched } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const user = await base44.auth.me();
        return { user, isAuthenticated: true };
      } catch (error) {
        return { user: null, isAuthenticated: false };
      }
    },
  });

  const isAdmin =
    authData?.isAuthenticated &&
    authData?.user?.role === 'admin';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-red-400" />
          </div>
        </div>

        {/* 404 */}
        <div>
          <h1 className="text-6xl font-bold text-muted-foreground">
            404
          </h1>
          <div className="w-16 h-1 bg-border mx-auto mt-2 rounded-full" />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Page Not Found</h2>
          <p className="text-sm text-muted-foreground">
            The page{' '}
            <span className="font-medium text-foreground">
              /{pageName}
            </span>{' '}
            doesn’t exist or has been moved.
          </p>
        </div>

        {/* Admin hint */}
        {isFetched && isAdmin && (
          <div className="p-4 rounded-xl border bg-card text-left">
            <p className="text-sm font-medium mb-1 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-primary" />
              Admin Note
            </p>
            <p className="text-xs text-muted-foreground">
              This route may not have been implemented yet. You may need to
              create the missing page or update routing.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-4">
          <Button onClick={() => navigate('/')} className="w-full">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}