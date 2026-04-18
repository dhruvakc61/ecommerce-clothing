import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import useFetch from "../../hooks/useFetch";
import api from "../../api/axios";
import { useState } from "react";
import formatCurrency from "../../utils/formatCurrency";

export default function AdminProducts() {
  const { data: products, loading, error, refetch } = useFetch("/api/products");
  const [busyId, setBusyId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      setBusyId(id);
      await api.delete(`/api/products/${id}`);
      refetch();
    } catch (err) {
      window.alert(err.response?.data?.message || "Failed to delete product.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex gap-6">
      <AdminSidebar />
      <div className="flex-1 bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <Link
            to="/admin/products/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Product
          </Link>
        </div>

        {loading && <p>Loading products...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && (!products || products.length === 0) && (
          <p>No products found.</p>
        )}

        {products && products.length > 0 && (
          <table className="w-full text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t">
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{formatCurrency(product.price || 0)}</td>
                  <td className="p-3">{product.stock ?? 0}</td>
                  <td className="p-3 space-x-3">
                    <Link
                      to={`/admin/products/${product._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(product._id)}
                      disabled={busyId === product._id}
                      className="text-red-600 hover:underline"
                    >
                      {busyId === product._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
