// Placeholder for ProtectedRoute.jsx
// Full implementation will be added later.
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Show nothing while auth status loads
  if (loading) return <p>Loading...</p>;

  // User not logged in  redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // User exists  allow page
  return children;
}
