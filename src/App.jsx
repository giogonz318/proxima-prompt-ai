import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { AuthProvider } from "@/lib/AuthContext";

import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import Subscription from "./pages/Subscription";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

import PageNotFound from "@/lib/PageNotFound";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

import AppLayout from "./components/layout/AppLayout";

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>

          <Routes>

            {/* 🌍 PUBLIC */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
            </Route>

            {/* 🔐 PROTECTED WITH LAYOUT */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Chat />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/subscription" element={<Subscription />} />
              </Route>
            </Route>

            {/* 🔒 ADMIN */}
            <Route element={<ProtectedRoute requiredRole="admin" />}>
              <Route element={<AppLayout />}>
                <Route path="/admin" element={<Admin />} />
              </Route>
            </Route>

            {/* 🚨 SPECIAL */}
            <Route
              path="/not-registered"
              element={<UserNotRegisteredError />}
            />

            {/* ❌ 404 */}
            <Route path="*" element={<PageNotFound />} />

          </Routes>

        </Router>

        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;