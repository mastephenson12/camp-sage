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
    console.log("Access update:", { email, app, status });

    return res.status(200).json({
      isMember: true,
      membershipLevel: "TrailPass",
      activeApps: [app],
      email,
      status,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}