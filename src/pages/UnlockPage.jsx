import { useState, useEffect } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { apiCall } from "@/lib/apiRequest";
import { useToast } from "@/contexts/ToastContext";

const UnlockPage = ({ onUnlock }) => {
  const [masterPassword, setMasterPassword] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    if (!masterPassword) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [masterPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDisabled(true);

    const data = { masterPassword };
    const response = await apiCall(data, "POST", "/auth/unlock");

    if (response?.success) {
      showToast("Unlocked successfully");
      setMasterPassword("");
      onUnlock(response?.data ?? null);
    } else {
      showToast(response.message, "fail");
    }
  };
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          <ShieldCheck className="w-10 h-10 text-primary" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-1">
          Vault Locked
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Enter your master password to unlock
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              placeholder="Master password"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              className="vault-input pl-10 text-center"
              autoFocus
              required
            />
          </div>
          <button
            type="submit"
            className={`vault-btn-primary w-full flex items-center justify-center gap-2 ${isDisabled && "opacity-50 hover:scale-100 cursor-not-allowed"}`}
            disabled={isDisabled}
          >
            Unlock Vault
          </button>
        </form>
      </div>
    </div>
  );
};
export default UnlockPage;
