import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request) {
  try {
    const {
      news,
      status,
      categories, // 👈 array
      recommended,
      title,
      thumbnail,
    } = await request.json();

    // 1. Insert news
    const newsRes = await sql`
      INSERT INTO news (news, status, recommended, title, thumbnail)
      VALUES (${news}, ${status}, ${recommended}, ${title}, ${thumbnail})
      RETURNING id
    `;

    const newsId = newsRes[0].id;

    // 2. Insert categories if not exist
    for (const name of categories) {
      await sql`
        INSERT INTO categories (name)
        VALUES (${name})
        ON CONFLICT (name) DO NOTHING
      `;
    }

    // 3. Get category IDs
    const categoryRows = await sql`
      SELECT id FROM categories
      WHERE name = ANY(${categories})
    `;

    // 4. Insert into junction table
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
      { success: false, error: "Upload failed" },
      { status: 500 }
    );
  }
}