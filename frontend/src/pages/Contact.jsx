import { useState } from "react";
import { Link } from "react-router-dom";

const CONTACT_CARDS = [
  {
    label: "Email",
    value: "hello@bayaclothing.com",
    helper: "For general enquiries and support",
  },
  {
    label: "Phone",
    value: "+44 20 7946 1058",
    helper: "Monday to Saturday, 9am to 6pm",
  },
  {
    label: "Studio",
    value: "14 Mercer Street, London",
    helper: "Design office and client appointments",
  },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (submitted) setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <>
      <style>{`
        .contact-page {
          display: grid;
          gap: 28px;
          color: var(--theme-text);
        }
        .contact-hero {
          position: relative;
          overflow: hidden;
          border-radius: 34px;
          min-height: min(66vh, 720px);
          display: flex;
          align-items: end;
          padding: clamp(28px, 5vw, 56px);
          background:
            linear-gradient(115deg, rgba(23, 16, 13, 0.82) 16%, rgba(23, 16, 13, 0.28) 72%, rgba(23, 16, 13, 0.14) 100%),
            url("https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1600&q=85") center/cover no-repeat;
          box-shadow: 0 34px 70px rgba(36, 28, 23, 0.14);
        }
        .contact-hero::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top right, rgba(216, 177, 138, 0.24), transparent 30%);
        }
        .contact-hero-body {
          position: relative;
          z-index: 1;
          max-width: 720px;
        }
        .contact-eyebrow {
          margin: 0 0 12px;
          font-size: 11px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--theme-accent-soft);
          font-weight: 700;
        }
        .contact-hero h1 {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(2.8rem, 7vw, 5.2rem);
          line-height: 0.92;
          color: var(--theme-surface);
          max-width: 8ch;
        }
        .contact-hero p {
          margin: 18px 0 0;
          max-width: 520px;
          color: rgba(255, 247, 238, 0.82);
          font-size: 15px;
          line-height: 1.9;
        }
        .contact-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
        }
        .contact-btn {
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
        .contact-btn-primary {
          background: var(--theme-accent);
          color: var(--theme-surface);
          box-shadow: 0 18px 28px rgba(176, 122, 79, 0.24);
        }
        .contact-btn-secondary {
          border: 1px solid rgba(255, 247, 238, 0.32);
          color: var(--theme-surface);
          background: rgba(255, 253, 249, 0.08);
          backdrop-filter: blur(8px);
        }
        .contact-grid {
          display: grid;
          gap: 24px;
          grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
        }
        .contact-section {
          background: linear-gradient(180deg, rgba(255, 253, 249, 0.9) 0%, rgba(246, 241, 234, 0.82) 100%);
          border: 1px solid var(--theme-border);
          border-radius: 28px;
          padding: clamp(24px, 4vw, 38px);
          box-shadow: 0 20px 42px rgba(36, 28, 23, 0.07);
        }
        .contact-section-kicker {
          margin: 0 0 10px;
          font-size: 11px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--theme-accent);
          font-weight: 700;
        }
        .contact-section-title {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3.2rem);
          line-height: 0.94;
          color: var(--theme-ink);
        }
        .contact-section-copy {
          margin: 16px 0 0;
          font-size: 15px;
          line-height: 1.9;
        }
        .contact-card-list {
          display: grid;
          gap: 16px;
          margin-top: 26px;
        }
        .contact-card {
          padding: 20px;
          border-radius: 22px;
          background: rgba(255, 253, 249, 0.92);
          border: 1px solid rgba(176, 122, 79, 0.14);
        }
        .contact-card-label {
          margin: 0 0 8px;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--theme-accent);
          font-weight: 700;
        }
        .contact-card-value {
          margin: 0;
          font-family: var(--font-display);
          font-size: 2rem;
          line-height: 1;
          color: var(--theme-ink);
        }
        .contact-card-helper {
          margin: 10px 0 0;
          color: var(--theme-muted);
          font-size: 14px;
          line-height: 1.8;
        }
        .contact-form {
          display: grid;
          gap: 18px;
          margin-top: 26px;
        }
        .contact-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }
        .contact-label {
          display: block;
          margin-bottom: 8px;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--theme-muted);
          font-weight: 700;
        }
        .contact-input,
        .contact-textarea {
          width: 100%;
          border: 1px solid rgba(176, 122, 79, 0.18);
          border-radius: 18px;
          background: rgba(255, 253, 249, 0.94);
          padding: 14px 16px;
          font-family: var(--font-body);
          font-size: 15px;
          color: var(--theme-ink);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .contact-input:focus,
        .contact-textarea:focus {
          border-color: var(--theme-accent);
          box-shadow: 0 0 0 4px rgba(176, 122, 79, 0.12);
        }
        .contact-textarea {
          min-height: 160px;
          resize: vertical;
        }
        .contact-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 999px;
          background: var(--theme-accent);
          color: var(--theme-surface);
          padding: 15px 24px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 18px 30px rgba(176, 122, 79, 0.18);
        }
        .contact-success {
          margin-top: 18px;
          padding: 14px 16px;
          border-radius: 18px;
          background: rgba(225, 244, 232, 0.9);
          border: 1px solid rgba(103, 160, 122, 0.2);
          color: #2f6b43;
          font-size: 14px;
          line-height: 1.7;
        }
        @media (max-width: 920px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 640px) {
          .contact-form-grid {
            grid-template-columns: 1fr;
          }
          .contact-card-value {
            font-size: 1.65rem;
          }
        }
      `}</style>

      <div className="contact-page">
        <section className="contact-hero">
          <div className="contact-hero-body">
            <p className="contact-eyebrow">Contact Baya</p>
            <h1>Let&apos;s talk.</h1>
            <p>
              Whether you have a product question, an order update, or a partnership idea,
              we&apos;d love to hear from you.
            </p>
            <div className="contact-actions">
              <a href="mailto:hello@bayaclothing.com" className="contact-btn contact-btn-primary">
                Email Us
              </a>
              <Link to="/products" className="contact-btn contact-btn-secondary">
                Shop Collection
              </Link>
            </div>
          </div>
        </section>

        <section className="contact-grid">
          <div className="contact-section">
            <p className="contact-section-kicker">Reach Out</p>
            <h2 className="contact-section-title">Stay close to the studio.</h2>
            <p className="contact-section-copy">
              We keep communication simple, direct, and personal. Choose the contact method
              that suits you best and we&apos;ll get back to you as soon as we can.
            </p>

            <div className="contact-card-list">
              {CONTACT_CARDS.map((item) => (
                <div key={item.label} className="contact-card">
                  <p className="contact-card-label">{item.label}</p>
                  <p className="contact-card-value">{item.value}</p>
                  <p className="contact-card-helper">{item.helper}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="contact-section">
            <p className="contact-section-kicker">Send a Message</p>
            <h2 className="contact-section-title">A simple note is enough.</h2>
            <p className="contact-section-copy">
              Drop us a message below and we&apos;ll follow up with you shortly.
            </p>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-grid">
                <div>
                  <label className="contact-label">Your Name</label>
                  <input
                    className="contact-input"
                    type="text"
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    placeholder="Jane Smith"
                    required
                  />
                </div>
                <div>
                  <label className="contact-label">Email</label>
                  <input
                    className="contact-input"
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="contact-label">Subject</label>
                <input
                  className="contact-input"
                  type="text"
                  value={form.subject}
                  onChange={(event) => updateField("subject", event.target.value)}
                  placeholder="Order question, partnership, product advice..."
                  required
                />
              </div>

              <div>
                <label className="contact-label">Message</label>
                <textarea
                  className="contact-textarea"
                  value={form.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  placeholder="Tell us how we can help."
                  required
                />
              </div>

              <button className="contact-submit" type="submit">
                Send Message
              </button>
            </form>

            {submitted ? (
              <div className="contact-success">
                Thanks for reaching out. Your message has been captured on the page for now,
                and the next step would be connecting this form to your real email or backend.
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </>
  );
}
