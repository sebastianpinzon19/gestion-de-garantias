import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function GET(request) {
  try {
    // Crear un transporte con las variables de entorno
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number.parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // Obtener los destinatarios de prueba
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || []

    if (adminEmails.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No hay direcciones de correo configuradas en ADMIN_EMAILS",
        },
        { status: 400 },
      )
    }

    // Enviar un correo de prueba
    const info = await transporter.sendMail({
      from: `"Sistema de Garantías" <${process.env.EMAIL_FROM}>`,
      to: adminEmails.join(","),
      subject: "Prueba de configuración de email",
      html: `
        <h1>Prueba de configuración de email</h1>
        <p>Este es un correo de prueba para verificar que la configuración de email está funcionando correctamente.</p>
        <p>Variables de entorno configuradas:</p>
        <ul>
          <li><strong>EMAIL_HOST:</strong> ${process.env.EMAIL_HOST}</li>
          <li><strong>EMAIL_PORT:</strong> ${process.env.EMAIL_PORT}</li>
          <li><strong>EMAIL_SECURE:</strong> ${process.env.EMAIL_SECURE}</li>
          <li><strong>EMAIL_USER:</strong> ${process.env.EMAIL_USER}</li>
          <li><strong>EMAIL_FROM:</strong> ${process.env.EMAIL_FROM}</li>
          <li><strong>ADMIN_EMAILS:</strong> ${process.env.ADMIN_EMAILS}</li>
          <li><strong>NEXT_PUBLIC_APP_URL:</strong> ${process.env.NEXT_PUBLIC_APP_URL}</li>
        </ul>
        <p>Fecha y hora: ${new Date().toLocaleString()}</p>
      `,
    })

    return NextResponse.json({
      success: true,
      message: "Correo de prueba enviado correctamente",
      messageId: info.messageId,
      previewURL: nodemailer.getTestMessageUrl?.(info) || null,
    })
  } catch (error) {
    console.error("Error al enviar el correo de prueba:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Error al enviar el correo de prueba",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
