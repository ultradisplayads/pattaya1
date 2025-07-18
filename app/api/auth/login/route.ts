import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Simulate user lookup and password verification
    // In real implementation, this would check against a database
    const users = [
      {
        id: "1",
        email: "user@example.com",
        password: "password123", // In real app, this would be hashed
        name: "John Doe",
        role: "user",
        verified: true,
      },
      {
        id: "2",
        email: "business@example.com",
        password: "business123",
        name: "Ocean View Restaurant",
        role: "business",
        verified: true,
      },
      {
        id: "3",
        email: "admin@pattaya1.com",
        password: "admin123",
        name: "Admin User",
        role: "admin",
        verified: true,
      },
    ]

    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    )

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
