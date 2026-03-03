import { useState, useEffect } from "react";
import {
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { apiCall } from "@/lib/apiRequest";
import { useToast } from "@/contexts/ToastContext";

const LoginPage = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailRequiredError, setEmailRequiredError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState("login");
  const [otp, setOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { showToast } = useToast();

  const isDisabled = !email || !password || isSubmitting;
  const isSendOtpDisabled = otp.length !== 6 || isSendingOtp;
  const isResetPasswordDisabled =
    !newPassword || !confirmNewPassword || isResettingPassword;

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

  const handleForgotPasswordClick = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailRequiredError(true);
      showToast("Please fill the email input field. Then, press forgot password.", "fail");
      return;
    }

    const response = await apiCall(
      { email },
      "POST",
      "/auth/forgotPasswordSendOTP",
    );
    if (response.success) {
      setEmailRequiredError(false);
      setOtp("");
      setForgotPasswordStep("otp");
      showToast("OTP sent");
    } else {
      showToast(response.message, "fail");
    }
  };

  const handleSendOtpSubmit = async (e) => {
    e.preventDefault();
    if (isSendOtpDisabled) return;

    setIsSendingOtp(true);
    try {
      const response = await apiCall(
        { email, otp },
        "POST",
        "/auth/forgotPasswordVerifyOTP",
      );
      if (response.success) {
        showToast("OTP Verified");
        setOtp("");
        setForgotPasswordStep("reset");
      } else {
        showToast(response.message, "fail");
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (isResetPasswordDisabled) return;
    if (newPassword !== confirmNewPassword) {
      showToast(
        "New password didn't matched with confirm new password",
        "fail",
      );
      return;
    }

    setIsResettingPassword(true);
    try {
      const response = await apiCall(
        { email, newPassword },
        "PATCH",
        "/auth/newPassword",
      );
      if (response.success) {
        showToast("Password updated successfully");
        setNewPassword("");
        setConfirmNewPassword("");
        setForgotPasswordStep("login");
      } else {
        showToast(response.message, "fail");
      }
    } finally {
      setIsResettingPassword(false);
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

        {forgotPasswordStep === "login" ? (
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailRequiredError) {
                      setEmailRequiredError(false);
                    }
                  }}
                  className={`vault-input pl-10 ${
                    emailRequiredError
                      ? "border-red-500 bg-red-900/20 focus:border-red-500"
                      : ""
                  }`}
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
              <button
                type="button"
                onClick={handleForgotPasswordClick}
                className="text-sm text-primary hover:underline font-medium"
              >
                Forgot password?
              </button>
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
        ) : forgotPasswordStep === "otp" ? (
          <form onSubmit={handleSendOtpSubmit} className="vault-card space-y-5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-foreground">
                Verify OTP
              </h2>
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code sent to {email.trim()}
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
                isSendOtpDisabled &&
                "opacity-50 hover:scale-100 cursor-not-allowed"
              }`}
              disabled={isSendOtpDisabled}
            >
              {isSendingOtp ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  Send OTP <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleResetPasswordSubmit}
            className="vault-card space-y-4"
          >
            <h2 className="text-xl font-semibold text-foreground">
              Set New Password
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter and confirm your new password
            </p>

            <div className="space-y-3 pt-2">
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="vault-input pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={
                    showNewPassword ? "Hide new password" : "Show new password"
                  }
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showConfirmNewPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="vault-input pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmNewPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={
                    showConfirmNewPassword
                      ? "Hide confirm new password"
                      : "Show confirm new password"
                  }
                >
                  {showConfirmNewPassword ? (
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
                isResetPasswordDisabled &&
                "opacity-50 hover:scale-100 cursor-not-allowed"
              }`}
              disabled={isResetPasswordDisabled}
            >
              {isResettingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  Update Password <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
export default LoginPage;
