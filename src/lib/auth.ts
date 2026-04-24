import { cookies } from "next/headers";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";

export const SESSION_COOKIE_NAME = "newsletter_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;
const getAuthSecret = () =>
  process.env.AUTH_SECRET ||
  process.env.DATABASE_URL ||
  "newsletter-dev-secret";

export const normalizeEmail = (value: unknown) => {
  return String(value || "").trim().toLowerCase();
};

export const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString("hex");
  const digest = scryptSync(password, salt + getAuthSecret(), 64).toString("hex");

  return `${salt}:${digest}`;
};

export const verifyPassword = (password: string, hashedPassword: string) => {
  const [salt, storedDigest] = String(hashedPassword || "").split(":");

  if (!salt || !storedDigest) {
    return false;
  }

  const suppliedDigest = scryptSync(password, salt + getAuthSecret(), 64);
  const storedBuffer = Buffer.from(storedDigest, "hex");

  if (storedBuffer.length !== suppliedDigest.length) {
    return false;
  }

  return timingSafeEqual(storedBuffer, suppliedDigest);
};

export const sanitizeUser = (user: any) => {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const createSession = async (sql: any, userId: number) => {
  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await sql`
    INSERT INTO auth_sessions (user_id, token_hash, expires_at)
    VALUES (${userId}, ${tokenHash}, ${expiresAt.toISOString()})
  `;

  return { token, expiresAt };
};

export const deleteSession = async (sql: any, token: string | undefined) => {
  if (!token) {
    return;
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");

  await sql`
    DELETE FROM auth_sessions
    WHERE token_hash = ${tokenHash}
  `;
};

export const getCurrentUser = async (sql: any) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const tokenHash = createHash("sha256").update(token).digest("hex");
    const rows = await sql`
      SELECT u.id, u.name, u.email, u.role
      FROM auth_sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = ${tokenHash}
      AND s.expires_at > NOW()
      LIMIT 1
    `;

    return sanitizeUser(rows[0]);
  } catch (error: any) {
    if (error?.code === "42P01") {
      return null;
    }

    throw error;
  }
};

export const getSessionToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
};

export const getSessionCookieOptions = (expiresAt?: Date) => ({
  httpOnly: true as const,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  expires: expiresAt,
});

export const isMissingAuthTableError = (error: any) => {
  return error?.code === "42P01";
};

export const isAdmin = (user: any) => {
  return user?.role === "admin";
};
