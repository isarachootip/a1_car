import crypto from "node:crypto";

export const SYSADMIN_USERNAME = "sysadmin";
export const SYSADMIN_DEFAULT_PASSWORD = "oil10041969*";
export const STAFF_DEFAULT_PASSWORD = "1234";
export const SESSION_COOKIE_NAME = "auto1_session";

const AUTH_SECRET =
  process.env.AUTO1_AUTH_SECRET ?? "auto1-central-retail-pickup-delivery-secret-2026";

export interface SessionUserPayload {
  id: string;
  username: string;
  name: string;
  role: "SYSADMIN" | "ADMIN" | "STAFF";
  branchId: string;
  branchName: string;
}

export function hashPassword(plainPassword: string, customSalt?: string): string {
  const salt = customSalt ?? crypto.randomBytes(8).toString("hex");
  const digest = crypto
    .createHmac("sha256", `${AUTH_SECRET}:${salt}`)
    .update(plainPassword)
    .digest("hex");
  return `${salt}:${digest}`;
}

export function verifyPassword(plainPassword: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(":")) return false;
  const [salt, expectedHex] = storedHash.split(":");
  if (!salt || !expectedHex) return false;
  const computed = hashPassword(plainPassword, salt).split(":")[1] ?? "";
  if (computed.length !== expectedHex.length) return false;
  return crypto.timingSafeEqual(
    Buffer.from(computed, "utf8"),
    Buffer.from(expectedHex, "utf8")
  );
}

export function generateStaffUsername(branchCode: string, staffIndex: number): string {
  const normalizedCode = branchCode.trim().toLowerCase();
  const num = String(staffIndex + 1).padStart(2, "0");
  return `${normalizedCode}-${num}`;
}

export function createSessionToken(payload: SessionUserPayload): string {
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url"
  );
  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(encodedPayload)
    .digest("base64url");
  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string | undefined): SessionUserPayload | null {
  if (!token || !token.includes(".")) return null;
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSig = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(encodedPayload)
    .digest("base64url");

  if (signature.length !== expectedSig.length) return null;
  const valid = crypto.timingSafeEqual(
    Buffer.from(signature, "utf8"),
    Buffer.from(expectedSig, "utf8")
  );
  if (!valid) return null;

  try {
    const json = Buffer.from(encodedPayload, "base64url").toString("utf8");
    return JSON.parse(json) as SessionUserPayload;
  } catch {
    return null;
  }
}
