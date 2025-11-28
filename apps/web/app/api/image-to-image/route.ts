import { NextResponse } from "next/server";
import { Buffer } from "buffer";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const prompt = (formData.get("prompt") as string) || "fashion design";
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 }
      );
    }

    const form = new FormData();
    form.append("prompt", prompt);
    form.append("model", "sd3.5-flash");
    form.append("image", imageFile); // File is supported in Node runtime fetch
    form.append("output_format", "png");

    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/edit/sd3",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_KEY}`,
          Accept: "image/*",
        },
        body: form,
      }
    );

    if (!response.ok) {
      let err: any = {};
      try {
        err = await response.json();
      } catch {
        err = { error: "Stability API error" };
      }
      return NextResponse.json(err, { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    return NextResponse.json({
      image: base64,
      mime: "image/png",
    });
  } catch (err: any) {
    console.error("image-to-image route error:", err);
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}

