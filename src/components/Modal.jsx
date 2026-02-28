import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { categories } from "@/data/passwords";
const Modal = ({ isOpen, onClose, onSave, editData }) => {
  const [form, setForm] = useState({
    service: "",
    username: "",
    password: "",
    category: "Social",
    icon: "🔒",
  });
  useEffect(() => {
    if (editData) {
      setForm({
        _id: editData._id,
        owner: editData.owner,
        service: editData.service,
        username: editData.username,
        password: editData.password,
        category: editData.category,
        icon: editData.icon || "🔒",
      });
    } else {
      setForm({
        service: "",
        username: "",
        password: "",
        category: "Social",
        icon: "🔒",
      });
    }
  }, [editData, isOpen]);
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="vault-overlay" onClick={onClose}>
      <div className="vault-modal" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-foreground">
            {editData ? "Edit Password" : "Add Password"}
          </h2>
          <button onClick={onClose} className="vault-btn-icon">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="🔒"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="vault-input w-16 text-center text-xl"
              maxLength={2}
            />
            <input
              type="text"
              placeholder="Service name"
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              className="vault-input flex-1"
              required
            />
          </div>
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="vault-input"
            required
          />
          <input
            type="text"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="vault-input"
            required
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="vault-input appearance-none cursor-pointer"
          >
            {categories
              .filter((c) => c !== "All")
              .map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
          </select>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="vault-btn-primary flex-1">
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="vault-btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Modal;
