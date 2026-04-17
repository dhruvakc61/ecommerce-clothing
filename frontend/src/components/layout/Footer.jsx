import { Link } from "react-router-dom";

export default function Footer() {
  const footerLinkColor = "rgba(255, 247, 238, 0.65)";

  return (
    <>
      <footer style={{ background: "var(--theme-dark)", fontFamily: "var(--font-body)", marginTop: "auto" }}>

        {/* Newsletter */}
        <div style={{ background: "linear-gradient(135deg, var(--theme-dark) 0%, var(--theme-dark-soft) 100%)", padding: "3rem 2rem", borderBottom: "1px solid rgba(255, 247, 238, 0.08)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--theme-surface)", margin: "0 0 6px", letterSpacing: "0.02em" }}>Subscribe to Our Newsletter</h3>
              <p style={{ color: "rgba(255, 247, 238, 0.62)", fontSize: "13px", margin: 0 }}>Get exclusive deals, updates and style tips delivered to your inbox.</p>
            </div>
            <div style={{ display: "flex", gap: 0 }}>
              <input type="email" placeholder="Enter your email address" style={{
                width: "280px", padding: "12px 18px", border: "1px solid rgba(255, 247, 238, 0.14)",
                borderRight: "none", background: "rgba(255, 253, 249, 0.08)", color: "var(--theme-surface)", fontSize: "13px", outline: "none",
                fontFamily: "var(--font-body)",
              }} />
              <button style={{
                background: "var(--theme-accent)", color: "var(--theme-surface)", border: "none",
                padding: "12px 24px", fontSize: "12px", letterSpacing: "0.16em",
                textTransform: "uppercase", fontWeight: "600", cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}>Subscribe</button>
            </div>
          </div>
        </div>

        {/* Main Footer */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "4rem 2rem 2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "3rem" }}>

            {/* Brand */}
            <div>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "30px", fontWeight: "600", color: "var(--theme-surface)", display: "block", marginBottom: "1rem", letterSpacing: "0.06em" }}>
                BAYA<span style={{ color: "var(--theme-accent-soft)" }}>Clothing</span>
              </span>
              <p style={{ color: "rgba(255, 247, 238, 0.62)", fontSize: "13px", lineHeight: "1.8", fontWeight: "300", maxWidth: "220px" }}>
                We are a team of designers and developers that create high quality clothing for everyone.
              </p>
            </div>

            {[
              {
                title: "Shopping",
                links: [
                  { label: "All Products", to: "/products" },
                  { label: "My Cart", to: "/cart" },
                  { label: "Checkout", to: "/checkout" },
                  { label: "Order History", to: "/orders" },
                ]
              },
              {
                title: "Account",
                links: [
                  { label: "Login", to: "/login" },
                  { label: "Register", to: "/register" },
                  { label: "My Profile", to: "/profile" },
                  { label: "About Us", to: "/about" },
                ]
              },
              {
                title: "Categories",
                links: [
                  { label: "Men", to: "/products?category=men" },
                  { label: "Women", to: "/products?category=women" },
                  { label: "Kids", to: "/products?category=kids" },
                  { label: "Accessories", to: "/products?category=accessories" },
                ]
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 style={{ color: "var(--theme-surface)", fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: "600", marginBottom: "1.5rem" }}>{col.title}</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  {col.links.map((link) => (
                    <Link key={link.label} to={link.to} style={{
                      color: footerLinkColor, fontSize: "13px", textDecoration: "none", transition: "color 0.2s",
                    }}
                      onMouseEnter={e => e.target.style.color = "var(--theme-accent-soft)"}
                      onMouseLeave={e => e.target.style.color = footerLinkColor}
                    >{link.label}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div style={{ borderTop: "1px solid rgba(255, 247, 238, 0.08)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ color: "rgba(255, 247, 238, 0.35)", fontSize: "12px", margin: 0 }}>
              (c) {new Date().getFullYear()} ClothingStore. All rights reserved.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              {["VISA", "MC", "AMEX", "PayPal"].map((pay) => (
                <span key={pay} style={{
                  background: "rgba(255, 253, 249, 0.08)", color: "rgba(255, 247, 238, 0.6)", fontSize: "10px", fontWeight: "600",
                  padding: "4px 8px", letterSpacing: "0.05em",
                }}>{pay}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
