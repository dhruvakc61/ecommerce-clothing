import { useLayoutEffect } from "react";
import { Routes, Route, useLocation, useParams, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import OrderHistory from "./pages/OrderHistory";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductEdit from "./pages/admin/AdminProductEdit";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";
import useCart from "./hooks/useCart";

// Forces ProductDetail to fully remount when the product id changes
// This ensures useFetch re-runs and loads the new product
function ProductDetailWithKey() {
  const { id } = useParams();
  return <ProductDetail key={id} />;
}

// Pages that should be full width (no container padding)
const FULL_WIDTH_PAGES = ["/", "/login", "/register", "/cart", "/checkout"];
const FOOTER_HIDDEN_PAGES = ["/login", "/register"];

function CartToast() {
  const { cartNotice, dismissCartNotice } = useCart();

  if (!cartNotice) return null;

  return (
    <>
      <style>{`
        .app-cart-toast {
          position: fixed;
          right: 18px;
          bottom: 18px;
          z-index: 2500;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          width: min(360px, calc(100vw - 32px));
          padding: 14px 16px;
          border-radius: 18px;
          background: rgba(31, 24, 20, 0.96);
          color: var(--theme-surface);
          box-shadow: 0 18px 38px rgba(36, 28, 23, 0.22);
          border: 1px solid rgba(216, 177, 138, 0.22);
          backdrop-filter: blur(14px);
        }
        .app-cart-toast-mark {
          width: 26px;
          height: 26px;
          border-radius: 999px;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--theme-accent);
          color: var(--theme-surface);
          font-size: 13px;
          font-weight: 700;
        }
        .app-cart-toast-copy {
          min-width: 0;
          flex: 1;
        }
        .app-cart-toast-title {
          margin: 0 0 4px;
          font-family: var(--font-display);
          font-size: 1.35rem;
          line-height: 1;
          color: var(--theme-surface);
        }
        .app-cart-toast-text {
          margin: 0;
          font-size: 13px;
          line-height: 1.6;
          color: rgba(255, 247, 238, 0.8);
        }
        .app-cart-toast-close {
          border: none;
          background: transparent;
          color: rgba(255, 247, 238, 0.72);
          cursor: pointer;
          font-size: 18px;
          line-height: 1;
          padding: 0;
          flex-shrink: 0;
        }
      `}</style>

      <div className="app-cart-toast" role="status" aria-live="polite">
        <span className="app-cart-toast-mark">✓</span>
        <div className="app-cart-toast-copy">
          <p className="app-cart-toast-title">Added to Cart</p>
          <p className="app-cart-toast-text">{cartNotice.message}</p>
        </div>
        <button type="button" className="app-cart-toast-close" onClick={dismissCartNotice} aria-label="Dismiss cart message">
          ×
        </button>
      </div>
    </>
  );
}

function App() {
  const { pathname, search, hash } = useLocation();
  const isProductDetailPage = pathname.startsWith("/products/");
  const isAdminPage = pathname.startsWith("/admin");
  const isFullWidth = FULL_WIDTH_PAGES.includes(pathname) || isProductDetailPage || isAdminPage;
  const showFooter = !FOOTER_HIDDEN_PAGES.includes(pathname) && !isAdminPage;
  const constrainedMainStyle = {
    flex: 1,
    maxWidth: "1280px",
    width: "100%",
    margin: "0 auto",
    padding: "24px 20px",
  };

  useLayoutEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.replace(/^#/, ""));
      if (target) {
        target.scrollIntoView({ block: "start", behavior: "auto" });
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search, hash]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--theme-bg)" }}>
      <Navbar />
      <CartToast />

      <main style={isFullWidth ? { flex: 1 } : constrainedMainStyle}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetailWithKey />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<Navigate to="/#our-story" replace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route path="/admin/products/:id" element={<AdminRoute><AdminProductEdit /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {showFooter ? <Footer /> : null}
    </div>
  );
}

export default App;
