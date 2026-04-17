import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import useFetch from "../../hooks/useFetch";
import api from "../../api/axios";

const emptyForm = {
  name: "",
  price: "",
  image: "",
  category: "men",
  stock: "0",
  description: "",
};

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";
  const { data: product } = useFetch(isNew ? null : `/products/${id}`, !isNew);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product && !isNew) {
      setForm({
        name: product.name || "",
        price: String(product.price || ""),
        image: product.image || "",
        category: product.category || "men",
        stock: String(product.stock ?? 0),
        description: product.description || "",
      });
    }
  }, [product, isNew]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.price) {
      setError("Name and price are required.");
      return;
    }

    try {
      setSaving(true);
      if (isNew) {
        await api.post("/products", {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        });
      } else {
        await api.put(`/products/${id}`, {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        });
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex gap-6">
      <AdminSidebar />
      <div className="flex-1 bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">
          {isNew ? "Add Product" : "Edit Product"}
        </h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Product Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Image URL</label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => updateField("image", e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Category</label>
            <select
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Stock</label>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => updateField("stock", e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea
              rows="4"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="lg:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-3 rounded"
            >
              {saving ? "Saving..." : "Save Product"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="border px-6 py-3 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
