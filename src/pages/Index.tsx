import { useState } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import UnlockPage from "@/pages/UnlockPage";
import DashboardPage from "@/pages/DashboardPage";

const AppContent = () => {
  const { authState, login, unlock, lock } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (authState === "login") {
    return showRegister ? (
      <RegisterPage onRegister={login} onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <LoginPage onLogin={login} onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  if (authState === "locked") {
    return <UnlockPage onUnlock={unlock} />;
  }

  return <DashboardPage onLock={lock} />;
};

const Index = () => (
  <AuthProvider>
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  </AuthProvider>
);

export default Index;
