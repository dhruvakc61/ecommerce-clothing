// Placeholder for AdminRoute.jsx
// Full implementation will be added later.
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  // Wait until authentication finishes
  if (loading) return <p>Loading...</p>;

  // If not logged in or not admin  redirect
  if (!user || !user.isAdmin) return <Navigate to="/" replace />;

  // Admin verified  allow access
  return children;
}
