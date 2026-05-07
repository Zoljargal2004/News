import { getCurrentUser, isAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Comment, isObjectId, News, serializeComment } from "@/lib/models";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const normalizeId = (value: string) => {
  return isObjectId(value) ? value : null;
};

const getNewsAccess = async (newsId: string, admin: boolean) => {
  const filter: Record<string, any> = { _id: newsId };

  if (!admin) {
    filter.status = true;
  }

  return News.exists(filter);
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

    const comments = await Comment.find({ news_id: newsId })
      .sort({ created_at: -1 })
      .populate("user_id", "name role")
      .lean();

    return NextResponse.json({
      success: true,
      data: comments.map(serializeComment),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch comments",
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
    await connectDB();

    const user = await getCurrentUser();

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

    const comment = await Comment.create({
      news_id: newsId,
      user_id: user.id,
      content: safeContent,
    });

    return NextResponse.json({
      success: true,
      data: {
        ...serializeComment(comment),
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
        error:
          error instanceof Error ? error.message : "Failed to create comment",
      },
      { status: 500 },
    );
  }
}
