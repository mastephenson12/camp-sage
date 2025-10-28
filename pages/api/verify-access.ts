import type { NextApiRequest, NextApiResponse } from "next";

/**
 * This endpoint receives a user's email and app name.
 * It calls GoHighLevel's API to check membership status.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, app } = req.body;

  if (!email || !app) {
    return res.status(400).json({ error: "Missing email or app" });
  }

  try {
    // ⚙️  TODO: replace with your real GHL API key later
    const apiKey = process.env.GHL_API_KEY;

    // This will eventually call GHL to look up contact by email.
    // For now, we’ll just fake a response so you can test deployment.
    return res.status(200).json({
      isMember: true,
      membershipLevel: "TrailPass",
      activeApps: ["CampSage"],
      email,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}
