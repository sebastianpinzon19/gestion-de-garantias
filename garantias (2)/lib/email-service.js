import nodemailer from "nodemailer"

// Configurar el transporte de correo
// En producción, usarías un servicio como SendGrid, Mailgun, etc.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.example.com",
  port: Number.parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER || "user@example.com",
    pass: process.env.EMAIL_PASSWORD || "password",
  },
})

// Función para enviar correo de notificación a administradores
export async function sendAdminNotification(warranty) {
  try {
    // Obtener correos de administradores (en producción, esto vendría de la base de datos)
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || ["admin@ejemplo.com"]

    const mailOptions = {
      from: `"Sistema de Garantías" <${process.env.EMAIL_FROM || "garantias@ejemplo.com"}>`,
      to: adminEmails.join(","),
      subject: `Nueva solicitud de garantía #${warranty.id}`,
      html: `
        <h1>Nueva solicitud de garantía</h1>
        <p>Se ha recibido una nueva solicitud de garantía con los siguientes detalles:</p>
        <ul>
          <li><strong>ID:</strong> ${warranty.id}</li>
          <li><strong>Cliente:</strong> ${warranty.customer_name}</li>
          <li><strong>Producto:</strong> ${warranty.brand} ${warranty.model}</li>
          <li><strong>Serial:</strong> ${warranty.serial}</li>
          <li><strong>Fecha:</strong> ${new Date(warranty.created_at).toLocaleDateString()}</li>
        </ul>
        <p>Por favor, ingrese al <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/garantias/${warranty.id}">panel de administración</a> para revisar y asignar esta garantía.</p>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error: error.message }
  }
}

// Función para notificar a un vendedor que se le ha asignado una garantía
export async function sendSellerAssignmentNotification(warranty, seller) {
  try {
    const mailOptions = {
      from: `"Sistema de Garantías" <${process.env.EMAIL_FROM || "garantias@ejemplo.com"}>`,
      to: seller.email,
      subject: `Garantía #${warranty.id} asignada a usted`,
      html: `
        <h1>Garantía asignada</h1>
        <p>Se le ha asignado una solicitud de garantía con los siguientes detalles:</p>
        <ul>
          <li><strong>ID:</strong> ${warranty.id}</li>
          <li><strong>Cliente:</strong> ${warranty.customer_name}</li>
          <li><strong>Producto:</strong> ${warranty.brand} ${warranty.model}</li>
          <li><strong>Serial:</strong> ${warranty.serial}</li>
          <li><strong>Fecha:</strong> ${new Date(warranty.created_at).toLocaleDateString()}</li>
        </ul>
        <p>Por favor, ingrese al <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/garantias/${warranty.id}">panel de vendedor</a> para gestionar esta garantía.</p>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent to seller:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending email to seller:", error)
    return { success: false, error: error.message }
  }
}

