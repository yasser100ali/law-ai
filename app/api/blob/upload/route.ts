import { NextReponse } from "next/server";
import { handleUpload, type HandleUploadBody} from '@vercel/blob/client';

export const runtime = "edge"

export async function POST(request: Request): Promise<NextReponse> {
    const body = (await request.join()) as HandleUploadBody;

    try { }
}
