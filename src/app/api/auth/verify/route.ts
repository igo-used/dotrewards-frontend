import { NextResponse } from "next/server"

// Verify Telegram data according to Telegram's documentation
// https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { initData } = body

    if (!initData) {
      return NextResponse.json({ success: false, error: "No init data provided" }, { status: 400 })
    }

    // Call the backend to verify the data
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8080"
    const response = await fetch(`${backendUrl}/api/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ init_data: initData }),
    })

    if (!response.ok) {
      throw new Error(`Backend verification failed: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error verifying Telegram data:", error)
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 401 })
  }
}

