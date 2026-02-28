import { useState, useCallback } from "react";
import { Copy, RefreshCw, Check } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
const generatePassword = (length, options) => {
    let chars = "";
    if (options.upper)
        chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (options.lower)
        chars += "abcdefghijklmnopqrstuvwxyz";
    if (options.numbers)
        chars += "0123456789";
    if (options.symbols)
        chars += "!@#$%^&*()_+-=[]{}|;:',.<>?";
    if (!chars)
        chars = "abcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};
const Generator = () => {
    const [length, setLength] = useState(16);
    const [options, setOptions] = useState({ upper: true, lower: true, numbers: true, symbols: true });
    const [password, setPassword] = useState(() => generatePassword(16, { upper: true, lower: true, numbers: true, symbols: true }));
    const [copied, setCopied] = useState(false);
    const { showToast } = useToast();
    const handleGenerate = useCallback(() => {
        setPassword(generatePassword(length, options));
        setCopied(false);
    }, [length, options]);
    const handleCopy = async () => {
        await navigator.clipboard.writeText(password);
        setCopied(true);
        showToast("Password copied!");
        setTimeout(() => setCopied(false), 2000);
    };
    const toggles = [
        { key: "upper", label: "Uppercase" },
        { key: "lower", label: "Lowercase" },
        { key: "numbers", label: "Numbers" },
        { key: "symbols", label: "Symbols" },
    ];
    return (<div className="max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-foreground mb-6">Password Generator</h2>

      <div className="vault-card space-y-5">
        {/* Output */}
        <div className="flex items-center gap-2 bg-input rounded-xl px-4 py-3">
          <span className="flex-1 font-mono text-sm text-foreground break-all">{password}</span>
          <button onClick={handleCopy} className="vault-btn-icon shrink-0">
            {copied ? <Check className="w-4 h-4 text-accent"/> : <Copy className="w-4 h-4"/>}
          </button>
        </div>

        {/* Length slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-muted-foreground">Length</label>
            <span className="text-sm font-semibold text-foreground">{length}</span>
          </div>
          <input type="range" min={8} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full accent-primary h-1.5 bg-secondary rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"/>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-2 gap-3">
          {toggles.map((t) => (<button key={t.key} onClick={() => setOptions((prev) => ({ ...prev, [t.key]: !prev[t.key] }))} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${options[t.key]
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-input text-muted-foreground border-border"}`}>
              {t.label}
            </button>))}
        </div>

        {/* Generate button */}
        <button onClick={handleGenerate} className="vault-btn-primary w-full flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4"/> Generate Password
        </button>
      </div>
    </div>);
};
export default Generator;
