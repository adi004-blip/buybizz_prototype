import { randomBytes } from "crypto";

/**
 * Generate a unique API key for purchased AI agents
 * Format: bb_live_sk_[32_random_chars]
 */
export function generateApiKey(): string {
  const randomString = randomBytes(32).toString("hex");
  return `bb_live_sk_${randomString}`;
}

/**
 * Validate API key format
 */
export function isValidApiKeyFormat(key: string): boolean {
  return /^bb_live_sk_[a-f0-9]{64}$/.test(key);
}
