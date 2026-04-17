import AdminSidebar from "../../components/admin/AdminSidebar";
import useFetch from "../../hooks/useFetch";

export default function AdminDashboard() {
  const { data: stats } = useFetch("/admin/stats");

  return (
    <div className="flex gap-6">
      <AdminSidebar />

      <div className="flex-1 bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {!stats ? (
          <p>Loading statistics...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-100 rounded">
              <h3 className="font-bold">Users</h3>
              <p className="text-2xl">{stats.users}</p>
            </div>

            <div className="p-4 bg-green-100 rounded">
              <h3 className="font-bold">Products</h3>
              <p className="text-2xl">{stats.products}</p>
            </div>

            <div className="p-4 bg-yellow-100 rounded">
              <h3 className="font-bold">Orders</h3>
              <p className="text-2xl">{stats.orders}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}