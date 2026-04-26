import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, Search } from "lucide-react";
import { adminApi } from "../api";

interface UserItem {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
  ticketCount: number;
}

export default function Users() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setUsers(await adminApi.getUsers());
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to load users";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleRole = async (u: UserItem) => {
    const next = u.role === "admin" ? "user" : "admin";
    setBusyId(u.id);
    try {
      await adminApi.updateUserRole(u.id, next);
      toast.success(next === "admin" ? "User promoted to admin" : "Admin access revoked");
      load();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to update role";
      toast.error(message);
    } finally {
      setBusyId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [query, users]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-[color:var(--color-text-primary)]">Users</h1>
        <div className="relative w-full sm:w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)]"
          />
          <input
            placeholder="Search by name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-base pl-9"
          />
        </div>
      </div>

      <div className="card-glow overflow-hidden">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="animate-spin text-[color:var(--color-accent-glow)]" size={24} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-[color:var(--color-text-muted)]">
            {query ? "No users match your search." : "No users yet."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[color:var(--color-border)] text-left text-xs uppercase tracking-wider text-[color:var(--color-text-muted)]">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Joined</th>
                  <th className="px-6 py-3">Tickets</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-[color:var(--color-border)]/40 last:border-0"
                  >
                    <td className="px-6 py-3 font-medium text-[color:var(--color-text-primary)]">{u.fullName}</td>
                    <td className="px-6 py-3 text-[color:var(--color-text-muted)]">{u.email}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          u.role === "admin"
                            ? "bg-[color:var(--color-accent)]/15 text-[color:var(--color-accent-glow)]"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {u.role === "admin" ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-[color:var(--color-text-muted)]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-[color:var(--color-text-muted)]">
                      {u.ticketCount}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-end">
                        <button
                          onClick={() => toggleRole(u)}
                          disabled={busyId === u.id}
                          className={u.role === "admin" ? "btn-danger" : "btn-outline"}
                        >
                          {busyId === u.id
                            ? "Working..."
                            : u.role === "admin"
                              ? "Revoke Admin"
                              : "Make Admin"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
