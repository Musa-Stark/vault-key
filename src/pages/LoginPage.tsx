import { useState } from "react";
import { Lock, Mail, ArrowRight } from "lucide-react";

interface LoginPageProps {
  onLogin: () => void;
  onSwitchToRegister: () => void;
}

const LoginPage = ({ onLogin, onSwitchToRegister }: LoginPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">VaultX</h1>
          <p className="text-muted-foreground mt-2 text-sm">Your passwords, secured.</p>
        </div>

        <form onSubmit={handleSubmit} className="vault-card space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Welcome back</h2>
          <p className="text-sm text-muted-foreground">Sign in to access your vault</p>

          <div className="space-y-3 pt-2">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="vault-input pl-10"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="vault-input pl-10"
                required
              />
            </div>
          </div>

          <button type="submit" className="vault-btn-primary w-full flex items-center justify-center gap-2">
            Sign In <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button type="button" onClick={onSwitchToRegister} className="text-primary hover:underline font-medium">
              Create one
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
