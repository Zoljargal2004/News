import { politicalParties } from "@/data/political-parties";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: politicalParties,
  });
}
