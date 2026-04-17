import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useState, useEffect } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import api from "../../api/axios";

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isNew = id === "new";
  const { data: product } = useFetch(!isNew ? `/products/${id}` : null, !isNew);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    if (product) setForm(product);
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isNew) await api.post("/products", form);
    else await api.put(`/products/${id}`, form);

    navigate("/admin/products");
  };

  return (
    <div className="flex gap-6">
      <AdminSidebar />

      <form
        onSubmit={handleSubmit}
        className="flex-1 bg-white p-6 rounded shadow max-w-xl"
      >
        <h1 className="text-xl font-bold mb-6">
          {isNew ? "Add Product" : "Edit Product"}
        </h1>

        <input
          type="text"
          placeholder="Product Name"
          className="w-full border px-3 py-2 rounded mb-3"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="number"
          placeholder="Price"
          className="w-full border px-3 py-2 rounded mb-3"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
          type="text"
          placeholder="Category"
          className="w-full border px-3 py-2 rounded mb-3"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="w-full border px-3 py-2 rounded mb-3"
          rows="4"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="text"
          placeholder="Image URL"
          className="w-full border px-3 py-2 rounded mb-3"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          {isNew ? "Create Product" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}