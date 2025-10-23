import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import dbConnect from "@/lib/dbConnect"; // your MongoDB connection
import Otp from "@/models/otp";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    await dbConnect();

    const normalizedEmail = email.trim().toLowerCase();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Expiry time = 5 mins
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Remove old OTPs for this email
    await Otp.deleteMany({ email: normalizedEmail });

    // Save new OTP
    await Otp.create({ email: normalizedEmail, otp, expiresAt });

    // Setup nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
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

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send OTP error:", err);
    return NextResponse.json({ message: "Failed to send OTP" }, { status: 500 });
  }
}
