// app/api/auth/email-otp/send/route.ts
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import nodemailer from "nodemailer"
import { cache } from "@/lib/cache"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const emailRaw = body?.email
    const email = typeof emailRaw === 'string' ? emailRaw.trim().toLowerCase() : ''
    if (!email) return NextResponse.json({ ok: false, message: "Email required" }, { status: 400 })

    const code = Math.floor(10000 + Math.random() * 90000).toString() // 5 digits
    cache.set(`email-otp:${email}`, code, 10 * 60) // 10 min TTL

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Your verification code",
      text: `Your verification code is ${code}. It expires in 10 minutes.`,
      html: `<p>Your verification code is <b>${code}</b>. It expires in 10 minutes.</p>`,
    })

    // Also store code in an HttpOnly cookie as a fallback for dev/server restarts
    const res = NextResponse.json({ ok: true })
    const cookiePayload = JSON.stringify({ email, code })
    res.cookies.set("email-otp", cookiePayload, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10, // 10 minutes
      path: "/",
    })
    return res
  } catch (err) {
    console.error("OTP send error", err)
    return NextResponse.json({ ok: false, message: "Failed to send code" }, { status: 500 })
  }
}