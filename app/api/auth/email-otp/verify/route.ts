// app/api/auth/email-otp/verify/route.ts
import { NextResponse } from "next/server"
import { cache } from "@/lib/cache"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const emailRaw = body?.email
    const codeRaw = body?.code
    const email = typeof emailRaw === 'string' ? emailRaw.trim().toLowerCase() : ''
    const code = typeof codeRaw === 'string' ? codeRaw.trim() : typeof codeRaw === 'number' ? String(codeRaw) : ''
    if (!email || !code) {
      return NextResponse.json({ ok: false, message: "Email and code required" }, { status: 400 })
    }

    let expected = cache.get<string>(`email-otp:${email}`)
    console.log("expected", expected)
    if (!expected) {
      const cookieStore = await cookies()
      const cookie = cookieStore.get("email-otp")?.value
      if (cookie) {
        try {
          const parsed = JSON.parse(cookie) as { email: string; code: string }
          if (parsed.email === email) expected = parsed.code
        } catch {}
      }
      if (!expected) {
        return NextResponse.json({ ok: false, message: "Code expired or not found" }, { status: 400 })
      }
    }
    if (expected !== code) {
      return NextResponse.json({ ok: false, message: "Invalid code" }, { status: 400 })
    }

    cache.delete(`email-otp:${email}`)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("OTP verify error", err)
    return NextResponse.json({ ok: false, message: "Verification failed" }, { status: 500 })
  }
}