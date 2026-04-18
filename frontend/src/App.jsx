import { useLayoutEffect } from "react";
import { Routes, Route, useLocation, useParams } from "react-router-dom";
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
import About from "./pages/About";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductEdit from "./pages/admin/AdminProductEdit";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";

// Forces ProductDetail to fully remount when the product id changes
// This ensures useFetch re-runs and loads the new product
function ProductDetailWithKey() {
  const { id } = useParams();
  return <ProductDetail key={id} />;
}

// Pages that should be full width (no container padding)
const FULL_WIDTH_PAGES = ["/", "/login", "/register", "/cart", "/checkout"];
const FOOTER_HIDDEN_PAGES = ["/login", "/register"];

function App() {
  const { pathname, search } = useLocation();
  const isProductDetailPage = pathname.startsWith("/products/");
  const isFullWidth = FULL_WIDTH_PAGES.includes(pathname) || isProductDetailPage;
  const showFooter = !FOOTER_HIDDEN_PAGES.includes(pathname);
  const constrainedMainStyle = {
    flex: 1,
    maxWidth: "1280px",
    width: "100%",
    margin: "0 auto",
    padding: "24px 20px",
  };

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--theme-bg)" }}>
      <Navbar />

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
          <Route path="/about" element={<About />} />
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
