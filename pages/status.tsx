import { useState } from "react";

interface MembershipData {
  isMember: boolean;
  membershipLevel: string;
  email: string;
  tags?: string[];
}

export default function StatusPage() {
  const [email, setEmail] = useState("");
  const [data, setData] = useState<MembershipData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = async () => {
    if (!email) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/verify-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, app: "CampSage" }),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to check status");
      }

      setData(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error checking status");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        maxWidth: "600px",
        margin: "4rem auto",
        textAlign: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1>🏕️ CampSage Membership Check</h1>
      <p>Enter your email to see if your TrailPass is active.</p>

      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: "10px",
          width: "80%",
          marginBottom: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />
      <br />
      <button
        onClick={checkStatus}
        disabled={!email || loading}
        style={{
          padding: "10px 20px",
          borderRadius: "6px",
          border: "none",
          background: loading ? "#aaa" : "#2e7d32",
          color: "#fff",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Checking..." : "Check Status"}
      </button>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

      {data && (
        <div style={{ marginTop: "2rem" }}>
          {data.isMember ? (
            <>
              <h2 style={{ color: "green" }}>✅ TrailPass Active!</h2>
              <p>Welcome back, adventurer!</p>
            </>
          ) : (
            <>
              <h2 style={{ color: "red" }}>❌ TrailPass Inactive</h2>
              <p>
                It looks like your TrailPass isn’t active. Check your membership
                in GoHighLevel or contact support.
              </p>
            </>
          )}
          <p>
            <strong>Email:</strong> {data.email}
          </p>
          <p>
            <strong>Membership Level:</strong> {data.membershipLevel}
          </p>
          {data.tags && (
            <p>
              <strong>Tags:</strong> {data.tags.join(", ")}
            </p>
          )}
        </div>
      )}
    </main>
  );
}