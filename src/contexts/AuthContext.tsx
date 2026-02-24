import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

type AuthState = "login" | "authenticated" | "locked";

interface AuthContextType {
  authState: AuthState;
  login: () => void;
  logout: () => void;
  unlock: () => void;
  lock: () => void;
}

const AuthContext = createContext<AuthContextType>({
  authState: "login",
  login: () => {},
  logout: () => {},
  unlock: () => {},
  lock: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>("login");

  const login = useCallback(() => setAuthState("locked"), []);
  const logout = useCallback(() => setAuthState("login"), []);
  const unlock = useCallback(() => setAuthState("authenticated"), []);
  const lock = useCallback(() => setAuthState("locked"), []);

  // Simulate auto-lock after 5 minutes of inactivity
  useEffect(() => {
    if (authState !== "authenticated") return;
    let timer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setAuthState("locked"), 5 * 60 * 1000);
    };

    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [authState]);

  return (
    <AuthContext.Provider value={{ authState, login, logout, unlock, lock }}>
      {children}
    </AuthContext.Provider>
  );
};
