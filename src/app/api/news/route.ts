import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const {
      news,
      status,
      categories,
      recommended,
      title,
      thumbnail,
    } = await request.json();
    const safeCategories = Array.isArray(categories) ? categories : [];
    const safeNews = Array.isArray(news) ? news : [];

    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 },
      );
    }

    const newsRes = await sql`
      INSERT INTO news (news, status, recommended, title, thumbnail)
      VALUES (${JSON.stringify(safeNews)}, ${status}, ${recommended}, ${title.trim()}, ${thumbnail})
      RETURNING id
    `;

    const newsId = newsRes[0].id;

    const categoryRows = await sql`
      SELECT id FROM categories
      WHERE name = ANY(${safeCategories})
    `;

    if (safeCategories.length > 0 && categoryRows.length !== safeCategories.length) {
      return NextResponse.json(
        { success: false, error: "One or more selected categories do not exist" },
        { status: 400 },
      );
    }

    for (const cat of categoryRows) {
      await sql`
        INSERT INTO news_categories (news_id, category_id)
        VALUES (${newsId}, ${cat.id})
      `;
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        success: false,
        error: e instanceof Error ? e.message : "Failed to create news",
      },
      { status: 500 }
    );
  }
}
