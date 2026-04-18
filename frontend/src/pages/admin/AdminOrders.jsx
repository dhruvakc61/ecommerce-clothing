import { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import useFetch from "../../hooks/useFetch";
import api from "../../api/axios";
import formatCurrency from "../../utils/formatCurrency";
import getOrderReference from "../../utils/orderReference";

const statusOptions = ["Pending", "Processing", "Shipped", "Delivered"];

function DetailRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "8px 0", borderBottom: "1px solid #f1f1f1" }}>
      <span style={{ fontSize: 12, color: "#777", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.6 }}>{label}</span>
      <span style={{ fontSize: 13, color: "#222", textAlign: "right" }}>{value || "N/A"}</span>
    </div>
  );
}

export default function AdminOrders() {
  const [openOrderId, setOpenOrderId] = useState(null);
  const { data: orders, loading, error, refetch } = useFetch("/api/orders");

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/api/orders/${orderId}`, { status });
      refetch();
    } catch (err) {
      window.alert(err.response?.data?.message || "Failed to update status.");
    }
  };

  return (
    <div className="flex gap-6">
      <AdminSidebar />

      <div className="flex-1 bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>
        {loading && <p>Loading orders...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && (!orders || orders.length === 0) && <p>No orders found.</p>}

        {orders && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="border rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 bg-gray-50 border-b">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Order</p>
                    <h2 className="text-lg font-semibold text-gray-900">{getOrderReference(order)}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : "No date available"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Customer</p>
                      <p className="text-sm font-medium text-gray-900">{order.shippingAddress?.fullName || order.user?.name || "N/A"}</p>
                      <p className="text-sm text-gray-500">{order.shippingAddress?.email || order.user?.email || "N/A"}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Total</p>
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(order.total || 0)}</p>
                    </div>

                    <select
                      className="border px-3 py-2 rounded-md bg-white"
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
                      className="border px-4 py-2 rounded-md bg-white text-sm font-medium text-gray-800"
                    >
                      {openOrderId === order._id ? "Hide Details" : "View Details"}
                    </button>
                  </div>
                </div>

                {openOrderId === order._id && (
                  <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-700 mb-4">Products</h3>
                      <div className="space-y-4">
                        {(order.items || []).map((item, index) => {
                          const productId = item._id || item.id || "N/A";
                          const unitPrice = Number(item.price || 0);
                          const qty = Number(item.qty || 0);
                          return (
                            <div key={`${order._id}-${productId}-${index}`} className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex items-start gap-4">
                                <div className="w-20 h-20 rounded-lg overflow-hidden bg-white border flex items-center justify-center flex-shrink-0">
                                  {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-xs text-gray-400">No image</span>
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className="text-base font-semibold text-gray-900 mb-2">{item.name || "Unnamed Product"}</p>
                                  <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
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
                    </div>

                    <div className="space-y-6">
                      <div className="border rounded-lg p-4">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-700 mb-4">Checkout Details</h3>
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

                      <div className="border rounded-lg p-4">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-700 mb-4">Pricing</h3>
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
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
