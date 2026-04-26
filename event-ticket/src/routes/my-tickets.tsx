import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ticketsApi, type Ticket } from "@/api";
import { TicketCard } from "@/components/TicketCard";
import { EmptyState, ErrorState, Spinner } from "@/components/States";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/my-tickets")({
  component: MyTicketsPage,
});

function MyTicketsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: "/login", search: { redirect: "/my-tickets" } });
    }
  }, [authLoading, isAuthenticated, navigate]);

  const load = () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    ticketsApi
      .mine()
      .then(setTickets)
      .catch((e) => setError(e?.response?.data?.message || "Failed to load your tickets."))
      .finally(() => setLoading(false));
  };

  useEffect(load, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">My Tickets</h1>
        <p className="mt-1 text-sm text-muted-foreground">All the events you've registered for.</p>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : tickets.length === 0 ? (
        <EmptyState
          title="You haven't registered for any events yet"
          description="Browse upcoming events and grab your first ticket."
          action={
            <Link to="/" className="inline-flex items-center rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow">
              Browse Events
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {tickets.map((t) => (
            <TicketCard key={t.ticketCode} ticket={t} />
          ))}
        </div>
      )}
    </div>
  );
}
