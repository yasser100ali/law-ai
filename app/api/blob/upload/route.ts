import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody} from '@vercel/blob/client';

export const runtime = "edge"

export async function POST(request: Request): Promise<NextResponse> {
    const body = (await request.json()) as HandleUploadBody;

    try {
        const json = await handleUpload({
            body, 
            request,
            onBeforeGenerateToken: async(pathname) => {
                return {
                    allowedContentTypes: [
                        "application/pdf", 
                        "text/plain",
                        "text/csv",
                        "application/vnd.ms-excel",
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    ],
                    addRandomSuffix: true,
                };
            },
            onUploadCompleted: async ({blob}) => {
                console.log("blob uploaded successfully", blob.url, blob.pathname, blob.contentType);
            },
        });
        
        return NextResponse.json(json);
    } catch(err) { 
        return NextResponse.json({ error: (err as Error).message }, { status: 400 });
    }
}
