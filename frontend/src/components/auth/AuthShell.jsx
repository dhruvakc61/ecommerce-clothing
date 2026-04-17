import { Link } from "react-router-dom";
import bayaAuthImage from "../../assets/baya-auth.png";

export default function AuthShell({
  eyebrow,
  title,
  description,
  panelTitle,
  panelCopy,
  footerText,
  footerLinkText,
  footerTo,
  children,
}) {
  return (
    <>
      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: stretch;
          justify-content: center;
          padding: clamp(18px, 3vw, 32px);
          background:
            radial-gradient(circle at top left, rgba(216, 177, 138, 0.22), transparent 28%),
            linear-gradient(180deg, rgba(255, 253, 249, 0.98) 0%, rgba(246, 241, 234, 0.94) 100%);
        }
        .auth-shell {
          width: min(1180px, 100%);
          display: grid;
          grid-template-columns: minmax(0, 1.02fr) minmax(420px, 0.98fr);
          background: rgba(255, 253, 249, 0.82);
          border: 1px solid rgba(228, 215, 200, 0.72);
          border-radius: 34px;
          overflow: hidden;
          box-shadow: 0 34px 70px rgba(36, 28, 23, 0.12);
          backdrop-filter: blur(18px);
        }
        .auth-visual {
          position: relative;
          min-height: 720px;
          background:
            linear-gradient(135deg, rgba(23, 16, 13, 0.9) 0%, rgba(23, 16, 13, 0.72) 100%),
            radial-gradient(circle at top, rgba(216, 177, 138, 0.28), transparent 38%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: clamp(28px, 4vw, 46px);
          color: var(--theme-surface);
        }
        .auth-visual::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 32%),
            radial-gradient(circle at bottom left, rgba(176, 122, 79, 0.18), transparent 30%);
          pointer-events: none;
        }
        .auth-brand {
          position: relative;
          z-index: 1;
        }
        .auth-brand-tag {
          margin: 0 0 10px;
          font-size: 11px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(255, 247, 238, 0.72);
          font-weight: 700;
        }
        .auth-brand-name {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(2.6rem, 5vw, 4.6rem);
          line-height: 0.92;
          color: var(--theme-surface);
          max-width: 7ch;
        }
        .auth-brand-copy {
          margin: 18px 0 0;
          max-width: 420px;
          color: rgba(255, 247, 238, 0.78);
          font-size: 15px;
          line-height: 1.9;
        }
        .auth-art-wrap {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px 0;
        }
        .auth-art-card {
          width: min(420px, 100%);
          aspect-ratio: 1 / 1;
          border-radius: 32px;
          background:
            linear-gradient(145deg, rgba(255, 253, 249, 0.12), rgba(255, 253, 249, 0.03));
          border: 1px solid rgba(255, 247, 238, 0.18);
          box-shadow: 0 28px 60px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(12px);
          padding: clamp(18px, 3vw, 34px);
        }
        .auth-art-card img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 18px 28px rgba(0, 0, 0, 0.2));
        }
        .auth-note {
          position: relative;
          z-index: 1;
          display: grid;
          gap: 10px;
          padding: 18px 20px;
          border-radius: 22px;
          background: rgba(255, 253, 249, 0.08);
          border: 1px solid rgba(255, 247, 238, 0.14);
          backdrop-filter: blur(10px);
        }
        .auth-note-label {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255, 247, 238, 0.72);
          font-weight: 700;
        }
        .auth-note-copy {
          color: rgba(255, 247, 238, 0.88);
          font-size: 14px;
          line-height: 1.8;
          margin: 0;
        }
        .auth-form-panel {
          padding: clamp(26px, 4vw, 48px);
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(circle at top right, rgba(216, 177, 138, 0.18), transparent 28%),
            rgba(255, 253, 249, 0.72);
        }
        .auth-form-inner {
          width: min(430px, 100%);
        }
        .auth-form-eyebrow {
          margin: 0 0 12px;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--theme-accent);
          font-weight: 700;
        }
        .auth-form-title {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 5vw, 4rem);
          color: var(--theme-ink);
          line-height: 0.95;
        }
        .auth-form-copy {
          margin: 16px 0 0;
          color: var(--theme-text);
          line-height: 1.85;
          font-size: 14px;
          max-width: 34ch;
        }
        .auth-form-card {
          margin-top: 30px;
          padding: clamp(22px, 3vw, 28px);
          border-radius: 28px;
          background: rgba(255, 253, 249, 0.88);
          border: 1px solid rgba(228, 215, 200, 0.7);
          box-shadow: 0 22px 44px rgba(36, 28, 23, 0.08);
        }
        .auth-footer {
          margin-top: 24px;
          text-align: center;
          color: var(--theme-muted);
          font-size: 14px;
        }
        .auth-footer a {
          color: var(--theme-accent);
          border-bottom: 1px solid var(--theme-accent);
        }
        @media (max-width: 980px) {
          .auth-shell {
            grid-template-columns: 1fr;
          }
          .auth-visual {
            min-height: auto;
            gap: 24px;
          }
          .auth-brand-name {
            max-width: none;
          }
          .auth-form-panel {
            padding-top: 0;
          }
        }
        @media (max-width: 640px) {
          .auth-page {
            padding: 14px;
          }
          .auth-shell {
            border-radius: 24px;
          }
          .auth-visual,
          .auth-form-panel {
            padding: 20px;
          }
          .auth-art-card {
            border-radius: 24px;
          }
          .auth-form-card {
            border-radius: 22px;
            padding: 18px;
          }
        }
      `}</style>

      <div className="auth-page">
        <div className="auth-shell">
          <section className="auth-visual">
            <div className="auth-brand">
              <p className="auth-brand-tag">Baya Identity</p>
              <h2 className="auth-brand-name">{panelTitle}</h2>
              <p className="auth-brand-copy">{panelCopy}</p>
            </div>

            <div className="auth-art-wrap">
              <div className="auth-art-card">
                <img src={bayaAuthImage} alt="Baya brand mark" />
              </div>
            </div>

            <div className="auth-note">
              <span className="auth-note-label">Brand Focus</span>
              <p className="auth-note-copy">
                Clean luxury, calm browsing, and a more intentional shopping flow from sign in to checkout.
              </p>
            </div>
          </section>

          <section className="auth-form-panel">
            <div className="auth-form-inner">
              <p className="auth-form-eyebrow">{eyebrow}</p>
              <h1 className="auth-form-title">{title}</h1>
              <p className="auth-form-copy">{description}</p>

              <div className="auth-form-card">{children}</div>

              <p className="auth-footer">
                {footerText}{" "}
                <Link to={footerTo}>{footerLinkText}</Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
