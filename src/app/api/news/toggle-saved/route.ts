import { getCurrentUser, isAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { isObjectId, News, Saveds } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const normalizeId = (value: unknown) => {
  const id = String(value || "").trim();

  return isObjectId(id) ? id : null;
};

const readJson = async (request: NextRequest) => {
  try {
    return await request.json();
  } catch {
    return {};
  }
};

const getNewsId = async (request: NextRequest) => {
  const body = await readJson(request);

  return normalizeId(
    body.news_id ||
      body.newsId ||
      body.id ||
      request.nextUrl.searchParams.get("news_id") ||
      request.nextUrl.searchParams.get("newsId") ||
      request.nextUrl.searchParams.get("id"),
  );
};

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const admin = isAdmin(user);
    const newsId = await getNewsId(request);

    if (!newsId) {
      return NextResponse.json(
        { success: false, error: "Invalid news id" },
        { status: 400 },
      );
    }

    const filter: Record<string, any> = { _id: newsId };

    if (!admin) {
      filter.status = true;
    }

    const news = await News.exists(filter);

    if (!news) {
      return NextResponse.json(
        { success: false, error: "News not found" },
        { status: 404 },
      );
    }

    const savedFilter = {
      user_id: user.id,
      news_id: newsId,
    };
    const existingSaved = await Saveds.exists(savedFilter);

    if (existingSaved) {
      await Saveds.deleteMany(savedFilter);

      return NextResponse.json({
        success: true,
        data: { id: newsId, saved: false },
      });
    }

    try {
      await Saveds.create(savedFilter);
    } catch (error: any) {
      if (error?.code !== 11000) {
        throw error;
      }
    }

    return NextResponse.json({
      success: true,
      data: { id: newsId, saved: true },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        success: false,
        error: e instanceof Error ? e.message : "Failed to toggle saved news",
      },
      { status: 500 },
    );
  }
}
