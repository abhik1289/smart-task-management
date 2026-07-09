import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "linear-gradient(135deg, #eef4ff 0%, #f8fbff 100%)",
      }}>
      <section
        style={{
          maxWidth: "720px",
          width: "100%",
          background: "white",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
        }}>
        <p
          style={{
            margin: 0,
            fontSize: "0.95rem",
            fontWeight: 600,
            color: "#2563eb",
          }}>
          Smart Task Management
        </p>
        <h1
          style={{
            fontSize: "2.2rem",
            margin: "10px 0 12px",
            color: "#0f172a",
          }}>
          Plan your day with clarity and momentum.
        </h1>
        <p
          style={{
            fontSize: "1rem",
            lineHeight: 1.6,
            color: "#475569",
            marginBottom: "24px",
          }}>
          Organize your work, track priorities, and stay productive from one
          simple workspace.
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link
            to="/sign-in"
            style={{
              padding: "12px 18px",
              borderRadius: "999px",
              background: "#2563eb",
              color: "white",
              textDecoration: "none",
              fontWeight: 600,
            }}>
            Sign in
          </Link>
          <Link
            to="/sign-up"
            style={{
              padding: "12px 18px",
              borderRadius: "999px",
              border: "1px solid #cbd5e1",
              color: "#0f172a",
              textDecoration: "none",
              fontWeight: 600,
            }}>
            Create account
          </Link>
        </div>
      </section>
    </main>
  );
}
