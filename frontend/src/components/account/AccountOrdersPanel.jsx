import { Link } from "react-router-dom";
import formatCurrency from "../../utils/formatCurrency";
import getOrderReference from "../../utils/orderReference";

const ORDER_STAGES = ["Pending", "Processing", "Shipped", "Delivered"];

function getStatusIndex(status) {
  const index = ORDER_STAGES.findIndex(
    (stage) => stage.toLowerCase() === String(status || "").toLowerCase()
  );
  return index === -1 ? 0 : index;
}

function formatOrderDate(value) {
  if (!value) return "Recently placed";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently placed";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getTrackingMessage(status) {
  switch (String(status || "").toLowerCase()) {
    case "processing":
      return "Your order is being prepared for dispatch.";
    case "shipped":
      return "Your package is on the way.";
    case "delivered":
      return "Delivered successfully.";
    default:
      return "We have received your order and queued it for fulfillment.";
  }
}

function OrderTracking({ status }) {
  const activeIndex = getStatusIndex(status);

  return (
    <div className="account-order-tracking">
      <div className="account-order-trackline" aria-hidden="true">
        <span
          className="account-order-trackline-fill"
          style={{ width: `${(activeIndex / (ORDER_STAGES.length - 1)) * 100}%` }}
        />
      </div>

      <div className="account-order-stages">
        {ORDER_STAGES.map((stage, index) => {
          const isComplete = index <= activeIndex;
          return (
            <div key={stage} className="account-order-stage">
              <span
                className="account-order-stage-dot"
                style={{
                  background: isComplete ? "var(--theme-accent)" : "rgba(176, 122, 79, 0.12)",
                  borderColor: isComplete ? "var(--theme-accent)" : "rgba(176, 122, 79, 0.24)",
                }}
              />
              <span
                className="account-order-stage-label"
                style={{ color: isComplete ? "var(--theme-ink)" : "var(--theme-muted)" }}
              >
                {stage}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AccountOrdersPanel({
  orders,
  loading,
  error,
  title = "My Orders",
  subtitle = "Track every purchase and revisit the details of recent deliveries.",
}) {
  return (
    <>
      <style>{`
        .account-orders-shell {
          background: linear-gradient(180deg, rgba(255, 253, 249, 0.92) 0%, rgba(246, 241, 234, 0.82) 100%);
          border: 1px solid var(--theme-border);
          border-radius: 30px;
          padding: clamp(22px, 3vw, 36px);
          box-shadow: 0 28px 60px rgba(36, 28, 23, 0.08);
        }
        .account-orders-header {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: end;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .account-orders-kicker {
          margin: 0 0 8px;
          font-size: 11px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--theme-accent);
          font-weight: 700;
        }
        .account-orders-title {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3.3rem);
          color: var(--theme-ink);
          line-height: 0.95;
        }
        .account-orders-subtitle {
          margin: 10px 0 0;
          max-width: 640px;
          color: var(--theme-text);
          line-height: 1.75;
          font-size: 14px;
        }
        .account-orders-count {
          padding: 10px 16px;
          border-radius: 999px;
          background: rgba(176, 122, 79, 0.12);
          color: var(--theme-accent-strong);
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 700;
        }
        .account-orders-state {
          background: rgba(255, 253, 249, 0.96);
          border: 1px dashed var(--theme-border);
          border-radius: 24px;
          padding: 32px 24px;
          text-align: center;
          color: var(--theme-text);
        }
        .account-orders-state h3 {
          margin: 0 0 8px;
          font-family: var(--font-display);
          font-size: 2rem;
          color: var(--theme-ink);
        }
        .account-orders-grid {
          display: grid;
          gap: 22px;
        }
        .account-order-card {
          background: rgba(255, 253, 249, 0.98);
          border: 1px solid var(--theme-border);
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 18px 34px rgba(36, 28, 23, 0.06);
        }
        .account-order-top {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: start;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .account-order-eyebrow {
          margin: 0 0 6px;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--theme-muted);
          font-weight: 700;
        }
        .account-order-id {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(1.5rem, 2.2vw, 2.2rem);
          color: var(--theme-ink);
          line-height: 1;
        }
        .account-order-date {
          margin: 10px 0 0;
          color: var(--theme-text);
          font-size: 14px;
        }
        .account-order-status {
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(176, 122, 79, 0.12);
          color: var(--theme-accent-strong);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-weight: 700;
          white-space: nowrap;
        }
        .account-order-tracking {
          position: relative;
          margin: 8px 0 22px;
        }
        .account-order-trackline {
          position: absolute;
          top: 15px;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(176, 122, 79, 0.14);
        }
        .account-order-trackline-fill {
          display: block;
          height: 100%;
          background: linear-gradient(90deg, var(--theme-accent) 0%, var(--theme-accent-soft) 100%);
        }
        .account-order-stages {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
          position: relative;
        }
        .account-order-stage {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-align: center;
        }
        .account-order-stage-dot {
          width: 14px;
          height: 14px;
          border-radius: 999px;
          border: 3px solid transparent;
          position: relative;
          z-index: 1;
        }
        .account-order-stage-label {
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 700;
        }
        .account-order-message {
          margin: 0 0 20px;
          color: var(--theme-text);
          line-height: 1.7;
          font-size: 14px;
        }
        .account-order-meta {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 18px;
        }
        .account-order-meta-card {
          padding: 16px;
          border-radius: 18px;
          background: var(--theme-surface);
          border: 1px solid rgba(176, 122, 79, 0.12);
        }
        .account-order-meta-label {
          display: block;
          margin-bottom: 8px;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--theme-muted);
          font-weight: 700;
        }
        .account-order-meta-value {
          color: var(--theme-ink);
          font-size: 15px;
          font-weight: 600;
        }
        .account-order-lower {
          display: grid;
          grid-template-columns: minmax(0, 1.3fr) minmax(260px, 0.7fr);
          gap: 18px;
        }
        .account-order-block {
          border: 1px solid rgba(176, 122, 79, 0.14);
          border-radius: 20px;
          background: linear-gradient(180deg, rgba(242, 233, 222, 0.58) 0%, rgba(255, 253, 249, 0.78) 100%);
          padding: 18px;
        }
        .account-order-block h4 {
          margin: 0 0 14px;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--theme-muted);
        }
        .account-order-items {
          display: grid;
          gap: 12px;
        }
        .account-order-item {
          display: grid;
          grid-template-columns: 60px minmax(0, 1fr) auto;
          gap: 12px;
          align-items: center;
        }
        .account-order-item img,
        .account-order-item-placeholder {
          width: 60px;
          height: 72px;
          border-radius: 16px;
          object-fit: cover;
          background: rgba(176, 122, 79, 0.12);
        }
        .account-order-item-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--theme-muted);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .account-order-item-name {
          margin: 0 0 4px;
          color: var(--theme-ink);
          font-weight: 600;
        }
        .account-order-item-copy {
          margin: 0;
          color: var(--theme-text);
          font-size: 13px;
          line-height: 1.6;
        }
        .account-order-item-total {
          color: var(--theme-ink);
          font-weight: 700;
          font-size: 14px;
          text-align: right;
        }
        .account-order-summary-list {
          display: grid;
          gap: 10px;
        }
        .account-order-summary-row {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          color: var(--theme-text);
          font-size: 14px;
        }
        .account-order-summary-row strong {
          color: var(--theme-ink);
        }
        .account-order-address {
          margin-top: 18px;
          padding-top: 18px;
          border-top: 1px solid rgba(176, 122, 79, 0.14);
          color: var(--theme-text);
          font-size: 14px;
          line-height: 1.75;
        }
        .account-order-address strong {
          color: var(--theme-ink);
        }
        .account-orders-empty-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 18px;
          padding: 14px 22px;
          border-radius: 999px;
          background: var(--theme-accent);
          color: var(--theme-surface);
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-size: 11px;
          font-weight: 700;
        }
        @media (max-width: 900px) {
          .account-order-meta,
          .account-order-lower {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 640px) {
          .account-orders-shell {
            border-radius: 22px;
            padding: 20px;
          }
          .account-order-card {
            border-radius: 20px;
            padding: 18px;
          }
          .account-order-stages {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            row-gap: 18px;
          }
          .account-order-trackline {
            display: none;
          }
          .account-order-item {
            grid-template-columns: 50px minmax(0, 1fr);
          }
          .account-order-item-total {
            grid-column: 2;
            text-align: left;
          }
        }
      `}</style>

      <section className="account-orders-shell">
        <div className="account-orders-header">
          <div>
            <p className="account-orders-kicker">Order Overview</p>
            <h2 className="account-orders-title">{title}</h2>
            <p className="account-orders-subtitle">{subtitle}</p>
          </div>
          <div className="account-orders-count">{orders?.length || 0} Orders</div>
        </div>

        {loading ? (
          <div className="account-orders-state">
            <h3>Loading Orders</h3>
            <p>We are gathering your most recent purchases and tracking updates.</p>
          </div>
        ) : error ? (
          <div className="account-orders-state">
            <h3>Orders Unavailable</h3>
            <p>{error}</p>
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="account-orders-state">
            <h3>No Orders Yet</h3>
            <p>Your account is ready. Once you place an order, tracking and delivery progress will appear here.</p>
            <Link to="/products" className="account-orders-empty-cta">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="account-orders-grid">
            {orders.map((order) => {
              const itemCount = (order.items || []).reduce(
                (total, item) => total + Number(item.qty || 0),
                0
              );

              return (
                <article key={order._id} className="account-order-card">
                  <div className="account-order-top">
                    <div>
                      <p className="account-order-eyebrow">Order Reference</p>
                      <h3 className="account-order-id">#{getOrderReference(order)}</h3>
                      <p className="account-order-date">{formatOrderDate(order.createdAt)}</p>
                    </div>
                    <div className="account-order-status">{order.status || "Pending"}</div>
                  </div>

                  <OrderTracking status={order.status} />
                  <p className="account-order-message">{getTrackingMessage(order.status)}</p>

                  <div className="account-order-meta">
                    <div className="account-order-meta-card">
                      <span className="account-order-meta-label">Order Total</span>
                      <div className="account-order-meta-value">
                        {formatCurrency(Number(order.total || 0))}
                      </div>
                    </div>
                    <div className="account-order-meta-card">
                      <span className="account-order-meta-label">Items</span>
                      <div className="account-order-meta-value">{itemCount}</div>
                    </div>
                    <div className="account-order-meta-card">
                      <span className="account-order-meta-label">Shipping</span>
                      <div className="account-order-meta-value">
                        {Number(order.shipping || 0) === 0
                          ? "Free Shipping"
                          : formatCurrency(Number(order.shipping || 0))}
                      </div>
                    </div>
                    <div className="account-order-meta-card">
                      <span className="account-order-meta-label">Payment</span>
                      <div className="account-order-meta-value">
                        {order.payment?.brand
                          ? `${order.payment.brand} •••• ${order.payment.last4 || "----"}`
                          : order.payment?.method || "Credit Card"}
                      </div>
                    </div>
                  </div>

                  <div className="account-order-lower">
                    <div className="account-order-block">
                      <h4>Items In This Order</h4>
                      <div className="account-order-items">
                        {(order.items || []).map((item, index) => (
                          <div
                            key={`${order._id}-${item._id || item.id || index}`}
                            className="account-order-item"
                          >
                            {item.image ? (
                              <img src={item.image} alt={item.name} />
                            ) : (
                              <div className="account-order-item-placeholder">Item</div>
                            )}

                            <div>
                              <p className="account-order-item-name">{item.name || "Product"}</p>
                              <p className="account-order-item-copy">
                                Qty {item.qty || 1}
                                {item.size ? ` · Size ${item.size}` : ""}
                                {item.color ? ` · ${item.color}` : ""}
                              </p>
                            </div>

                            <div className="account-order-item-total">
                              {formatCurrency(Number(item.price || 0) * Number(item.qty || 1))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="account-order-block">
                      <h4>Summary</h4>
                      <div className="account-order-summary-list">
                        <div className="account-order-summary-row">
                          <span>Subtotal</span>
                          <strong>{formatCurrency(Number(order.subtotal || 0))}</strong>
                        </div>
                        <div className="account-order-summary-row">
                          <span>Discount</span>
                          <strong>{formatCurrency(Number(order.discount || 0))}</strong>
                        </div>
                        <div className="account-order-summary-row">
                          <span>Shipping</span>
                          <strong>{formatCurrency(Number(order.shipping || 0))}</strong>
                        </div>
                        <div className="account-order-summary-row">
                          <span>Total</span>
                          <strong>{formatCurrency(Number(order.total || 0))}</strong>
                        </div>
                      </div>

                      <div className="account-order-address">
                        <strong>Delivery</strong>
                        <div>{order.shippingAddress?.fullName || "Customer"}</div>
                        <div>{order.shippingAddress?.address || "Address unavailable"}</div>
                        <div>
                          {[order.shippingAddress?.city, order.shippingAddress?.state, order.shippingAddress?.postalCode]
                            .filter(Boolean)
                            .join(", ")}
                        </div>
                        <div>{order.shippingAddress?.country || ""}</div>
                        {order.shippingAddress?.phone ? <div>{order.shippingAddress.phone}</div> : null}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
