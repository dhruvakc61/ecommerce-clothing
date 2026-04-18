import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";
import api from "../api/axios";
import formatCurrency from "../utils/formatCurrency";

const J = "var(--font-body)";
const D = "var(--font-display)";
const FREE_SHIP_MIN = 100;

function stripDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function inferCardBrand(number) {
  const digits = stripDigits(number);
  if (/^4/.test(digits)) return "Visa";
  if (/^5[1-5]/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "Amex";
  if (/^6(?:011|5)/.test(digits)) return "Discover";
  return "Card";
}

function formatCardNumber(value) {
  const digits = stripDigits(value).slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value) {
  const digits = stripDigits(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function isExpiryValid(value) {
  const [monthRaw, yearRaw] = String(value || "").split("/");
  const month = Number(monthRaw);
  const year = Number(yearRaw);

  if (!month || !year || month < 1 || month > 12) {
    return false;
  }

  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  return year > currentYear || (year === currentYear && month >= currentMonth);
}

const GoldBtn = ({ children, onClick, disabled = false, style = {}, type = "button" }) => {
  const [hover, setHover] = useState(false);
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: J,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 2,
        textTransform: "uppercase",
        cursor: disabled ? "not-allowed" : "pointer",
        border: "none",
        borderRadius: 2,
        padding: "13px 26px",
        background: disabled ? "#d9c3a0" : hover ? "#cf9c38" : "#e8b14f",
        color: "#fff",
        transition: "background .2s",
        ...style,
      }}
    >
      {children}
    </button>
  );
};

function Hero() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        position: "relative",
        height: 150,
        overflow: "hidden",
        background: "#111",
        marginBottom: 0,
      }}
    >
      <img
        src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&q=80"
        alt=""
        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }}
      />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 clamp(16px, 4vw, 60px)" }}>
        <h1
          style={{
            fontFamily: D,
            fontSize: "clamp(24px,4vw,40px)",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: 4,
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Checkout
        </h1>
      </div>
    </div>
  );
}

function BreadcrumbBar() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        background: "#2a2a2a",
        padding: "13px clamp(16px, 4vw, 60px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
        marginBottom: 48,
      }}
    >
      <span style={{ fontFamily: J, fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: 2, textTransform: "uppercase" }}>
        Checkout
      </span>
      <span style={{ fontFamily: J, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", minWidth: 0, overflowWrap: "anywhere" }}>
        <Link to="/" style={{ color: "#aaa", textDecoration: "none" }}>Home</Link>
        <span style={{ margin: "0 8px", color: "#555" }}>/</span>
        <Link to="/cart" style={{ color: "#aaa", textDecoration: "none" }}>Cart</Link>
        <span style={{ margin: "0 8px", color: "#555" }}>/</span>
        <span style={{ color: "#e8b14f" }}>Checkout</span>
      </span>
    </div>
  );
}

function EmptyCheckout() {
  return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <svg width="68" height="68" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1" style={{ marginBottom: 20 }}>
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      <h2
        style={{
          fontFamily: D,
          fontSize: 32,
          fontWeight: 600,
          color: "#1a1a1a",
          marginBottom: 10,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        Your cart is empty
      </h2>
      <p style={{ color: "#999", fontSize: 14, marginBottom: 28 }}>
        Add a few products before moving to checkout.
      </p>
      <Link
        to="/products"
        style={{
          display: "inline-block",
          background: "#e8b14f",
          color: "#fff",
          padding: "13px 32px",
          fontFamily: J,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: "uppercase",
          textDecoration: "none",
          borderRadius: 2,
        }}
      >
        Browse Products
      </Link>
    </div>
  );
}

export default function Checkout() {
  const { cart, clearCart, clearPromo, promo, totals } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    country: "USA",
    notes: "",
  });
  const [payment, setPayment] = useState({
    cardholderName: user?.name || "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const shipping = totals.subtotal > FREE_SHIP_MIN ? 0 : totals.subtotal > 0 ? 10 : 0;
  const discount = totals.discount || 0;
  const total = Math.max(0, totals.subtotal - discount + shipping);

  const cardBrand = useMemo(() => inferCardBrand(payment.cardNumber), [payment.cardNumber]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSubmitError("");
  };

  const updatePayment = (field, value) => {
    setSubmitError("");
    setPayment((prev) => ({
      ...prev,
      [field]:
        field === "cardNumber"
          ? formatCardNumber(value)
          : field === "expiry"
            ? formatExpiry(value)
            : field === "cvv"
              ? stripDigits(value).slice(0, 4)
              : value,
    }));
  };

  const validateForm = () => {
    const requiredFields = ["fullName", "email", "phone", "address", "city", "state", "postalCode", "country"];
    const missing = requiredFields.find((field) => !String(form[field]).trim());
    if (missing) {
      return "Please complete all required shipping details.";
    }

    if (!String(payment.cardholderName).trim()) {
      return "Please enter the cardholder name.";
    }

    const cardDigits = stripDigits(payment.cardNumber);
    if (cardDigits.length < 13 || cardDigits.length > 19) {
      return "Please enter a valid card number.";
    }

    if (!isExpiryValid(payment.expiry)) {
      return "Please enter a valid card expiry date.";
    }

    if (String(payment.cvv).length < 3) {
      return "Please enter a valid CVV.";
    }

    return "";
  };

  const handleOrder = async () => {
    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    try {
      setLoading(true);
      setSubmitError("");

      const cardDigits = stripDigits(payment.cardNumber);
      const [expMonth = "", expYear = ""] = payment.expiry.split("/");

      const order = {
        items: cart,
        subtotal: totals.subtotal,
        shipping,
        discount,
        promoCode: promo.code || "",
        total,
        shippingAddress: {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          apartment: form.apartment.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          postalCode: form.postalCode.trim(),
          country: form.country.trim(),
          notes: form.notes.trim(),
        },
        payment: {
          method: "Credit Card",
          status: "Authorized",
          transactionId: `CARD-${Date.now()}`,
          last4: cardDigits.slice(-4),
          brand: inferCardBrand(cardDigits),
          cardholderName: payment.cardholderName.trim(),
          expMonth,
          expYear: expYear.length === 2 ? `20${expYear}` : expYear,
        },
        status: "Pending",
      };

      await api.post("/orders", order);
      clearCart();
      clearPromo();
      navigate("/order-success");
    } catch (error) {
      setSubmitError(error?.response?.data?.message || "We couldn't place your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <Hero />
        <BreadcrumbBar />
        <EmptyCheckout />
      </>
    );
  }

  return (
    <>
      <style>{`
        .checkout-page { font-family:var(--font-body); background:#fff; color:#333; overflow-x:hidden; }
        .checkout-wrap { max-width:1200px; margin:0 auto; padding:0 24px 60px; }
        .checkout-layout { display:grid; grid-template-columns:minmax(0, 1.45fr) minmax(320px, 0.95fr); gap:24px; }
        .checkout-panel { background:#fff; border:1px solid #efefef; border-radius:4px; padding:28px 24px; }
        .checkout-grid { display:grid; grid-template-columns:1fr 1fr; gap:18px 16px; }
        .checkout-field.full { grid-column:1 / -1; }
        .checkout-label { font-size:12px; color:#555; margin-bottom:6px; display:block; font-weight:600; }
        .checkout-input, .checkout-textarea, .checkout-select {
          width:100%; padding:10px 14px; border:1px solid #e0e0e0; border-radius:2px;
          font-size:13px; font-family:inherit; outline:none; box-sizing:border-box; background:#fff;
        }
        .checkout-input:focus, .checkout-textarea:focus, .checkout-select:focus { border-color:#e8b14f; }
        .checkout-textarea { min-height:110px; resize:vertical; }
        .checkout-section-divider {
          border-top:1px solid #efefef;
          margin:28px 0 24px;
          padding-top:28px;
        }
        .checkout-card-row {
          display:grid;
          grid-template-columns:minmax(0, 1fr) 124px;
          gap:16px;
        }
        .checkout-payment-pill {
          display:inline-flex;
          align-items:center;
          gap:10px;
          padding:10px 14px;
          border-radius:999px;
          background:#faf7f1;
          border:1px solid #eee3d1;
          color:#7a6d5d;
          font-size:12px;
          margin-bottom:18px;
        }
        .checkout-payment-dot {
          width:8px;
          height:8px;
          border-radius:999px;
          background:#4caf50;
        }
        .checkout-error {
          margin-top:14px;
          padding:12px 14px;
          background:#fff4f4;
          border:1px solid #f1c5c5;
          color:#b63f3f;
          border-radius:4px;
          font-size:13px;
          line-height:1.6;
        }
        .checkout-card-meta {
          margin-top:14px;
          display:flex;
          justify-content:space-between;
          gap:12px;
          flex-wrap:wrap;
          color:#8a7b6c;
          font-size:12px;
        }
        .checkout-item { display:flex; gap:12px; padding:12px 0; border-bottom:1px solid #f0f0f0; }
        .checkout-item:last-child { border-bottom:none; }
        .checkout-item-media {
          width:68px; height:76px; border-radius:8px; overflow:hidden; background:#f8f6f3;
          border:1px solid #efefef; flex-shrink:0; display:flex; align-items:center; justify-content:center;
        }
        .checkout-item-name {
          font-family:${D}; font-size:22px; font-weight:600; color:#1a1a1a;
          margin:0 0 6px; letter-spacing:.5px; text-transform:uppercase;
        }
        .checkout-item-meta { font-size:12px; color:#999; margin:0 0 4px; }
        .checkout-summary-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; gap:12px; }
        .checkout-summary-divider { border-top:1px solid #e8e8e8; padding-top:14px; margin-top:4px; }
        .checkout-note {
          margin-top:16px; padding:14px 16px; background:#faf7f1; border:1px solid #eee3d1;
          border-radius:4px; font-size:13px; color:#7a6d5d; line-height:1.7;
        }
        @media(max-width:900px){
          .checkout-layout { grid-template-columns:1fr; }
        }
        @media(max-width:640px){
          .checkout-wrap { padding:0 16px 48px; }
          .checkout-grid,
          .checkout-card-row { grid-template-columns:1fr; }
          .checkout-panel { padding:22px 16px; }
          .checkout-item { flex-wrap:wrap; }
          .checkout-item > div:last-child { width:100%; text-align:left; }
        }
      `}</style>

      <div className="checkout-page">
        <Hero />
        <BreadcrumbBar />

        <div className="checkout-wrap">
          <h2
            style={{
              fontFamily: D,
              fontSize: 34,
              fontWeight: 600,
              color: "#1a1a1a",
              letterSpacing: 1,
              textTransform: "uppercase",
              marginBottom: 24,
              paddingBottom: 14,
              borderBottom: "3px solid #e8b14f",
              display: "inline-block",
            }}
          >
            Checkout Details
          </h2>

          <div className="checkout-layout">
            <div className="checkout-panel">
              <p style={{ fontFamily: D, fontSize: 28, fontWeight: 600, color: "#1a1a1a", marginBottom: 8, letterSpacing: 0.5 }}>
                Customer Information
              </p>
              <p style={{ fontSize: 13, color: "#999", marginBottom: 22 }}>
                Complete your delivery and contact details so we can process your order smoothly.
              </p>

              <div className="checkout-grid">
                {[
                  { key: "fullName", label: "Full Name *" },
                  { key: "email", label: "Email Address *", type: "email" },
                  { key: "phone", label: "Phone Number *", type: "tel" },
                  { key: "country", label: "Country *" },
                  { key: "city", label: "City *" },
                  { key: "state", label: "State / Province *" },
                  { key: "postalCode", label: "Zip / Postal Code *" },
                ].map((field) => (
                  <div className="checkout-field" key={field.key}>
                    <label className="checkout-label">{field.label}</label>
                    <input
                      type={field.type || "text"}
                      value={form[field.key]}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      className="checkout-input"
                    />
                  </div>
                ))}

                <div className="checkout-field full">
                  <label className="checkout-label">Street Address *</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    className="checkout-input"
                    placeholder="House number and street name"
                  />
                </div>

                <div className="checkout-field full">
                  <label className="checkout-label">Apartment, Suite, Unit</label>
                  <input
                    type="text"
                    value={form.apartment}
                    onChange={(e) => updateField("apartment", e.target.value)}
                    className="checkout-input"
                    placeholder="Optional"
                  />
                </div>

                <div className="checkout-field full">
                  <label className="checkout-label">Order Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    className="checkout-textarea"
                    placeholder="Delivery instructions, gate code, preferred time, or anything we should know."
                  />
                </div>
              </div>

              <div className="checkout-section-divider">
                <p style={{ fontFamily: D, fontSize: 28, fontWeight: 600, color: "#1a1a1a", marginBottom: 8, letterSpacing: 0.5 }}>
                  Payment Details
                </p>
                <p style={{ fontSize: 13, color: "#999", marginBottom: 22 }}>
                  Enter your card details below. For safety, only masked card information is stored with the order.
                </p>

                <div className="checkout-payment-pill">
                  <span className="checkout-payment-dot" />
                  Credit Card Payment
                </div>

                <div className="checkout-grid">
                  <div className="checkout-field full">
                    <label className="checkout-label">Cardholder Name *</label>
                    <input
                      type="text"
                      value={payment.cardholderName}
                      onChange={(e) => updatePayment("cardholderName", e.target.value)}
                      className="checkout-input"
                      placeholder="Name on card"
                    />
                  </div>

                  <div className="checkout-field full">
                    <label className="checkout-label">Card Number *</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      value={payment.cardNumber}
                      onChange={(e) => updatePayment("cardNumber", e.target.value)}
                      className="checkout-input"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  <div className="checkout-field">
                    <label className="checkout-label">Expiry *</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      value={payment.expiry}
                      onChange={(e) => updatePayment("expiry", e.target.value)}
                      className="checkout-input"
                      placeholder="MM/YY"
                    />
                  </div>

                  <div className="checkout-field">
                    <label className="checkout-label">CVV *</label>
                    <input
                      type="password"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      value={payment.cvv}
                      onChange={(e) => updatePayment("cvv", e.target.value)}
                      className="checkout-input"
                      placeholder="123"
                    />
                  </div>
                </div>

                <div className="checkout-card-meta">
                  <span>Card Type: {cardBrand}</span>
                  <span>Secure entry. CVV is never stored.</span>
                </div>
              </div>
            </div>

            <div className="checkout-panel" style={{ background: "#fafafa" }}>
              <p style={{ fontFamily: D, fontSize: 28, fontWeight: 600, color: "#1a1a1a", marginBottom: 18, letterSpacing: 0.5 }}>
                Order Summary
              </p>

              <div style={{ marginBottom: 20 }}>
                {cart.map((item) => {
                  const pid = item._id || item.id;
                  const price = item.price ?? item.sale_price ?? 0;
                  return (
                    <div className="checkout-item" key={item.cartItemId || pid}>
                      <Link to={`/products/${pid}`} className="checkout-item-media">
                        {item.image || item.thumbnail ? (
                          <img src={item.image || item.thumbnail} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        )}
                      </Link>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="checkout-item-name">{item.name}</p>
                        <p className="checkout-item-meta">Product ID: {pid}</p>
                        <p className="checkout-item-meta">Quantity: {item.qty}</p>
                        {item.size && <p className="checkout-item-meta">Size: {item.size}</p>}
                        {item.color && <p className="checkout-item-meta">Color: {item.color}</p>}
                        {item.category && <p className="checkout-item-meta">Category: {item.category}</p>}
                      </div>
                      <div style={{ fontFamily: J, fontSize: 14, fontWeight: 700, color: "#1a1a1a", whiteSpace: "nowrap" }}>
                        {formatCurrency(price * item.qty)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="checkout-summary-row">
                <span style={{ fontSize: 13, color: "#999" }}>Subtotal</span>
                <span style={{ fontFamily: J, fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>
                  {formatCurrency(totals.subtotal)}
                </span>
              </div>

              <div className="checkout-summary-row">
                <span style={{ fontSize: 13, color: "#999" }}>Shipping</span>
                <span style={{ fontFamily: J, fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>
                  {shipping === 0 ? "Free" : formatCurrency(shipping)}
                </span>
              </div>

              {discount > 0 ? (
                <div className="checkout-summary-row">
                  <span style={{ fontSize: 13, color: "#4caf50" }}>
                    Discount {promo.code ? `(${promo.code})` : ""}
                  </span>
                  <span style={{ fontFamily: J, fontSize: 14, fontWeight: 600, color: "#4caf50" }}>
                    - {formatCurrency(discount)}
                  </span>
                </div>
              ) : null}

              <div className="checkout-summary-row">
                <span style={{ fontSize: 13, color: "#999" }}>Payment Method</span>
                <span style={{ fontFamily: J, fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>
                  {cardBrand} ending {stripDigits(payment.cardNumber).slice(-4) || "----"}
                </span>
              </div>

              <div className="checkout-summary-row checkout-summary-divider">
                <span style={{ fontFamily: J, fontSize: 15, fontWeight: 700, color: "#1a1a1a", letterSpacing: 1, textTransform: "uppercase" }}>
                  Total
                </span>
                <span style={{ fontFamily: J, fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>
                  {formatCurrency(total)}
                </span>
              </div>

              <GoldBtn onClick={handleOrder} disabled={loading} style={{ width: "100%", textAlign: "center", display: "block", padding: "14px" }}>
                {loading ? "Processing..." : "Place Order"}
              </GoldBtn>

              {submitError ? <div className="checkout-error">{submitError}</div> : null}

              <div className="checkout-note">
                Orders over {formatCurrency(FREE_SHIP_MIN)} qualify for free shipping. We will use your phone number for delivery updates and any urgent order clarifications.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
