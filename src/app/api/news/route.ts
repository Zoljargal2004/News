import { sql } from "@/lib/db";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

const normalizeCategories = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(value.map((item) => String(item).trim()).filter(Boolean))];
};

const normalizeCategoryIds = (value: string | null) => {
  if (!value) {
    return [];
  }

  return [
    ...new Set(
      value
        .split(",")
        .map((item) => Number(item.trim()))
        .filter((item) => Number.isInteger(item) && item > 0),
    ),
  ];
};

const normalizeNews = (value: unknown) => {
  return Array.isArray(value) ? value : [];
};

const normalizeDate = (value: string | null) => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed || null;
};

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(sql);

    if (!isAdmin(user)) {
      return NextResponse.json(
        { success: false, error: "Only admins can create news" },
        { status: 403 },
      );
    }

    const {
      news,
      status,
      categories,
      recommended,
      title,
      thumbnail,
      politicalParty,
    } =
      await request.json();
    const safeTitle = String(title || "").trim();
    const safeCategories = normalizeCategories(categories);
    const safeNews = normalizeNews(news);
    const safePoliticalParty = String(politicalParty || "").trim() || null;

    if (!safeTitle) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 },
      );
    }

    if (safeNews.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one content block is required" },
        { status: 400 },
      );
    }

    const newsRes = await sql`
      INSERT INTO news (
        news,
        status,
        recommended,
        title,
        thumbnail,
        political_party,
        author_id
      )
      VALUES (
        ${JSON.stringify(safeNews)},
        ${Boolean(status)},
        ${Boolean(recommended)},
        ${safeTitle},
        ${thumbnail || null},
        ${safePoliticalParty},
        ${user.id}
      )
      RETURNING id
    `;

    const newsId = newsRes[0]?.id;

    if (!newsId) {
      throw new Error("Failed to create news row");
    }

    if (safeCategories.length > 0) {
      const categoryRows = await sql`
        SELECT id, name FROM categories
        WHERE name = ANY(${safeCategories})
      `;

      if (categoryRows.length !== safeCategories.length) {
        const foundNames = new Set(categoryRows.map((row) => row.name));
        const missingCategories = safeCategories.filter(
          (name) => !foundNames.has(name),
        );

        return NextResponse.json(
          {
            success: false,
            error: `Unknown categories: ${missingCategories.join(", ")}`,
          },
          { status: 400 },
        );
      }

      for (const category of categoryRows) {
        await sql`
          INSERT INTO news_categories (news_id, category_id)
          VALUES (${newsId}, ${category.id})
        `;
      }
    }

    return NextResponse.json({ success: true, data: { id: newsId } });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        success: false,
        error: e instanceof Error ? e.message : "Failed to create news",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(sql);
    const admin = isAdmin(user);
    const { searchParams } = new URL(request.url);
    const publishDate = normalizeDate(searchParams.get("publish-date"));
    const categoryIds = normalizeCategoryIds(searchParams.get("category"));

    let news;

    if (categoryIds.length > 0 && publishDate) {
      news = await sql`
    SELECT DISTINCT n.*
    FROM news n
    JOIN news_categories nc ON n.id = nc.news_id
    JOIN categories c ON c.id = nc.category_id
    WHERE c.id = ANY(${categoryIds}::int[])
    AND (${admin} OR n.status = TRUE)
    AND n.created_at >= ${publishDate}
    AND n.created_at < ${publishDate}::date + INTERVAL '1 day'
    ORDER BY n.created_at DESC
  `;
    } else if (categoryIds.length > 0) {
      news = await sql`
    SELECT DISTINCT n.*
    FROM news n
    JOIN news_categories nc ON n.id = nc.news_id
    JOIN categories c ON c.id = nc.category_id
    WHERE c.id = ANY(${categoryIds}::int[])
    AND (${admin} OR n.status = TRUE)
    ORDER BY n.created_at DESC
  `;
    } else if (publishDate) {
      news = await sql`
        SELECT *
        FROM news
        WHERE (${admin} OR status = TRUE)
        AND created_at >= ${publishDate}
        AND created_at < ${publishDate}::date + INTERVAL '1 day'
        ORDER BY created_at DESC
      `;
    } else {
      news = await sql`
        SELECT *
        FROM news
        WHERE (${admin} OR status = TRUE)
        ORDER BY created_at DESC
      `;
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
