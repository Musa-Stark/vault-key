import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
const AuthContext = createContext({
  authState: "login",
  vaultItems: [],
  unlockData: null,
  setVaultItems: () => {},
  setUnlockData: () => {},
  login: () => {},
  logout: () => {},
  unlock: () => {},
  lock: () => {},
});
export const useAuth = () => useContext(AuthContext);

const getVaultItemsFromUnlockPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  return (
    payload.passwords ||
    payload.entries ||
    payload.items ||
    payload.data ||
    []
  );
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState("login");
  const [vaultItems, setVaultItems] = useState([]);
  const [unlockData, setUnlockData] = useState(null);
  const login = useCallback(() => setAuthState("locked"), []);
  const logout = useCallback(() => {
    setVaultItems([]);
    setUnlockData(null);
    setAuthState("login");
  }, []);
  const unlock = useCallback((payload = null) => {
    const items = getVaultItemsFromUnlockPayload(payload);
    setVaultItems(Array.isArray(items) ? items : []);
    setUnlockData(payload);
    setAuthState("authenticated");
  }, []);
  const lock = useCallback(() => {
    setVaultItems([]);
    setUnlockData(null);
    setAuthState("locked");
  }, []);
  // Simulate auto-lock after 5 minutes of inactivity
  useEffect(() => {
    if (authState !== "authenticated") return;
    let timer;
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
    <AuthContext.Provider
      value={{
        authState,
        vaultItems,
        unlockData,
        setVaultItems,
        setUnlockData,
        login,
        logout,
        unlock,
        lock,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
