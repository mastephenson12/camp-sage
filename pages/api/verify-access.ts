import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const email = req.body.email || req.body["email"];
  const app = req.body.app || req.body["app"];
  const status = req.body.status || "active";

  if (!email || !app) {
    return res.status(400).json({ error: "Missing email or app" });
  }

  try {
    // Query GoHighLevel for contact by email
    const ghlRes = await fetch(`https://rest.gohighlevel.com/v1/contacts/lookup?email=${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${process.env.GHL_API_KEY}` },
    });

    const contactData = await ghlRes.json();

    // Check for TrailPass tag
    const hasTrailPass =
      contactData?.contact?.tags?.includes("TrailPass_Member") || false;

    console.log("Access check:", { email, hasTrailPass });

    return res.status(200).json({
      isMember: hasTrailPass,
      membershipLevel: hasTrailPass ? "TrailPass" : "None",
      activeApps: hasTrailPass ? [app] : [],
      email,
      status,
    });
  } catch (error) {
    console.error("Error checking GHL:", error);
    return res.status(500).json({ error: "Server error" });
  }
}