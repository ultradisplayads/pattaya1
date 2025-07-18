import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    // Simulate user creation
    // In real implementation, this would save to database with hashed password
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      role: "user" as const,
      verified: false,
      createdAt: new Date().toISOString(),
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    )

    return NextResponse.json({
      token,
      user: newUser,
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
