import { NextResponse } from "next/server";
import { clearTokenCookie } from "@/lib/tokens";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully"
    });
    
    clearTokenCookie(response);
    return response;
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 