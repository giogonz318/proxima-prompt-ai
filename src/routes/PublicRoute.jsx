import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

const PublicRoute = () => {
  const {
    isLoadingAuth,
    isLoadingPublicSettings,
    authError,
  } = useAuth();

  if (isLoadingAuth || isLoadingPublicSettings) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  // If user is already authenticated, block login page access
  if (!authError) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;