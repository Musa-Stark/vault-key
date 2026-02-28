import { useState } from "react";
import { Key, Lock, Shield, Settings, Menu, X, ChevronRight } from "lucide-react";
const categories = ["All", "Social", "Bank", "Development", "Custom"];
const navItems = [
    { id: "passwords", label: "All Passwords", icon: Key },
    { id: "generator", label: "Password Generator", icon: Shield },
    { id: "settings", label: "Settings", icon: Settings },
];
const Sidebar = ({ activeView, onNavigate, activeCategory, onCategoryChange }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const content = (<div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-5 border-b border-border">
        <Lock className="w-6 h-6 text-primary"/>
        <span className="text-lg font-bold text-foreground">VaultX</span>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (<button key={item.id} onClick={() => { onNavigate(item.id); setMobileOpen(false); }} className={`vault-sidebar-item w-full ${activeView === item.id ? "active" : ""}`}>
            <item.icon className="w-4 h-4"/>
            {item.label}
          </button>))}

        {activeView === "passwords" && (<div className="mt-6">
            <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Categories</p>
            {categories.map((cat) => (<button key={cat} onClick={() => { onCategoryChange(cat); setMobileOpen(false); }} className={`vault-sidebar-item w-full text-sm ${activeCategory === cat ? "active" : ""}`}>
                <ChevronRight className="w-3 h-3"/>
                {cat}
              </button>))}
          </div>)}
      </nav>
    </div>);
    return (<>
      {/* Mobile toggle */}
      <button onClick={() => setMobileOpen(true)} className="lg:hidden fixed top-4 left-4 z-50 vault-btn-icon bg-card border border-border">
        <Menu className="w-5 h-5"/>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (<div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div className="w-64 h-full bg-surface border-r border-border" onClick={(e) => e.stopPropagation()} style={{ animation: "slideInLeft 0.2s ease-out" }}>
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 vault-btn-icon">
              <X className="w-5 h-5"/>
            </button>
            {content}
          </div>
        </div>)}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 bg-surface border-r border-border h-screen sticky top-0 shrink-0">
        {content}
      </aside>
    </>);
};
export default Sidebar;
