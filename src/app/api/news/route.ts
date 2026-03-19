import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { news, status, category, recommended, title } =
      await request.json();

    const res = await sql`
      INSERT INTO news (news, status, category, recommended, title)
      VALUES (${news}, ${status}, ${category}, ${recommended}, ${title})
      RETURNING *
    `;

    return NextResponse.json({ success: true, data: res[0] });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 }
    );
  }
}