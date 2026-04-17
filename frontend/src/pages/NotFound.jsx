// Placeholder for NotFound.jsx
// Full implementation will be added later.
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h2 className="text-3xl font-bold">404 - Page Not Found</h2>
      <p className="mt-4 text-gray-600">
        The page you're looking for doesn't exist.
      </p>

      <Link to="/" className="text-blue-600 underline mt-6 block">
        Go Home
      </Link>
    </div>
  );
}