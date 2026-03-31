import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout?.();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex">

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-6">App</h2>

        <nav className="flex flex-col gap-3">
          <Link to="/" className="hover:text-gray-300">Chat</Link>
          <Link to="/settings" className="hover:text-gray-300">Settings</Link>
          <Link to="/subscription" className="hover:text-gray-300">Subscription</Link>
          {user?.role === "admin" && (
            <Link to="/admin" className="hover:text-gray-300">Admin</Link>
          )}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 py-2 rounded-md"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>

    </div>
  );
};

export default AppLayout;