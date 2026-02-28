import { useState } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import UnlockPage from "@/pages/UnlockPage";
import DashboardPage from "@/pages/DashboardPage";
const AppContent = () => {
  const { authState, login, logout, unlock, lock } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  // authState = "locked"

  if (authState === "login") {
    return showRegister ? (
      <RegisterPage
        onRegister={login}
        onSwitchToLogin={() => setShowRegister(false)}
      />
    ) : (
      <LoginPage
        onLogin={login}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }
  if (authState === "locked") {
    return <UnlockPage onUnlock={unlock} />;
  }
  return <DashboardPage onLock={lock} onLogout={logout} />;
};
const Index = () => (
  <ToastProvider>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </ToastProvider>
);
export default Index;
