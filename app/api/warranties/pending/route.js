import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    // In a real implementation, this would query the database for pending warranties
    // For now, we'll return mock data
    const pendingWarranties = [
      {
        id: 1001,
        customer_name: "Juan Pérez",
        brand: "FrostCool",
        model: "XYZ-123",
        serial: "RF123456789",
        created_at: "2023-05-15",
        status: "pending",
      },
      {
        id: 1004,
        customer_name: "Ana Martínez",
        brand: "HomeHeat",
        model: "GHI-012",
        serial: "ES432109876",
        created_at: "2023-05-01",
        status: "pending",
      },
      {
        id: 1008,
        customer_name: "Roberto Gómez",
        brand: "KitchenPro",
        model: "MNO-789",
        serial: "LC789012345",
        created_at: "2023-05-18",
        status: "pending",
      },
    ]

    return NextResponse.json(pendingWarranties)
  } catch (error) {
    console.error("Error fetching pending warranties:", error)

    // Return empty array instead of error
    return NextResponse.json([])
  }
}
