import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import useCart from "../hooks/useCart";
import formatCurrency from "../utils/formatCurrency";

/* ─── DATA ─── */
const slides = [
  {
    tag: "The Latest Winter Products for 2025",
    price: 299.99,
    title: "Look Hot With\n2025 Style",
    sub: "Discover our newest collection of premium winter fashion crafted for the modern wardrobe.",
    img: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1920&q=90",
    pos: "center 20%",
  },
  {
    tag: "Summer Collection Is Here",
    price: 199.99,
    title: "Feel Fresh &\nStay Stylish",
    sub: "Explore our vibrant summer lineup featuring light fabrics and bold designs.",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=90",
    pos: "center 15%",
  },
  {
    tag: "New Arrivals — Men's Edition",
    price: 249.99,
    title: "Dress Sharp\nEvery Day",
    sub: "Premium menswear designed for confidence, comfort and class.",
    img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1920&q=90",
    pos: "center 25%",
  },
];

const testimonials = [
  { name: "Sarah Johnson", role: "Verified Buyer", text: "Absolutely love the quality of the clothes! The fabric feels premium and the stitching is perfect. Will definitely shop again and again." },
  { name: "Michael Chen", role: "Fashion Blogger", text: "BoShop has completely changed how I think about online fashion. Fast delivery, great packaging, and stunning designs every time." },
  { name: "Emily Davis", role: "Loyal Customer", text: "I've been shopping here for 2 years and every single order has been perfect. Customer service is truly outstanding!" },
];

function formatKnowledgeDate(value) {
  if (!value) return "Latest story";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

/* ─── PRODUCT CARD ─── */
function ProductCard({ product, onAddToCart }) {
  const [hov, setHov] = useState(false);
  const cardRadius = 16;
  const pillRadius = 999;
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: "transparent", cursor: "pointer", borderRadius: cardRadius, overflow: "visible", boxShadow: hov ? "0 24px 40px rgba(36, 28, 23, 0.12)" : "0 12px 26px rgba(36, 28, 23, 0.07)", transition: "box-shadow 0.3s ease, transform 0.3s ease", transform: hov ? "translateY(-4px)" : "translateY(0)" }}>
      <div style={{ position: "relative", overflow: "hidden", paddingBottom: "125%", background: "var(--theme-panel)", borderRadius: cardRadius }}>
        <img src={product.image || product.img} alt={product.name}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
            transition: "transform 0.45s ease", transform: hov ? "scale(1.07)" : "scale(1)" }} />
        {product.badge && (
          <span style={{ position: "absolute", top: 10, left: 10, background: "var(--theme-accent)",
            color: "var(--theme-surface)", fontSize: 10, fontWeight: 700, letterSpacing: 1,
            padding: "3px 9px", textTransform: "uppercase", fontFamily: "var(--font-display)",
            borderRadius: pillRadius }}>
            {product.badge}
          </span>
        )}
        <div style={{ position: "absolute", left: 12, right: 12, bottom: 12, zIndex: 2,
          background: "rgba(255, 253, 249, 0.95)", borderRadius: cardRadius,
          padding: "13px 14px 14px", boxShadow: "0 14px 32px rgba(36, 28, 23, 0.12)",
          backdropFilter: "blur(8px)", transition: "transform 0.28s ease, opacity 0.28s ease",
          transform: hov ? "translateY(110%)" : "translateY(0)", opacity: hov ? 0 : 1 }}>
          <Link to={`/products/${product._id}`} style={{ textDecoration: "none" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600,
              color: "var(--theme-ink)", marginBottom: 5, letterSpacing: 0.4, lineHeight: 1.3,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {product.name}
            </p>
          </Link>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, color: "var(--theme-accent)" }}>
              {formatCurrency(product.price || 0)}
            </span>
            {product.oldPrice && (
              <span style={{ fontSize: 12, color: "#b8aa9a", textDecoration: "line-through" }}>
                {formatCurrency(product.oldPrice)}
              </span>
            )}
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0,
          background: "transparent", padding: "12px",
          display: "flex", gap: 6, justifyContent: "center",
          transform: hov ? "translateY(0)" : "translateY(101%)",
          transition: "transform 0.32s ease", zIndex: 3 }}>
          <button onClick={() => onAddToCart(product)}
            style={{ flex: 1, background: "var(--theme-accent)", color: "var(--theme-surface)", border: "none",
              padding: "9px 6px", fontSize: 10, fontFamily: "var(--font-body)",
              fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", cursor: "pointer",
              borderRadius: pillRadius }}>
            Add To Cart
          </button>
          <Link to={`/products/${product._id}`}
            style={{ background: "var(--theme-dark-soft)", color: "var(--theme-surface)",
              border: "1px solid var(--theme-dark-soft)", padding: "9px 12px",
              fontSize: 10, fontFamily: "var(--font-body)", fontWeight: 700,
              textTransform: "uppercase", textDecoration: "none",
              display: "flex", alignItems: "center", whiteSpace: "nowrap",
              borderRadius: pillRadius }}>
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── HOME ─── */
export default function Home() {
  const [slide, setSlide] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [testiIdx, setTestiIdx] = useState(0);
  const [email, setEmail] = useState("");
  const timerRef = useRef(null);

  const { data: products } = useFetch("/products");
  const {
    data: vogueFeed,
    loading: vogueLoading,
    error: vogueError,
  } = useFetch("/content/vogue?limit=3");
  const { addToCart } = useCart();
  const display = Array.isArray(products) ? products.slice(0, 8) : [];
  const vogueArticles = Array.isArray(vogueFeed?.articles) ? vogueFeed.articles : [];

  // Auto-advance slider
  useEffect(() => {
    timerRef.current = setInterval(() => setSlide(s => (s + 1) % slides.length), 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  const goSlide = (i) => { clearInterval(timerRef.current); setSlide(i); timerRef.current = setInterval(() => setSlide(s => (s + 1) % slides.length), 5000); };
  const prev = () => goSlide((slide + slides.length - 1) % slides.length);
  const next = () => goSlide((slide + 1) % slides.length);

  return (
    <>
      <style>{`
        html { scroll-behavior: smooth; }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .bw {
          font-family: var(--font-body);
          background: linear-gradient(180deg, rgba(255, 253, 249, 0.98) 0%, rgba(246, 241, 234, 0.92) 100%);
          color: var(--theme-text);
          --bw-radius-sm: 10px;
          --bw-radius-md: 18px;
          --bw-radius-lg: 28px;
          --bw-radius-pill: 999px;
        }
        .bw a { text-decoration: none; color: inherit; }
        .bw button { font-family: inherit; }

        /* Full-bleed helper */
        .bw-bleed {
          width: 100%;
          max-width: 100%;
          position: relative;
        }

        /* Centered content wrapper */
        .bw-wrap {
          max-width: 1260px;
          margin: 0 auto;
          padding: 0 30px;
        }
        @media(max-width:600px){ .bw-wrap { padding: 0 16px; } }

        /* ═══ HERO ═══ */
       /* ═══ HERO ═══ */
.bw-hero {
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  position: relative;
 
}
  

/* FIXED BACKGROUND */
.bw-hero-fixed {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url("/images/ChatGPT%20Image%20Apr%2017,%202026,%2011_33_00%20AM.png");
  background-size: cover;
  background-position: center;
  background-attachment: sticky;
  display: flex;
  align-items: center;
}

/* DARK GRADIENT OVERLAY */
.bw-hero-grad {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(100deg, rgba(23,16,13,0.85) 20%, rgba(23,16,13,0.35) 30%, rgba(23,16,13,0.1) 100%),
    radial-gradient(circle at top left, rgba(176,122,79,0.25), transparent 100%);
}

/* CONTENT POSITION */
.bw-hero-body {
  position: relative;
  z-index: 2;
  padding: 0 6vw;
  max-width: 650px;
}

/* SMALL TEXT */
.bw-hero-eyebrow {
  font-size: 11px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #d6b08c;
  margin-bottom: 12px;
  font-weight: 600;
}

/* PRICE */
.bw-hero-price {
  font-size: 18px;
  color: #d6b08c;
  font-weight: 700;
  letter-spacing: 0.2em;
  margin-bottom: 16px;
}

/* MAIN HEADING */
.bw-hero-h1 {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 600;
  color: #fff;
  line-height: 1.05;
  white-space: pre-line;
  margin-bottom: 20px;
}

/* SUBTEXT */
.bw-hero-sub {
  font-size: 14px;
  color: rgba(255,255,255,0.75);
  line-height: 1.8;
  margin-bottom: 30px;
  max-width: 420px;
}

/* BUTTON */
.bw-cta {
  display: inline-block;
  background: #c08a5a;
  color: #fff;
  padding: 14px 42px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  border-radius: 999px;
  transition: 0.25s;
}

.bw-cta:hover {
  background: #a97445;
  transform: translateY(-2px);
}

        /* ═══ FEATURE STRIP ═══ */
        .bw-feat { background: #1e1e1e; }
        .bw-feat-grid {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          border-left: 1px solid #2e2e2e;
          border-radius: var(--bw-radius-md);
          overflow: hidden;
        }
        .bw-feat-cell {
          display: flex; align-items: center; gap: 14px;
          padding: clamp(16px,2vw,24px) clamp(14px,2vw,22px);
          border-right: 1px solid #2e2e2e;
          border-bottom: 1px solid #2e2e2e;
          border-top: 1px solid #2e2e2e;
        }
        .bw-feat-icon { font-size: clamp(22px,2.5vw,30px); flex-shrink: 0; }
        .bw-feat-name {
          font-family: var(--font-display);
          font-size: clamp(10px,1vw,12px); font-weight: 700;
          color: var(--theme-surface); letter-spacing: 0.8px;
          text-transform: uppercase; margin-bottom: 3px;
        }
        .bw-feat-note { font-size: 11px; color: #666; }

        /* ═══ SECTION SHELL ═══ */
        .bw-section { padding: clamp(48px,7vw,88px) 0; }
        .bw-section-alt { background: linear-gradient(180deg, rgba(242, 233, 222, 0.76) 0%, rgba(255, 253, 249, 0.78) 100%); }
        .bw-head { text-align: center; margin-bottom: clamp(28px,4vw,52px); }
        .bw-ey {
          font-family: var(--font-body);
          font-size: 11px; letter-spacing: 3.5px;
          text-transform: uppercase; color: var(--theme-accent);
          margin-bottom: 10px; font-weight: 600;
        }
        .bw-h2 {
          font-family: var(--font-display);
          font-size: clamp(20px,2.8vw,30px);
          font-weight: 700; color: var(--theme-ink); letter-spacing: 1px;
          margin-bottom: 0;
        }
        .bw-bar {
          width: 44px; height: 3px; background: var(--theme-accent);
          margin: 11px auto 14px;
        }
        .bw-sub {
          font-size: 14px; color: var(--theme-muted); line-height: 1.7;
          max-width: 520px; margin: 0 auto;
        }

        /* TABS */
        .bw-tabs {
          display: flex; border-bottom: 2px solid var(--theme-border);
          margin-bottom: clamp(20px,3vw,38px);
          overflow-x: auto; -webkit-overflow-scrolling: touch;
        }
        .bw-tab {
          flex-shrink: 0; background: none; border: none;
          font-family: var(--font-display);
          font-size: clamp(11px,1.1vw,13px); font-weight: 600;
          letter-spacing: 1px; text-transform: uppercase;
          color: var(--theme-muted); cursor: pointer;
          padding: clamp(10px,1.2vw,14px) clamp(16px,2.5vw,30px);
          border-bottom: 2px solid transparent;
          margin-bottom: -2px; transition: all 0.2s;
          border-radius: var(--bw-radius-pill) var(--bw-radius-pill) 0 0;
        }
        .bw-tab.on { color: var(--theme-accent); border-bottom-color: var(--theme-accent); }
        .bw-tab:hover { color: var(--theme-accent); }

        /* PRODUCT GRID */
        .bw-pg4 {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: clamp(14px,2vw,28px);
        }

        /* VIEW ALL */
        .bw-view-all {
          display: inline-block;
          border: 1px solid var(--theme-ink); color: var(--theme-ink);
          padding: clamp(10px,1.2vw,13px) clamp(28px,4vw,52px);
          font-family: var(--font-body);
          font-size: clamp(10px,1vw,12px); font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          margin-top: clamp(28px,4vw,48px);
          transition: all 0.22s;
          border-radius: var(--bw-radius-pill);
        }
        .bw-view-all:hover { background: var(--theme-ink); color: var(--theme-surface); }

        .bw-empty-products {
          border: 1px solid var(--theme-border);
          background: rgba(255, 253, 249, 0.86);
          border-radius: var(--bw-radius-md);
          padding: clamp(22px, 3vw, 30px);
          text-align: center;
          color: var(--theme-muted);
          font-size: 14px;
          line-height: 1.8;
        }

        /* ═══ ABOUT ═══ */
        .bw-about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(28px,5vw,80px);
          align-items: center;
        }
        .bw-about-img {
          width: 100%; aspect-ratio: 4/5;
          object-fit: cover; display: block;
          border-radius: var(--bw-radius-md);
        }
        .bw-tl {
          padding-left: 16px;
          border-left: 3px solid var(--theme-accent);
          margin-bottom: 18px;
        }
        .bw-tl-yr {
          font-family: var(--font-display);
          font-size: 11px; font-weight: 700;
          color: var(--theme-accent); letter-spacing: 2px; margin-bottom: 4px;
        }
        .bw-tl-tx { font-size: 13px; color: var(--theme-muted); line-height: 1.8; }
        .bw-chk { list-style: none; margin: 18px 0 26px; }
        .bw-chk li {
          display: flex; align-items: center; gap: 10px;
          padding: 7px 0; font-size: 14px; color: var(--theme-text);
          border-bottom: 1px solid var(--theme-border);
        }
        .bw-chk li::before {
          content: '✓'; color: var(--theme-accent);
          font-weight: 700; font-size: 15px; flex-shrink: 0;
        }
        .bw-gold {
          display: inline-block; background: var(--theme-accent); color: var(--theme-surface);
          padding: clamp(11px,1.3vw,14px) clamp(26px,3.5vw,42px);
          font-family: var(--font-body);
          font-size: clamp(11px,1vw,12px); font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          transition: background 0.22s;
          border-radius: var(--bw-radius-pill);
        }
        .bw-gold:hover { background: var(--theme-accent-strong); color: var(--theme-surface); }

        /* ═══ PROMO ═══ */
        .bw-promo {
          width: 100%;
          min-height: clamp(260px,38vh,420px);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          background-image: url('images/c68937db-af5f-40a9-8a34-5162494f291c.png');
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          background-attachment:fixed;
        }
        .bw-promo-ov {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(23, 16, 13, 0.52) 0%, rgba(23, 16, 13, 0.68) 100%);
        }
        .bw-promo-body {
          position: relative; z-index: 2;
          text-align: center;
          padding: clamp(40px,6vw,64px) clamp(20px,4vw,48px);
          max-width: 680px;
        }
        .bw-promo-h {
          font-family: var(--font-display);
          font-size: clamp(1.3rem,3.5vw,2.6rem);
          font-weight: 700; color: var(--theme-surface);
          letter-spacing: 1px; margin-bottom: 14px;
        }
        .bw-promo-p {
          font-size: clamp(13px,1.3vw,15px);
          color: rgba(255,255,255,0.74);
          max-width: 500px; margin: 0 auto 28px; line-height: 1.85;
        }

        /* ═══ BLOG ═══ */
        .bw-blog-grid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: clamp(16px,2.5vw,32px);
        }
        .bw-bc {
          background: var(--theme-surface); border: 1px solid var(--theme-border);
          transition: box-shadow 0.3s; overflow: hidden;
          border-radius: var(--bw-radius-md);
        }
        .bw-bc:hover { box-shadow: 0 18px 38px rgba(36, 28, 23, 0.12); }
        .bw-bc-iw { overflow: hidden; }
        .bw-bc-img {
          width: 100%; aspect-ratio: 16/10;
          object-fit: cover; display: block;
          transition: transform 0.45s;
        }
        .bw-bc:hover .bw-bc-img { transform: scale(1.06); }
        .bw-bc-body { padding: clamp(14px,2vw,22px); }
        .bw-bc-meta { font-size: 11px; color: var(--theme-muted); margin-bottom: 8px; }
        .bw-bc-meta b { color: var(--theme-accent); font-weight: 400; }
        .bw-bc-title {
          font-family: var(--font-display);
          font-size: clamp(13px,1.2vw,15px); font-weight: 600;
          color: var(--theme-ink); margin-bottom: 8px; line-height: 1.45;
          letter-spacing: 0.3px;
        }
        .bw-bc-title a:hover { color: var(--theme-accent); }
        .bw-bc-ex { font-size: 13px; color: var(--theme-muted); line-height: 1.75; margin-bottom: 12px; }
        .bw-rm {
          font-family: var(--font-body);
          font-size: 11px; font-weight: 700;
          color: var(--theme-accent); letter-spacing: 0.16em; text-transform: uppercase;
        }
        .bw-rm:hover { text-decoration: underline; }

        /* ═══ TESTIMONIAL ═══ */
        .bw-testi { text-align: center; }
        .bw-testi-q {
          font-size: clamp(14px,1.5vw,16px); color: var(--theme-text);
          line-height: 1.95; max-width: 620px;
          margin: 0 auto 22px; font-style: italic;
        }
        .bw-testi-n {
          font-family: var(--font-display);
          font-size: 13px; font-weight: 700;
          color: var(--theme-ink); letter-spacing: 1px; text-transform: uppercase;
        }
        .bw-testi-r { font-size: 12px; color: var(--theme-accent); margin-top: 4px; }

        /* ═══ NEWSLETTER ═══ */
        .bw-nl {
          background: #1e1e1e;
          padding: clamp(44px,6vw,72px) 0;
          text-align: center;
          border-radius: var(--bw-radius-lg) var(--bw-radius-lg) 0 0;
        }
        .bw-nl h2 {
          font-family: var(--font-display);
          font-size: clamp(18px,2.5vw,26px);
          font-weight: 700; color: var(--theme-surface); letter-spacing: 1px; margin-bottom: 8px;
        }
        .bw-nl p { font-size: 14px; color: #666; margin-bottom: 26px; }
        .bw-nl-row {
          display: flex; justify-content: center;
          max-width: 500px; margin: 0 auto;
          border-radius: var(--bw-radius-pill);
          overflow: hidden;
        }
        .bw-nl-in {
          flex: 1; min-width: 0;
          padding: clamp(11px,1.3vw,14px) 18px;
          border: none; font-size: 14px;
          font-family: var(--font-body); outline: none;
        }
        .bw-nl-btn {
          background: var(--theme-accent); color: var(--theme-surface); border: none;
          padding: clamp(11px,1.3vw,14px) clamp(18px,2.5vw,28px);
          font-family: var(--font-display);
          font-size: 11px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          cursor: pointer; white-space: nowrap;
          transition: background 0.2s;
        }
        .bw-nl-btn:hover { background: var(--theme-accent-strong); }

        /* ═══ BRANDS ═══ */
        .bw-brands {
          padding: clamp(28px,4vw,44px) 0;
          border-top: 1px solid #efefef;
        }
        .bw-brand-row {
          display: flex; justify-content: space-around;
          align-items: center; flex-wrap: wrap; gap: 20px;
        }
        .bw-brand {
          font-family: var(--font-display);
          font-size: clamp(14px,1.8vw,20px); font-weight: 700;
          color: #cec0b2; letter-spacing: 4px; text-transform: uppercase;
          cursor: pointer; transition: color 0.2s;
        }
        .bw-brand:hover { color: var(--theme-accent); }

        /* ═══ RESPONSIVE ═══ */
        @media (max-width: 1024px) {
          .bw-pg4 { grid-template-columns: repeat(3,1fr); }
        }
        @media (max-width: 900px) {
          .bw-feat-grid { grid-template-columns: repeat(2,1fr); }
          .bw-about-grid { grid-template-columns: 1fr; gap: 30px; }
          .bw-about-img { aspect-ratio: 16/9; }
        }
        @media (max-width: 768px) {
          .bw-pg4 { grid-template-columns: repeat(2,1fr); gap: 14px; }
          .bw-blog-grid { grid-template-columns: repeat(2,1fr); }
          .bw-hero-sub { display: none; }
          .bw-promo { background-attachment: scroll; }
        }
        @media (max-width: 580px) {
          .bw-feat-grid { grid-template-columns: 1fr 1fr; }
          .bw-feat-cell { padding: 14px 12px; }
          .bw-blog-grid { grid-template-columns: 1fr; }
          .bw-nl-row { flex-direction: column; }
          .bw-nl-in, .bw-nl-btn { width: 100%; }
        }
        @media (max-width: 420px) {
          .bw-pg4 { grid-template-columns: repeat(2,1fr); gap: 10px; }
          .bw-hero-price { display: none; }
        }
      /* ══ INFO FEATURES ══ */
.bw-info-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: var(--theme-panel);
}
.bw-info-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: clamp(28px, 4vw, 48px) clamp(16px, 2vw, 28px);
  border-right: 1px solid var(--theme-border);
  background: var(--theme-panel);
}
.bw-info-cell:nth-child(even) { background: rgba(255, 253, 249, 0.55); }
.bw-info-cell:last-child { border-right: none; }
.bw-info-title {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--theme-ink);
  margin: 14px 0 8px;
}
.bw-info-desc {
  font-size: 13px;
  color: var(--theme-muted);
  line-height: 1.65;
  max-width: 190px;
  margin: 0;
}
@media (max-width: 768px) {
  .bw-info-strip { grid-template-columns: repeat(2, 1fr); }
  .bw-info-cell:nth-child(2) { border-right: none; }
  .bw-info-cell { border-bottom: 1px solid var(--theme-border); }
}
@media (max-width: 420px) {
  .bw-info-strip { grid-template-columns: 1fr; }
  .bw-info-cell { border-right: none; }
}`
      }</style>

      <div className="bw">

        {/* ══ HERO ══ */}
       {/* ══ HERO (STATIC + FIXED BACKGROUND) ══ */}
<div className="bw-hero bw-bleed">
  <div className="bw-hero-fixed">

    {/* overlay */}
    <div className="bw-hero-grad" />

    {/* content */}
    <div className="bw-hero-body">
      <p className="bw-hero-eyebrow">
        THE LATEST WINTER PRODUCTS FOR 2025
      </p>

      <p className="bw-hero-price">{formatCurrency(slides[slide].price)}</p>

      <h1 className="bw-hero-h1">
        Look Hot{"\n"}With{"\n"}2025 Style
      </h1>

      <p className="bw-hero-sub">
        Discover our newest collection of premium winter fashion
        crafted for the modern wardrobe.
      </p>

      <Link to="/products" className="bw-cta">
        Shop Now
      </Link>
    </div>

  </div>
</div>

        {/* ══ FEATURES ══ }
        <div className="bw-feat bw-bleed">
          <div className="bw-wrap">
            <div className="bw-feat-grid">
              {[
              { icon: "🚚", name: `Free Shipment Over ${formatCurrency(50)}`, note: "On all qualifying orders" },
                { icon: "💬", name: "24/7 Online Support", note: "We're always here for you" },
                { icon: "🔒", name: "100% Secure Payment", note: "SSL encrypted checkout" },
                { icon: "🌍", name: "World Wide Shipment", note: "Delivered to your door" },
              ].map(f => (
                <div key={f.name} className="bw-feat-cell">
                  <span className="bw-feat-icon">{f.icon}</span>
                  <div>
                    <p className="bw-feat-name">{f.name}</p>
                    <p className="bw-feat-note">{f.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>*/}
      

        

        {/* ══ BEST COLLECTION ══ */}
        <div className="bw-section">
          <div className="bw-wrap">
            <div className="bw-head">
              <p className="bw-ey">Explore Our Range</p>
              <h2 className="bw-h2">Best Collection Arrived</h2>
              <div className="bw-bar" />
              <p className="bw-sub">Discover the finest pieces from our latest seasonal collection.</p>
            </div>
            {/*<div className="bw-tabs">
              {["Best Selling", "Hand Made Items", "Top 10 Specials"].map((t, i) => (
                <button key={i} className={`bw-tab${activeTab === i ? " on" : ""}`} onClick={() => setActiveTab(i)}>{t}</button>
              ))}
            </div>*/}
            {display.length > 0 ? (
              <div className="bw-pg4">
                {display.map(p => <ProductCard key={p._id} product={p} onAddToCart={addToCart} />)}
              </div>
            ) : (
              <div className="bw-empty-products">No products available yet.</div>
            )}
            <div style={{ textAlign: "center" }}>
              <Link to="/products" className="bw-view-all">View All Products</Link>
            </div>
          </div>
        </div>

        {/* ══ ABOUT ══ */}
        <div className="bw-section bw-section-alt">
          <div className="bw-wrap">
            <div className="bw-about-grid">
              <img src="images/c68937db-af5f-40a9-8a34-5162494f291c.png" />
              <div>
                <p className="bw-ey" style={{ textAlign: "left" }}>Our Story</p>
                <h2 className="bw-h2" style={{ textAlign: "left" }}>A Brief History of BAYA</h2>
                <div className="bw-bar" style={{ margin: "11px 0 16px" }} />
                <p style={{ fontSize: 14, color: "var(--theme-muted)", lineHeight: 1.9, marginBottom: 22 }}>
                 BAYA Clothing was born from a simple idea: to create pieces that embody quiet elegance and purposeful design. Inspired by the baya bird—renowned for its intricately woven nests—our brand reflects the same dedication to craftsmanship, precision, and natural beauty.

Just as the baya bird carefully selects each strand to build something both functional and beautiful, BAYA Clothing focuses on thoughtful construction, clean silhouettes, and refined details. Every piece is designed with intention, blending minimalism with timeless aesthetics to create garments that feel effortless yet distinctive.

Rooted in simplicity, BAYA stands for more than just clothing—it represents a philosophy of design where less is more, and every element has meaning. Our collections are built for those who appreciate subtle luxury, modern identity, and the art of understated style.

BAYA Clothing — Woven with purpose, defined by simplicity.
                </p>
               
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(14px,1.5vw,17px)", color: "var(--theme-ink)", margin: "20px 0 10px", fontWeight: 700 }}>
                  Fully Customizable &amp; Beautiful
                </h3>
                <ul className="bw-chk">
                  <li>Fully Customizable Designs</li>
                  <li>100% Hand Made with Care</li>
                  <li>Elegant Looks for All Occasions</li>
                </ul>
                <Link to="/products" className="bw-gold">Order Now</Link>
              </div>
            </div>
          </div>
        </div>
          {/* ══ INFO FEATURES ══ */}
<div className="bw-info-strip bw-bleed">
  {[
    {
      title: "Free Shipping",
      desc: `Shipping worldwide for orders over ${formatCurrency(99)}`,
      icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--theme-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    },
    {
      title: "Special Gift",
      desc: "Give the perfect gift to your loved ones",
      icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--theme-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
    },
    {
      title: "Money Back",
      desc: "Not satisfied? Full refund within 30 days",
      icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--theme-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    },
    {
      title: "Support 24/7",
      desc: "We are here for you around the clock",
      icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--theme-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    },
  ].map(f => (
    <div key={f.title} className="bw-info-cell">
      {f.icon}
      <p className="bw-info-title">{f.title}</p>
      <p className="bw-info-desc">{f.desc}</p>
    </div>
  ))}
</div>

        {/* ══ POPULAR PRODUCTS ══ */}
        <div className="bw-section">
          <div className="bw-wrap">
            <div className="bw-head">
              <p className="bw-ey">Fan Favourites</p>
              <h2 className="bw-h2">Popular Products</h2>
              <div className="bw-bar" />
              <p className="bw-sub">Loved by thousands of customers around the world.</p>
            </div>
            {display.length > 0 ? (
              <div className="bw-pg4">
                {display.map(p => <ProductCard key={p._id + "b"} product={p} onAddToCart={addToCart} />)}
              </div>
            ) : (
              <div className="bw-empty-products">Popular products will appear here once items are added.</div>
            )}
          </div>
        </div>


        {/* ══ PROMO BANNER ══ */}
        <div className="bw-promo bw-bleed">
          <div className="bw-promo-ov" />
          <div className="bw-promo-body">
            <p className="bw-ey" style={{ marginBottom: 14 }}>Limited Time Offer</p>
            <h2 className="bw-promo-h">We Always Stay With Our Clients</h2>
            <p className="bw-promo-p">We deliver 100% and provide instant response to help you succeed in this constantly changing and challenging business world.</p>
            <Link to="/products" className="bw-cta">Shop Now</Link>
          </div>
        </div>

        {/* ══ BLOG ══ */}
        <div className="bw-section">
          <div className="bw-wrap">
            <div className="bw-head">
              <p className="bw-ey">Latest Updates</p>
              <h2 className="bw-h2">Knowledge Share</h2>
              <div className="bw-bar" />
              <p className="bw-sub">Fresh stories from British Vogue, with direct links to the original articles.</p>
            </div>
            {vogueLoading ? (
              <div className="bw-empty-products">Loading latest British Vogue stories...</div>
            ) : vogueError ? (
              <div className="bw-empty-products">We could not load Vogue stories right now. Please try again shortly.</div>
            ) : vogueArticles.length > 0 ? (
              <div className="bw-blog-grid">
                {vogueArticles.map((article, index) => (
                  <article key={`${article.link}-${index}`} className="bw-bc">
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noreferrer"
                      className="bw-bc-iw"
                      aria-label={`Open British Vogue article: ${article.title}`}
                    >
                      <img src={article.image} alt={article.title} className="bw-bc-img" />
                    </a>
                    <div className="bw-bc-body">
                      <p className="bw-bc-meta">
                        <b>{formatKnowledgeDate(article.publishedAt)}</b>
                        {article.author ? ` · By ${article.author}` : ""}
                        {" · British Vogue"}
                      </p>
                      <h3 className="bw-bc-title">
                        <a href={article.link} target="_blank" rel="noreferrer">
                          {article.title}
                        </a>
                      </h3>
                      <p className="bw-bc-ex">{article.description}</p>
                      <a href={article.link} target="_blank" rel="noreferrer" className="bw-rm">
                        Read On Vogue →
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bw-empty-products">No Vogue stories are available at the moment.</div>
            )}
          </div>
        </div>

        {/* ══ TESTIMONIALS ══ */}
        <div className="bw-section bw-section-alt bw-testi">
          <div className="bw-wrap">
            <p className="bw-ey">What People Say</p>
            <h2 className="bw-h2">Customer Reviews</h2>
            <div className="bw-bar" />
            <p className="bw-testi-q">"{testimonials[testiIdx].text}"</p>
            <p className="bw-testi-n">{testimonials[testiIdx].name}</p>
            <p className="bw-testi-r">{testimonials[testiIdx].role}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 9, marginTop: 24 }}>
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setTestiIdx(i)}
                  style={{ width: i === testiIdx ? 26 : 9, height: 9, borderRadius: 5, border: "none", cursor: "pointer", background: i === testiIdx ? "var(--theme-accent)" : "#cec0b2", transition: "all 0.3s" }} />
              ))}
            </div>
          </div>
        </div>

        {/* ══ NEWSLETTER ══ */}
      

        {/* ══ BRANDS ══ 
        <div className="bw-brands">
          <div className="bw-wrap">
            <div className="bw-brand-row">
              {["GUCCI", "PRADA", "ZARA", "H&M", "VERSACE"].map(b => (
                <span key={b} className="bw-brand">{b}</span>
              ))}
            </div>
          </div>
        </div>*/}

      </div>
    </>
  );
}
