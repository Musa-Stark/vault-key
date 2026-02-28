import { useState, useMemo, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import PasswordCard from "@/components/PasswordCard";
import Modal from "@/components/Modal";
import Generator from "@/components/Generator";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { ShieldOff, Settings } from "lucide-react";
import { apiCall } from "@/lib/apiRequest";

const DashboardPage = ({ onLock, onLogout }) => {
  const {
    vaultItems: passwords,
    setVaultItems: setPasswords,
    unlockData,
  } = useAuth();


  const [activeView, setActiveView] = useState("passwords");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const { showToast } = useToast();

  const filtered = useMemo(() => {
    if (!passwords) return;

    return passwords.filter((p) => {
      const matchCategory =
        activeCategory === "All" || p.category === activeCategory;
      const matchSearch =
        !searchQuery ||
        p.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.username.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [passwords, activeCategory, searchQuery]);

  // handleSave
  const handleSave = async (entry) => {
    let wasUpdate = false;
    let apiMethod = isEdit ? "PATCH" : "POST";

    const response = await apiCall(entry, apiMethod, "/password");
    const data = response.data;

    if (!response.success) {
      showToast(response.message, "fail");
    } else {
      showToast("Password added");

      setPasswords((prev) => {
        const exists = prev.find((p) => p._id === data._id);

        if (exists) {
          wasUpdate = true;
          const updated = prev.map((p) => (p._id === data._id ? data : p));
          return updated;
        }
        return [...prev, data];
      });

      setIsEdit(isEdit && false);

      if (wasUpdate) {
        showToast("Password updated");
      }
    }
  };

  const handleEdit = (_id) => {
    const entry = passwords.find((p) => p._id === _id);
    if (entry) {
      setEditData(entry);
      setModalOpen(true);
      setIsEdit(!isEdit && true);
    }
  };
  const handleDelete = async (_id) => {
    const item = passwords.find((p) => p._id === _id);
    const response = await apiCall(item, "DELETE", "/password");

    if (response.success) {
      setPasswords((prev) => prev.filter((p) => p._id !== _id));
      showToast("Password deleted");
    } else {
      showToast(response.message, "fail");
    }
  };

  const handleAddNew = () => {
    setEditData(null);
    setModalOpen(true);
    setIsEdit(isEdit && false);
  };

  const userData = unlockData || {};
  const accountEmail = userData?.email || "john@gmail.com";
  const displayName = userData?.name || userData?.fullName || "John Doe";

  useEffect(() => {
    const fetchVaultItems = async () => {
      const response = await apiCall("", "GET", "/password");
      if (!response.success) {
        showToast(response.message, "fail");
      } else {
        setPasswords(response.data.reverse());
      }
    };
    fetchVaultItems();
  }, [showToast, setPasswords]);

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
          onLogout={onLogout}
          accountEmail={accountEmail}
          displayName={displayName}
        />

        <main className="flex-1 p-4 lg:p-6">
          {activeView === "passwords" && (
            <>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    {activeCategory === "All"
                      ? "All Passwords"
                      : activeCategory}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {passwords && filtered.length} items
                  </p>
                </div>
              </div>

              {passwords && filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <ShieldOff className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    No passwords found
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Add your first password to get started
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {passwords &&
                    filtered.map((p) => (
                      <PasswordCard
                        key={p._id || p.id}
                        {...p}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                </div>
              )}
            </>
          )}

          {activeView === "generator" && <Generator />}

          {activeView === "settings" && (
            <div className="max-w-lg mx-auto">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Settings
              </h2>
              <div className="vault-card space-y-4">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Auto-lock timeout
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Lock vault after 5 minutes of inactivity
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Account
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {accountEmail}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setIsEdit(isEdit && false);
        }}
        onSave={handleSave}
        editData={editData}
      />
    </div>
  );
};
export default DashboardPage;
