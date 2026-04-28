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
  user: { fullName: string; email: string };
}

interface Event {
  id: string;
  title: string;
  date: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeEvents, setActiveEvents] = useState<Event[]>([]);
  const [tickets, setTickets] = useState<RecentTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const exportToCSV = (tickets: RecentTicket[], eventTitle: string) => {
    const headers = ["#", "Attendee Name", "Email", "Ticket Code", "Registration Date"];
    const rows = tickets.map((t, index) => [
      index + 1,
      t.user.fullName,
      t.user.email,
      t.ticketCode,
      new Date(t.createdAt).toLocaleString()
    ]);

    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${eventTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_attendees.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sortedTickets = [...tickets].sort((a, b) => {
    if (sortBy === "name") {
      const comparison = a.user.fullName.localeCompare(b.user.fullName);
      return sortOrder === "asc" ? comparison : -comparison;
    } else {
      const comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortOrder === "asc" ? comparison : -comparison;
    }
  });

  const handleSort = (column: "name" | "date") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const [s, evs] = await Promise.all([
          adminApi.stats(),
          adminApi.getEvents()
        ]);
        setStats(s);
        const now = new Date();
        const active = (evs as Event[]).filter((e) => new Date(e.date) > now);
        setActiveEvents(active);
      } catch (err) {
        setTickets([]);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let t;
        if (selectedEvent) {
          const event = activeEvents.find(e => e.id === selectedEvent);
          if (event) {
            t = await adminApi.getEventTickets(selectedEvent);
          } else {
            t = [];
          }
        } else {
          t = await adminApi.getRecentTickets();
        }
        setTickets(t);
      } catch (err) {
        setTickets([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedEvent, activeEvents]);

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
        <StatCard label="Active Events" value={activeEvents.length} icon={TrendingUp} />
      </div>

      <div className="card-glow mt-8 overflow-hidden">
        <div className="border-b border-[color:var(--color-border)] px-6 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
              {selectedEvent ? `Attendees for ${activeEvents.find(e => e.id === selectedEvent)?.title}` : "Recent Tickets"}
            </h2>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="rounded-lg border border-[color:var(--color-border)] bg-surface px-3 py-1.5 text-sm"
              >
                <option value="">All Events (Recent)</option>
                {activeEvents.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
              <button
                onClick={() => exportToCSV(tickets, selectedEvent ? activeEvents.find(e => e.id === selectedEvent)?.title : "Recent Tickets")}
                className="rounded-lg border border-[color:var(--color-border)] bg-surface px-3 py-1.5 text-sm hover:bg-muted"
              >
                Download CSV
              </button>
            </div>
          </div>
        </div>
        {tickets.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-[color:var(--color-text-muted)]">
            No recent tickets yet.
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 border-b border-[color:var(--color-border)] bg-surface text-left text-xs uppercase tracking-wider text-[color:var(--color-text-muted)]">
                  <tr>
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3 cursor-pointer hover:text-[color:var(--color-text-primary)]" onClick={() => handleSort("name")}>
                      Attendee Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-6 py-3">Email/Contact</th>
                    <th className="px-6 py-3">Ticket Code</th>
                    <th className="px-6 py-3 cursor-pointer hover:text-[color:var(--color-text-primary)]" onClick={() => handleSort("date")}>
                      Registration Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTickets.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm text-[color:var(--color-text-muted)]">
                        {selectedEvent ? "No attendees found for this event." : "No recent tickets yet."}
                      </td>
                    </tr>
                  ) : (
                    sortedTickets.map((t, index) => (
                      <tr
                        key={t.ticketCode}
                        className="border-b border-[color:var(--color-border)]/40 last:border-0 hover:bg-muted/50"
                      >
                        <td className="px-6 py-3 text-[color:var(--color-text-muted)]">{index + 1}</td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--color-accent)] text-xs font-semibold text-[color:var(--color-accent-foreground)]">
                              {t.user?.fullName.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-[color:var(--color-text-primary)]">{t.user?.fullName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-[color:var(--color-text-muted)]">{t.user?.email || 'N/A'}</td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-[color:var(--color-accent-glow)]">
                              {t.ticketCode.slice(0, 8)}...
                            </span>
                            <button
                              onClick={() => navigator.clipboard.writeText(t.ticketCode)}
                              className="text-[color:var(--color-text-muted)] hover:text-[color:var(--color-accent)]"
                              title="Copy full ticket code"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-[color:var(--color-text-muted)]">
                          {new Date(t.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
