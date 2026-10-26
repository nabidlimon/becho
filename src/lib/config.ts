import fs from "fs";
import path from "path";

/**
 * In-memory cache for .env.local variables to avoid repeated synchronous disk reads.
 */
let cachedEnvLocal: Record<string, string> | null = null;
let lastEnvMtime = 0;

function loadEnvLocalCache(): Record<string, string> {
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const stats = fs.statSync(envPath);
      if (cachedEnvLocal !== null && stats.mtimeMs === lastEnvMtime) {
        return cachedEnvLocal;
      }
      lastEnvMtime = stats.mtimeMs;
      cachedEnvLocal = {};
      const content = fs.readFileSync(envPath, "utf8");
      const lines = content.split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx !== -1) {
            const k = trimmed.substring(0, eqIdx).trim();
            let v = trimmed.substring(eqIdx + 1).trim();
            // Strip surrounding quotes if present
            if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
              v = v.slice(1, -1);
            }
            cachedEnvLocal[k] = v;
            process.env[k] = v;
          }
        }
      }
    }
  } catch {
    // Ignore file read error if running in browser or edge
  }

  return cachedEnvLocal || {};
}

/**
 * Resolves environment variables efficiently:
 * 1. Checks freshly cached .env.local (auto-reloaded on file modification)
 * 2. Falls back to process.env (Vercel serverless / container env)
 */
function getEnvVar(key: string, defaultValue = ""): string {
  const fileEnv = loadEnvLocalCache();
  if (fileEnv[key]) {
    return fileEnv[key];
  }

  if (process.env[key]) {
    return process.env[key]!;
  }

  return defaultValue;
}

export const config = {
  get appUrl() {
    return getEnvVar("NEXT_PUBLIC_APP_URL", "http://localhost:3000");
  },
  gemini: {
    get apiKey() {
      return getEnvVar("GEMINI_API_KEY", "");
    },
    get model() {
      return getEnvVar("GEMINI_MODEL", "gemini-2.5-flash");
    },
  },
  meta: {
    get appId() {
      return getEnvVar("META_APP_ID", "");
    },
    get appSecret() {
      return getEnvVar("META_APP_SECRET", "");
    },
    get verifyToken() {
      return getEnvVar("META_VERIFY_TOKEN", "becho_secure_verify_token_2026");
    },
    get apiVersion() {
      return getEnvVar("META_GRAPH_API_VERSION", "v20.0");
    },
    graphBaseUrl: "https://graph.facebook.com",
  },
  debounce: {
    get windowMs() {
      return parseInt(getEnvVar("DEBOUNCE_WINDOW_MS", "3500"), 10);
    },
  },
  storage: {
    get mode() {
      return getEnvVar("STORAGE_MODE", "local");
    },
    get databaseUrl() {
      return getEnvVar("DATABASE_URL", "");
    },
  },
};
