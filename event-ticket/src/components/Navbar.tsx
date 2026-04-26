import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const { location } = useRouterState();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate({ to: "/" });
  };

  const linkBase =
    "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors";
  const activeProps = { className: "text-sm font-medium text-foreground" };

  // Hide navbar on the route currently — render always
  void location;

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-primary-foreground">
              <path
                d="M3 9a2 2 0 012-2h14a2 2 0 012 2v1a2 2 0 100 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1a2 2 0 100-4V9z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="font-display text-lg font-bold tracking-tight">EventFlow</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to={isAuthenticated ? "/events" : "/"}
            className={linkBase}
            activeProps={activeProps}
            activeOptions={{ exact: !isAuthenticated }}
          >
            Events
          </Link>
          {isAuthenticated && (
            <Link to="/my-tickets" className={linkBase} activeProps={activeProps}>
              My Tickets
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-foreground">
                  {user?.fullName?.charAt(0).toUpperCase() ?? "U"}
                </div>
                <span className="text-sm text-muted-foreground">
                  {user?.fullName?.split(" ")[0]}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-gradient-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] shadow-glow"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden rounded-md p-2 text-muted-foreground hover:bg-accent"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-3">
            <Link
              to={isAuthenticated ? "/events" : "/"}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm hover:bg-accent"
            >
              Events
            </Link>
            {isAuthenticated && (
              <Link
                to="/my-tickets"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm hover:bg-accent"
              >
                My Tickets
              </Link>
            )}

            <div className="my-2 border-t border-border" />
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-gradient-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
