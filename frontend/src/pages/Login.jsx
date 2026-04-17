import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell";
import useAuth from "../hooks/useAuth";
import { validateEmail } from "../utils/validators";

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

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateEmail(email)) return setError("Please enter a valid email address.");

    try {
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Welcome Back"
      title="Sign In"
      description="Step back into your wardrobe with a calmer, more refined Baya experience."
      panelTitle="A quieter kind of luxury."
      panelCopy="Return to your account to explore elevated pieces, revisit your profile, and move through the store with a more curated rhythm."
      footerText="Don't have an account?"
      footerLinkText="Create one"
      footerTo="/register"
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

        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
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
            placeholder="you@example.com"
          />
        </div>

        <div style={{ marginBottom: "22px" }}>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
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
            placeholder="********"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...submitButtonStyle,
            background: loading ? "var(--theme-accent-strong)" : "var(--theme-accent)",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </AuthShell>
  );
}
