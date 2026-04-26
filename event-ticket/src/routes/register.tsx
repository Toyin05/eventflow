import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { AuthShell, Field } from "./login";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    try {
      await register(fullName, email, password);
      navigate({ to: "/" });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not create your account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Join EventFlow and never miss an event.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field
          label="Full name"
          value={fullName}
          onChange={setFullName}
          placeholder="Jane Doe"
          required
        />
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          required
        />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="At least 6 characters"
          required
        />
        <Field
          label="Confirm password"
          type="password"
          value={confirm}
          onChange={setConfirm}
          placeholder="Repeat your password"
          required
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-gradient-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.01] disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
