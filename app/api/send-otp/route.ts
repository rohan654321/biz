import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { readOtpStore, writeOtpStore, cleanExpiredOtps } from "@/lib/otpStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // Clean expired OTPs first
    cleanExpiredOtps();

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Read current store
    const otpStore = readOtpStore();
    
    // Store OTP with expiration (5 minutes)
    otpStore[normalizedEmail] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    };

    // Write back to storage
    writeOtpStore(otpStore);

    console.log(`OTP for ${normalizedEmail}: ${otp}`);
    console.log('All stored OTPs:', otpStore);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "mondalrohan201@gmail.com",
        pass: process.env.EMAIL_PASS || "vwpg xiry lmgg jgbp",
      },
    });

    await transporter.sendMail({
      from: `"BizTradeFairs" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: "Your OTP Verification Code",
      html: `<p>Your OTP code is <b>${otp}</b>. It will expire in 5 minutes.</p>`,
    });

    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
  } catch (err) {
    console.error("Send OTP error:", err);
    return NextResponse.json({ message: "Failed to send OTP" }, { status: 500 });
  }
}