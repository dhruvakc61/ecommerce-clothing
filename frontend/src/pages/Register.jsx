import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell";
import useAuth from "../hooks/useAuth";
import { validateEmail, validatePassword } from "../utils/validators";

const labelStyle = {
  display: "block",
  fontSize: "11px",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--theme-muted)",
  marginBottom: "8px",
  fontWeight: "700",
};

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  background: "rgba(255, 253, 249, 0.92)",
  border: "1px solid var(--theme-border)",
  borderRadius: "16px",
  fontSize: "15px",
  color: "var(--theme-ink)",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "var(--font-body)",
  transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
};

const submitButtonStyle = {
  width: "100%",
  background: "var(--theme-accent)",
  color: "var(--theme-surface)",
  border: "none",
  borderRadius: "999px",
  padding: "15px",
  fontSize: "12px",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  fontWeight: "700",
  cursor: "pointer",
  fontFamily: "var(--font-body)",
  transition: "background 0.2s, transform 0.2s, box-shadow 0.2s",
  boxShadow: "0 18px 30px rgba(176, 122, 79, 0.18)",
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateEmail(form.email)) return setError("Please enter a valid email address.");
    if (!validatePassword(form.password)) return setError("Password must be at least 6 characters.");

    try {
      setLoading(true);
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Join Baya"
      title="Create Account"
      description="Build your profile and start exploring a more elevated storefront shaped around quieter luxury."
      panelTitle="Made for intentional shopping."
      panelCopy="Create your account to save your details, track orders, and move through the Baya experience with a profile that feels tailored to you."
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerTo="/login"
    >
      <form onSubmit={submit}>
        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "12px 16px",
              fontSize: "13px",
              borderRadius: "16px",
              marginBottom: "18px",
            }}
          >
            {error}
          </div>
        )}

        {[
          { label: "Full Name", key: "name", type: "text", placeholder: "John Doe" },
          { label: "Email", key: "email", type: "email", placeholder: "you@example.com" },
          { label: "Password", key: "password", type: "password", placeholder: "********" },
        ].map((field) => (
          <div key={field.key} style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>{field.label}</label>
            <input
              type={field.type}
              value={form[field.key]}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              style={inputStyle}
              placeholder={field.placeholder}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--theme-accent)";
                e.target.style.boxShadow = "0 0 0 4px rgba(176, 122, 79, 0.12)";
                e.target.style.transform = "translateY(-1px)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--theme-border)";
                e.target.style.boxShadow = "none";
                e.target.style.transform = "translateY(0)";
              }}
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          style={{
            ...submitButtonStyle,
            marginTop: "8px",
            background: loading ? "var(--theme-accent-strong)" : "var(--theme-accent)",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </AuthShell>
  );
}
