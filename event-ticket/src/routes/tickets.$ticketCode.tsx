import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { ticketsApi, type Ticket } from "@/api";
import { ErrorState, Spinner } from "@/components/States";
import { formatDate, formatTime } from "@/utils/format";

export const Route = createFileRoute("/tickets/$ticketCode")({
  component: TicketDetail,
});

function TicketDetail() {
  const { ticketCode } = Route.useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    ticketsApi
      .get(ticketCode)
      .then(setTicket)
      .catch((e) => setError(e?.response?.data?.message || "Failed to load ticket."))
      .finally(() => setLoading(false));
  };

  useEffect(load, [ticketCode]);

  if (loading)
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Spinner />
      </div>
    );
  if (error)
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  if (!ticket) return null;

  const valid = ticket.status === "valid";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 print:py-0">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link
          to="/my-tickets"
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
          Back to tickets
        </Link>
        <button
          onClick={() => window.print()}
          className="rounded-lg border border-border bg-surface px-3.5 py-1.5 text-sm font-medium hover:bg-accent"
        >
          Print
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border bg-gradient-card shadow-card">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto]">
          <div className="p-8 sm:p-10">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                EventFlow
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  valid ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                }`}
              >
                {valid ? "Valid" : "Cancelled"}
              </span>
            </div>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight">
              {ticket.event.title}
            </h1>

            <dl className="mt-8 space-y-4">
              <Row label="Attendee" value={ticket.user.fullName} />
              <Row label="Date" value={formatDate(ticket.event.date)} />
              <Row label="Time" value={formatTime(ticket.event.date, ticket.event.time)} />
              <Row label="Location" value={ticket.event.location} />
              <Row
                label="Ticket code"
                value={<span className="font-mono">{ticket.ticketCode}</span>}
              />
            </dl>
          </div>

          <div className="relative flex items-center justify-center border-t border-dashed border-border bg-surface p-8 sm:border-l sm:border-t-0">
            <span className="absolute -top-3 left-1/2 hidden h-6 w-6 -translate-x-1/2 rounded-full bg-background sm:left-0 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:block" />
            <span className="absolute -bottom-3 left-1/2 hidden h-6 w-6 -translate-x-1/2 rounded-full bg-background sm:left-0 sm:bottom-auto sm:top-auto sm:hidden" />
            <div className="rounded-xl bg-white p-4">
              <QRCode value={`${window.location.origin}/tickets/${ticket.ticketCode}`} size={180} />
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Present this QR code at the venue entrance. Do not share your ticket code.
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-3 last:border-0">
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}
