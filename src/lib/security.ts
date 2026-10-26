import crypto from "crypto";
import { config } from "./config";

/**
 * Verifies that incoming webhook requests genuinely originate from Meta.
 * Meta computes HMAC-SHA256 using the Meta App Secret and passes it in `x-hub-signature-256`.
 */
export function verifyMetaSignature(
  rawBody: string | Buffer,
  signatureHeader?: string | null,
  appSecret?: string
): boolean {
  const secret = appSecret || config.meta.appSecret;

  // In development mode without App Secret set, allow pass-through
  if (!secret) {
    if (process.env.NODE_ENV !== "production") {
      return true;
    }
    return false;
  }

  if (!signatureHeader || !signatureHeader.startsWith("sha256=")) {
    return false;
  }

  const expectedHash = signatureHeader.slice(7);
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(rawBody);
  const computedHash = hmac.digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(computedHash, "hex"),
      Buffer.from(expectedHash, "hex")
    );
  } catch {
    return false;
  }
}

function getEncryptionKey(): Buffer {
  const secret =
    process.env.ENCRYPTION_KEY ||
    process.env.SESSION_SECRET ||
    process.env.META_APP_SECRET ||
    "becho-default-secret-encryption-key-2026";
  return crypto.createHash("sha256").update(secret).digest(); // Exactly 32 bytes
}

/**
 * Encrypts sensitive Page Access Tokens using AES-256-GCM.
 */
export function encryptToken(plainText: string): string {
  if (!plainText) return "";
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts AES-256-GCM encrypted tokens.
 */
export function decryptToken(cipherString: string): string {
  if (!cipherString) return "";
  try {
    const parts = cipherString.split(":");
    if (parts.length !== 3) return cipherString; // If stored in plain text during dev
    const [ivHex, authTagHex, encryptedHex] = parts;
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      getEncryptionKey(),
      Buffer.from(ivHex, "hex")
    );
    decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    return cipherString;
  }
}

/**
 * In-memory sliding-window rate limiter for sensitive authentication endpoints.
 */
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

export function checkRateLimit(
  key: string,
  limit: number = 10,
  windowMs: number = 60 * 1000
): { success: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  record.count += 1;
  return { success: true, remaining: limit - record.count };
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return headers.get("x-real-ip") || "127.0.0.1";
}
