import { Link } from "@tanstack/react-router";
import type { Ticket } from "@/api";
import { formatDate, formatTime } from "@/utils/format";

export function TicketCard({ ticket, onUnregister }: { ticket: Ticket; onUnregister?: (ticket: Ticket) => void }) {
  const valid = ticket.status === "valid";
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-card shadow-card transition-all hover:border-primary/40">
      <div className="flex flex-col sm:flex-row">
        <div className="relative flex w-full items-center justify-center bg-gradient-primary p-6 sm:w-40">
          <div className="text-center">
            <div className="font-display text-3xl font-bold text-primary-foreground">
              {new Date(ticket.event.date).getDate()}
            </div>
            <div className="text-xs uppercase tracking-wider text-primary-foreground/80">
              {new Date(ticket.event.date).toLocaleDateString(undefined, { month: "short" })}
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between p-5">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-lg font-semibold text-foreground">
                {ticket.event.title}
              </h3>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  valid
                    ? "bg-success/15 text-success"
                    : "bg-destructive/15 text-destructive"
                }`}
              >
                {valid ? "Valid" : "Cancelled"}
              </span>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {formatDate(ticket.event.date)} · {formatTime(ticket.event.date, ticket.event.time)}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {ticket.event.location}
            </div>
            <div className="mt-3 inline-flex items-center gap-2 rounded-md border border-dashed border-border bg-surface px-2.5 py-1 font-mono text-xs text-muted-foreground">
              <span className="text-muted-foreground/70">CODE</span>
              <span className="text-foreground">{ticket.ticketCode}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Link
              to="/tickets/$ticketCode"
              params={{ ticketCode: ticket.ticketCode }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              View Ticket
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            {onUnregister && (
              <button
                onClick={() => onUnregister(ticket)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-destructive bg-surface px-3 py-1.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/5"
              >
                Unregister
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
