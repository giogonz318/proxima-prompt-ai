import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

const ProtectedRoute = ({ requiredRole }) => {
  const {
    isLoadingAuth,
    isLoadingPublicSettings,
    authError,
    user,
  } = useAuth();

  if (isLoadingAuth || isLoadingPublicSettings) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated
  if (authError?.type === "auth_required") {
    return <Navigate to="/login" replace />;
  }

  // Not registered
  if (authError?.type === "user_not_registered") {
    return <Navigate to="/not-registered" replace />;
  }

  // Role check (NEW)
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;