import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { apiCall } from "@/lib/apiRequest";
import { useToast } from "@/contexts/ToastContext";

const RegisterPage = ({ onRegister, onSwitchToLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [masterPassword, setMasterPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { showToast } = useToast();

  let isRegisterDisabled =
    !name || !email || !password || !masterPassword || isRegistering;
  const isVerifyDisabled = otp.length !== 6 || isVerifying;

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (isRegisterDisabled) return;
    setIsRegistering(true);
    
    const data = { name, email, password, masterPassword };
    
    const response = await apiCall(data, "POST", "/auth/registerSendOTP");
    if (response.success) {
      showToast("OTP sent");
      setIsRegistering(false);
      setShowOtpStep(true);
    } else {
      setIsRegistering(false);
      showToast(response.message, "fail");
    }

    setOtp("");
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (isVerifyDisabled) return;

    const data = { email, otp };

    setIsVerifying(true);
    try {
      const response = await apiCall(data, "POST", "/auth/register");
      if (response.success) {
        localStorage.setItem("token", response.data.token);
        showToast("Registered successfully");
        setName("");
        setEmail("");
        setPassword("");
        setMasterPassword("");
        setOtp("");
        setShowOtpStep(false);
        onRegister();
      } else {
        showToast(response.message, "fail");
      }
    } finally {
      setIsVerifying(false);
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
            Create your secure vault
          </p>
        </div>

        {!showOtpStep ? (
          <form
            onSubmit={handleRegisterSubmit}
            className="vault-card space-y-4"
          >
            <h2 className="text-xl font-semibold text-foreground">
              Create account
            </h2>
            <p className="text-sm text-muted-foreground">
              Start securing your passwords today
            </p>

            <div className="space-y-3 pt-2">
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="vault-input pl-10"
                  required
                />
              </div>
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
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="vault-input pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showMasterPassword ? "text" : "password"}
                  placeholder="Master password"
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  className="vault-input pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowMasterPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={
                    showMasterPassword
                      ? "Hide master password"
                      : "Show master password"
                  }
                >
                  {showMasterPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`vault-btn-primary w-full flex items-center justify-center gap-2 ${
                isRegisterDisabled &&
                "opacity-50 hover:scale-100 cursor-not-allowed"
              }`}
              disabled={isRegisterDisabled}
            >
              {isRegistering ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  Register <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifySubmit} className="vault-card space-y-5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-foreground">
                Verify OTP
              </h2>
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code sent to {email}
              </p>
            </div>

            <div className="flex justify-center pt-1">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value.replace(/\D/g, ""))}
                containerClassName="justify-center"
              >
                <InputOTPGroup className="gap-2">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <InputOTPSlot
                      key={idx}
                      index={idx}
                      className="h-12 w-11 rounded-xl border border-border bg-input text-base font-semibold text-foreground shadow-sm"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            <button
              type="submit"
              className={`vault-btn-primary w-full flex items-center justify-center gap-2 ${
                isVerifyDisabled &&
                "opacity-50 hover:scale-100 cursor-not-allowed"
              }`}
              disabled={isVerifyDisabled}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify OTP <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowOtpStep(false);
                setOtp("");
              }}
              className="vault-btn-secondary w-full flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to details
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
