import useFetch from "../../hooks/useFetch";
import AdminSidebar from "../../components/admin/AdminSidebar";
import getOrderReference from "../../utils/orderReference";
import formatCurrency from "../../utils/formatCurrency";

export default function AdminOrders() {
  const { data: orders, loading } = useFetch("/admin/orders");

  return (
    <div className="flex gap-6">
      <AdminSidebar />

      <div className="flex-1 bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold mb-6">Manage Orders</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Order ID</th>
                <th className="p-2">User</th>
                <th className="p-2">Total</th>
                <th className="p-2">Items</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t">
                  <td className="p-2">{getOrderReference(o)}</td>
                  <td className="p-2">{o.user?.name}</td>
                  <td className="p-2">{formatCurrency(o.total || 0)}</td>
                  <td className="p-2">{o.items.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
