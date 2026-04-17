// Placeholder for AdminSidebar.jsx
// Full implementation will be added later.
import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const { pathname } = useLocation();

  const menu = [
    { label: "Dashboard", path: "/admin" },
    { label: "Products", path: "/admin/products" },
    { label: "Users", path: "/admin/users" },
    { label: "Orders", path: "/admin/orders" }
  ];

  return (
    <aside className="bg-white shadow p-6 rounded w-64 h-fit">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>

      <nav className="space-y-3">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-3 py-2 rounded ${
              pathname === item.path
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}