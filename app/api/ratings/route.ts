import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rating, feedback } = body;

    if (!rating || typeof rating !== "number") {
      return NextResponse.json(
        { error: "Rating must be a number" },
        { status: 400 }
      );
    }

    const newRating = await prisma.rating.create({
      data: {
        rating,
        feedback: feedback || null,
      },
    });

    return NextResponse.json(
      { success: true, rating: newRating },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving rating: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
