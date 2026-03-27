import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import {
  createSession,
  deleteSession,
  getSessionCookieOptions,
  getSessionToken,
  isMissingAuthTableError,
  normalizeEmail,
  sanitizeUser,
  SESSION_COOKIE_NAME,
  verifyPassword,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const safeEmail = normalizeEmail(email);
    const safePassword = String(password || "");

    if (!safeEmail || !safePassword) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 },
      );
    }

    const rows = await sql`
      SELECT id, name, email, password
      FROM users
      WHERE email = ${safeEmail}
      LIMIT 1
    `;


    const user = rows[0];

    if (!user || !verifyPassword(safePassword, user.password)) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const { token, expiresAt } = await createSession(sql, user.id);
    const response = NextResponse.json({
      success: true,
      data: sanitizeUser(user),
    });

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
        error: e instanceof Error ? e.message : "Failed to sign in",
      },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    const token = await getSessionToken();
    await deleteSession(sql, token);

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE_NAME, "", {
      ...getSessionCookieOptions(new Date(0)),
      maxAge: 0,
    });

    return response;
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        success: false,
        error: e instanceof Error ? e.message : "Failed to sign out",
      },
      { status: 500 },
    );
  }
}
