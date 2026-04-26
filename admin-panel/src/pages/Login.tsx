import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "../api";
import { useAuth } from "../AuthContext";

export default function Login() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authApi.login({ email, password });
      if (data.user.role !== "admin") {
        toast.error("Access denied. Admin accounts only.");
        return;
      }
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(data.user));
      setAuth(data.token, data.user);
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data
          ?.message || (err as Error).message || "Login failed";
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
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-base"
              placeholder="admin@example.com"
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
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[color:var(--color-text-muted)]">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-[color:var(--color-accent-glow)]">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
