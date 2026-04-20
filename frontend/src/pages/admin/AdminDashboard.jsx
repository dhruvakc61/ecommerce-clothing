import { Link } from "react-router-dom";
import AdminPageShell from "../../components/admin/AdminPageShell";
import StatsCard from "../../components/admin/StatsCard";
import useFetch from "../../hooks/useFetch";
import formatCurrency from "../../utils/formatCurrency";
import getOrderReference from "../../utils/orderReference";

function DashboardList({ title, eyebrow, emptyText, children }) {
  return (
    <section className="rounded-[26px] border border-[#eadfd2] bg-[#fffdf9] p-5 shadow-[0_16px_38px_rgba(36,28,23,0.04)] sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--theme-accent)]">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-[var(--font-display)] text-3xl leading-none text-[var(--theme-ink)]">
        {title}
      </h2>
      <div className="mt-5">{children || <p className="text-sm text-[var(--theme-muted)]">{emptyText}</p>}</div>
    </section>
  );
}

export default function AdminDashboard() {
  const { data: stats, loading: statsLoading, error: statsError } = useFetch("/api/admin/stats");
  const { data: orders } = useFetch("/api/orders");
  const { data: products } = useFetch("/api/products");
  const { data: users } = useFetch("/api/users");

  const orderList = Array.isArray(orders) ? orders : [];
  const productList = Array.isArray(products) ? products : [];
  const userList = Array.isArray(users) ? users : [];

  const totalRevenue = orderList.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const pendingOrders = orderList.filter((order) => (order.status || "Pending") !== "Delivered").length;
  const lowStockProducts = productList.filter((product) => Number(product.stock ?? 0) <= 5);
  const adminUsers = userList.filter((user) => user.isAdmin).length;

  const recentOrders = [...orderList]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 4);

  const newestUsers = [...userList]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 4);

  const actionButtonClass =
    "inline-flex items-center justify-center rounded-full border border-[#d8b18a] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)] transition hover:bg-[var(--theme-accent)] hover:text-white";

  return (
    <AdminPageShell
      eyebrow="Store Overview"
      title="Admin Dashboard"
      description="A calmer control center for tracking store health, inventory pressure, and fulfilment progress across desktop and mobile."
      actions={
        <>
          <Link to="/admin/products/new" className={actionButtonClass}>
            Add Product
          </Link>
          <Link to="/admin/orders" className={actionButtonClass}>
            Review Orders
          </Link>
        </>
      }
    >
      {statsLoading ? <p className="text-sm text-[var(--theme-muted)]">Loading statistics...</p> : null}
      {statsError ? <p className="text-sm text-red-600">{statsError}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Users"
          value={stats?.users ?? userList.length}
          subtitle={`${adminUsers} admin account${adminUsers === 1 ? "" : "s"} managing the store`}
          tone="blue"
        />
        <StatsCard
          title="Products"
          value={stats?.products ?? productList.length}
          subtitle={`${lowStockProducts.length} item${lowStockProducts.length === 1 ? "" : "s"} need stock attention`}
          tone="green"
        />
        <StatsCard
          title="Orders"
          value={stats?.orders ?? orderList.length}
          subtitle={`${pendingOrders} order${pendingOrders === 1 ? "" : "s"} still in progress`}
          tone="yellow"
        />
        <StatsCard
          title="Revenue"
          value={formatCurrency(totalRevenue)}
          subtitle="Combined total from recorded orders"
          tone="red"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <DashboardList title="Recent Orders" eyebrow="Fulfilment" emptyText="Orders will appear here once customers begin checking out.">
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex flex-col gap-3 rounded-[22px] border border-[#efe4d8] bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--theme-accent)]">
                      {getOrderReference(order)}
                    </p>
                    <p className="mt-2 truncate text-sm font-semibold text-[var(--theme-ink)]">
                      {order.shippingAddress?.fullName || order.user?.name || "Customer"}
                    </p>
                    <p className="mt-1 text-sm text-[var(--theme-muted)]">
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : "No date available"}
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <span className="rounded-full bg-[#f5ece3] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                      {order.status || "Pending"}
                    </span>
                    <strong className="text-base text-[var(--theme-ink)]">{formatCurrency(order.total || 0)}</strong>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </DashboardList>

        <DashboardList title="Inventory Watch" eyebrow="Stock Alerts" emptyText="Low stock products will appear here automatically.">
          {lowStockProducts.length > 0 ? (
            <div className="space-y-4">
              {lowStockProducts.slice(0, 4).map((product) => (
                <div key={product._id} className="rounded-[22px] border border-[#efe4d8] bg-white p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--theme-ink)]">{product.name}</p>
                      <p className="mt-1 text-sm text-[var(--theme-muted)]">
                        {product.category || "Uncategorized"} · {formatCurrency(product.price || 0)}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#2f241d] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                      {product.stock ?? 0} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </DashboardList>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <DashboardList title="Newest Members" eyebrow="Customers" emptyText="New accounts will appear here as customers register.">
          {newestUsers.length > 0 ? (
            <div className="space-y-4">
              {newestUsers.map((user) => (
                <div key={user._id} className="flex items-center justify-between gap-4 rounded-[22px] border border-[#efe4d8] bg-white p-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--theme-ink)]">{user.name}</p>
                    <p className="mt-1 truncate text-sm text-[var(--theme-muted)]">{user.email}</p>
                  </div>
                  <span className="rounded-full bg-[#f6f0e9] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                    {user.isAdmin ? "Admin" : "User"}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </DashboardList>

        <DashboardList title="Quick Actions" eyebrow="Shortcuts" emptyText="">
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              to="/admin/products"
              className="rounded-[22px] border border-[#efe4d8] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(36,28,23,0.08)]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--theme-accent)]">
                Products
              </p>
              <p className="mt-3 font-[var(--font-display)] text-2xl leading-none text-[var(--theme-ink)]">
                Manage Catalog
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--theme-muted)]">
                Add new pieces, update stock, and keep your storefront accurate.
              </p>
            </Link>

            <Link
              to="/admin/users"
              className="rounded-[22px] border border-[#efe4d8] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(36,28,23,0.08)]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--theme-accent)]">
                Users
              </p>
              <p className="mt-3 font-[var(--font-display)] text-2xl leading-none text-[var(--theme-ink)]">
                Review Accounts
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--theme-muted)]">
                Check customer details and keep admin access under control.
              </p>
            </Link>

            <Link
              to="/admin/orders"
              className="rounded-[22px] border border-[#efe4d8] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(36,28,23,0.08)]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--theme-accent)]">
                Orders
              </p>
              <p className="mt-3 font-[var(--font-display)] text-2xl leading-none text-[var(--theme-ink)]">
                Fulfil Orders
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--theme-muted)]">
                Update statuses and inspect every order without losing details on mobile.
              </p>
            </Link>

            <Link
              to="/admin/products/new"
              className="rounded-[22px] border border-[#efe4d8] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(36,28,23,0.08)]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--theme-accent)]">
                Create
              </p>
              <p className="mt-3 font-[var(--font-display)] text-2xl leading-none text-[var(--theme-ink)]">
                Add Inventory
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--theme-muted)]">
                Launch a new product with cleaner inputs and a more focused edit view.
              </p>
            </Link>
          </div>
        </DashboardList>
      </div>
    </AdminPageShell>
  );
}
