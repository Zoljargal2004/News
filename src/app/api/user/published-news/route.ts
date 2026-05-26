import { getCurrentUser, isAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { News, serializeNews } from "@/lib/models";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!isAdmin(user)) {
      return NextResponse.json({ success: true, data: [] });
    }

    const news = await News.find({
      author_id: user.id,
      status: true,
    })
      .sort({ created_at: -1 })
      .populate("author_id", "name email")
      .populate("categories", "name")
      .lean();

    return NextResponse.json({
      success: true,
      data: news.map(serializeNews),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch published news",
      },
      { status: 500 },
    );
  }
}
