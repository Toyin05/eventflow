import { Link } from "@tanstack/react-router";
import type { EventItem } from "@/api";
import { formatDate, formatTime } from "@/utils/format";

export function EventCard({ event }: { event: EventItem }) {
  return (
    <Link
      to="/events/$id"
      params={{ id: event.id }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-gradient-card shadow-card transition-all hover:border-primary/40 hover:shadow-glow"
    >
      <div className="relative h-40 w-full overflow-hidden bg-gradient-primary">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)",
          backgroundSize: "40px 40px, 60px 60px",
        }} />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div className="rounded-md bg-background/80 px-2 py-1 text-xs font-semibold text-foreground backdrop-blur">
            {formatDate(event.date)}
          </div>
          <div className="rounded-md bg-background/80 px-2 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            {formatTime(event.date, event.time)}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
          {event.title}
        </h3>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{event.location}</span>
        </div>
        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
          {event.description}
        </p>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {typeof event.spotsLeft === "number"
              ? `${event.spotsLeft} spots left`
              : `${event.capacity} capacity`}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
            View Event
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
