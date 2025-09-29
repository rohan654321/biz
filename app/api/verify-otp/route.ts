import { NextResponse } from "next/server";
import { readOtpStore, writeOtpStore, cleanExpiredOtps } from "@/lib/otpStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email & OTP required" },
        { status: 400 }
      );
    }

    // Clean expired OTPs first
    cleanExpiredOtps();

    // Normalize inputs
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedOtp = String(otp).trim();

    console.log(`Verifying OTP for ${normalizedEmail}: ${normalizedOtp}`);

    // Read from storage
    const otpStore = readOtpStore();
    console.log('Stored OTPs:', otpStore);

    const storedOtpData = otpStore[normalizedEmail];

    if (!storedOtpData) {
      return NextResponse.json(
        { message: "OTP not found or expired" },
        { status: 400 }
      );
    }

    // Check expiration
    if (Date.now() > storedOtpData.expiresAt) {
      delete otpStore[normalizedEmail]; // Clean up expired OTP
      writeOtpStore(otpStore);
      return NextResponse.json(
        { message: "OTP has expired" },
        { status: 400 }
      );
    }

    // Verify OTP
    if (storedOtpData.otp === normalizedOtp) {
      delete otpStore[normalizedEmail]; // Clear after success
      writeOtpStore(otpStore);
      return NextResponse.json({ message: "OTP verified successfully" }, { status: 200 });
    }

    return NextResponse.json(
      { message: "Invalid OTP" },
      { status: 400 }
    );
  } catch (err) {
    console.error("Verify OTP error:", err);
    return NextResponse.json(
      { message: "Server error verifying OTP" },
      { status: 500 }
    );
  }
}