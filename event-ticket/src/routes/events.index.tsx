import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { eventsApi, type EventItem } from "@/api";
import { useAuth } from "@/context/AuthContext";
import { EventCard } from "@/components/EventCard";
import { EmptyState, ErrorState, Spinner } from "@/components/States";

export const Route = createFileRoute("/events/")({
  component: Events,
});

function Events() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated]);

  const loadEvents = () => {
    setLoading(true);
    setError(null);
    eventsApi
      .list()
      .then(setEvents)
      .catch((e) =>
        setError(
          e?.response?.data?.message || "Could not load events right now. Please try again later.",
        ),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadEvents();
    }
  }, [isAuthenticated]);

  // Don't render anything while redirecting
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Upcoming Events</h1>
        <p className="mt-2 text-muted-foreground">Find something worth showing up for.</p>
      </div>

      {loading ? (
        <Spinner label="Loading events…" />
      ) : error ? (
        <ErrorState message={error} onRetry={loadEvents} />
      ) : events.length === 0 ? (
        <div className="flex justify-center">
          <EmptyState
            title="No events posted yet."
            description="Check back soon — something exciting is coming."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
