import { Link } from "react-router-dom";
import AdminPageShell from "../../components/admin/AdminPageShell";
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

  const productList = Array.isArray(products) ? products : [];
  const lowStockCount = productList.filter((product) => Number(product.stock ?? 0) <= 5).length;
  const outOfStockCount = productList.filter((product) => Number(product.stock ?? 0) === 0).length;

  const actionButtonClass =
    "inline-flex items-center justify-center rounded-full bg-[var(--theme-accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_12px_24px_rgba(176,122,79,0.2)] transition hover:bg-[var(--theme-accent-strong)]";

  return (
    <AdminPageShell
      eyebrow="Inventory"
      title="Manage Products"
      description="Keep the catalog clean across desktop and mobile with a table on large screens and easy-to-read stacked cards on small screens."
      actions={
        <Link to="/admin/products/new" className={actionButtonClass}>
          Add Product
        </Link>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[22px] border border-[#eadfd2] bg-[#fffaf3] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-accent)]">Catalog Size</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--theme-ink)]">{productList.length}</p>
        </div>
        <div className="rounded-[22px] border border-[#eadfd2] bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-accent)]">Low Stock</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--theme-ink)]">{lowStockCount}</p>
        </div>
        <div className="rounded-[22px] border border-[#eadfd2] bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-accent)]">Out of Stock</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--theme-ink)]">{outOfStockCount}</p>
        </div>
      </div>

      <div className="mt-6">
        {loading && <p className="text-sm text-[var(--theme-muted)]">Loading products...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && productList.length === 0 && <p className="text-sm text-[var(--theme-muted)]">No products found.</p>}

        {productList.length > 0 ? (
          <>
            <div className="space-y-4 md:hidden">
              {productList.map((product) => (
                <article key={product._id} className="rounded-[24px] border border-[#eadfd2] bg-white p-4 shadow-[0_12px_30px_rgba(36,28,23,0.04)]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-[var(--theme-ink)]">{product.name}</p>
                      <p className="mt-1 text-sm text-[var(--theme-muted)]">{product.category || "Uncategorized"}</p>
                    </div>
                    <span className="rounded-full bg-[#f5ece3] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                      {formatCurrency(product.price || 0)}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-[#faf5ef] px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">Stock</p>
                      <p className="mt-2 text-lg font-semibold text-[var(--theme-ink)]">{product.stock ?? 0}</p>
                    </div>
                    <div className="rounded-2xl bg-[#faf5ef] px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">Status</p>
                      <p className="mt-2 text-lg font-semibold text-[var(--theme-ink)]">
                        {Number(product.stock ?? 0) === 0 ? "Out of stock" : Number(product.stock ?? 0) <= 5 ? "Low stock" : "Healthy"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      to={`/admin/products/${product._id}`}
                      className="inline-flex items-center justify-center rounded-full border border-[#d8b18a] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(product._id)}
                      disabled={busyId === product._id}
                      className="inline-flex items-center justify-center rounded-full border border-[#e9c9c0] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#a64d3b]"
                    >
                      {busyId === product._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden overflow-hidden rounded-[26px] border border-[#eadfd2] md:block">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="bg-[#fbf5ee]">
                    <tr className="text-[11px] uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                      <th className="px-5 py-4 font-semibold">Name</th>
                      <th className="px-5 py-4 font-semibold">Category</th>
                      <th className="px-5 py-4 font-semibold">Price</th>
                      <th className="px-5 py-4 font-semibold">Stock</th>
                      <th className="px-5 py-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1e7dc] bg-white">
                    {productList.map((product) => (
                      <tr key={product._id} className="align-middle">
                        <td className="px-5 py-4 font-medium text-[var(--theme-ink)]">{product.name}</td>
                        <td className="px-5 py-4 text-sm text-[var(--theme-muted)]">{product.category || "Uncategorized"}</td>
                        <td className="px-5 py-4 text-sm text-[var(--theme-ink)]">{formatCurrency(product.price || 0)}</td>
                        <td className="px-5 py-4 text-sm text-[var(--theme-ink)]">{product.stock ?? 0}</td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-3 text-sm">
                            <Link to={`/admin/products/${product._id}`} className="font-semibold text-[var(--theme-accent)] hover:underline">
                              Edit
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(product._id)}
                              disabled={busyId === product._id}
                              className="font-semibold text-[#a64d3b] hover:underline"
                            >
                              {busyId === product._id ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </AdminPageShell>
  );
}
