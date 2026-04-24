import { getCurrentUser, isAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

const normalizeId = (value: string) => {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
};

const getNewsAccess = async (newsId: number, admin: boolean) => {
  const rows = await sql`
    SELECT id
    FROM news
    WHERE id = ${newsId}
    AND (${admin} OR status = TRUE)
    LIMIT 1
  `;

  return rows[0] || null;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser(sql);
    const admin = isAdmin(user);
    const { id: rawId } = await params;
    const newsId = normalizeId(rawId);

    if (!newsId) {
      return NextResponse.json(
        { success: false, error: "Invalid news id" },
        { status: 400 },
      );
    }

    const news = await getNewsAccess(newsId, admin);

    if (!news) {
      return NextResponse.json(
        { success: false, error: "News not found" },
        { status: 404 },
      );
    }

    const comments = await sql`
      SELECT
        c.id,
        c.content,
        c.created_at,
        c.updated_at,
        u.id AS user_id,
        u.name AS user_name,
        u.role AS user_role
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.news_id = ${newsId}
      ORDER BY c.created_at DESC
    `;

    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch comments",
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser(sql);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const admin = isAdmin(user);
    const { id: rawId } = await params;
    const newsId = normalizeId(rawId);
    const { content } = await request.json();
    const safeContent = String(content || "").trim();

    if (!newsId) {
      return NextResponse.json(
        { success: false, error: "Invalid news id" },
        { status: 400 },
      );
    }

    if (!safeContent) {
      return NextResponse.json(
        { success: false, error: "Comment is required" },
        { status: 400 },
      );
    }

    const news = await getNewsAccess(newsId, admin);

    if (!news) {
      return NextResponse.json(
        { success: false, error: "News not found" },
        { status: 404 },
      );
    }

    const rows = await sql`
      INSERT INTO comments (news_id, user_id, content)
      VALUES (${newsId}, ${user.id}, ${safeContent})
      RETURNING id, content, created_at, updated_at
    `;

    return NextResponse.json({
      success: true,
      data: {
        ...rows[0],
        user_id: user.id,
        user_name: user.name,
        user_role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create comment",
      },
      { status: 500 },
    );
  }
}
