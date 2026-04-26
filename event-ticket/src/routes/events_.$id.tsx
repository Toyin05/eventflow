import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { eventsApi, type EventItem, type Ticket } from "@/api";
import { ErrorState, Spinner } from "@/components/States";
import { useAuth } from "@/context/AuthContext";
import { formatDate, formatTime } from "@/utils/format";

export const Route = createFileRoute("/events_/$id")({
  component: EventDetail,
});

function EventDetail() {
  const { id } = Route.useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [registeredTicket, setRegisteredTicket] = useState<Ticket | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    eventsApi
      .get(id)
      .then(setEvent)
      .catch((e) => setError(e?.response?.data?.message || "Failed to load event."))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate({ to: "/login", search: { redirect: `/events/${id}` } });
      return;
    }
    setSubmitting(true);
    setRegisterError(null);
    try {
      const ticket = await eventsApi.register(id);
      setRegisteredTicket(ticket);
      // Redirect to ticket page after successful registration
      navigate({ to: "/tickets/$ticketCode", params: { ticketCode: ticket.ticketCode } });
    } catch (e: any) {
      setRegisterError(e?.response?.data?.message || "Could not register for this event.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Spinner />
      </div>
    );
  if (error)
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  if (!event) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to events
      </Link>

      <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-gradient-card shadow-card">
        <div className="relative h-48 bg-gradient-primary sm:h-64">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)",
              backgroundSize: "40px 40px, 60px 60px",
            }}
          />
        </div>
        <div className="p-6 sm:p-10">
          <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
            {event.title}
          </h1>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <InfoBox label="Date" value={formatDate(event.date)} />
            <InfoBox label="Time" value={formatTime(event.date, event.time)} />
            <InfoBox label="Location" value={event.location} />
          </div>

          <div className="mt-8">
            <h2 className="font-display text-lg font-semibold">About this event</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {event.description}
            </p>
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Capacity</div>
              <div className="mt-1 font-display text-lg font-semibold">
                {typeof event.spotsLeft === "number"
                  ? `${event.spotsLeft} spots left`
                  : `${event.capacity} total spots`}
              </div>
            </div>

            {registeredTicket ? (
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
                  You're registered
                </span>
                <span className="text-sm text-muted-foreground">Redirecting to your ticket...</span>
              </div>
            ) : (
              <button
                onClick={handleRegister}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-60"
              >
                {submitting ? "Registering…" : "Register for this Event"}
              </button>
            )}
          </div>

          {registerError && <p className="mt-3 text-sm text-destructive">{registerError}</p>}
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}
