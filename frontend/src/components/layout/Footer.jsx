import { Link } from "react-router-dom";

const LINK_COLUMNS = [
  {
    title: "Shopping",
    links: [
      { label: "All Products", to: "/products" },
      { label: "My Cart", to: "/cart" },
      { label: "Checkout", to: "/checkout" },
      { label: "Order History", to: "/orders" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Login", to: "/login" },
      { label: "Register", to: "/register" },
      { label: "My Profile", to: "/profile" },
      { label: "About Us", to: "/#our-story" },
    ],
  },
  {
    title: "Categories",
    links: [
      { label: "Men", to: "/products?category=men" },
      { label: "Women", to: "/products?category=women" },
      { label: "Kids", to: "/products?category=kids" },
      { label: "Accessories", to: "/products?category=accessories" },
    ],
  },
];

export default function Footer() {
  return (
    <>
      <style>{styles}</style>
      <footer className="site-footer">
        <section className="site-footer-newsletter">
          <div className="site-footer-shell site-footer-newsletter-inner">
            <div className="site-footer-newsletter-copy">
              <h3>Subscribe to Our Newsletter</h3>
              <p>Get exclusive deals, updates and style tips delivered to your inbox.</p>
            </div>

            <form className="site-footer-newsletter-form">
              <input type="email" placeholder="Enter your email address" />
              <button type="button">Subscribe</button>
            </form>
          </div>
        </section>

        <section className="site-footer-main">
          <div className="site-footer-shell">
            <div className="site-footer-grid">
              <div className="site-footer-brand">
                <span className="site-footer-brandmark">
                  BAYA<span>Clothing</span>
                </span>
                <p>
                  We are a team of designers and developers that create high quality
                  clothing for everyone.
                </p>
              </div>

              {LINK_COLUMNS.map((column) => (
                <div key={column.title} className="site-footer-column">
                  <h4>{column.title}</h4>
                  <div className="site-footer-links">
                    {column.links.map((link) => (
                      <Link key={link.label} to={link.to}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="site-footer-bottom">
              <p>(c) {new Date().getFullYear()} ClothingStore. All rights reserved.</p>
              <div className="site-footer-payments">
                {["VISA", "MC", "AMEX", "PayPal"].map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </footer>
    </>
  );
}

const styles = `
  .site-footer {
    margin-top: auto;
    background: var(--theme-dark);
    color: var(--theme-surface);
    font-family: var(--font-body);
  }
  .site-footer-shell {
    width: min(1200px, calc(100% - 32px));
    margin: 0 auto;
  }
  .site-footer-newsletter {
    background: linear-gradient(135deg, var(--theme-dark) 0%, var(--theme-dark-soft) 100%);
    border-bottom: 1px solid rgba(255, 247, 238, 0.08);
  }
  .site-footer-newsletter-inner {
    padding: 48px 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(320px, 520px);
    gap: 28px;
    align-items: end;
  }
  .site-footer-newsletter-copy h3 {
    margin: 0 0 10px;
    font-family: var(--font-display);
    font-size: clamp(2.2rem, 5vw, 3.8rem);
    line-height: 0.96;
    letter-spacing: 0.01em;
  }
  .site-footer-newsletter-copy p {
    margin: 0;
    color: rgba(255, 247, 238, 0.64);
    font-size: 15px;
    line-height: 1.8;
    max-width: 36ch;
  }
  .site-footer-newsletter-form {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 0;
    align-self: center;
  }
  .site-footer-newsletter-form input,
  .site-footer-newsletter-form button {
    font: inherit;
  }
  .site-footer-newsletter-form input {
    min-width: 0;
    padding: 18px 22px;
    border: 1px solid rgba(255, 247, 238, 0.14);
    border-right: none;
    background: rgba(255, 253, 249, 0.08);
    color: var(--theme-surface);
    font-size: 14px;
    outline: none;
  }
  .site-footer-newsletter-form input::placeholder {
    color: rgba(255, 247, 238, 0.5);
  }
  .site-footer-newsletter-form button {
    border: none;
    padding: 18px 24px;
    background: var(--theme-accent);
    color: var(--theme-surface);
    font-size: 12px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: 700;
    cursor: pointer;
  }
  .site-footer-main {
    padding: 60px 0 32px;
  }
  .site-footer-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) repeat(3, minmax(0, 1fr));
    gap: 32px;
  }
  .site-footer-brandmark {
    display: inline-block;
    margin-bottom: 18px;
    font-family: var(--font-display);
    font-size: clamp(2.4rem, 4vw, 3.4rem);
    line-height: 0.95;
    letter-spacing: 0.02em;
  }
  .site-footer-brandmark span {
    color: var(--theme-accent-soft);
  }
  .site-footer-brand p {
    margin: 0;
    max-width: 24ch;
    color: rgba(255, 247, 238, 0.64);
    font-size: 15px;
    line-height: 1.9;
  }
  .site-footer-column h4 {
    margin: 0 0 18px;
    font-size: 12px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: 700;
  }
  .site-footer-links {
    display: grid;
    gap: 12px;
  }
  .site-footer-links a {
    color: rgba(255, 247, 238, 0.64);
    text-decoration: none;
    font-size: 14px;
    line-height: 1.7;
    transition: color 0.2s ease;
  }
  .site-footer-links a:hover,
  .site-footer-links a:focus-visible {
    color: var(--theme-accent-soft);
    outline: none;
  }
  .site-footer-bottom {
    margin-top: 42px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 247, 238, 0.08);
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: center;
    flex-wrap: wrap;
  }
  .site-footer-bottom p {
    margin: 0;
    color: rgba(255, 247, 238, 0.38);
    font-size: 13px;
  }
  .site-footer-payments {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .site-footer-payments span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 58px;
    padding: 8px 10px;
    background: rgba(255, 253, 249, 0.08);
    color: rgba(255, 247, 238, 0.62);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
  }
  @media (max-width: 960px) {
    .site-footer-newsletter-inner,
    .site-footer-grid {
      grid-template-columns: 1fr;
    }
    .site-footer-brand p {
      max-width: 40ch;
    }
  }
  @media (max-width: 640px) {
    .site-footer-shell {
      width: min(1200px, calc(100% - 24px));
    }
    .site-footer-newsletter-inner {
      padding: 40px 0;
      gap: 20px;
    }
    .site-footer-newsletter-form {
      grid-template-columns: 1fr;
      gap: 10px;
    }
    .site-footer-newsletter-form input {
      border-right: 1px solid rgba(255, 247, 238, 0.14);
    }
    .site-footer-newsletter-form button {
      width: 100%;
    }
    .site-footer-main {
      padding: 42px 0 24px;
    }
    .site-footer-grid {
      gap: 26px;
    }
    .site-footer-bottom {
      align-items: flex-start;
      flex-direction: column;
    }
  }
`;
