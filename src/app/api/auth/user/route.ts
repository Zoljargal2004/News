import { sql } from "@/lib/db";
import {
  createSession,
  getCurrentUser,
  getSessionCookieOptions,
  hashPassword,
  isMissingAuthTableError,
  normalizeEmail,
  sanitizeUser,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser(sql);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        success: false,
        error: e instanceof Error ? e.message : "Failed to fetch user",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, password } = await request.json();
    const safeName = String(name || "").trim();
    const safeEmail = normalizeEmail(email);
    const safePassword = String(password || "");

    if (!safeName || !safeEmail || !safePassword) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required" },
        { status: 400 },
      );
    }

    if (safePassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    const existingUsers = await sql`
      SELECT id
      FROM users
      WHERE email = ${safeEmail}
      LIMIT 1
    `;

    if (existingUsers[0]) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = hashPassword(safePassword);
    const userRows = await sql`
      INSERT INTO users (name, email, password)
      VALUES (${safeName}, ${safeEmail}, ${hashedPassword})
      RETURNING id, name, email
    `;

    const user = sanitizeUser(userRows[0]);

    if (!user) {
      throw new Error("Failed to create user");
    }

    const { token, expiresAt } = await createSession(sql, user.id);
    const response = NextResponse.json({ success: true, data: user });

    response.cookies.set(
      SESSION_COOKIE_NAME,
      token,
      getSessionCookieOptions(expiresAt),
    );

    return response;
  } catch (e) {
    console.error(e);
    if (isMissingAuthTableError(e)) {
      return NextResponse.json(
        {
          success: false,
          error: "Auth tables are missing. Run src/lib/auth-schema.sql in your database first.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: e instanceof Error ? e.message : "Failed to register user",
      },
      { status: 500 },
    );
  }
}
