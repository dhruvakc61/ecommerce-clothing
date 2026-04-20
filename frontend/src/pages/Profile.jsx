import { Link, useNavigate } from "react-router-dom";
import AccountOrdersPanel from "../components/account/AccountOrdersPanel";
import useAuth from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";
import formatCurrency from "../utils/formatCurrency";
import getOrderReference from "../utils/orderReference";

function getInitials(name) {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function formatOrderDate(value) {
  if (!value) return "No recent date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No recent date";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getStatusMessage(status) {
  switch (String(status || "").toLowerCase()) {
    case "processing":
      return "In preparation with the fulfillment team.";
    case "shipped":
      return "On the move and heading to your address.";
    case "delivered":
      return "Completed and safely delivered.";
    default:
      return "Queued and waiting for the next update.";
  }
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { data: orders, loading, error } = useFetch("/orders/my");

  if (!user) return null;

  const safeOrders = Array.isArray(orders) ? orders : [];
  const sortedOrders = [...safeOrders].sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );
  const totalSpent = sortedOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );
  const activeOrders = sortedOrders.filter(
    (order) => String(order.status || "").toLowerCase() !== "delivered"
  ).length;
  const deliveredOrders = sortedOrders.filter(
    (order) => String(order.status || "").toLowerCase() === "delivered"
  ).length;
  const totalItems = sortedOrders.reduce(
    (sum, order) =>
      sum +
      (order.items || []).reduce(
        (itemSum, item) => itemSum + Number(item.qty || 0),
        0
      ),
    0
  );
  const latestOrder = sortedOrders[0];
  const averageOrderValue = sortedOrders.length ? totalSpent / sortedOrders.length : 0;
  const fullName = user.name || "Customer";
  const firstName = fullName.split(" ").filter(Boolean)[0] || fullName;
  const membershipLabel = user.isAdmin
    ? "Admin Control"
    : sortedOrders.length > 2
      ? "Returning Client"
      : "Signature Member";
  const latestReference = latestOrder ? `#${getOrderReference(latestOrder)}` : "No orders yet";
  const latestDestination = latestOrder
    ? [latestOrder.shippingAddress?.city, latestOrder.shippingAddress?.country]
        .filter(Boolean)
        .join(", ") || "Address saved at checkout"
    : "Place your first order to unlock delivery details.";
  const latestStatus = latestOrder?.status || "Ready to shop";
  const activityCopy = error
    ? "We could not load account activity right now."
    : latestOrder
      ? getStatusMessage(latestOrder.status)
      : "Your next order will appear here with live tracking updates.";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <style>{`
        .profile-page {
          display: grid;
          gap: 24px;
          padding-bottom: 24px;
          color: var(--theme-text);
        }
        .profile-stage {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
          gap: 22px;
          padding: clamp(18px, 2vw, 24px);
          border-radius: 34px;
          background:
            radial-gradient(circle at top right, rgba(216, 177, 138, 0.18), transparent 28%),
            linear-gradient(180deg, rgba(255, 253, 249, 0.92) 0%, rgba(239, 232, 223, 0.9) 100%);
          border: 1px solid rgba(176, 122, 79, 0.14);
          box-shadow: 0 28px 60px rgba(36, 28, 23, 0.08);
          overflow: hidden;
        }
        .profile-stage::after {
          content: "";
          position: absolute;
          inset: auto -50px -70px auto;
          width: 220px;
          height: 220px;
          border-radius: 999px;
          background: rgba(176, 122, 79, 0.08);
          pointer-events: none;
        }
        .profile-signature {
          position: relative;
          z-index: 1;
          overflow: hidden;
          border-radius: 30px;
          padding: clamp(24px, 4vw, 40px);
          min-height: 520px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background:
            linear-gradient(145deg, rgba(21, 17, 14, 0.97) 0%, rgba(35, 28, 24, 0.92) 55%, rgba(68, 50, 39, 0.88) 100%);
          color: var(--theme-surface);
          box-shadow: 0 28px 58px rgba(36, 28, 23, 0.2);
        }
        .profile-signature::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at top left, rgba(216, 177, 138, 0.18), transparent 28%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 34%);
          pointer-events: none;
        }
        .profile-signature-top,
        .profile-signature-bottom {
          position: relative;
          z-index: 1;
        }
        .profile-kicker {
          margin: 0 0 14px;
          font-size: 11px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: rgba(255, 247, 238, 0.72);
          font-weight: 700;
        }
        .profile-headline {
          margin: 0;
          max-width: 8ch;
          font-family: var(--font-display);
          font-size: clamp(3rem, 6vw, 5.4rem);
          line-height: 0.9;
          color: var(--theme-surface);
        }
        .profile-copy {
          margin: 18px 0 0;
          max-width: 520px;
          color: rgba(255, 247, 238, 0.78);
          font-size: 15px;
          line-height: 1.9;
        }
        .profile-action-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 28px;
        }
        .profile-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 0 20px;
          border: none;
          border-radius: 999px;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .profile-btn:hover {
          transform: translateY(-2px);
        }
        .profile-btn-primary {
          background: var(--theme-accent);
          color: var(--theme-surface);
          box-shadow: 0 18px 28px rgba(176, 122, 79, 0.3);
        }
        .profile-btn-secondary {
          background: rgba(255, 253, 249, 0.1);
          color: var(--theme-surface);
          border: 1px solid rgba(255, 247, 238, 0.18);
          backdrop-filter: blur(8px);
        }
        .profile-btn-tertiary {
          background: transparent;
          color: rgba(255, 247, 238, 0.7);
          border: 1px solid rgba(255, 247, 238, 0.14);
        }
        .profile-mini-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }
        .profile-mini-card {
          padding: 16px;
          border-radius: 22px;
          background: rgba(255, 253, 249, 0.08);
          border: 1px solid rgba(255, 247, 238, 0.12);
          backdrop-filter: blur(10px);
        }
        .profile-mini-label {
          display: block;
          margin-bottom: 8px;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255, 247, 238, 0.58);
          font-weight: 700;
        }
        .profile-mini-value {
          margin: 0;
          color: var(--theme-surface);
          font-size: 15px;
          line-height: 1.6;
          font-weight: 500;
        }
        .profile-overview {
          position: relative;
          z-index: 1;
          display: grid;
          gap: 18px;
          align-content: start;
        }
        .profile-overview-shell {
          padding: clamp(22px, 3vw, 30px);
          border-radius: 30px;
          background: rgba(255, 253, 249, 0.9);
          border: 1px solid rgba(176, 122, 79, 0.14);
          box-shadow: 0 24px 46px rgba(36, 28, 23, 0.08);
        }
        .profile-overview-kicker {
          margin: 0 0 10px;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--theme-accent);
          font-weight: 700;
        }
        .profile-overview-title {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3.4rem);
          line-height: 0.95;
          color: var(--theme-ink);
          max-width: 10ch;
        }
        .profile-overview-copy {
          margin: 14px 0 0;
          color: var(--theme-text);
          line-height: 1.85;
          font-size: 14px;
          max-width: 42ch;
        }
        .profile-overview-grid {
          display: grid;
          gap: 14px;
          margin-top: 22px;
        }
        .profile-focus-card {
          padding: 18px 18px 20px;
          border-radius: 24px;
          border: 1px solid rgba(176, 122, 79, 0.12);
          background: rgba(246, 241, 234, 0.9);
        }
        .profile-focus-card.is-accent {
          background:
            linear-gradient(135deg, rgba(176, 122, 79, 0.14) 0%, rgba(216, 177, 138, 0.18) 100%),
            rgba(255, 253, 249, 0.92);
        }
        .profile-focus-label {
          display: block;
          margin-bottom: 8px;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--theme-muted);
          font-weight: 700;
        }
        .profile-focus-value {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(1.65rem, 3vw, 2.4rem);
          line-height: 1;
          color: var(--theme-ink);
        }
        .profile-focus-copy {
          margin: 10px 0 0;
          color: var(--theme-text);
          line-height: 1.75;
          font-size: 14px;
        }
        .profile-identity-row {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 14px;
          align-items: center;
          margin-bottom: 18px;
        }
        .profile-avatar {
          width: 72px;
          height: 72px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--theme-accent) 0%, var(--theme-accent-soft) 100%);
          color: var(--theme-surface);
          font-family: var(--font-display);
          font-size: 26px;
          font-weight: 700;
          box-shadow: 0 16px 34px rgba(176, 122, 79, 0.24);
        }
        .profile-name {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(2rem, 3vw, 2.8rem);
          line-height: 0.95;
          color: var(--theme-ink);
        }
        .profile-email {
          margin: 8px 0 0;
          color: var(--theme-text);
          font-size: 14px;
          word-break: break-word;
        }
        .profile-chip {
          display: inline-flex;
          margin-top: 12px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(176, 122, 79, 0.12);
          color: var(--theme-accent-strong);
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 700;
        }
        .profile-metrics {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }
        .profile-metric {
          padding: 20px;
          border-radius: 26px;
          background: rgba(255, 253, 249, 0.9);
          border: 1px solid rgba(176, 122, 79, 0.12);
          box-shadow: 0 18px 34px rgba(36, 28, 23, 0.06);
        }
        .profile-metric-label {
          margin: 0 0 10px;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--theme-muted);
          font-weight: 700;
        }
        .profile-metric-value {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(2rem, 3vw, 2.7rem);
          line-height: 1;
          color: var(--theme-ink);
        }
        .profile-metric-copy {
          margin: 10px 0 0;
          color: var(--theme-text);
          font-size: 14px;
          line-height: 1.75;
        }
        .profile-detail-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) repeat(2, minmax(0, 0.95fr));
          gap: 16px;
        }
        .profile-panel {
          padding: 22px;
          border-radius: 28px;
          background: rgba(255, 253, 249, 0.9);
          border: 1px solid rgba(176, 122, 79, 0.12);
          box-shadow: 0 20px 40px rgba(36, 28, 23, 0.06);
        }
        .profile-panel-dark {
          background:
            linear-gradient(180deg, rgba(31, 24, 20, 0.97) 0%, rgba(47, 37, 31, 0.94) 100%);
          color: rgba(255, 247, 238, 0.82);
          border-color: rgba(176, 122, 79, 0.18);
        }
        .profile-panel-kicker {
          margin: 0 0 8px;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--theme-accent);
          font-weight: 700;
        }
        .profile-panel-dark .profile-panel-kicker {
          color: rgba(216, 177, 138, 0.88);
        }
        .profile-panel-title {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(1.75rem, 3vw, 2.4rem);
          line-height: 0.95;
          color: var(--theme-ink);
        }
        .profile-panel-dark .profile-panel-title {
          color: var(--theme-surface);
        }
        .profile-panel-copy {
          margin: 12px 0 0;
          font-size: 14px;
          line-height: 1.8;
        }
        .profile-detail-list {
          display: grid;
          gap: 14px;
          margin-top: 20px;
        }
        .profile-detail-row {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: start;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(176, 122, 79, 0.12);
          font-size: 14px;
        }
        .profile-detail-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .profile-detail-row span {
          color: var(--theme-muted);
        }
        .profile-detail-row strong {
          color: var(--theme-ink);
          text-align: right;
          font-weight: 600;
        }
        .profile-shortcut-list {
          display: grid;
          gap: 12px;
          margin-top: 22px;
        }
        .profile-shortcut {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: center;
          padding: 16px 18px;
          border-radius: 20px;
          text-decoration: none;
          background: rgba(255, 253, 249, 0.08);
          border: 1px solid rgba(255, 247, 238, 0.1);
          color: var(--theme-surface);
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .profile-shortcut:hover {
          transform: translateY(-2px);
          background: rgba(255, 253, 249, 0.12);
        }
        .profile-shortcut strong {
          display: block;
          margin-bottom: 4px;
          font-size: 14px;
          color: var(--theme-surface);
        }
        .profile-shortcut span {
          font-size: 13px;
          color: rgba(255, 247, 238, 0.68);
          line-height: 1.6;
        }
        .profile-delivery-block {
          margin-top: 20px;
          padding: 18px;
          border-radius: 20px;
          background: rgba(246, 241, 234, 0.88);
          border: 1px solid rgba(176, 122, 79, 0.12);
        }
        .profile-delivery-block strong {
          display: block;
          margin-bottom: 10px;
          color: var(--theme-ink);
          font-size: 15px;
        }
        .profile-delivery-block p {
          margin: 0;
          color: var(--theme-text);
          font-size: 14px;
          line-height: 1.75;
        }
        @media (max-width: 1080px) {
          .profile-stage,
          .profile-detail-grid,
          .profile-metrics {
            grid-template-columns: 1fr;
          }
          .profile-signature {
            min-height: auto;
          }
        }
        @media (max-width: 720px) {
          .profile-page {
            gap: 18px;
          }
          .profile-stage,
          .profile-signature,
          .profile-overview-shell,
          .profile-panel,
          .profile-metric {
            border-radius: 24px;
          }
          .profile-stage {
            padding: 14px;
          }
          .profile-signature,
          .profile-overview-shell,
          .profile-panel {
            padding: 20px;
          }
          .profile-headline,
          .profile-overview-title {
            max-width: none;
          }
          .profile-mini-grid {
            grid-template-columns: 1fr;
          }
          .profile-identity-row {
            grid-template-columns: 1fr;
          }
          .profile-detail-row {
            flex-direction: column;
          }
          .profile-detail-row strong {
            text-align: left;
          }
          .profile-action-row {
            flex-direction: column;
          }
          .profile-btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="profile-page">
        <section className="profile-stage">
          <div className="profile-signature">
            <div className="profile-signature-top">
              <p className="profile-kicker">Account Studio</p>
              <h1 className="profile-headline">Welcome back, {firstName}.</h1>
              <p className="profile-copy">
                Your Baya account now feels less like a plain settings page and more
                like a personal client room. Check current order movement, revisit
                recent deliveries, and move back into the store from one cleaner
                place.
              </p>

              <div className="profile-action-row">
                <a href="#profile-orders" className="profile-btn profile-btn-primary">
                  Track Orders
                </a>
                <Link to="/products" className="profile-btn profile-btn-secondary">
                  Continue Shopping
                </Link>
                <button
                  type="button"
                  className="profile-btn profile-btn-tertiary"
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </div>
            </div>

            <div className="profile-signature-bottom">
              <div className="profile-mini-grid">
                <div className="profile-mini-card">
                  <span className="profile-mini-label">Membership</span>
                  <p className="profile-mini-value">{membershipLabel}</p>
                </div>
                <div className="profile-mini-card">
                  <span className="profile-mini-label">Latest Reference</span>
                  <p className="profile-mini-value">{latestReference}</p>
                </div>
                <div className="profile-mini-card">
                  <span className="profile-mini-label">Contact</span>
                  <p className="profile-mini-value">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-overview">
            <div className="profile-overview-shell">
              <div className="profile-identity-row">
                <div className="profile-avatar">{getInitials(fullName) || "U"}</div>
                <div>
                  <h2 className="profile-name">{fullName}</h2>
                  <p className="profile-email">{user.email}</p>
                  <span className="profile-chip">
                    {user.isAdmin ? "Admin Account" : "Customer Account"}
                  </span>
                </div>
              </div>

              <p className="profile-overview-kicker">Account Pulse</p>
              <h3 className="profile-overview-title">A clearer view of what is moving.</h3>
              <p className="profile-overview-copy">
                The profile is now organized around your real activity: what you
                ordered most recently, where it is heading, and how your shopping
                history is building over time.
              </p>

              <div className="profile-overview-grid">
                <article className="profile-focus-card is-accent">
                  <span className="profile-focus-label">Latest Order</span>
                  <p className="profile-focus-value">{latestReference}</p>
                  <p className="profile-focus-copy">
                    {latestOrder
                      ? `${latestStatus} • ${formatOrderDate(latestOrder.createdAt)}`
                      : "No order has been placed yet."}
                  </p>
                </article>

                <article className="profile-focus-card">
                  <span className="profile-focus-label">Delivery Focus</span>
                  <p className="profile-focus-value">{latestDestination}</p>
                  <p className="profile-focus-copy">{activityCopy}</p>
                </article>

                <article className="profile-focus-card">
                  <span className="profile-focus-label">Average Basket</span>
                  <p className="profile-focus-value">
                    {loading ? "..." : formatCurrency(averageOrderValue)}
                  </p>
                  <p className="profile-focus-copy">
                    A quick read on how each order is stacking up across your account.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="profile-metrics" aria-label="Profile metrics">
          <article className="profile-metric">
            <p className="profile-metric-label">Orders Placed</p>
            <p className="profile-metric-value">{loading ? "..." : sortedOrders.length}</p>
            <p className="profile-metric-copy">
              Every purchase stays visible here for a more reliable account history.
            </p>
          </article>

          <article className="profile-metric">
            <p className="profile-metric-label">In Motion</p>
            <p className="profile-metric-value">{loading ? "..." : activeOrders}</p>
            <p className="profile-metric-copy">
              Orders still being processed, packed, shipped, or closing in on delivery.
            </p>
          </article>

          <article className="profile-metric">
            <p className="profile-metric-label">Pieces Ordered</p>
            <p className="profile-metric-value">{loading ? "..." : totalItems}</p>
            <p className="profile-metric-copy">
              A running count of items purchased across all recorded orders.
            </p>
          </article>

          <article className="profile-metric">
            <p className="profile-metric-label">Lifetime Spend</p>
            <p className="profile-metric-value">
              {loading ? "..." : formatCurrency(totalSpent)}
            </p>
            <p className="profile-metric-copy">
              The combined value of your order history, from first checkout onward.
            </p>
          </article>
        </section>

        <section className="profile-detail-grid">
          <article className="profile-panel">
            <p className="profile-panel-kicker">Account Details</p>
            <h3 className="profile-panel-title">Your profile essentials.</h3>
            <p className="profile-panel-copy">
              The most important account information is grouped here so it is easy to
              scan without digging through the order list first.
            </p>

            <div className="profile-detail-list">
              <div className="profile-detail-row">
                <span>Full Name</span>
                <strong>{fullName}</strong>
              </div>
              <div className="profile-detail-row">
                <span>Email</span>
                <strong>{user.email}</strong>
              </div>
              <div className="profile-detail-row">
                <span>Account Type</span>
                <strong>{user.isAdmin ? "Administrator" : membershipLabel}</strong>
              </div>
              <div className="profile-detail-row">
                <span>Delivered Orders</span>
                <strong>{loading ? "..." : deliveredOrders}</strong>
              </div>
              <div className="profile-detail-row">
                <span>Current Activity</span>
                <strong>{latestStatus}</strong>
              </div>
            </div>
          </article>

          <article className="profile-panel profile-panel-dark">
            <p className="profile-panel-kicker">Shopping Shortcuts</p>
            <h3 className="profile-panel-title">Move through the store faster.</h3>
            <p className="profile-panel-copy">
              Jump directly into the next step, whether that is browsing new pieces,
              checking your tracked orders, or managing the store if you are an admin.
            </p>

            <div className="profile-shortcut-list">
              <a href="#profile-orders" className="profile-shortcut">
                <div>
                  <strong>Open tracked orders</strong>
                  <span>Review live order progress and purchase details.</span>
                </div>
                <span>View</span>
              </a>
              <Link to="/products" className="profile-shortcut">
                <div>
                  <strong>Browse the collection</strong>
                  <span>Step back into the storefront and keep shopping.</span>
                </div>
                <span>Shop</span>
              </Link>
              {user.isAdmin ? (
                <Link to="/admin" className="profile-shortcut">
                  <div>
                    <strong>Open admin dashboard</strong>
                    <span>Manage catalog, orders, and store activity.</span>
                  </div>
                  <span>Admin</span>
                </Link>
              ) : (
                <Link to="/orders" className="profile-shortcut">
                  <div>
                    <strong>Visit orders page</strong>
                    <span>See your purchase history in a dedicated route.</span>
                  </div>
                  <span>Orders</span>
                </Link>
              )}
            </div>
          </article>

          <article className="profile-panel">
            <p className="profile-panel-kicker">Delivery Snapshot</p>
            <h3 className="profile-panel-title">Recent shipping profile.</h3>
            <p className="profile-panel-copy">
              Pulling the latest checkout details forward makes the account feel more
              useful, especially when you want to confirm where your most recent order
              is headed.
            </p>

            <div className="profile-delivery-block">
              <strong>
                {latestOrder?.shippingAddress?.fullName || fullName}
              </strong>
              <p>
                {latestOrder?.shippingAddress?.address || "Your saved delivery address will appear after checkout."}
              </p>
              <p>
                {latestOrder
                  ? [
                      latestOrder.shippingAddress?.city,
                      latestOrder.shippingAddress?.state,
                      latestOrder.shippingAddress?.postalCode,
                      latestOrder.shippingAddress?.country,
                    ]
                      .filter(Boolean)
                      .join(", ")
                  : "Your city, region, and country will show here once an order is placed."}
              </p>
              <p>
                {latestOrder?.payment?.brand
                  ? `${latestOrder.payment.brand} ending in ${latestOrder.payment.last4 || "----"}`
                  : latestOrder?.payment?.method || "Payment method details appear here with your first order."}
              </p>
            </div>
          </article>
        </section>

        <div id="profile-orders">
          <AccountOrdersPanel
            orders={sortedOrders}
            loading={loading}
            error={error}
            title="Orders & Tracking"
            subtitle="Review each purchase, inspect what was included, and follow every order from confirmation through delivery in a more polished account flow."
          />
        </div>
      </div>
    </>
  );
}
