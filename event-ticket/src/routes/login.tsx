import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: (search.redirect as string) || "/",
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate({ to: search.redirect || "/" });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to access your tickets and bookings.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" required />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-gradient-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.01] disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold text-primary hover:underline">
          Create one
        </Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-12 sm:px-6">
      <div className="w-full">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="rounded-2xl border border-border bg-gradient-card p-6 shadow-card sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Field({
  label, type = "text", value, onChange, placeholder, required,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-input bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none ring-primary/40 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2"
      />
    </label>
  );
}
