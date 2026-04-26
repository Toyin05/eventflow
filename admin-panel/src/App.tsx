import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import EventForm from "./pages/EventForm";
import Users from "./pages/Users";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <Sidebar>{children}</Sidebar>
    </ProtectedRoute>
  );
}

function RootRedirect() {
  const { user, token } = useAuth();
  if (token && user?.role === "admin") return <Navigate to="/dashboard" replace />;
  return <Navigate to="/login" replace />;
}

function PublicOnly({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();
  if (token && user?.role === "admin") return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route
        path="/login"
        element={
          <PublicOnly>
            <Login />
          </PublicOnly>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnly>
            <Register />
          </PublicOnly>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedLayout>
            <Events />
          </ProtectedLayout>
        }
      />
      <Route
        path="/events/new"
        element={
          <ProtectedLayout>
            <EventForm />
          </ProtectedLayout>
        }
      />
      <Route
        path="/events/:id/edit"
        element={
          <ProtectedLayout>
            <EventForm />
          </ProtectedLayout>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedLayout>
            <Users />
          </ProtectedLayout>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
