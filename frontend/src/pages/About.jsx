import { Link } from "react-router-dom";

const MILESTONES = [
  {
    year: "2012",
    title: "The Boutique Beginning",
    copy:
      "BoShop started as a small edit of carefully sourced wardrobe staples, built around timeless tailoring and soft everyday luxury.",
  },
  {
    year: "2018",
    title: "Growing With Our Community",
    copy:
      "As our collection expanded, so did our focus on better fabrics, dependable fits, and a shopping experience that feels calm and personal.",
  },
  {
    year: "Today",
    title: "Modern Fashion, Thoughtfully Curated",
    copy:
      "We now bring together elevated essentials, seasonal statements, and dependable service for customers shopping from anywhere.",
  },
];

const VALUES = [
  {
    title: "Quality First",
    copy: "We choose pieces that balance comfort, craftsmanship, and long-term wear instead of short-lived trends.",
  },
  {
    title: "Thoughtful Design",
    copy: "Every collection is shaped to feel refined, versatile, and easy to style for real everyday life.",
  },
  {
    title: "Human Service",
    copy: "From checkout to delivery, we aim for an experience that feels clear, supportive, and beautifully simple.",
  },
];

const PROMISES = [
  "Curated styles for men, women, kids, and accessories",
  "Clean, elevated visuals inspired by modern editorial fashion",
  "A shopping experience designed to feel polished on every device",
  "Fast ordering flow with account history and order tracking",
];

export default function About() {
  return (
    <>
      <style>{`
        .about-page {
          display: grid;
          gap: 28px;
          color: var(--theme-text);
        }
        .about-hero {
          position: relative;
          overflow: hidden;
          border-radius: 34px;
          min-height: min(72vh, 760px);
          display: flex;
          align-items: end;
          padding: clamp(28px, 5vw, 54px);
          background:
            linear-gradient(115deg, rgba(23, 16, 13, 0.78) 18%, rgba(23, 16, 13, 0.26) 72%, rgba(23, 16, 13, 0.14) 100%),
            url("https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1600&q=85") center/cover no-repeat;
          box-shadow: 0 36px 72px rgba(36, 28, 23, 0.14);
        }
        .about-hero::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top right, rgba(216, 177, 138, 0.24), transparent 30%);
        }
        .about-hero-body {
          position: relative;
          z-index: 1;
          max-width: 700px;
        }
        .about-eyebrow {
          margin: 0 0 12px;
          font-size: 11px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--theme-accent-soft);
          font-weight: 700;
        }
        .about-hero h1 {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(2.9rem, 7vw, 5.6rem);
          line-height: 0.9;
          color: var(--theme-surface);
          max-width: 9ch;
        }
        .about-hero p {
          margin: 18px 0 0;
          max-width: 540px;
          color: rgba(255, 247, 238, 0.82);
          font-size: 15px;
          line-height: 1.9;
        }
        .about-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 28px;
        }
        .about-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 22px;
          border-radius: 999px;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-size: 11px;
          font-weight: 700;
        }
        .about-btn-primary {
          background: var(--theme-accent);
          color: var(--theme-surface);
          box-shadow: 0 18px 28px rgba(176, 122, 79, 0.24);
        }
        .about-btn-secondary {
          border: 1px solid rgba(255, 247, 238, 0.32);
          color: var(--theme-surface);
          background: rgba(255, 253, 249, 0.08);
          backdrop-filter: blur(8px);
        }
        .about-section {
          background: linear-gradient(180deg, rgba(255, 253, 249, 0.9) 0%, rgba(246, 241, 234, 0.82) 100%);
          border: 1px solid var(--theme-border);
          border-radius: 28px;
          padding: clamp(24px, 4vw, 38px);
          box-shadow: 0 20px 42px rgba(36, 28, 23, 0.07);
        }
        .about-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(300px, 0.95fr);
          gap: 28px;
          align-items: center;
        }
        .about-copy-kicker {
          margin: 0 0 10px;
          font-size: 11px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--theme-accent);
          font-weight: 700;
        }
        .about-copy-title {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3.4rem);
          line-height: 0.95;
          color: var(--theme-ink);
        }
        .about-copy-text {
          margin: 16px 0 0;
          font-size: 15px;
          line-height: 1.9;
        }
        .about-image {
          width: 100%;
          min-height: 420px;
          border-radius: 24px;
          object-fit: cover;
          box-shadow: 0 24px 40px rgba(36, 28, 23, 0.12);
        }
        .about-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          margin-top: 22px;
        }
        .about-stat {
          padding: 18px;
          border-radius: 20px;
          background: rgba(255, 253, 249, 0.92);
          border: 1px solid rgba(176, 122, 79, 0.14);
        }
        .about-stat strong {
          display: block;
          font-family: var(--font-display);
          font-size: clamp(1.9rem, 3vw, 2.6rem);
          color: var(--theme-ink);
          line-height: 1;
          margin-bottom: 8px;
        }
        .about-stat span {
          font-size: 13px;
          color: var(--theme-text);
          line-height: 1.7;
        }
        .about-values {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }
        .about-value {
          padding: 22px;
          border-radius: 22px;
          background: rgba(255, 253, 249, 0.94);
          border: 1px solid rgba(176, 122, 79, 0.14);
        }
        .about-value h3 {
          margin: 0 0 10px;
          font-family: var(--font-display);
          font-size: 1.8rem;
          color: var(--theme-ink);
        }
        .about-value p {
          margin: 0;
          line-height: 1.8;
        }
        .about-timeline {
          display: grid;
          gap: 18px;
        }
        .about-milestone {
          display: grid;
          grid-template-columns: 92px minmax(0, 1fr);
          gap: 18px;
          align-items: start;
          padding: 18px;
          border-radius: 22px;
          background: rgba(255, 253, 249, 0.88);
          border: 1px solid rgba(176, 122, 79, 0.14);
        }
        .about-milestone-year {
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--theme-accent);
          font-weight: 700;
          padding-top: 6px;
        }
        .about-milestone h3 {
          margin: 0 0 8px;
          font-family: var(--font-display);
          font-size: 1.8rem;
          line-height: 1;
          color: var(--theme-ink);
        }
        .about-milestone p {
          margin: 0;
          line-height: 1.8;
        }
        .about-promises {
          display: grid;
          gap: 12px;
          margin-top: 18px;
        }
        .about-promise {
          display: flex;
          gap: 12px;
          align-items: start;
          padding: 14px 0;
          border-bottom: 1px solid rgba(176, 122, 79, 0.14);
        }
        .about-promise:last-child {
          border-bottom: none;
        }
        .about-promise-mark {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          border-radius: 999px;
          background: rgba(176, 122, 79, 0.14);
          color: var(--theme-accent-strong);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          margin-top: 2px;
        }
        .about-cta {
          text-align: center;
          padding: clamp(28px, 5vw, 44px);
          background:
            radial-gradient(circle at top, rgba(216, 177, 138, 0.18), transparent 35%),
            linear-gradient(135deg, rgba(255, 253, 249, 0.98) 0%, rgba(235, 225, 212, 0.92) 100%);
        }
        .about-cta h2 {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3.2rem);
          color: var(--theme-ink);
        }
        .about-cta p {
          margin: 14px auto 0;
          max-width: 640px;
          line-height: 1.85;
        }
        @media (max-width: 980px) {
          .about-grid,
          .about-values,
          .about-stats {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 640px) {
          .about-page {
            gap: 22px;
          }
          .about-hero,
          .about-section {
            border-radius: 22px;
          }
          .about-hero {
            min-height: 60vh;
            padding: 22px;
          }
          .about-section {
            padding: 20px;
          }
          .about-image {
            min-height: 280px;
          }
          .about-milestone {
            grid-template-columns: 1fr;
            gap: 10px;
          }
        }
      `}</style>

      <div className="about-page">
        <section className="about-hero">
          <div className="about-hero-body">
            <p className="about-eyebrow">About BoShop</p>
            <h1>Style With A Clear Point Of View</h1>
            <p>
              BoShop was built to make premium-looking fashion feel approachable, curated, and easy to shop. We blend modern essentials with a softer editorial mood so every visit feels intentional.
            </p>
            <div className="about-actions">
              <Link to="/products" className="about-btn about-btn-primary">
                Shop Collection
              </Link>
              <Link to="/profile" className="about-btn about-btn-secondary">
                My Account
              </Link>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="about-grid">
            <div>
              <p className="about-copy-kicker">Our Story</p>
              <h2 className="about-copy-title">We design the shopping experience like we design the wardrobe.</h2>
              <p className="about-copy-text">
                Clean lines, warm tones, thoughtful details, and nothing unnecessary. From the collections we feature to the way products are browsed, tracked, and revisited, we want fashion shopping to feel calm, polished, and dependable.
              </p>
              <p className="about-copy-text">
                The result is a store shaped around wearable style, practical confidence, and a customer journey that feels as refined as the products themselves.
              </p>

              <div className="about-stats">
                <div className="about-stat">
                  <strong>4+</strong>
                  <span>Core categories spanning women, men, kids, and accessories.</span>
                </div>
                <div className="about-stat">
                  <strong>24/7</strong>
                  <span>A digital storefront designed to feel smooth on every visit.</span>
                </div>
                <div className="about-stat">
                  <strong>100%</strong>
                  <span>Focused on a cohesive, elevated experience from browse to checkout.</span>
                </div>
              </div>
            </div>

            <img
              className="about-image"
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=85"
              alt="Fashion editorial"
            />
          </div>
        </section>

        <section className="about-section">
          <p className="about-copy-kicker">What Guides Us</p>
          <h2 className="about-copy-title" style={{ maxWidth: "10ch" }}>
            Three values behind every collection.
          </h2>
          <div className="about-values" style={{ marginTop: 24 }}>
            {VALUES.map((value) => (
              <article key={value.title} className="about-value">
                <h3>{value.title}</h3>
                <p>{value.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section">
          <div className="about-grid" style={{ alignItems: "start" }}>
            <div>
              <p className="about-copy-kicker">Our Timeline</p>
              <h2 className="about-copy-title">A boutique mindset, scaled for modern shopping.</h2>
              <div className="about-timeline" style={{ marginTop: 24 }}>
                {MILESTONES.map((milestone) => (
                  <article key={milestone.year} className="about-milestone">
                    <div className="about-milestone-year">{milestone.year}</div>
                    <div>
                      <h3>{milestone.title}</h3>
                      <p>{milestone.copy}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div>
              <p className="about-copy-kicker">Why Customers Stay</p>
              <h2 className="about-copy-title">The details that keep the experience consistent.</h2>
              <div className="about-promises">
                {PROMISES.map((promise) => (
                  <div key={promise} className="about-promise">
                    <div className="about-promise-mark">✓</div>
                    <div>{promise}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="about-section about-cta">
          <p className="about-copy-kicker">Start Exploring</p>
          <h2>Find pieces that feel refined, wearable, and unmistakably yours.</h2>
          <p>
            Browse the full collection, explore category edits, or head into your account to revisit orders and keep track of what is on the way.
          </p>
          <div className="about-actions" style={{ justifyContent: "center" }}>
            <Link to="/products" className="about-btn about-btn-primary">
              View Products
            </Link>
            <Link to="/orders" className="about-btn" style={{ border: "1px solid rgba(36, 28, 23, 0.14)", color: "var(--theme-ink)", background: "rgba(255, 253, 249, 0.78)" }}>
              Track Orders
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
