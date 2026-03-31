import type { NextApiRequest, NextApiResponse } from "next";
import { validateCodeUsage } from "@/lib/validateCodeUsage";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const result = validateCodeUsage(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid data",
      details: result.errors,
    });
  }

  // TODO: save to DB here if needed

  return res.status(200).json({
    message: "Code usage recorded successfully",
    data: result.data,
  });
}