import { useState, useRef, useEffect } from "react";
import { Search, Lock, Plus, LogOut } from "lucide-react";
const Navbar = ({
  searchQuery,
  onSearchChange,
  onLock,
  onAddNew,
  onLogout,
  accountEmail = "john@gmail.com",
  displayName = "John Doe",
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef(null);
  const initials = (displayName?.trim()?.[0] || "U").toUpperCase();
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-4 lg:px-6 py-3">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative max-w-md ml-10 lg:ml-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search passwords..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="vault-input pl-9 py-2 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={onAddNew}
            className="vault-btn-primary py-2 px-4 flex items-center gap-1.5 text-sm"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
          <button
            onClick={onLock}
            className="vault-btn-icon"
            title="Lock vault"
          >
            <Lock className="w-5 h-5" />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setProfileOpen((p) => !p)}
              className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-primary/40"
            >
              {initials}
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-border bg-card shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                <div className="flex items-center gap-3 p-4 border-b border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-lg font-semibold shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {accountEmail}
                    </p>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onLogout?.();
                      localStorage.removeItem("token");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted transition-colors duration-150 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-muted-foreground" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
