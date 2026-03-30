import { MessageSquare, Settings, CreditCard } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClass =
    "flex items-center gap-3 px-4 py-2 rounded-lg text-sm hover:bg-slate-100";

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col p-4">
      <h1 className="text-lg font-semibold mb-6">Proxima AI</h1>

      <nav className="flex flex-col gap-2">
        <NavLink to="/" className={linkClass}>
          <MessageSquare size={18} /> Chat
        </NavLink>

        <NavLink to="/subscription" className={linkClass}>
          <CreditCard size={18} /> Subscription
        </NavLink>

        <NavLink to="/settings" className={linkClass}>
          <Settings size={18} /> Settings
        </NavLink>
      </nav>

      <div className="mt-auto text-xs text-slate-400">
        © 2026 Proxima
      </div>
    </div>
  );
}