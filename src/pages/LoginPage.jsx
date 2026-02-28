import { useState, useEffect } from "react";
import { Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { apiCall } from "@/lib/apiRequest";
import { useToast } from "@/contexts/ToastContext";

const LoginPage = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const isDisabled = !email || !password || isSubmitting;

  useEffect(() => {
    const sendToken = async () => {
      const response = await apiCall("", "GET", "/auth/token");
      if (response.success) {
        onLogin();
      } else {
        showToast(response.message, "fail");
        localStorage.removeItem("token");
      }
    };
    const token = localStorage.getItem("token");
    if (token) {
      sendToken();
    }
  }, [onLogin, showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDisabled) return;

    const data = { email, password };
    setIsSubmitting(true);

    try {
      const response = await apiCall(data, "POST", "/auth/login");

      if (response.success) {
        localStorage.setItem("token", response.data.token);
        showToast("Logged In successfully");
        onLogin();
        setEmail("");
        setPassword("");
      } else {
        showToast(response.message, "fail");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">VaultX</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Your passwords, secured.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="vault-card space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Welcome back
          </h2>
          <p className="text-sm text-muted-foreground">
            Sign in to access your vault
          </p>

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

          <button
            type="submit"
            className={`vault-btn-primary w-full flex items-center justify-center gap-2 ${isDisabled && "opacity-50 hover:scale-100 cursor-not-allowed"}`}
            disabled={isDisabled}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-primary hover:underline font-medium"
            >
              Create one
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};
export default LoginPage;
