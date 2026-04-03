/**
 * Auth utility module - credentials stored securely as bcrypt hash.
 * No database required. Password is hashed at build/import time.
 *
 * Credentials:
 *   username : admin
 *   password : Aicam651@  (stored only as bcrypt hash below)
 */

import * as bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";

// ─── Static credentials (no DB) ──────────────────────────────────────────────
// Generated with: bcrypt.hashSync("Aicam651@", 12)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD_HASH = "$2b$12$vvtS4LADiw2d/im0oN5EYOlvPYB./eszU8HTS01MDk4VlPXYyhOiy";

// ─── JWT config ───────────────────────────────────────────────────────────────
const JWT_SECRET_VALUE = process.env.JWT_SECRET ?? "visioncore-super-secret-key-change-in-production";
const SECRET = new TextEncoder().encode(JWT_SECRET_VALUE);
const SESSION_COOKIE = "vc_session";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours
const REMEMBER_ME_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// ─── Validate credentials ─────────────────────────────────────────────────────
export async function validateCredentials(username: string, password: string): Promise<boolean> {
  if (username.toLowerCase().trim() !== ADMIN_USERNAME.toLowerCase()) {
    return false;
  }
  return bcrypt.compare(password, ADMIN_PASSWORD_HASH);
}

// ─── Create signed JWT session token ─────────────────────────────────────────
export async function createSessionToken(username: string, maxAge: number = SESSION_MAX_AGE): Promise<string> {
  return new SignJWT({ username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${maxAge}s`)
    .sign(SECRET);
}

// ─── Verify JWT session token ─────────────────────────────────────────────────
export async function verifySessionToken(token: string): Promise<{ username: string; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { username: string; role: string };
  } catch {
    return null;
  }
}

export { SESSION_COOKIE, SESSION_MAX_AGE, REMEMBER_ME_MAX_AGE };
