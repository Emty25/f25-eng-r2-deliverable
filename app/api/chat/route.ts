/* eslint-disable */
import { generateResponse } from "@/lib/services/species-chat";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { message: string };
  try {
    const { message } = body;
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const genresponse = await generateResponse(message);
    return NextResponse.json({ response: genresponse });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get response" }, { status: 502 });
  }
}
