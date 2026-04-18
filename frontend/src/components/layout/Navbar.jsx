import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import bayaLogo from "../../assets/baya_logo_transparent.png";

const SHOP_CATEGORIES = [
  { label: "Mens", to: "/products?category=men" },
  { label: "Womens", to: "/products?category=women" },
  { label: "Kids", to: "/products?category=kids" },
  { label: "Accessories", to: "/products?category=accessories" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart, totals } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const profileRef = useRef(null);

  useEffect(() => {
    if (!profileOpen) return undefined;

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${search.trim()}`);
      setSearchOpen(false);
      setSearch("");
    }
  };

  const handleNavLinkClick = () => {
    setMenuOpen(false);
    setSearchOpen(false);
    setCartOpen(false);
    setProfileOpen(false);
    if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMenuOpen(false);
  };

  const cartTotal = totals.subtotal;
  const itemCount = totals.itemCount;

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .boshop-nav { font-family: var(--font-body); }
        .boshop-nav a { text-decoration: none; }

        /* Main Nav */
        .main-nav {
  position: fixed;
  top: 0;
  z-index: 1000;

  width: 100%;
  padding: 0 40px;

  /* Glass effect */
  background: linear-gradient(
    180deg,
    rgba(255, 253, 249, 0.85) 0%,
    rgba(255, 253, 249, 0.25) 100%
  );

  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);

  border-bottom: 1px solid rgba(228, 215, 200, 0.4);
  box-shadow: 0 10px 25px rgba(36, 28, 23, 0.08);
}
        .main-nav-inner {
          margin: 0 auto;
          padding: 0 20px;
          height: 82px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        /* Logo */
        .logo {
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
        }
        .logo img {
          display: block;
          width: clamp(148px, 17vw, 220px);
          height: auto;
          max-height: 62px;
          object-fit: contain;
        }

        /* Desktop Nav Links */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 28px;
          list-style: none;
        }
        .nav-item {
          position: relative;
        }
        .nav-item.has-dropdown {
          padding-bottom: 22px;
          margin-bottom: -22px;
        }
        .nav-item.has-dropdown::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 100%;
          height: 22px;
        }
        .nav-links a {
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--theme-text);
          transition: color 0.2s;
          padding: 4px 0;
          position: relative;
        }
        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--theme-accent);
          transition: width 0.3s;
        }
        .nav-links a:hover { color: var(--theme-accent); }
        .nav-links a:hover::after { width: 100%; }
        .nav-trigger {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .nav-caret {
          font-size: 10px;
          line-height: 1;
          transform: translateY(-1px);
        }
        .shop-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          left: 50%;
          min-width: 220px;
          padding: 12px;
          background: rgba(255, 253, 249, 0.76);
          border: 1px solid rgba(228, 215, 200, 0.64);
          box-shadow: 0 18px 38px rgba(36, 28, 23, 0.12);
          backdrop-filter: blur(20px);
          transform: translateX(-50%) translateY(10px);
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.22s ease, transform 0.22s ease, visibility 0.22s ease;
          pointer-events: none;
          z-index: 2000;
        }
        .shop-dropdown::before {
          content: "";
          position: absolute;
          top: -8px;
          left: 50%;
          width: 14px;
          height: 14px;
          background: rgba(255, 253, 249, 0.76);
          border-left: 1px solid rgba(228, 215, 200, 0.64);
          border-top: 1px solid rgba(228, 215, 200, 0.64);
          transform: translateX(-50%) rotate(45deg);
        }
        .nav-item:hover .shop-dropdown,
        .nav-item:focus-within .shop-dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
          pointer-events: auto;
        }
        .shop-dropdown a {
          display: block;
          padding: 12px 14px;
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--theme-text);
          border-bottom: 1px solid var(--theme-border);
          transition: color 0.2s, background 0.2s;
        }
        .shop-dropdown a:last-child {
          border-bottom: none;
        }
        .shop-dropdown a::after {
          display: none;
        }
        .shop-dropdown a:hover,
        .shop-dropdown a:focus-visible {
          color: var(--theme-accent);
          background: var(--theme-surface-soft);
          outline: none;
        }

        /* Nav Icons */
        .nav-icons {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
        }
        .nav-icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--theme-ink);
          font-size: 18px;
          padding: 4px;
          position: relative;
          transition: color 0.2s;
          display: flex;
          align-items: center;
        }
        .nav-icon-btn:hover { color: var(--theme-accent); }
        .profile-menu-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .profile-menu-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--theme-ink);
          font-size: 18px;
          padding: 4px;
          position: relative;
          transition: color 0.2s;
          display: flex;
          align-items: center;
        }
        .profile-menu-btn:hover {
          color: var(--theme-accent);
        }
        .profile-dropdown {
          position: absolute;
          top: calc(100% + 14px);
          right: 0;
          min-width: 220px;
          padding: 12px;
          background: rgba(255, 253, 249, 0.88);
          border: 1px solid rgba(228, 215, 200, 0.7);
          box-shadow: 0 18px 38px rgba(36, 28, 23, 0.12);
          backdrop-filter: blur(20px);
          border-radius: 18px;
          z-index: 2100;
        }
        .profile-dropdown::before {
          content: "";
          position: absolute;
          top: -7px;
          right: 16px;
          width: 14px;
          height: 14px;
          background: rgba(255, 253, 249, 0.88);
          border-left: 1px solid rgba(228, 215, 200, 0.7);
          border-top: 1px solid rgba(228, 215, 200, 0.7);
          transform: rotate(45deg);
        }
        .profile-dropdown-head {
          padding: 10px 12px 14px;
          border-bottom: 1px solid rgba(228, 215, 200, 0.7);
          margin-bottom: 6px;
        }
        .profile-dropdown-label {
          display: block;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--theme-muted);
          font-weight: 700;
          margin-bottom: 6px;
        }
        .profile-dropdown-name {
          color: var(--theme-ink);
          font-family: var(--font-display);
          font-size: 1.55rem;
          line-height: 1;
        }
        .profile-dropdown-email {
          margin-top: 8px;
          font-size: 13px;
          color: var(--theme-text);
          line-height: 1.6;
          overflow-wrap: anywhere;
        }
        .profile-dropdown-link,
        .profile-dropdown-action {
          display: block;
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--theme-text);
          text-decoration: none;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .profile-dropdown-link:hover,
        .profile-dropdown-action:hover {
          background: var(--theme-surface-soft);
          color: var(--theme-accent);
        }
        .cart-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: var(--theme-accent);
          color: var(--theme-surface);
          font-size: 10px;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Search Dropdown */
        .search-bar {
          background: rgba(242, 233, 222, 0.72);
          border-bottom: 1px solid rgba(228, 215, 200, 0.6);
          padding: 14px 20px;
          display: flex;
          justify-content: center;
          backdrop-filter: blur(18px);
        }
        .search-bar form {
          display: flex;
          width: 100%;
          max-width: 560px;
        }
        .search-bar input {
          flex: 1;
          padding: 10px 16px;
          border: 1px solid var(--theme-border);
          border-right: none;
          font-size: 14px;
          font-family: var(--font-body);
          background: rgba(255, 255, 255, 0.85);
          color: var(--theme-ink);
          outline: none;
        }
        .search-bar button {
          background: var(--theme-accent);
          color: var(--theme-surface);
          border: none;
          padding: 10px 22px;
          font-family: var(--font-body);
          font-size: 12px;
          letter-spacing: 0.16em;
          font-weight: 600;
          cursor: pointer;
          text-transform: uppercase;
        }

        /* Cart Sidebar */
        .cart-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 2000;
        }
        .cart-sidebar {
          position: fixed;
          top: 0;
          right: 0;
          width: 340px;
          height: 100vh;
          background: var(--theme-surface);
          z-index: 2001;
          display: flex;
          flex-direction: column;
          box-shadow: -12px 0 30px rgba(36, 28, 23, 0.18);
        }
        .cart-sidebar-header {
          background: linear-gradient(135deg, var(--theme-dark) 0%, var(--theme-dark-soft) 100%);
          color: var(--theme-surface);
          padding: 18px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-body);
          font-size: 14px;
          letter-spacing: 0.14em;
          font-weight: 600;
          text-transform: uppercase;
        }
        .cart-close-btn {
          background: none;
          border: none;
          color: #fff;
          font-size: 20px;
          cursor: pointer;
        }
        .cart-items-list {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }
        .cart-item-row {
          display: flex;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid var(--theme-border);
          align-items: flex-start;
        }
        .cart-item-img {
          width: 70px;
          height: 80px;
          object-fit: cover;
          flex-shrink: 0;
        }
        .cart-item-info { flex: 1; }
        .cart-item-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--theme-ink);
          margin-bottom: 4px;
        }
        .cart-item-price { font-size: 13px; color: var(--theme-accent); font-weight: 600; }
        .cart-item-qty { font-size: 12px; color: var(--theme-muted); }
        .cart-footer {
          padding: 16px;
          border-top: 1px solid var(--theme-border);
        }
        .cart-subtotal {
          display: flex;
          justify-content: space-between;
          font-weight: 700;
          font-size: 15px;
          margin-bottom: 16px;
          color: var(--theme-ink);
          font-family: var(--font-body);
        }
        .cart-btn {
          display: block;
          width: 100%;
          padding: 12px;
          text-align: center;
          font-family: var(--font-body);
          font-size: 13px;
          letter-spacing: 0.16em;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 8px;
          cursor: pointer;
          border: none;
        }
        .cart-btn-outline {
          background: transparent;
          border: 1px solid var(--theme-ink) !important;
          color: var(--theme-ink);
          transition: all 0.2s;
          text-decoration: none;
        }
        .cart-btn-outline:hover { background: var(--theme-ink); color: var(--theme-surface); }
        .cart-btn-filled {
          background: var(--theme-accent);
          color: var(--theme-surface);
          transition: background 0.2s;
          text-decoration: none;
        }
        .cart-btn-filled:hover { background: var(--theme-accent-strong); }

        /* Mobile menu */
        .hamburger {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          flex-direction: column;
          gap: 5px;
          padding: 4px;
        }
        .hamburger span {
          display: block;
          width: 24px;
          height: 2px;
          background: var(--theme-ink);
          transition: all 0.3s;
        }
        .mobile-menu {
          display: none;
          background: var(--theme-surface);
          border-top: 1px solid var(--theme-border);
          padding: 16px 20px 20px;
          flex-direction: column;
          gap: 4px;
          box-shadow: 0 16px 30px rgba(36, 28, 23, 0.08);
        }
        .mobile-menu a, .mobile-menu button {
          display: block;
          padding: 10px 0;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--theme-ink);
          border-bottom: 1px solid var(--theme-border);
          background: none;
          border-left: none;
          border-right: none;
          border-top: none;
          cursor: pointer;
          text-align: left;
          text-decoration: none;
        }
        .mobile-menu a:hover, .mobile-menu button:hover { color: var(--theme-accent); }

        @media (max-width: 768px) {
          .main-nav {
            padding: 0 12px;
          }
          .nav-links { display: none; }
          .hamburger { display: flex; }
          .mobile-menu { display: flex; }
          .cart-sidebar { width: min(100%, 360px); max-width: none; }
          .main-nav-inner { height: 76px; }
          .logo img { width: clamp(138px, 36vw, 184px); max-height: 54px; }
          .nav-icons { gap: 10px; }
          .nav-icon-btn,
          .profile-menu-btn {
            padding: 6px;
          }
          .profile-dropdown {
            right: -10px;
            min-width: 200px;
          }
          .search-bar {
            padding: 12px 16px;
          }
          .search-bar form {
            max-width: none;
          }
        }
        @media (max-width: 540px) {
          .main-nav {
            padding: 0 8px;
          }
          .main-nav-inner {
            padding: 0 8px;
            gap: 10px;
          }
          .logo img {
            width: clamp(112px, 31vw, 156px);
            max-height: 48px;
          }
          .nav-icons {
            gap: 4px;
          }
          .nav-icon-btn svg,
          .profile-menu-btn svg {
            width: 17px;
            height: 17px;
          }
          .hamburger {
            padding: 6px 4px;
          }
          .search-bar form {
            flex-direction: column;
            gap: 10px;
          }
          .search-bar input {
            border-right: 1px solid var(--theme-border);
          }
          .search-bar button {
            width: 100%;
          }
          .mobile-menu {
            padding-left: 16px;
            padding-right: 16px;
          }
        }
      `}</style>

      {/* Main Nav */}
      <nav className="main-nav boshop-nav">
        <div className="main-nav-inner">
          <Link to="/" className="logo" aria-label="Baya home">
            <img src={bayaLogo} alt="Baya" />
          </Link>

          <ul className="nav-links">
            <li className="nav-item"><Link to="/">Home</Link></li>
            <li className="nav-item has-dropdown">
              <Link to="/products" className="nav-trigger" onClick={handleNavLinkClick}>
                <span>Shop</span>
                <span className="nav-caret">▾</span>
              </Link>
              <div className="shop-dropdown">
                {SHOP_CATEGORIES.map((category) => (
                  <Link key={category.label} to={category.to} onClick={handleNavLinkClick}>
                    {category.label}
                  </Link>
                ))}
              </div>
            </li>
            <li className="nav-item"><Link to="/">Collection</Link></li>
            <li className="nav-item"><Link to="/about">About</Link></li>
            <li className="nav-item"><Link to="/">Contact</Link></li>
          </ul>

          <div className="nav-icons">
            <button className="nav-icon-btn" onClick={() => { setSearchOpen(v => !v); setCartOpen(false); setProfileOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
            <div className="profile-menu-wrap" ref={profileRef}>
              <button
                className="profile-menu-btn"
                onClick={() => {
                  if (!user) {
                    navigate("/login");
                    return;
                  }
                  setProfileOpen((value) => !value);
                  setSearchOpen(false);
                  setCartOpen(false);
                }}
                aria-label={user ? "Open account menu" : "Login"}
                aria-expanded={user ? profileOpen : undefined}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </button>

              {user && profileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-head">
                    <span className="profile-dropdown-label">Signed In</span>
                    <div className="profile-dropdown-name">{user.name}</div>
                    <div className="profile-dropdown-email">{user.email}</div>
                  </div>

                  <Link to="/profile" className="profile-dropdown-link" onClick={handleNavLinkClick}>
                    View Profile
                  </Link>
                  {user.isAdmin && (
                    <Link to="/admin" className="profile-dropdown-link" onClick={handleNavLinkClick}>
                      Admin Panel
                    </Link>
                  )}
                  <button className="profile-dropdown-action" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
            <button className="nav-icon-btn" onClick={() => { setCartOpen(v => !v); setSearchOpen(false); setProfileOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </button>
            <button className="hamburger" onClick={() => { setMenuOpen(v => !v); setProfileOpen(false); }}>
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="mobile-menu">
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/products" onClick={() => setMenuOpen(false)}>Shop</Link>
            {SHOP_CATEGORIES.map((category) => (
              <Link key={category.label} to={category.to} onClick={() => setMenuOpen(false)}>
                {category.label}
              </Link>
            ))}
            <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart ({itemCount})</Link>
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
                {user.isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
                <button onClick={() => { logout(); setMenuOpen(false); }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}

        {/* Search Bar */}
        {searchOpen && (
          <div className="search-bar">
            <form onSubmit={handleSearch}>
              <input autoFocus type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search for products..." />
              <button type="submit">Search</button>
            </form>
          </div>
        )}
      </nav>

      {/* Cart Sidebar */}
      {cartOpen && (
        <>
          <div className="cart-overlay boshop-nav" onClick={() => setCartOpen(false)} />
          <div className="cart-sidebar boshop-nav">
            <div className="cart-sidebar-header">
              <span>Shopping Cart ({itemCount})</span>
              <button className="cart-close-btn" onClick={() => setCartOpen(false)}>x</button>
            </div>
            <div className="cart-items-list">
              {cart.length === 0 ? (
                <p style={{ textAlign: "center", color: "var(--theme-muted)", padding: "40px 0", fontSize: "14px" }}>Your cart is empty</p>
              ) : (
                cart.map(item => (
                  <div key={item.cartItemId || item._id} className="cart-item-row">
                    <img src={item.image || item.thumbnail} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-info">
                      <p className="cart-item-name">{item.name}</p>
                      <p className="cart-item-price">${item.price?.toFixed(2)} USD</p>
                      {item.size && <p className="cart-item-qty">SIZE: {item.size}</p>}
                      <p className="cart-item-qty">QTY: {String(item.qty || 1).padStart(2, "0")}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="cart-footer">
              <div className="cart-subtotal">
                <span>SUBTOTAL:</span>
                <span>${cartTotal.toFixed(2)} USD</span>
              </div>
              <Link to="/cart" className="cart-btn cart-btn-outline" onClick={() => setCartOpen(false)}>View Cart</Link>
              <Link to="/checkout" className="cart-btn cart-btn-filled" onClick={() => setCartOpen(false)}>Check Out</Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
