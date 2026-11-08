import type { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";

// --- Fail closed: refuse to start without GEMINI_API_KEY ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// --- CORS allowlist ---
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:4173",
];
// Production origin added at deploy time via env var
const PROD_ORIGIN = process.env.CORS_ORIGIN;
if (PROD_ORIGIN) ALLOWED_ORIGINS.push(PROD_ORIGIN);

// --- Rate limit: 20 req/hour per IP (in-memory sliding window) ---
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_WINDOW_MS);
  rateLimitMap.set(ip, recent);
  if (recent.length >= RATE_LIMIT) return true;
  recent.push(now);
  return false;
}

// --- Request validation ---
const GuideRequest = z.object({
  bodyId: z.string().min(1).max(100),
  question: z.string().min(1).max(500),
  lang: z.string().default("en"),
});

// --- CORS headers ---
function setCorsHeaders(req: VercelRequest, res: VercelResponse): boolean {
  const origin = req.headers.origin ?? "";
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Max-Age", "86400");
  }
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
}

// --- Handler ---
export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  if (setCorsHeaders(req, res)) return;

  // Method check
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Fail closed: no API key = 500
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: "Guide unavailable" });
  }

  // Rate limit
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ??
    req.socket.remoteAddress ??
    "unknown";
  if (isRateLimited(ip)) {
    res.setHeader("Retry-After", "3600");
    return res.status(429).json({ error: "Too many questions. Try again later." });
  }

  // Validate request body
  const parsed = GuideRequest.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
  }

  const { bodyId, question } = parsed.data;

  // Placeholder response until Gemini integration in P4-T01
  return res.status(200).json({
    answer: `This is a placeholder response about ${bodyId}. The AI guide will be connected in P4-T01. You asked: "${question}"`,
    sources: [],
    placeholder: true,
  });
}
