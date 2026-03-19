import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();

    const file = form.get("file");
    const fileName = form.get("fileName");

    if (!file || !fileName) {
      return NextResponse.json(
        { error: "Missing file or fileName" },
        { status: 400 }
      );
    }

    const uploadForm = new FormData();
    uploadForm.append("file", file);
    uploadForm.append("fileName", fileName as string);

    const res = await fetch(
      "https://upload.imagekit.io/api/v1/files/upload",
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.IMAGE_UPLOAD_KEY + ":"
            ).toString("base64"),
        },
        body: uploadForm,
      }
    );

    const data = await res.json();

    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 }
    );
  }
}