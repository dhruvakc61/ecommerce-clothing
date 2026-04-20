import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AccountOrdersPanel from "../components/account/AccountOrdersPanel";
import useAuth from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";
import getOrderReference from "../utils/orderReference";

function getInitials(name) {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function splitName(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "",
  };
}

function InfoField({ label, value, fullWidth = false }) {
  return (
    <div className={fullWidth ? "account-field account-field-full" : "account-field"}>
      <span className="account-field-label">{label}</span>
      <div className="account-field-value">{value || "-"}</div>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { data: orders, loading, error } = useFetch("/orders/my");
  const [activeTab, setActiveTab] = useState("info");

  if (!user) return null;

  const safeOrders = Array.isArray(orders) ? orders : [];
  const sortedOrders = [...safeOrders].sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );
  const latestOrder = sortedOrders[0];
  const { firstName, lastName } = splitName(user.name);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <style>{`
        .account-page {
          display: grid;
          gap: 24px;
          padding-bottom: 24px;
        }
        .account-hero {
          position: relative;
          overflow: hidden;
          border-radius: 28px;
          padding: 46px 20px;
          text-align: center;
          background:
            radial-gradient(circle, rgba(36, 28, 23, 0.08) 0 2px, transparent 3px) top 28px right 90px / 18px 18px no-repeat,
            radial-gradient(circle, rgba(36, 28, 23, 0.08) 0 2px, transparent 3px) bottom 26px left 90px / 18px 18px no-repeat,
            linear-gradient(180deg, rgba(255, 253, 249, 0.98) 0%, rgba(244, 239, 232, 0.96) 100%);
          border: 1px solid rgba(176, 122, 79, 0.12);
        }
        .account-title {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(2.2rem, 4vw, 3.2rem);
          color: var(--theme-ink);
        }
        .account-breadcrumb {
          margin: 10px 0 0;
          font-size: 13px;
          color: var(--theme-muted);
        }
        .account-breadcrumb a {
          text-decoration: none;
        }
        .account-shell {
          display: grid;
          grid-template-columns: 260px minmax(0, 1fr);
          gap: 24px;
          align-items: start;
        }
        .account-sidebar {
          display: grid;
          gap: 12px;
        }
        .account-menu-item {
          width: 100%;
          padding: 18px 20px;
          border: 1px solid rgba(36, 28, 23, 0.08);
          background: #fff;
          color: var(--theme-ink);
          font-size: 15px;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
          border-radius: 0;
          transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }
        .account-menu-item.is-active {
          background: #f6c35f;
          border-color: #f6c35f;
        }
        .account-panel {
          background: #fff;
          border: 1px solid rgba(176, 122, 79, 0.12);
          border-radius: 28px;
          padding: clamp(22px, 4vw, 34px);
          box-shadow: 0 22px 44px rgba(36, 28, 23, 0.06);
        }
        .account-profile-top {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: 26px;
          flex-wrap: wrap;
        }
        .account-avatar {
          width: 104px;
          height: 104px;
          border-radius: 999px;
          background: linear-gradient(135deg, var(--theme-accent-soft) 0%, var(--theme-accent) 100%);
          color: var(--theme-surface);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 700;
        }
        .account-profile-name {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          color: var(--theme-ink);
        }
        .account-profile-meta {
          margin: 8px 0 0;
          font-size: 14px;
          color: var(--theme-muted);
        }
        .account-badge {
          display: inline-flex;
          margin-top: 12px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(176, 122, 79, 0.1);
          color: var(--theme-accent-strong);
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 700;
        }
        .account-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }
        .account-field {
          display: grid;
          gap: 8px;
        }
        .account-field-full {
          grid-column: 1 / -1;
        }
        .account-field-label {
          font-size: 13px;
          color: var(--theme-ink);
          font-weight: 600;
        }
        .account-field-value {
          min-height: 52px;
          display: flex;
          align-items: center;
          padding: 0 16px;
          background: #fff;
          border: 1px solid rgba(36, 28, 23, 0.1);
          color: var(--theme-text);
          font-size: 14px;
        }
        .account-orders-wrap {
          margin-top: 0;
        }
        .account-empty {
          min-height: 240px;
          display: grid;
          place-items: center;
          text-align: center;
          border: 1px dashed rgba(176, 122, 79, 0.2);
          border-radius: 22px;
          color: var(--theme-muted);
          background: rgba(255, 253, 249, 0.7);
          padding: 24px;
        }
        .account-empty h3 {
          margin: 0 0 8px;
          font-family: var(--font-display);
          font-size: 2rem;
          color: var(--theme-ink);
        }
        .account-empty p {
          margin: 0;
          line-height: 1.8;
        }
        @media (max-width: 920px) {
          .account-shell {
            grid-template-columns: 1fr;
          }
          .account-sidebar {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        @media (max-width: 640px) {
          .account-page {
            gap: 18px;
          }
          .account-hero,
          .account-panel {
            border-radius: 22px;
          }
          .account-sidebar {
            grid-template-columns: 1fr;
          }
          .account-grid {
            grid-template-columns: 1fr;
          }
          .account-profile-top {
            align-items: flex-start;
          }
          .account-avatar {
            width: 88px;
            height: 88px;
            font-size: 1.7rem;
          }
        }
      `}</style>

      <div className="account-page">
        <section className="account-hero">
          <h1 className="account-title">My Account</h1>
          <p className="account-breadcrumb">
            <Link to="/">Home</Link> / My Account
          </p>
        </section>

        <section className="account-shell">
          <aside className="account-sidebar" aria-label="Account navigation">
            <button
              type="button"
              className={`account-menu-item ${activeTab === "info" ? "is-active" : ""}`}
              onClick={() => setActiveTab("info")}
            >
              Personal Information
            </button>
            <button
              type="button"
              className={`account-menu-item ${activeTab === "orders" ? "is-active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              My Orders
            </button>
            <button
              type="button"
              className="account-menu-item"
              onClick={handleLogout}
            >
              Logout
            </button>
          </aside>

          <div className="account-panel">
            {activeTab === "info" ? (
              <>
                <div className="account-profile-top">
                  <div className="account-avatar">{getInitials(user.name) || "U"}</div>
                  <div>
                    <h2 className="account-profile-name">{user.name || "Customer"}</h2>
                    <p className="account-profile-meta">{user.email}</p>
                    <span className="account-badge">
                      {user.isAdmin ? "Admin Account" : "Customer Account"}
                    </span>
                  </div>
                </div>

                <div className="account-grid">
                  <InfoField label="First Name" value={firstName} />
                  <InfoField label="Last Name" value={lastName} />
                  <InfoField label="Email" value={user.email} fullWidth />
                  <InfoField label="Orders" value={loading ? "Loading..." : String(sortedOrders.length)} />
                  <InfoField label="Latest Order" value={latestOrder ? `#${getOrderReference(latestOrder)}` : "No orders yet"} />
                  <InfoField label="Status" value={latestOrder?.status || "Ready to shop"} />
                  <InfoField label="Role" value={user.isAdmin ? "Administrator" : "Customer"} />
                </div>
              </>
            ) : sortedOrders.length ? (
              <div className="account-orders-wrap">
                <AccountOrdersPanel
                  orders={sortedOrders}
                  loading={loading}
                  error={error}
                  title="My Orders"
                  subtitle="Track your orders."
                />
              </div>
            ) : (
              <div className="account-empty">
                <div>
                  <h3>No Orders Yet</h3>
                  <p>Your orders will appear here once you place your first purchase.</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
