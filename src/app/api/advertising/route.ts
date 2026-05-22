import { getCurrentUser, isAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import {
  AdvertisingRequest,
  serializeAdvertisingRequest,
} from "@/lib/models";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    await connectDB();

    const user = await getCurrentUser();
    const body = await request.json();

    const companyName = String(body.companyName || "").trim();
    const contactName = String(body.contactName || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim() || null;
    const placement = String(body.placement || "homepage").trim();
    const budget = String(body.budget || "").trim() || null;
    const message = String(body.message || "").trim();

    if (!companyName || !contactName || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Company name, contact name, email, and message are required",
        },
        { status: 400 },
      );
    }

    const createdRequest = await AdvertisingRequest.create({
      company_name: companyName,
      contact_name: contactName,
      email,
      phone,
      placement,
      budget,
      message,
      user_id: user?.id || null,
    });

    return NextResponse.json(
      {
        success: true,
        data: serializeAdvertisingRequest(createdRequest),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to submit advertising request",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const user = await getCurrentUser();

    if (!isAdmin(user)) {
      return NextResponse.json(
        { success: false, error: "Only admins can view advertising requests" },
        { status: 403 },
      );
    }

    const requests = await AdvertisingRequest.find({})
      .sort({ created_at: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: requests.map(serializeAdvertisingRequest),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch advertising requests",
      },
      { status: 500 },
    );
  }
}