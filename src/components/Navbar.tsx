import { Search, Lock, Plus } from "lucide-react";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onLock: () => void;
  onAddNew: () => void;
}

const Navbar = ({ searchQuery, onSearchChange, onLock, onAddNew }: NavbarProps) => {
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
          <button onClick={onAddNew} className="vault-btn-primary py-2 px-4 flex items-center gap-1.5 text-sm">
            <Plus className="w-4 h-4" /> Add
          </button>
          <button onClick={onLock} className="vault-btn-icon" title="Lock vault">
            <Lock className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold">
            J
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
