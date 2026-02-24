import { useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import PasswordCard from "@/components/PasswordCard";
import Modal from "@/components/Modal";
import Generator from "@/components/Generator";
import { dummyPasswords } from "@/data/passwords";
import { useToast } from "@/contexts/ToastContext";
import { ShieldOff, Settings } from "lucide-react";

interface DashboardPageProps {
  onLock: () => void;
}

interface PasswordEntry {
  id: string;
  service: string;
  username: string;
  password: string;
  category: string;
  icon?: string;
  url?: string;
}

const DashboardPage = ({ onLock }: DashboardPageProps) => {
  const [passwords, setPasswords] = useState<PasswordEntry[]>(dummyPasswords);
  const [activeView, setActiveView] = useState("passwords");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<PasswordEntry | null>(null);
  const { showToast } = useToast();

  const filtered = useMemo(() => {
    return passwords.filter((p) => {
      const matchCategory = activeCategory === "All" || p.category === activeCategory;
      const matchSearch = !searchQuery || p.service.toLowerCase().includes(searchQuery.toLowerCase()) || p.username.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [passwords, activeCategory, searchQuery]);

  const handleSave = (entry: PasswordEntry) => {
    setPasswords((prev) => {
      const exists = prev.find((p) => p.id === entry.id);
      if (exists) {
        showToast("Password updated");
        return prev.map((p) => (p.id === entry.id ? entry : p));
      }
      showToast("Password added");
      return [...prev, entry];
    });
  };

  const handleEdit = (id: string) => {
    const entry = passwords.find((p) => p.id === id);
    if (entry) {
      setEditData(entry);
      setModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setPasswords((prev) => prev.filter((p) => p.id !== id));
    showToast("Password deleted");
  };

  const handleAddNew = () => {
    setEditData(null);
    setModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onLock={onLock}
          onAddNew={handleAddNew}
        />

        <main className="flex-1 p-4 lg:p-6">
          {activeView === "passwords" && (
            <>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    {activeCategory === "All" ? "All Passwords" : activeCategory}
                  </h1>
                  <p className="text-sm text-muted-foreground">{filtered.length} items</p>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <ShieldOff className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-1">No passwords found</h3>
                  <p className="text-sm text-muted-foreground">Add your first password to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map((p) => (
                    <PasswordCard key={p.id} {...p} onEdit={handleEdit} onDelete={handleDelete} />
                  ))}
                </div>
              )}
            </>
          )}

          {activeView === "generator" && <Generator />}

          {activeView === "settings" && (
            <div className="max-w-lg mx-auto">
              <h2 className="text-xl font-bold text-foreground mb-6">Settings</h2>
              <div className="vault-card space-y-4">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Auto-lock timeout</p>
                    <p className="text-xs text-muted-foreground">Lock vault after 5 minutes of inactivity</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Account</p>
                    <p className="text-xs text-muted-foreground">john@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} editData={editData} />
    </div>
  );
};

export default DashboardPage;
