import AdminSidebar from "../../components/admin/AdminSidebar";
import useFetch from "../../hooks/useFetch";
import StatsCard from "../../components/admin/StatsCard";

export default function AdminDashboard() {
  const { data: stats, loading, error } = useFetch("/api/admin/stats");

  return (
    <div className="flex gap-6 margin-top:80px">
      <AdminSidebar />
      <div className="flex-1 bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {loading && <p>Loading statistics...</p>}
        {error && (
          <p className="text-red-600">{error}</p>
        )}

        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatsCard title="Users" value={stats.users} tone="blue" />
            <StatsCard title="Products" value={stats.products} tone="green" />
            <StatsCard title="Orders" value={stats.orders} tone="yellow" />
          </div>
        )}
      </div>
    </div>
  );
}
