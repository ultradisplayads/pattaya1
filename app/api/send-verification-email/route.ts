import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    // In a real application, you would use a service like SendGrid, Resend, or AWS SES
    // For demo purposes, we'll just log the code
    console.log(`Verification code for ${email}: ${code}`)

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully",
    })
  } catch (error) {
    console.error("Error sending verification email:", error)
    return NextResponse.json({ success: false, message: "Failed to send verification email" }, { status: 500 })
  }
}
