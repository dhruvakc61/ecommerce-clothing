import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminPageShell from "../../components/admin/AdminPageShell";
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
  const { data: product } = useFetch(isNew ? null : `/api/products/${id}`, !isNew);
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
        await api.post("/api/products", {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        });
      } else {
        await api.put(`/api/products/${id}`, {
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
    <AdminPageShell
      eyebrow={isNew ? "Create" : "Update"}
      title={isNew ? "Add Product" : "Edit Product"}
      description="The editor now uses the same responsive admin shell, so creating or updating inventory stays comfortable on smaller screens too."
      actions={
        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          className="inline-flex items-center justify-center rounded-full border border-[#d8b18a] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]"
        >
          Back to Products
        </button>
      }
    >
      <div className="rounded-[26px] border border-[#eadfd2] bg-[#fffdf9] p-5 shadow-[0_16px_38px_rgba(36,28,23,0.04)] sm:p-6">
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <form onSubmit={handleSave} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold">Product Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full rounded-2xl border border-[#e7dacc] bg-white px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              className="w-full rounded-2xl border border-[#e7dacc] bg-white px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Image URL</label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => updateField("image", e.target.value)}
              className="w-full rounded-2xl border border-[#e7dacc] bg-white px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Category</label>
            <select
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="w-full rounded-2xl border border-[#e7dacc] bg-white px-4 py-3"
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Stock</label>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => updateField("stock", e.target.value)}
              className="w-full rounded-2xl border border-[#e7dacc] bg-white px-4 py-3"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-semibold">Description</label>
            <textarea
              rows="4"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="w-full rounded-2xl border border-[#e7dacc] bg-white px-4 py-3"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[var(--theme-accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_12px_24px_rgba(176,122,79,0.2)]"
            >
              {saving ? "Saving..." : "Save Product"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="rounded-full border border-[#d8b18a] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminPageShell>
  );
}
