import { sql } from "@/lib/db";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

const normalizeId = (value: string) => {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser(sql);
    const admin = isAdmin(user);
    const { id: rawId } = await params;
    const id = normalizeId(rawId);

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Invalid news id" },
        { status: 400 },
      );
    }

    const rows = await sql`
      SELECT
        n.*,
        u.name AS author_name,
        u.email AS author_email,
        COALESCE(
          ARRAY_AGG(c.name) FILTER (WHERE c.name IS NOT NULL),
          ARRAY[]::text[]
        ) AS categories
      FROM news n
      LEFT JOIN users u ON u.id = n.author_id
      LEFT JOIN news_categories nc ON n.id = nc.news_id
      LEFT JOIN categories c ON c.id = nc.category_id
      WHERE n.id = ${id}
      AND (${admin} OR n.status = TRUE)
      GROUP BY n.id, u.name, u.email
    `;

    const news = rows[0];

    if (!news) {
      return NextResponse.json(
        { success: false, error: "News not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: news,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        success: false,
        error: e instanceof Error ? e.message : "Failed to fetch news",
      },
      { status: 500 },
    );
  }
}
