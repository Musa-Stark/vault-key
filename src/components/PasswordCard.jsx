import { useState } from "react";
import { Eye, EyeOff, Copy, Pencil, Trash2, Check, Loader2 } from "lucide-react";
import { serviceIcons } from "@/data/passwords";
import { useToast } from "@/contexts/ToastContext";
const PasswordCard = ({
  _id,
  service,
  username,
  password,
  category,
  icon,
  onEdit,
  onDelete,
  isDeleting = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();
  const handleCopy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    showToast("Password copied!");
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="vault-card group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">
            {icon || serviceIcons[service] || "🔒"}
          </span>
          <div>
            <h3 className="font-semibold text-foreground text-sm">{service}</h3>
            <p className="text-xs text-muted-foreground">
              {username && username}
            </p>
          </div>
        </div>
        <span className="vault-badge">{category}</span>
      </div>

      <div className="flex items-center gap-2 bg-input rounded-lg px-3 py-2">
        <span className="flex-1 text-sm font-mono text-muted-foreground">
          {visible ? password : "•".repeat(12)}
        </span>
        <button
          onClick={() => setVisible(!visible)}
          className="vault-btn-icon p-1"
        >
          {visible ? (
            <EyeOff className="w-3.5 h-3.5" />
          ) : (
            <Eye className="w-3.5 h-3.5" />
          )}
        </button>
        <button onClick={handleCopy} className="vault-btn-icon p-1">
          {copied ? (
            <Check className="w-3.5 h-3.5 text-accent" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      <div className="flex items-center gap-1 mt-3">
        <button
          onClick={() => onEdit(_id)}
          className="vault-btn-ghost text-xs flex items-center gap-1"
        >
          <Pencil className="w-3 h-3" /> Edit
        </button>
        <button
          onClick={() => onDelete(_id)}
          disabled={isDeleting}
          className={`vault-btn-ghost text-xs flex items-center gap-1 !text-destructive ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isDeleting ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" /> Deleting...
            </>
          ) : (
            <>
              <Trash2 className="w-3 h-3" /> Delete
            </>
          )}
        </button>
      </div>
    </div>
  );
};
export default PasswordCard;
