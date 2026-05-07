import { getCurrentUser, isAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { isObjectId, News, serializeNews } from "@/lib/models";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const normalizeId = (value: string) => {
  return isObjectId(value) ? value : null;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const user = await getCurrentUser();
    const admin = isAdmin(user);
    const { id: rawId } = await params;
    const id = normalizeId(rawId);

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Invalid news id" },
        { status: 400 },
      );
    }

    const filter: Record<string, any> = { _id: id };

    if (!admin) {
      filter.status = true;
    }

    const news = await News.findOne(filter)
      .populate("author_id", "name email")
      .populate("categories", "name")
      .lean();

    if (!news) {
      return NextResponse.json(
        { success: false, error: "News not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: serializeNews(news),
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
