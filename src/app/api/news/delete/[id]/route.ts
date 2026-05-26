import { getCurrentUser, isAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Comment, isObjectId, News } from "@/lib/models";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const normalizeId = (value: string) => {
  return isObjectId(value) ? value : null;
};

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const user = await getCurrentUser();

    if (!isAdmin(user)) {
      return NextResponse.json(
        { success: false, error: "Only admins can delete news" },
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

    const deletedNews = await News.findByIdAndDelete(id).lean();

    if (!deletedNews) {
      return NextResponse.json(
        { success: false, error: "News not found" },
        { status: 404 },
      );
    }

    await Comment.deleteMany({ news_id: id });

    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete news",
      },
      { status: 500 },
    );
  }
}
