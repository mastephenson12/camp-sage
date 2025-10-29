import type { NextApiRequest, NextApiResponse } from "next";

/**
 * This endpoint receives webhook data from GoHighLevel.
 * It now supports both JSON and form submissions.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Handle both JSON and x-www-form-urlencoded data
  const email = req.body.email || req.body["email"];
  const app = req.body.app || req.body["app"];

  if (!email || !app) {
    return res.status(400).json({ error: "Missing email or app" });
  }

  try {
  // Handle both “added” and “removed” membership updates
  const status = req.body.status || "active";

  // Log who triggered it and their status
  console.log("Access update:", { email, app, status });

  // Simulate a membership check (we’ll connect GHL API later)
  return res.status(200).json({
    isMember: true,
    membershipLevel: "TrailPass",
    activeApps: [app],
    email,
  });
} catch (error) {
  console.error(error);
  return res.status(500).json({ error: "Server error" });
}
