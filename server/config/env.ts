import dotenv from "dotenv";

type NodeEnv = "development" | "production" | "test";

dotenv.config();

const requiredEnv = ["DATABASE_URL", "JWT_SECRET"];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});

export const env = Object.freeze({
  port: Number(process.env.PORT) || 8000,
  nodeEnv: (process.env.NODE_ENV as NodeEnv) ?? "development",
  clientUrls: process.env.CLIENT_URL?.split(",")
    .map((url) => url.trim())
    .filter(Boolean) || ["http://localhost:5173"],
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || "",
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
  },
});

export const isProd = env.nodeEnv === "production";

export const isDev = env.nodeEnv === "development";

export const isTest = env.nodeEnv === "test";
