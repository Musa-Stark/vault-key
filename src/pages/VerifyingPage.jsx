import { Loader2, ShieldCheck } from "lucide-react";

const VerifyingPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          <ShieldCheck className="w-10 h-10 text-primary" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          Verifying Session
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          Checking your saved login, please wait...
        </p>

        <div className="inline-flex items-center justify-center gap-2 text-sm text-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          Verifying...
        </div>
      </div>
    </div>
  );
};

export default VerifyingPage;
