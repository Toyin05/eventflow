import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();
  const localToken = localStorage.getItem("admin_token");
  if (!token || !localToken || !user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
