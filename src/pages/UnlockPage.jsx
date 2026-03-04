import { useState } from "react";
import {
  Lock,
  ShieldCheck,
  Loader2,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { apiCall } from "@/lib/apiRequest";
import { useToast } from "@/contexts/ToastContext";

const UnlockPage = ({ onUnlock }) => {
  const [masterPassword, setMasterPassword] = useState("");
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [unlockStep, setUnlockStep] = useState("unlock");
  const [otp, setOtp] = useState("");
  const [newMasterPassword, setNewMasterPassword] = useState("");
  const [confirmNewMasterPassword, setConfirmNewMasterPassword] = useState("");
  const [showNewMasterPassword, setShowNewMasterPassword] = useState(false);
  const [showConfirmNewMasterPassword, setShowConfirmNewMasterPassword] =
    useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSettingMasterPassword, setIsSettingMasterPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("[email]");
  const { showToast } = useToast();

  const isDisabled = !masterPassword || isSubmitting;
  const isVerifyOtpDisabled = otp.length !== 6 || isVerifyingOtp;
  const isSetMasterPasswordDisabled =
    !newMasterPassword || !confirmNewMasterPassword || isSettingMasterPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDisabled) return;

    setIsSubmitting(true);

    try {
      const data = { masterPassword };
      const response = await apiCall(data, "POST", "/auth/unlock");

      if (response?.success) {
        showToast("Unlocked successfully");
        setMasterPassword("");
        onUnlock(response?.data ?? null);
      } else {
        showToast(response.message, "fail");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotMasterPassword = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Session token not found. Please sign in", "fail");
      return
    }

    const response = await apiCall(
      { token },
      "POST",
      "/auth/forgotMasterPasswordSendOTP",
    );
    if (response.success) {
      setOtp("");
      setUnlockStep("otp");
      showToast("OTP sending...");
      setEmail(response.data.email);
    } else {
      showToast(response.message, "fail");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (isVerifyOtpDisabled) return;
    setIsVerifyingOtp(true);

    try {
      const response = await apiCall(
        { email, otp },
        "POST",
        "/auth/forgotMasterPasswordVerifyOTP",
      );
      if (response.success) {
        showToast("OTP Verified");
        setOtp("");
        setUnlockStep("resetMaster");
      } else {
        showToast(response.message, "fail");
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSetMasterPasswordSubmit = async (e) => {
    e.preventDefault();
    if (isSetMasterPasswordDisabled) return;
    if (newMasterPassword !== confirmNewMasterPassword) {
      showToast(
        "New master password didn't matched with confirm master password",
        "fail",
      );
      return;
    }

    setIsSettingMasterPassword(true);
    try {
      const response = await apiCall(
        { email, newMasterPassword },
        "PATCH",
        "/auth/newMasterPassword",
      );
      if (response.success) {
        showToast("Master password updated successfully");
        setNewMasterPassword("");
        setConfirmNewMasterPassword("");
        setUnlockStep("unlock");
      } else {
        showToast(response.message, "fail");
      }
    } finally {
      setIsSettingMasterPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {unlockStep === "unlock" ? (
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
                type={showMasterPassword ? "text" : "password"}
                placeholder="Master password"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                className="vault-input pl-10 pr-10 text-center"
                autoFocus
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
            <button
              type="button"
              onClick={handleForgotMasterPassword}
              className="text-sm text-primary hover:underline font-medium"
            >
              Forgot master password?
            </button>
            <button
              type="submit"
              className={`vault-btn-primary w-full flex items-center justify-center gap-2 ${isDisabled && "opacity-50 hover:scale-100 cursor-not-allowed"}`}
              disabled={isDisabled}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Unlocking...
                </>
              ) : (
                "Unlock Vault"
              )}
            </button>
          </form>
        </div>
      ) : unlockStep === "otp" ? (
        <form
          onSubmit={handleOtpSubmit}
          className="vault-card w-full max-w-md space-y-5"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-foreground">Enter OTP</h2>
            <p className="text-sm text-muted-foreground">
              Enter otp that we just sent to {email}
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
              isVerifyOtpDisabled &&
              "opacity-50 hover:scale-100 cursor-not-allowed"
            }`}
            disabled={isVerifyOtpDisabled}
          >
            {isVerifyingOtp ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying OTP...
              </>
            ) : (
              <>
                Verify OTP <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleSetMasterPasswordSubmit}
          className="vault-card w-full max-w-md space-y-4"
        >
          <h2 className="text-xl font-semibold text-foreground">
            Set New Master Password
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter and confirm your new master password
          </p>

          <div className="space-y-3 pt-2">
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showNewMasterPassword ? "text" : "password"}
                placeholder="New master password"
                value={newMasterPassword}
                onChange={(e) => setNewMasterPassword(e.target.value)}
                className="vault-input pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewMasterPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={
                  showNewMasterPassword
                    ? "Hide new master password"
                    : "Show new master password"
                }
              >
                {showNewMasterPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showConfirmNewMasterPassword ? "text" : "password"}
                placeholder="Confirm master password"
                value={confirmNewMasterPassword}
                onChange={(e) => setConfirmNewMasterPassword(e.target.value)}
                className="vault-input pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmNewMasterPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={
                  showConfirmNewMasterPassword
                    ? "Hide confirm master password"
                    : "Show confirm master password"
                }
              >
                {showConfirmNewMasterPassword ? (
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
              isSetMasterPasswordDisabled &&
              "opacity-50 hover:scale-100 cursor-not-allowed"
            }`}
            disabled={isSetMasterPasswordDisabled}
          >
            {isSettingMasterPassword ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
export default UnlockPage;
