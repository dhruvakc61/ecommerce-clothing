import { Link } from "react-router-dom";
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

export default function Profile() {
  const { user } = useAuth();
  const { data: orders, loading, error } = useFetch("/orders/my");

  if (!user) return null;

  const safeOrders = Array.isArray(orders) ? orders : [];
  const activeOrders = safeOrders.filter(
    (order) => String(order.status || "").toLowerCase() !== "delivered"
  ).length;
  const totalSpent = safeOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );
  const latestOrder = safeOrders[0];

  return (
    <>
      <style>{`
        .profile-page {
          display: grid;
          gap: 28px;
          padding-bottom: 24px;
         
        }
        .profile-hero {
          position: relative;
          overflow: hidden;
          border-radius: 34px;
          border: 1px solid rgba(176, 122, 79, 0.18);
          background:
            radial-gradient(circle at top right, rgba(216, 177, 138, 0.28), transparent 34%),
            linear-gradient(135deg, rgba(255, 253, 249, 0.98) 0%, rgba(235, 225, 212, 0.92) 100%);
          box-shadow: 0 36px 70px rgba(36, 28, 23, 0.1);
        }
        .profile-hero::after {
          content: "";
          position: absolute;
          width: 220px;
          height: 220px;
          right: -40px;
          bottom: -70px;
          border-radius: 999px;
          background: rgba(176, 122, 79, 0.08);
        }
        .profile-hero-inner {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.9fr);
          gap: 24px;
          padding: clamp(24px, 4vw, 40px);
        }
        .profile-kicker {
          margin: 0 0 10px;
          font-size: 11px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--theme-accent);
          font-weight: 700;
        }
        .profile-title {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 5vw, 4.6rem);
          line-height: 0.92;
          color: var(--theme-ink);
          max-width: 9ch;
        }
        .profile-copy {
          margin: 16px 0 0;
          max-width: 560px;
          color: var(--theme-text);
          line-height: 1.8;
          font-size: 15px;
        }
        .profile-actions {
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
          padding: 0 22px;
          border-radius: 999px;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-size: 11px;
          font-weight: 700;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .profile-btn-primary {
          background: var(--theme-accent);
          color: var(--theme-surface);
          box-shadow: 0 18px 28px rgba(176, 122, 79, 0.22);
        }
        .profile-btn-secondary {
          border: 1px solid rgba(36, 28, 23, 0.14);
          color: var(--theme-ink);
          background: rgba(255, 253, 249, 0.72);
        }
        .profile-btn:hover {
          transform: translateY(-2px);
        }
        .profile-side {
          display: grid;
          gap: 16px;
          align-content: start;
        }
        .profile-card {
          background: rgba(255, 253, 249, 0.92);
          border: 1px solid rgba(176, 122, 79, 0.14);
          border-radius: 26px;
          padding: 22px;
          backdrop-filter: blur(10px);
        }
        .profile-identity {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 16px;
          align-items: center;
        }
        .profile-avatar {
          width: 72px;
          height: 72px;
          border-radius: 22px;
          background: linear-gradient(135deg, var(--theme-accent) 0%, var(--theme-accent-soft) 100%);
          color: var(--theme-surface);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 700;
          box-shadow: 0 16px 34px rgba(176, 122, 79, 0.24);
        }
        .profile-name {
          margin: 0;
          font-family: var(--font-display);
          font-size: 2rem;
          color: var(--theme-ink);
          line-height: 1;
        }
        .profile-email {
          margin: 8px 0 0;
          color: var(--theme-text);
          font-size: 14px;
        }
        .profile-badge {
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
        .profile-card-title {
          margin: 0 0 14px;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--theme-muted);
          font-weight: 700;
        }
        .profile-detail-list,
        .profile-status-list {
          display: grid;
          gap: 12px;
        }
        .profile-detail-row,
        .profile-status-row {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: center;
          color: var(--theme-text);
          font-size: 14px;
        }
        .profile-detail-row strong,
        .profile-status-row strong {
          color: var(--theme-ink);
          font-weight: 600;
        }
        .profile-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }
        .profile-stat {
          padding: 22px;
          border-radius: 24px;
          background: rgba(255, 253, 249, 0.86);
          border: 1px solid rgba(176, 122, 79, 0.14);
          box-shadow: 0 20px 34px rgba(36, 28, 23, 0.05);
        }
        .profile-stat-label {
          margin: 0 0 10px;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--theme-muted);
          font-weight: 700;
        }
        .profile-stat-value {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(2rem, 3vw, 2.8rem);
          line-height: 1;
          color: var(--theme-ink);
        }
        .profile-stat-copy {
          margin: 10px 0 0;
          color: var(--theme-text);
          line-height: 1.7;
          font-size: 14px;
        }
        @media (max-width: 980px) {
          .profile-hero-inner,
          .profile-stats {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 640px) {
          .profile-page {
            gap: 22px;
          }
          .profile-hero {
            border-radius: 24px;
          }
          .profile-hero-inner {
            padding: 22px;
          }
          .profile-card,
          .profile-stat {
            border-radius: 20px;
            padding: 18px;
          }
          .profile-identity {
            grid-template-columns: 1fr;
          }
          .profile-avatar {
            width: 64px;
            height: 64px;
          }
        }
      `}</style>

      <div className="profile-page">
        <section className="profile-hero">
          <div className="profile-hero-inner">
            <div>
              <p className="profile-kicker">Account Studio</p>
              <h1 className="profile-title">Your Profile, Orders, and Tracking</h1>
              <p className="profile-copy">
                Keep your account details close, revisit previous purchases, and follow each order from confirmation to delivery in one calm, storefront-styled space.
              </p>

              <div className="profile-actions">
                <a href="#profile-orders" className="profile-btn profile-btn-primary">
                  Track Orders
                </a>
                <Link to="/products" className="profile-btn profile-btn-secondary">
                  Continue Shopping
                </Link>
              </div>
            </div>

            <div className="profile-side">
              <div className="profile-card">
                <div className="profile-identity">
                  <div className="profile-avatar">{getInitials(user.name) || "U"}</div>
                  <div>
                    <h2 className="profile-name">{user.name || "Customer"}</h2>
                    <p className="profile-email">{user.email}</p>
                    <span className="profile-badge">
                      {user.isAdmin ? "Admin Account" : "Member Account"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="profile-card">
                <h3 className="profile-card-title">Account Details</h3>
                <div className="profile-detail-list">
                  <div className="profile-detail-row">
                    <span>Name</span>
                    <strong>{user.name}</strong>
                  </div>
                  <div className="profile-detail-row">
                    <span>Email</span>
                    <strong>{user.email}</strong>
                  </div>
                  <div className="profile-detail-row">
                    <span>Orders Placed</span>
                    <strong>{safeOrders.length}</strong>
                  </div>
                </div>
              </div>

              <div className="profile-card">
                <h3 className="profile-card-title">Latest Activity</h3>
                <div className="profile-status-list">
                  <div className="profile-status-row">
                    <span>Most Recent Order</span>
                    <strong>{latestOrder ? `#${getOrderReference(latestOrder)}` : "None yet"}</strong>
                  </div>
                  <div className="profile-status-row">
                    <span>Current Status</span>
                    <strong>{latestOrder?.status || "Ready to shop"}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="profile-stats">
          <article className="profile-stat">
            <p className="profile-stat-label">Lifetime Orders</p>
            <p className="profile-stat-value">{safeOrders.length}</p>
            <p className="profile-stat-copy">Every confirmed purchase stays visible here for quick reference.</p>
          </article>

          <article className="profile-stat">
            <p className="profile-stat-label">Active Tracking</p>
            <p className="profile-stat-value">{activeOrders}</p>
            <p className="profile-stat-copy">Orders that are still being processed, shipped, or nearing delivery.</p>
          </article>

          <article className="profile-stat">
            <p className="profile-stat-label">Total Spent</p>
            <p className="profile-stat-value">{formatCurrency(totalSpent)}</p>
            <p className="profile-stat-copy">A running view of your completed and in-progress purchases.</p>
          </article>
        </section>

        <div id="profile-orders">
          <AccountOrdersPanel
            orders={safeOrders}
            loading={loading}
            error={error}
            title="Orders & Tracking"
            subtitle="Review each order, see what was included, and follow its progress from confirmation to doorstep."
          />
        </div>
      </div>
    </>
  );
}
