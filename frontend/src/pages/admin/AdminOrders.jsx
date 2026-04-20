import { useState } from "react";
import AdminPageShell from "../../components/admin/AdminPageShell";
import useFetch from "../../hooks/useFetch";
import api from "../../api/axios";
import formatCurrency from "../../utils/formatCurrency";
import getOrderReference from "../../utils/orderReference";

const statusOptions = ["Pending", "Processing", "Shipped", "Delivered"];

function DetailRow({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: "10px 0",
        borderBottom: "1px solid #f1f1f1",
      }}
      className="sm:flex-row sm:items-center sm:justify-between"
    >
      <span style={{ fontSize: 12, color: "#777", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.6 }}>
        {label}
      </span>
      <span style={{ fontSize: 13, color: "#222", textAlign: "left", wordBreak: "break-word" }} className="sm:text-right">
        {value || "N/A"}
      </span>
    </div>
  );
}

function getStatusClasses(status) {
  const normalized = String(status || "Pending").toLowerCase();

  if (normalized === "delivered") return "bg-green-50 text-green-700";
  if (normalized === "shipped") return "bg-sky-50 text-sky-700";
  if (normalized === "processing") return "bg-amber-50 text-amber-700";
  return "bg-stone-100 text-stone-700";
}

export default function AdminOrders() {
  const [openOrderId, setOpenOrderId] = useState(null);
  const { data: orders, loading, error, refetch } = useFetch("/api/orders");
  const orderList = Array.isArray(orders) ? orders : [];
  const totalRevenue = orderList.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const pendingCount = orderList.filter((order) => (order.status || "Pending") === "Pending").length;
  const activeCount = orderList.filter((order) => {
    const status = String(order.status || "Pending").toLowerCase();
    return status !== "delivered";
  }).length;

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/api/orders/${orderId}`, { status });
      refetch();
    } catch (err) {
      window.alert(err.response?.data?.message || "Failed to update status.");
    }
  };

  return (
    <AdminPageShell
      eyebrow="Fulfilment"
      title="Manage Orders"
      description="Order details now expand cleanly on mobile, with stacked metadata, safer wrapping, and clearer status controls."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[22px] border border-[#eadfd2] bg-[#fffaf3] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-accent)]">Total Orders</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--theme-ink)]">{orderList.length}</p>
        </div>
        <div className="rounded-[22px] border border-[#eadfd2] bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-accent)]">Pending Now</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--theme-ink)]">{pendingCount}</p>
        </div>
        <div className="rounded-[22px] border border-[#eadfd2] bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-accent)]">Revenue</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--theme-ink)]">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>

      <div className="mt-6">
        {loading && <p className="text-sm text-[var(--theme-muted)]">Loading orders...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && orderList.length === 0 && <p className="text-sm text-[var(--theme-muted)]">No orders found.</p>}

        {orderList.length > 0 && (
          <div className="space-y-6">
            {orderList.map((order) => (
              <div key={order._id} className="overflow-hidden rounded-[26px] border border-[#eadfd2] bg-white shadow-[0_16px_40px_rgba(36,28,23,0.05)]">
                <div className="flex flex-col gap-5 border-b border-[#f1e7dc] bg-[#fbf5ee] px-5 py-5 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--theme-accent)]">Order</p>
                    <h2 className="text-lg font-semibold text-[var(--theme-ink)]">{getOrderReference(order)}</h2>
                    <p className="mt-1 text-sm text-[var(--theme-muted)]">
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : "No date available"}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:flex xl:items-center">
                    <div className="xl:text-right">
                      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--theme-accent)]">Customer</p>
                      <p className="text-sm font-medium text-[var(--theme-ink)]">{order.shippingAddress?.fullName || order.user?.name || "N/A"}</p>
                      <p className="break-all text-sm text-[var(--theme-muted)]">{order.shippingAddress?.email || order.user?.email || "N/A"}</p>
                    </div>

                    <div className="xl:text-right">
                      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--theme-accent)]">Total</p>
                      <p className="text-lg font-semibold text-[var(--theme-ink)]">{formatCurrency(order.total || 0)}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--theme-muted)]">
                        {activeCount} active in fulfilment
                      </p>
                    </div>

                    <select
                      className="rounded-full border border-[#e7dacc] bg-white px-4 py-2 text-sm text-[var(--theme-ink)]"
                      value={order.status || "Pending"}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => setOpenOrderId((prev) => (prev === order._id ? null : order._id))}
                      className="rounded-full border border-[#d8b18a] bg-white px-4 py-2 text-sm font-medium text-[var(--theme-accent)]"
                    >
                      {openOrderId === order._id ? "Hide Details" : "View Details"}
                    </button>
                  </div>
                </div>

                {openOrderId === order._id && (
                  <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-6">
                      <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">Products</h3>
                      <div className="space-y-4">
                        {(order.items || []).map((item, index) => {
                          const productId = item._id || item.id || "N/A";
                          const unitPrice = Number(item.price || 0);
                          const qty = Number(item.qty || 0);
                          return (
                            <div key={`${order._id}-${productId}-${index}`} className="rounded-[22px] border border-[#efe4d8] bg-[#fffdf9] p-4">
                              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white">
                                  {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-xs text-gray-400">No image</span>
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className="mb-2 text-base font-semibold text-[var(--theme-ink)]">{item.name || "Unnamed Product"}</p>
                                  <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
                                    <DetailRow label="Product ID" value={productId} />
                                    <DetailRow label="Category" value={item.category} />
                                    <DetailRow label="Size" value={item.size} />
                                    <DetailRow label="Color" value={item.color} />
                                    <DetailRow label="Quantity" value={qty ? String(qty) : "N/A"} />
                                    <DetailRow label="Unit Price" value={formatCurrency(unitPrice)} />
                                    <DetailRow label="Line Total" value={formatCurrency(unitPrice * qty)} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="rounded-[22px] border border-[#efe4d8] p-4">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">Pricing</h3>
                          <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${getStatusClasses(order.status)}`}>
                            {order.status || "Pending"}
                          </span>
                        </div>
                        <DetailRow label="Subtotal" value={formatCurrency(order.subtotal || 0)} />
                        <DetailRow label="Shipping" value={formatCurrency(order.shipping || 0)} />
                        <DetailRow label="Promo Code" value={order.promoCode} />
                        <DetailRow label="Discount" value={formatCurrency(order.discount || 0)} />
                        <DetailRow label="Payment Method" value={order.payment?.method} />
                        <DetailRow label="Payment Status" value={order.payment?.status} />
                        <DetailRow label="Card Brand" value={order.payment?.brand} />
                        <DetailRow label="Card Last 4" value={order.payment?.last4} />
                        <DetailRow label="Grand Total" value={formatCurrency(order.total || 0)} />
                      </div>
                    </div>

                    <div>
                      <div className="rounded-[22px] border border-[#efe4d8] p-4">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">Checkout Details</h3>
                        <DetailRow label="Full Name" value={order.shippingAddress?.fullName} />
                        <DetailRow label="Email" value={order.shippingAddress?.email || order.user?.email} />
                        <DetailRow label="Phone" value={order.shippingAddress?.phone} />
                        <DetailRow label="Address" value={order.shippingAddress?.address} />
                        <DetailRow label="Apartment" value={order.shippingAddress?.apartment} />
                        <DetailRow label="City" value={order.shippingAddress?.city} />
                        <DetailRow label="State" value={order.shippingAddress?.state} />
                        <DetailRow label="Postal Code" value={order.shippingAddress?.postalCode} />
                        <DetailRow label="Country" value={order.shippingAddress?.country} />
                        <DetailRow label="Order Notes" value={order.shippingAddress?.notes} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminPageShell>
  );
}
