export async function GET(request) {
  // En una implementación real, aquí se consultaría la base de datos
  const garantias = [
    {
      id: 1001,
      cliente: "Juan Pérez",
      producto: "Refrigerador XYZ-123",
      serial: "RF123456789",
      fechaSolicitud: "2023-05-15",
      estado: "pendiente",
      crediMemo: "",
    },
    {
      id: 1002,
      cliente: "María González",
      producto: "Lavadora ABC-456",
      serial: "LV987654321",
      fechaSolicitud: "2023-05-10",
      estado: "aprobada",
      crediMemo: "CM-002",
    },
    {
      id: 1003,
      cliente: "Carlos Rodríguez",
      producto: "Televisor DEF-789",
      serial: "TV567891234",
      fechaSolicitud: "2023-05-05",
      estado: "rechazada",
      crediMemo: "CM-003",
    },
  ]

  return Response.json(garantias)
}

export async function POST(request) {
  try {
    const data = await request.json()

    // En una implementación real, aquí se guardaría en la base de datos
    // y se generaría un ID único

    const nuevaGarantia = {
      id: Math.floor(1000 + Math.random() * 9000), // ID aleatorio para demo
      ...data,
      fechaSolicitud: new Date().toISOString().split("T")[0],
      estado: "pendiente",
    }

    return Response.json({
      success: true,
      mensaje: "Garantía creada correctamente",
      garantia: nuevaGarantia,
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        mensaje: "Error al crear la garantía",
      },
      { status: 500 },
    )
  }
}

