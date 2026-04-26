import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Calendar, Ticket, Users, TrendingUp, Loader2 } from "lucide-react";
import StatCard from "../components/StatCard";
import { adminApi } from "../api";

interface Stats {
  totalEvents: number;
  totalTickets: number;
  totalUsers: number;
}
interface RecentTicket {
  ticketCode: string;
  status: string;
  createdAt: string;
  user: { fullName: string };
  event: { title: string };
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeEvents, setActiveEvents] = useState(0);
  const [tickets, setTickets] = useState<RecentTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, evs] = await Promise.all([
          adminApi.stats(),
          adminApi.getEvents()
        ]);
        setStats(s);
        const now = new Date();
        setActiveEvents(
          (evs as { date: string }[]).filter((e) => new Date(e.date) > now).length
        );
      } catch (err) {
        toast.error('Failed to load stats');
      }

      try {
        const t = await adminApi.getRecentTickets();
        setTickets(t);
      } catch {
        // silently fail — no recent tickets yet
        setTickets([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-[color:var(--color-accent-glow)]" size={28} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-[color:var(--color-text-primary)]">Dashboard</h1>
        <Link to="/events/new" className="btn-primary inline-block">
          Create New Event
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Events" value={stats?.totalEvents ?? 0} icon={Calendar} />
        <StatCard label="Total Tickets Issued" value={stats?.totalTickets ?? 0} icon={Ticket} />
        <StatCard label="Total Users" value={stats?.totalUsers ?? 0} icon={Users} />
        <StatCard label="Active Events" value={activeEvents} icon={TrendingUp} />
      </div>

      <div className="card-glow mt-8 overflow-hidden">
        <div className="border-b border-[color:var(--color-border)] px-6 py-4">
          <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">Recent Tickets</h2>
        </div>
        {tickets.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-[color:var(--color-text-muted)]">
            No recent tickets yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[color:var(--color-border)] text-left text-xs uppercase tracking-wider text-[color:var(--color-text-muted)]">
                <tr>
                  <th className="px-6 py-3">Attendee</th>
                  <th className="px-6 py-3">Event</th>
                  <th className="px-6 py-3">Ticket Code</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr
                    key={t.ticketCode}
                    className="border-b border-[color:var(--color-border)]/40 last:border-0"
                  >
                    <td className="px-6 py-3 text-[color:var(--color-text-primary)]">{t.user?.fullName}</td>
                    <td className="px-6 py-3 text-[color:var(--color-text-muted)]">
                      {t.event?.title}
                    </td>
                    <td className="px-6 py-3 font-mono text-xs text-[color:var(--color-accent-glow)]">
                      {t.ticketCode}
                    </td>
                    <td className="px-6 py-3 text-[color:var(--color-text-muted)]">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          t.status === "cancelled"
                            ? "bg-red-500/15 text-red-400"
                            : "bg-emerald-500/15 text-emerald-400"
                        }`}
                      >
                        {t.status === "cancelled" ? "Cancelled" : "Valid"}
                      </span>
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
