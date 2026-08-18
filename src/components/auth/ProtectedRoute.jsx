import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated, authLoading } = useAuth();
  const location = useLocation();

  // Wait until the saved token is validated
  if (authLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-sm text-ink-soft">
          Loading...
        </p>
      </div>
    );
  }

  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}