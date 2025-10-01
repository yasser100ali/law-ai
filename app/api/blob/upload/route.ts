import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

export const runtime = "edge"; // OK to keep Edge as long as the env var is configured

export async function POST(request: Request): Promise<NextResponse> {
  // 🔒 Fail fast if the signing token isn't present
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Missing BLOB_READ_WRITE_TOKEN. Add it to .env.local (dev) and your Vercel project env (prod).",
      },
      { status: 500 },
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const json = await handleUpload({
      body,
      request,
      // Called BEFORE the client token is generated
      onBeforeGenerateToken: async (pathname /*, clientPayload */) => {
        // You can add auth checks here if needed
        return {
          // match what you accept client-side
          allowedContentTypes: [
            "application/pdf",
            "text/plain",
            "text/csv",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          ],
          addRandomSuffix: true,
          // access: "public", // optional override; client can also set access
          // tokenPayload: JSON.stringify({ userId: "..." }), // optional
        };
      },
      // Called AFTER the actual upload finishes
      onUploadCompleted: async ({ blob /*, tokenPayload*/ }) => {
        // Persist blob.url / blob.pathname in your DB if you want
        console.log("Blob uploaded:", {
          url: blob.url,
          pathname: blob.pathname,
          contentType: blob.contentType,
        });
      },
    });

    return NextResponse.json(json);
  } catch (err) {
    const msg = (err as Error).message || "Upload error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
