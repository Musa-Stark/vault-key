import { useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";

interface UnlockPageProps {
  onUnlock: () => void;
}

const UnlockPage = ({ onUnlock }: UnlockPageProps) => {
  const [masterPassword, setMasterPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUnlock();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          <ShieldCheck className="w-10 h-10 text-primary" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-1">Vault Locked</h1>
        <p className="text-muted-foreground text-sm mb-8">Enter your master password to unlock</p>

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
          <button type="submit" className="vault-btn-primary w-full">
            Unlock Vault
          </button>
        </form>
      </div>
    </div>
  );
};

export default UnlockPage;
