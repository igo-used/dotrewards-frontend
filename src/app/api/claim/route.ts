import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { telegramId, claimType, platform } = body

    if (!telegramId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Call the backend API
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8080"
    const response = await fetch(`${backendUrl}/api/claim`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        telegram_id: telegramId,
        claim_type: claimType,
        platform: platform || "",
      }),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error processing claim:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

