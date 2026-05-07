import { connectDB } from "@/lib/db";
import {
  createSession,
  getCurrentUser,
  getSessionCookieOptions,
  hashPassword,
  normalizeEmail,
  sanitizeUser,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";
import { User } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();

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

    await connectDB();
    const existingUsers = await User.exists({ email: safeEmail });

    if (existingUsers) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = hashPassword(safePassword);
    const newUser = await User.create({
      name: safeName,
      email: safeEmail,
      password: hashedPassword,
      role: "reader",
    });

    const user = sanitizeUser(newUser);

    if (!user) {
      throw new Error("Failed to create user");
    }

    const { token, expiresAt } = await createSession(user.id);
    const response = NextResponse.json({ success: true, data: user });

    response.cookies.set(
      SESSION_COOKIE_NAME,
      token,
      getSessionCookieOptions(expiresAt),
    );

    return response;
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        success: false,
        error: e instanceof Error ? e.message : "Failed to register user",
      },
      { status: 500 },
    );
  }
}
