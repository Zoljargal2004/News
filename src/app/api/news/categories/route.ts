import { slugifyCategory } from "@/lib/categories";
import { connectDB } from "@/lib/db";
import { Category, serializeCategory } from "@/lib/models";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();

    const categoryRows = await Category.find({}).sort({ name: 1 }).lean();

    return NextResponse.json(
      {
        success: true,
        data: categoryRows.map((item) => ({
          ...serializeCategory(item),
          slug: slugifyCategory(item.name),
        })),
      },
      { status: 200 },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
