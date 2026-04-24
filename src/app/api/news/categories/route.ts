import { sql } from "@/lib/db";
import { slugifyCategory } from "@/lib/categories";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categoryRows = await sql`
      SELECT id, name FROM categories
      ORDER BY name ASC
    `;
    return NextResponse.json(
      {
        success: true,
        data: categoryRows.map((item) => ({
          ...item,
          slug: slugifyCategory(item.name),
        })),
      },
      { status: 200 },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 },
    );
  }
}
