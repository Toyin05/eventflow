import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { adminApi } from "../api";
import ConfirmModal from "../components/ConfirmModal";

interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  capacity: number;
}

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState<EventItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getEvents();
      setEvents(data);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to load events";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await adminApi.deleteEvent(toDelete.id);
      toast.success("Event deleted successfully.");
      setToDelete(null);
      load();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to delete event";
      toast.error("Cannot delete event with active attendees. Please clear tickets first or contact support.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-[color:var(--color-text-primary)]">Events</h1>
        <Link to="/events/new" className="btn-primary">
          Create New Event
        </Link>
      </div>

      <div className="card-glow overflow-hidden">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="animate-spin text-[color:var(--color-accent-glow)]" size={24} />
          </div>
        ) : events.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-[color:var(--color-text-muted)]">
            No events yet. Create your first event.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[color:var(--color-border)] text-left text-xs uppercase tracking-wider text-[color:var(--color-text-muted)]">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Capacity</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr
                    key={ev.id}
                    className="border-b border-[color:var(--color-border)]/40 last:border-0"
                  >
                    <td className="px-6 py-3 font-medium text-[color:var(--color-text-primary)]">{ev.title}</td>
                    <td className="px-6 py-3 text-[color:var(--color-text-muted)]">
                      {new Date(ev.date).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-[color:var(--color-text-muted)]">
                      {ev.location}
                    </td>
                    <td className="px-6 py-3 text-[color:var(--color-text-muted)]">
                      {ev.capacity}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/events/${ev.id}/edit`)}
                          className="btn-outline"
                        >
                          Edit
                        </button>
                        <button onClick={() => setToDelete(ev)} className="btn-danger">
                          Delete
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

      <ConfirmModal
        open={!!toDelete}
        title="Delete event"
        message={`Are you sure you want to delete ${toDelete?.title ?? ""}? This action cannot be undone.`}
        onCancel={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
