import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate({ to: "/events" });
    }
  }, [user, navigate]);

  if (user) {
    return null; // Will redirect
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Your Ticket to Every <span className="text-gradient">Moment That Matters</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
              EventFlow is Nigeria's easiest way to discover events, register instantly, and get
              your ticket in seconds. Concerts, conferences, workshops, campus events — all in one
              place.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
              >
                Get Started — It's Free
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface/60 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-accent"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Visual element - animated gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-pulse" />
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight">How It Works</h2>
          <p className="mt-4 text-muted-foreground">Get your tickets in 3 simple steps</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground">
              <span className="text-lg font-bold">1</span>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold">Create Your Account</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign up in under a minute. No stress, no long forms.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground">
              <span className="text-lg font-bold">2</span>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold">Discover Events</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Browse verified events happening around you — campus, city, online.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground">
              <span className="text-lg font-bold">3</span>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold">Get Your Ticket</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Register for any event and receive your digital ticket instantly with a unique QR
              code.
            </p>
          </div>
        </div>
      </section>

      {/* Why EventFlow */}
      <section className="bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight">Why EventFlow</h2>
            <p className="mt-4 text-muted-foreground">Built for Nigerians, by Nigerians</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <svg
                  className="h-5 w-5 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">Instant Digital Tickets</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Get a QR-coded ticket the moment you register
              </p>
            </div>
            <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <svg
                  className="h-5 w-5 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">Events For Nigerians</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Built for our culture, our campuses, our communities
              </p>
            </div>
            <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <svg
                  className="h-5 w-5 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">Secure & Simple</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No stress, no queues. Just show your ticket and walk in
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-primary">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-primary-foreground">
              Ready to attend your next event?
            </h2>
            <p className="mt-4 text-primary-foreground/80">
              Join thousands of Nigerians discovering amazing events
            </p>
            <div className="mt-8">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-foreground px-6 py-3 text-sm font-semibold text-primary shadow-glow transition-transform hover:scale-[1.03]"
              >
                Create Free Account
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-muted/20 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div>
              <div className="font-display text-lg font-bold">EventFlow</div>
              <p className="mt-2 text-sm text-muted-foreground">Your ticket to every moment.</p>
            </div>
            <div>
              <h3 className="font-semibold">Quick Links</h3>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>
                  <Link to="/" className="hover:text-foreground">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-foreground">
                    Register
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-foreground">
                    Login
                  </Link>
                </li>
              </ul>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">© 2026 EventFlow. Built by Group 26.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
