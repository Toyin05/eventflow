import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { adminApi } from "../api";

export default function EventForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit || !id) return;
    (async () => {
      try {
        const ev = await adminApi.getEvent(id);
        setTitle(ev.title || "");
        setDescription(ev.description || "");
        const d = new Date(ev.date);
        setDate(d.toISOString().slice(0, 10));
        setTime(d.toTimeString().slice(0, 5));
        setLocation(ev.location || "");
        setCapacity(String(ev.capacity ?? ""));
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to load event";
        toast.error(message);
      } finally {
        setFetching(false);
      }
    })();
  }, [id, isEdit]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title || !description || !date || !time || !location || !capacity) {
      setError("All fields are required.");
      return;
    }
    const cap = Number(capacity);
    if (!Number.isFinite(cap) || cap <= 0) {
      setError("Capacity must be a positive number.");
      return;
    }
    const combined = new Date(`${date}T${time}`);
    if (combined <= new Date()) {
      setError("Date must be in the future.");
      return;
    }

    const payload = {
      title,
      description,
      date: combined.toISOString(),
      location,
      capacity: cap,
    };

    setLoading(true);
    try {
      if (isEdit && id) {
        await adminApi.updateEvent(id, payload);
        toast.success("Event updated");
      } else {
        await adminApi.createEvent(payload);
        toast.success("Event created");
      }
      navigate("/events");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to save event";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-[color:var(--color-accent-glow)]" size={28} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold text-[color:var(--color-text-primary)]">
        {isEdit ? "Edit Event" : "Create New Event"}
      </h1>

      <form onSubmit={onSubmit} className="card-glow space-y-4 p-6">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[color:var(--color-text-muted)]">
            Event Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-base"
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[color:var(--color-text-muted)]">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-base min-h-[120px]"
            required
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[color:var(--color-text-muted)]">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-base"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[color:var(--color-text-muted)]">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="input-base"
              required
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[color:var(--color-text-muted)]">
            Location
          </label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="input-base"
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[color:var(--color-text-muted)]">
            Capacity
          </label>
          <input
            type="number"
            min={1}
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="input-base"
            required
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link to="/events" className="btn-outline">
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
