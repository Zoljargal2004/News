import { cookies } from "next/headers";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { connectDB } from "@/lib/db";
import { serializeUser, Session } from "@/lib/models";

export const SESSION_COOKIE_NAME = "newsletter_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;
const getAuthSecret = () =>
  process.env.AUTH_SECRET ||
  process.env.MONGODB_URI ||
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
  return serializeUser(user);
};

export const createSession = async (dbOrUserId: any, maybeUserId?: string) => {
  const userId = maybeUserId || dbOrUserId;
  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await connectDB();
  await Session.create({
    user_id: userId,
    token_hash: tokenHash,
    expires_at: expiresAt,
  });

  return { token, expiresAt };
};

export const deleteSession = async (
  dbOrToken: any,
  maybeToken?: string | undefined,
) => {
  const token = maybeToken || dbOrToken;

  if (!token) {
    return;
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");

  await connectDB();
  await Session.deleteOne({ token_hash: tokenHash });
};

export const getCurrentUser = async (_db?: any) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const tokenHash = createHash("sha256").update(token).digest("hex");
    await connectDB();

    const session = await Session.findOne({
      token_hash: tokenHash,
      expires_at: { $gt: new Date() },
    })
      .populate("user_id", "name email role")
      .lean();

    if (!session?.user_id) {
      return null;
    }

    return sanitizeUser(session.user_id);
  } catch (error: any) {
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

export const isAdmin = (user: any) => {
  return user?.role === "admin";
};
