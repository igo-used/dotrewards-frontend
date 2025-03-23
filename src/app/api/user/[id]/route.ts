import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    // Call the backend API
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8080"
    const response = await fetch(`${backendUrl}/api/user/${userId}`)

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching user data:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

