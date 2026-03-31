const logout = async () => {
  // Example (adjust to your backend)
  await fetch("/api/auth/logout", { method: "POST" });
  window.location.href = "/login";
};

return {
  user, // must include role: "admin" | "user"
  isLoadingAuth,
  isLoadingPublicSettings,
  authError,
  navigateToLogin,
  logout, // ✅ included in SAME return
};