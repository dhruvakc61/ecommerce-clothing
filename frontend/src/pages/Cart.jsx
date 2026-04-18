import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import formatCurrency from "../utils/formatCurrency";

const VALID_COUPONS  = { SAVE10: 10, SAVE20: 20, BOSHOP: 15 };
const J              = "var(--font-body)";
const D              = "var(--font-display)";
const FREE_SHIP_MIN  = 50;

/* ─── tiny helpers ─────────────────────────────────────────── */
const GoldBtn = ({ children, onClick, style = {} }) => {
  const [h, sH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => sH(true)} onMouseLeave={() => sH(false)}
      style={{ fontFamily:J, fontSize:11, fontWeight:700, letterSpacing:2,
        textTransform:"uppercase", cursor:"pointer", border:"none", borderRadius:2,
        padding:"13px 26px", background: h ? "#cf9c38" : "#e8b14f",
        color:"#fff", transition:"background .2s", ...style }}>
      {children}
    </button>
  );
};

const OutlineBtn = ({ children, onClick, style = {} }) => {
  const [h, sH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => sH(true)} onMouseLeave={() => sH(false)}
      style={{ fontFamily:J, fontSize:11, fontWeight:700, letterSpacing:2,
        textTransform:"uppercase", cursor:"pointer", borderRadius:2,
        padding:"12px 22px", border:"1px solid #1a1a1a",
        background: h ? "#1a1a1a" : "transparent",
        color: h ? "#fff" : "#1a1a1a", transition:"all .2s", ...style }}>
      {children}
    </button>
  );
};

const DarkBtn = ({ children, onClick, style = {} }) => {
  const [h, sH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => sH(true)} onMouseLeave={() => sH(false)}
      style={{ fontFamily:J, fontSize:11, fontWeight:700, letterSpacing:2,
        textTransform:"uppercase", cursor:"pointer", border:"none", borderRadius:2,
        padding:"13px 26px", background: h ? "#333" : "#1a1a1a",
        color:"#fff", transition:"background .2s", ...style }}>
      {children}
    </button>
  );
};

/* ─── Hero banner ──────────────────────────────────────────── */
function Hero() {
  return (
    <div style={{ width:"100%", maxWidth:"100%", position:"relative",
      height:150, overflow:"hidden",
      background:"#111", marginBottom:0 }}>
      <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&q=80"
        alt="" style={{ width:"100%", height:"100%", objectFit:"cover", opacity:.4 }}/>
      <div style={{ position:"absolute", inset:0, display:"flex",
        alignItems:"center", padding:"0 clamp(16px, 4vw, 60px)" }}>
        <h1 style={{ fontFamily:D, fontSize:"clamp(24px,4vw,40px)", fontWeight:600,
          color:"#fff", letterSpacing:4, textTransform:"uppercase", margin:0 }}>
          Shopping Cart
        </h1>
      </div>
    </div>
  );
}

/* ─── Breadcrumb bar ───────────────────────────────────────── */
function BreadcrumbBar() {
  return (
    <div style={{ width:"100%", maxWidth:"100%", background:"#2a2a2a",
      padding:"13px clamp(16px, 4vw, 60px)", display:"flex",
      justifyContent:"space-between", alignItems:"center", gap:12, flexWrap:"wrap", marginBottom:48 }}>
      <span style={{ fontFamily:J, fontSize:11, fontWeight:700,
        color:"#fff", letterSpacing:2, textTransform:"uppercase" }}>
        Shopping Cart
      </span>
      <span style={{ fontFamily:J, fontSize:11, letterSpacing:1, textTransform:"uppercase", minWidth:0, overflowWrap:"anywhere" }}>
        <Link to="/" style={{ color:"#aaa", textDecoration:"none" }}>Home</Link>
        <span style={{ margin:"0 8px", color:"#555" }}>/</span>
        <span style={{ color:"#e8b14f" }}>Shopping Cart</span>
      </span>
    </div>
  );
}

/* ─── Empty state ──────────────────────────────────────────── */
function EmptyCart() {
  return (
    <div style={{ textAlign:"center", padding:"80px 20px" }}>
      <svg width="68" height="68" viewBox="0 0 24 24" fill="none"
        stroke="#ddd" strokeWidth="1" style={{ marginBottom:20 }}>
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
      <h2 style={{ fontFamily:D, fontSize:32, fontWeight:600, color:"#1a1a1a",
        marginBottom:10, letterSpacing:1, textTransform:"uppercase" }}>
        Your cart is empty
      </h2>
      <p style={{ color:"#999", fontSize:14, marginBottom:28 }}>
        Looks like you haven't added anything yet.
      </p>
      <Link to="/products" style={{ display:"inline-block", background:"#e8b14f",
        color:"#fff", padding:"13px 32px", fontFamily:J, fontSize:11,
        fontWeight:700, letterSpacing:2, textTransform:"uppercase",
        textDecoration:"none", borderRadius:2 }}>
        Browse Products
      </Link>
    </div>
  );
}

/* ─── Table header cell ────────────────────────────────────── */
const TH = ({ children, align = "left", width }) => (
  <th style={{ fontFamily:J, fontSize:11, fontWeight:700, letterSpacing:1.5,
    textTransform:"uppercase", color:"#555", padding:"14px 16px",
    textAlign:align, background:"#fafafa", borderBottom:"1px solid #e8e8e8",
    ...(width ? { width } : {}) }}>
    {children}
  </th>
);

/* ─── Cart row ─────────────────────────────────────────────── */
function CartRow({ item }) {
  const { updateQty, removeFromCart } = useCart();
  const [hovX, sHovX] = useState(false);
  const pid   = item._id || item.id;
  const lineId = item.cartItemId || pid;
  const price = item.price ?? item.sale_price ?? 0;

  return (
    <tr style={{ borderBottom:"1px solid #f0f0f0" }}>
      {/* Image */}
      <td data-label="Product" style={{ padding:"18px 16px", verticalAlign:"middle" }}>
        <Link to={`/products/${pid}`}>
          <div style={{ width:76, height:76, borderRadius:8, overflow:"hidden",
            background:"#f8f6f3", border:"1px solid #efefef",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            {item.image || item.thumbnail
              ? <img src={item.image||item.thumbnail} alt={item.name}
                  style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
              : <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                  stroke="#ccc" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
            }
          </div>
        </Link>
      </td>

      {/* Name + meta */}
      <td data-label="Details" style={{ padding:"18px 16px", verticalAlign:"middle" }}>
        <Link to={`/products/${pid}`} style={{ textDecoration:"none" }}>
          <p style={{ fontFamily:D, fontSize:21, fontWeight:600, color:"#1a1a1a",
            margin:"0 0 8px", letterSpacing:.5, textTransform:"uppercase" }}>
            {item.name}
          </p>
        </Link>
        {item.color && (
          <p style={{ fontSize:12, color:"#999", margin:"0 0 3px" }}>
            <span style={{ color:"#555", fontWeight:600 }}>COLOR : </span>{item.color}
          </p>
        )}
        {item.size && (
          <p style={{ fontSize:12, color:"#999", margin:0 }}>
            <span style={{ color:"#555", fontWeight:600 }}>SIZE : </span>{item.size}
          </p>
        )}
        {!item.color && !item.size && item.category && (
          <p style={{ fontSize:12, color:"#999", margin:0 }}>
            <span style={{ color:"#555", fontWeight:600 }}>CATEGORY : </span>{item.category}
          </p>
        )}
      </td>

      {/* Quantity */}
      <td data-label="Quantity" style={{ padding:"18px 16px", verticalAlign:"middle", textAlign:"center" }}>
        <div style={{ display:"inline-flex", alignItems:"center",
          border:"1px solid #e0e0e0", borderRadius:4, overflow:"hidden", background:"#fff" }}>
          <button onClick={() => updateQty(lineId, item.qty - 1)}
            style={{ width:32, height:36, border:"none", background:"none",
              cursor:"pointer", fontSize:18, color:"#555", lineHeight:1 }}>−</button>
          <span style={{ width:38, textAlign:"center", fontSize:14,
            fontWeight:700, fontFamily:J }}>{item.qty}</span>
          <button onClick={() => updateQty(lineId, item.qty + 1)}
            style={{ width:32, height:36, border:"none", background:"none",
              cursor:"pointer", fontSize:18, color:"#555", lineHeight:1 }}>+</button>
        </div>
      </td>

      {/* Unit price */}
      <td data-label="Unit Price" style={{ padding:"18px 16px", verticalAlign:"middle", textAlign:"center",
        fontFamily:J, fontSize:14, fontWeight:700, color:"#1a1a1a" }}>
        {formatCurrency(price)}
      </td>

      {/* Delivery */}
      <td data-label="Delivery" style={{ padding:"18px 16px", verticalAlign:"middle", textAlign:"center" }}>
        {price >= FREE_SHIP_MIN
          ? <span style={{ fontFamily:J, fontSize:11, fontWeight:700,
              color:"#4caf50", letterSpacing:1 }}>FREE SHIPPING</span>
          : <span style={{ fontFamily:J, fontSize:11, color:"#999" }}>Standard</span>
        }
      </td>

      {/* Subtotal */}
      <td data-label="Subtotal" style={{ padding:"18px 16px", verticalAlign:"middle", textAlign:"center",
        fontFamily:J, fontSize:14, fontWeight:700, color:"#1a1a1a" }}>
        {formatCurrency(price * item.qty)}
      </td>

      {/* Remove */}
      <td data-label="Remove" style={{ padding:"18px 16px", verticalAlign:"middle", textAlign:"center" }}>
        <button onClick={() => removeFromCart(lineId)}
          onMouseEnter={() => sHovX(true)} onMouseLeave={() => sHovX(false)}
          style={{ width:30, height:30, borderRadius:"50%",
            border:`1px solid ${hovX ? "#e05252" : "#ddd"}`,
            background: hovX ? "#fff3f3" : "#fff",
            cursor:"pointer", display:"inline-flex",
            alignItems:"center", justifyContent:"center", transition:"all .2s" }}>
          <svg width="10" height="10" viewBox="0 0 14 14" fill="none"
            stroke={hovX ? "#e05252" : "#aaa"} strokeWidth="2.5">
            <line x1="1" y1="1" x2="13" y2="13"/>
            <line x1="13" y1="1" x2="1" y2="13"/>
          </svg>
        </button>
      </td>
    </tr>
  );
}

/* ─── Info card ────────────────────────────────────────────── */
function InfoCard({ icon, title, desc }) {
  return (
    <div style={{ flex:1, background:"#f8f8f8", borderRadius:4,
      padding:"28px 24px", minWidth:200 }}>
      <p style={{ fontFamily:J, fontSize:12, fontWeight:700, letterSpacing:1,
        textTransform:"uppercase", color:"#1a1a1a", marginBottom:10 }}>
        {icon} {title}
      </p>
      <p style={{ fontSize:13, color:"#999", lineHeight:1.7, margin:0 }}>{desc}</p>
    </div>
  );
}

/* ─── Main ─────────────────────────────────────────────────── */
export default function Cart() {
  const { cart, clearCart, totals, promo, applyPromo, clearPromo } = useCart();
  const navigate = useNavigate();

  /* coupon */
  const [coupon,      setCoupon]      = useState(promo.code || "");
  const [couponMsg,   setCouponMsg]   = useState(null); // {text, ok}
  const discount = totals.discount || 0;
  const couponApplied = !!promo.code && discount > 0;

  /* totals */
  const subtotal = totals.subtotal;
  const shipping = subtotal > 100 ? 0 : subtotal > 0 ? 10 : 0;
  const grandTotal = subtotal - discount + shipping;

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    const val  = VALID_COUPONS[code];
    if (val) {
      applyPromo(code, val);
      setCouponMsg({ text:`Coupon applied! You save ${formatCurrency(val)}.`, ok:true });
    } else {
      clearPromo();
      setCouponMsg({ text:"Invalid coupon code.", ok:false });
    }
  };

  if (cart.length === 0) return (
    <>
      <Hero/><BreadcrumbBar/><EmptyCart/>
    </>
  );

  return (
    <>
      <style>{`
        .cart-page { font-family:var(--font-body); background:#fff; color:#333; }
        .cart-wrap { max-width:1200px; margin:0 auto; padding:0 24px 60px; }
        .cart-table { width:100%; border-collapse:collapse; border:1px solid #e8e8e8; border-radius:4px; overflow:hidden; }
        .cart-table tr:last-child td { border-bottom:none; }
        .cart-actions { display:flex; justify-content:space-between; align-items:center; margin-top:20px; flex-wrap:wrap; gap:12px; }
        .cart-bottom { display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-top:48px; }
        .cart-panel { background:#fff; border:1px solid #efefef; border-radius:4px; padding:28px 24px; }
        .cart-input { width:100%; padding:10px 14px; border:1px solid #e0e0e0; border-radius:2px; font-size:13px; font-family:inherit; outline:none; box-sizing:border-box; }
        .cart-input:focus { border-color:#e8b14f; }
        .cart-select { width:100%; padding:10px 14px; border:1px solid #e0e0e0; border-radius:2px; font-size:13px; font-family:inherit; outline:none; background:#fff; appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; cursor:pointer; box-sizing:border-box; }
        .cart-label { font-size:12px; color:#555; margin-bottom:6px; display:block; font-weight:600; }
        .cart-info-strip { display:flex; gap:20px; margin-top:48px; flex-wrap:wrap; }
        @media(max-width:900px){
          .cart-bottom { grid-template-columns:1fr; }
          .cart-info-strip { flex-direction:column; }
        }
        @media(max-width:700px){
          .cart-wrap { padding:0 16px 48px; }
          .cart-table thead { display:none; }
          .cart-table,
          .cart-table tbody { display:grid; gap:16px; border:none; }
          .cart-table tr {
            display:grid;
            gap:8px;
            border:1px solid #ece4d9;
            border-radius:18px;
            padding:14px 0;
            background:linear-gradient(180deg, #fff 0%, #fcfaf6 100%);
            box-shadow:0 14px 28px rgba(36,28,23,.04);
          }
          .cart-table td {
            display:flex;
            align-items:flex-start;
            justify-content:space-between;
            gap:12px;
            border:none;
            padding:8px 14px;
          }
          .cart-table td::before {
            content:attr(data-label);
            font-size:10px;
            letter-spacing:.18em;
            text-transform:uppercase;
            color:var(--theme-muted);
            font-weight:700;
            padding-top:6px;
            flex:0 0 88px;
          }
          .cart-table td[data-label="Product"]::before,
          .cart-table td[data-label="Remove"]::before {
            padding-top:0;
          }
        }
      `}</style>

      <div className="cart-page">
        <Hero/>
        <BreadcrumbBar/>

        <div className="cart-wrap">

          {/* Section title */}
          <h2 style={{ fontFamily:D, fontSize:34, fontWeight:600, color:"#1a1a1a",
            letterSpacing:1, textTransform:"uppercase", marginBottom:6,
            paddingBottom:14, borderBottom:"3px solid #e8b14f", display:"inline-block" }}>
            Shopping Cart
          </h2>

          {/* ── Cart table ── */}
          <table className="cart-table" style={{ marginTop:24 }}>
            <thead>
              <tr>
                <TH width={100}>Product</TH>
                <TH>Product Name</TH>
                <TH align="center" width={120}>Quantity</TH>
                <TH align="center" width={110}>Unit Price</TH>
                <TH align="center" width={140}>Delivery Info</TH>
                <TH align="center" width={110}>Sub Total</TH>
                <TH align="center" width={60}>Remove</TH>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => <CartRow key={item.cartItemId || item._id || item.id} item={item}/>)}
            </tbody>
          </table>

          {/* ── Action buttons ── */}
          <div className="cart-actions">
            <GoldBtn onClick={() => navigate("/products")}>
              ← Continue Shopping
            </GoldBtn>
            <div style={{ display:"flex", gap:10 }}>
              <OutlineBtn onClick={clearCart}>
                Clear Cart
              </OutlineBtn>
            </div>
          </div>

          {/* ── Bottom 3-col section ── */}
          <div className="cart-bottom">

            {/* Coupon */}
            <div className="cart-panel">
              <p style={{ fontFamily:J, fontSize:13, color:"#555",
                marginBottom:16, fontWeight:400 }}>
                Apply coupon code here
              </p>
              <label className="cart-label">Enter your coupon code</label>
              <input className="cart-input" value={coupon}
                onChange={e => {
                  const nextCoupon = e.target.value;
                  setCoupon(nextCoupon);
                  setCouponMsg(null);
                  if (!nextCoupon.trim()) clearPromo();
                }}
                placeholder="e.g. SAVE10"
                style={{ marginBottom:14 }}/>
              {couponApplied && (
                <p style={{ fontSize:12, marginBottom:12, color:"#4caf50" }}>
                  Active promo: <strong>{promo.code}</strong>
                </p>
              )}
              {couponMsg && (
                <p style={{ fontSize:12, marginBottom:12,
                  color: couponMsg.ok ? "#4caf50" : "#e05252" }}>
                  {couponMsg.text}
                </p>
              )}
              <DarkBtn onClick={applyCoupon}>Apply Code</DarkBtn>
            </div>

            {/* Order summary */}
            <div className="cart-panel" style={{ background:"#fafafa" }}>
              <div style={{ display:"flex", justifyContent:"space-between",
                alignItems:"center", marginBottom:10 }}>
                <span style={{ fontSize:13, color:"#999" }}>Subtotal</span>
                <span style={{ fontFamily:J, fontSize:14, fontWeight:600,
                  color:"#1a1a1a" }}>{formatCurrency(subtotal)}</span>
              </div>

              {shipping > 0 && (
                <div style={{ display:"flex", justifyContent:"space-between",
                  alignItems:"center", marginBottom:10 }}>
                  <span style={{ fontSize:13, color:"#999" }}>Shipping</span>
                  <span style={{ fontFamily:J, fontSize:14, fontWeight:600,
                    color:"#1a1a1a" }}>{formatCurrency(shipping)}</span>
                </div>
              )}

              {couponApplied && discount > 0 && (
                <div style={{ display:"flex", justifyContent:"space-between",
                  alignItems:"center", marginBottom:10 }}>
                  <span style={{ fontSize:13, color:"#4caf50" }}>Discount</span>
                  <span style={{ fontFamily:J, fontSize:14, fontWeight:600,
                    color:"#4caf50" }}>− {formatCurrency(discount)}</span>
                </div>
              )}

              <div style={{ borderTop:"1px solid #e8e8e8", paddingTop:14,
                marginTop:4, marginBottom:20,
                display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontFamily:J, fontSize:15, fontWeight:700,
                  color:"#1a1a1a", letterSpacing:1, textTransform:"uppercase" }}>
                  Grand Total
                </span>
                <span style={{ fontFamily:J, fontSize:20, fontWeight:700,
                  color:"#1a1a1a" }}>{formatCurrency(grandTotal)}</span>
              </div>

              <GoldBtn onClick={() => navigate("/checkout")} style={{ width:"100%",
                textAlign:"center", display:"block", padding:"14px" }}>
                Proceed to Checkout
              </GoldBtn>

              <p style={{ textAlign:"center", marginTop:12, fontSize:12,
                color:"#e05252", fontWeight:600, cursor:"pointer", fontFamily:J }}>
                Checkout with multiple addresses
              </p>

              {/* Accepted payments */}
              <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:20 }}>
                {["VISA","MC","PP","AMEX"].map(p => (
                  <div key={p} style={{ background:"#eee", borderRadius:3,
                    padding:"4px 8px", fontSize:9, fontWeight:700,
                    color:"#777", fontFamily:J, letterSpacing:.5 }}>
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Info strip ── */}
          <div className="cart-info-strip">
            {[
              { icon:"🚚", title:"Free Shipping on Order Over $1000", desc:"Enjoy free delivery on all qualifying orders over $1,000 anywhere in the world." },
              { icon:"🎁", title:"Unlimited Gifts on Every Order",     desc:"We include a complimentary gift with every order placed through our store." },
              { icon:"🔒", title:"100% Money Back Guarantee",          desc:"Not happy? Return your order within 30 days for a full, no-questions-asked refund." },
            ].map(c => (
              <div key={c.title} style={{ flex:1, background:"#f8f8f8",
                borderRadius:4, padding:"26px 22px", minWidth:200 }}>
                <p style={{ fontFamily:J, fontSize:11, fontWeight:700,
                  letterSpacing:1, textTransform:"uppercase",
                  color:"#1a1a1a", marginBottom:10 }}>
                  {c.icon} {c.title}
                </p>
                <p style={{ fontSize:13, color:"#999", lineHeight:1.7, margin:0 }}>
                  {c.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
