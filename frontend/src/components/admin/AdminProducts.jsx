import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import AdminSidebar from "../../components/admin/AdminSidebar";
import api from "../../api/axios";

export default function AdminProducts() {
  const { data: products, loading, refetch } = useFetch("/api/products");

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;

    await api.delete(`/api/products/${id}`);
    refetch();
  };

  return (
    <div className="flex gap-6">
      <AdminSidebar />

      <div className="flex-1 bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Manage Products</h1>

          <Link
            to="/admin/products/new"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add New Product
          </Link>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Price</th>
                <th className="p-2">Category</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">${p.price}</td>
                  <td className="p-2">{p.category}</td>
                  <td className="p-2 space-x-3">
                    <Link
                      to={`/admin/products/${p._id}`}
                      className="text-blue-600"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="text-red-600"
                    >
                      Delete
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