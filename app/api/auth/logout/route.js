import { NextResponse } from "next/server";
import { clearTokenCookies } from "@/lib/tokens";

export async function POST() {
  try {
    clearTokenCookies();
    
    return NextResponse.json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 