import React, { createContext, useState, useContext, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { appParams } from "./app-params";
import { createAxiosClient } from "@base44/sdk/dist/utils/axios-client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);

  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    setIsLoadingPublicSettings(true);
    setIsLoadingAuth(true);
    setAuthError(null);

    try {
      const appClient = createAxiosClient({
        baseURL: `/api/apps/public`,
        headers: {
          "X-App-Id": appParams.appId,
        },
        token: appParams.token,
        interceptResponses: true,
      });

      const publicSettings = await appClient.get(
        `/prod/public-settings/by-id/${appParams.appId}`
      );

      setAppPublicSettings(publicSettings);
      setIsLoadingPublicSettings(false);

      if (appParams.token) {
        await checkUserAuth();
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoadingAuth(false);
      }
    } catch (appError) {
      console.error("App state check failed:", appError);

      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      setUser(null);

      const reason = appError?.data?.extra_data?.reason;

      if (appError?.status === 403 && reason) {
        setAuthError({
          type: reason,
          message: appError.message,
        });
      } else {
        setAuthError({
          type: "unknown",
          message: appError?.message || "Failed to load app",
        });
      }
    }
  };

  const checkUserAuth = async () => {
    try {
      const currentUser = await base44.auth.me();

      setUser(currentUser);
      setIsAuthenticated(true);
      setAuthError(null);
    } catch (error) {
      console.error("User auth check failed:", error);

      setUser(null);
      setIsAuthenticated(false);

      if (error?.status === 401 || error?.status === 403) {
        setAuthError({
          type: "auth_required",
          message: "Authentication required",
        });
      }
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);

    // SAFE: avoid direct window dependency in argument passing
    if (shouldRedirect) {
      const redirectUrl =
        typeof window !== "undefined" ? window.location.href : "/";
      base44.auth.logout(redirectUrl);
    } else {
      base44.auth.logout();
    }
  };

  const navigateToLogin = () => {
    const redirectUrl =
      typeof window !== "undefined" ? window.location.href : "/";
    base44.auth.redirectToLogin(redirectUrl);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        logout,
        navigateToLogin,
        checkAppState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};