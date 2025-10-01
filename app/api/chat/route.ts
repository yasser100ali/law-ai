import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Chat API received:", {
      messages: body.messages?.length || 0,
      hasData: !!body.data,
      dataKeys: body.data ? Object.keys(body.data) : []
    });

    // Forward to your Python backend (streaming response)
    const response = await fetch("http://localhost:8000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error("Python backend error:", response.status, response.statusText);
      return new Response(
        JSON.stringify({ error: "Backend error" }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Return the streaming response as-is (don't parse as JSON)
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "x-vercel-ai-data-stream": "v1"
      }
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
