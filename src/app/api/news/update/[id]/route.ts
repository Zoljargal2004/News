import { getCurrentUser, isAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Category, isObjectId, News, serializeNews } from "@/lib/models";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const normalizeId = (value: string) => {
  return isObjectId(value) ? value : null;
};

const normalizeCategories = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(value.map((item) => String(item).trim()).filter(Boolean))];
};

const normalizeNews = (value: unknown) => {
  return Array.isArray(value) ? value : [];
};

const updateNews = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    await connectDB();

    const user = await getCurrentUser();

    if (!isAdmin(user)) {
      return NextResponse.json(
        { success: false, error: "Only admins can edit news" },
        { status: 403 },
      );
    }

    const { id: rawId } = await params;
    const id = normalizeId(rawId);

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Invalid news id" },
        { status: 400 },
      );
    }

    const existingNews = await News.findById(id);

    if (!existingNews) {
      return NextResponse.json(
        { success: false, error: "News not found" },
        { status: 404 },
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
    } = await request.json();
    const safeTitle = String(title || "").trim();
    const safeNews = normalizeNews(news);
    const safeCategories = normalizeCategories(categories);
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

    const categoryRows = await Promise.all(
      safeCategories.map((name) =>
        Category.findOneAndUpdate(
          { name },
          { $setOnInsert: { name } },
          { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
        ),
      ),
    );

    existingNews.set({
      news: safeNews,
      status: Boolean(status),
      recommended: Boolean(recommended),
      title: safeTitle,
      thumbnail: thumbnail || null,
      political_party: safePoliticalParty,
      categories: categoryRows.map((category) => category._id),
    });

    await existingNews.save();

    const updatedNews = await News.findById(id)
      .populate("author_id", "name email")
      .populate("categories", "name")
      .lean();

    return NextResponse.json({
      success: true,
      data: serializeNews(updatedNews),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update news",
      },
      { status: 500 },
    );
  }
};

export const PUT = updateNews;
export const PATCH = updateNews;
