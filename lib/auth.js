import { SignJWT, jwtVerify } from "jose";

// Cookie name that holds the admin session JWT.
export const AUTH_COOKIE = "admin_token";

// How long a session lasts.
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

// Sign a JWT for the given payload (e.g. { sub, email }).
// Uses `jose` so the same tokens verify in both the Node and Edge runtimes.
export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

// Verify a token; returns the payload, or null if invalid/expired.
export async function verifyToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
  } catch {
    return null;
  }
}

// Standard options for setting the auth cookie.
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: MAX_AGE_SECONDS,
};

// Options for clearing the auth cookie on logout. Mirrors `cookieOptions`
// (same httpOnly/secure/sameSite/path) so the browser reliably overwrites and
// expires the existing cookie; only the lifetime differs (maxAge: 0).
export const clearCookieOptions = {
  ...cookieOptions,
  maxAge: 0,
};
