import { useEffect, useState } from "react";

// Rebuild trigger

interface MembershipData {
  isMember: boolean;
  membershipLevel: string;
  activeApps: string[];
  email: string;
  status?: string;
}

export default function StatusPage() {
  const [status, setStatus] = useState<MembershipData | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const checkStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/verify-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, app: "CampSage" }),
      });
      const data = await res.json();
      setStatus(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: "600px", margin: "4rem auto", textAlign: "center" }}>
      <h1>🏕️ CampSage Membership Check</h1>

      <p>Enter your email to check your TrailPass status.</p>
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
          background: "#2e7d32",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {loading ? "Checking..." : "Check Status"}
      </button>

      {status && (
        <div style={{ marginTop: "2rem" }}>
          <h2>
            {status.isMember
              ? "✅ Access Granted!"
              : "❌ Access Not Found"}
          </h2>
          <p>
            <strong>Email:</strong> {status.email}
          </p>
          <p>
            <strong>Membership Level:</strong> {status.membershipLevel}
          </p>
          {status.status && (
            <p>
              <strong>Status:</strong> {status.status}
            </p>
          )}
        </div>
      )}
    </main>
  );
}
