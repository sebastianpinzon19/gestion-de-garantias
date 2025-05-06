import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { sendPendingWarrantiesNotification } from "@/lib/email-service"

export async function GET(request) {
  try {
    // Check for API key to secure the endpoint
    const apiKey = request.headers.get("x-api-key")

    if (!apiKey || apiKey !== process.env.CRON_API_KEY) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Connect to database
    const sql = neon(process.env.DATABASE_URL)

    // Get count of pending warranties
    const result = await sql`
      SELECT COUNT(*) as pending_count 
      FROM "Warranty" 
      WHERE status = 'pending'
    `

    const pendingCount = Number.parseInt(result[0]?.pending_count || "0", 10)

    // If there are pending warranties, send notifications
    if (pendingCount > 0) {
      // Get all sellers
      const sellers = await sql`
        SELECT email FROM "User" WHERE role = 'seller'
      `

      // Send notification to each seller
      const notifications = []
      for (const seller of sellers) {
        if (seller.email) {
          const result = await sendPendingWarrantiesNotification({
            to: seller.email,
            count: pendingCount,
          })

          notifications.push({
            email: seller.email,
            success: result.success,
          })
        }
      }

      return NextResponse.json({
        success: true,
        pendingCount,
        notificationsSent: notifications,
      })
    }

    return NextResponse.json({
      success: true,
      pendingCount,
      message: "No pending warranties, no notifications sent",
    })
  } catch (error) {
    console.error("Error sending daily notifications:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
