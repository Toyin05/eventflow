import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Calendar, Users, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/events", label: "Events", icon: Calendar },
  { to: "/users", label: "Users", icon: Users },
];

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebarContent = (
    <div className="flex h-full w-60 flex-col border-r border-[color:var(--color-border)] bg-white/90 backdrop-blur-md">
      <div className="px-6 py-6">
        <div className="font-display text-2xl font-bold text-[color:var(--color-text-primary)]">EventFlow</div>
        <span className="mt-2 inline-block rounded-full bg-[color:var(--color-accent)]/15 px-2.5 py-0.5 text-xs font-semibold text-[color:var(--color-accent-glow)]">
          Admin Panel
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-[color:var(--color-accent)]/12 font-semibold text-[color:var(--color-accent-glow)]"
                  : "text-[color:var(--color-text-muted)] hover:bg-slate-100 hover:text-[color:var(--color-text-primary)]"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[color:var(--color-border)] p-4">
        {user && (
          <div className="mb-3">
            <div className="text-sm font-medium text-[color:var(--color-text-primary)]">{user.fullName}</div>
            <div className="text-xs text-[color:var(--color-text-muted)]">{user.email}</div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-red-400/50 px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:block">{sidebarContent}</aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full">{sidebarContent}</div>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        {/* Mobile topbar */}
        <header className="flex items-center justify-between border-b border-[color:var(--color-border)] bg-white/90 px-4 py-3 backdrop-blur-md md:hidden">
          <div className="font-display text-lg font-bold text-[color:var(--color-text-primary)]">EventFlow</div>
          <button
            onClick={() => setOpen(!open)}
            className="rounded-md p-2 text-[color:var(--color-text-primary)] hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
