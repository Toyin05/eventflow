import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "../api";

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [mismatch, setMismatch] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setMismatch(true);
      return;
    }
    setMismatch(false);
    setLoading(true);
    try {
      await authApi.registerAdmin({ fullName, email, password, adminSecret: "eventflow-admin-2026" });
      toast.success("Admin account created! Please log in.");
      navigate("/login");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data
          ?.message || (err as Error).message || "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="card-glow w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl font-bold text-[color:var(--color-text-primary)]">EventFlow</h1>
          <span className="mt-3 inline-block rounded-full bg-[color:var(--color-accent)]/20 px-3 py-1 text-xs font-semibold text-[color:var(--color-accent-glow)]">
            Admin Panel
          </span>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[color:var(--color-text-muted)]">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input-base"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[color:var(--color-text-muted)]">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-base"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[color:var(--color-text-muted)]">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-base"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[color:var(--color-text-muted)]">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="input-base"
            />
            {mismatch && (
              <p className="mt-1.5 text-xs text-red-400">Passwords do not match.</p>
            )}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[color:var(--color-text-muted)]">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-[color:var(--color-accent-glow)]">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
