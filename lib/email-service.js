import nodemailer from "nodemailer"

// Configurar transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number.parseInt(process.env.EMAIL_SERVER_PORT),
  secure: process.env.EMAIL_SERVER_PORT === "465",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

// Enviar notificación de nueva garantía a administradores
export async function sendWarrantyNotification(warranty, adminEmails) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: adminEmails.join(","),
      subject: `Nueva solicitud de garantía - ${warranty.customer_name}`,
      html: `
        <h1>Nueva solicitud de garantía</h1>
        <p><strong>Cliente:</strong> ${warranty.customer_name}</p>
        <p><strong>Teléfono:</strong> ${warranty.customer_phone}</p>
        <p><strong>Producto:</strong> ${warranty.brand} ${warranty.model}</p>
        <p><strong>Serial:</strong> ${warranty.serial}</p>
        <p><strong>Fecha de compra:</strong> ${new Date(warranty.purchase_date).toLocaleDateString()}</p>
        <p><strong>Descripción del daño:</strong> ${warranty.damage_description}</p>
        <p>Por favor, ingrese al sistema para revisar los detalles completos.</p>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log("Notificación de garantía enviada a administradores")
    return true
  } catch (error) {
    console.error("Error al enviar notificación de garantía:", error)
    return false
  }
}

// Enviar notificación de actualización de estado al cliente
export async function sendStatusUpdateNotification(warranty, customerEmail) {
  try {
    if (!customerEmail) {
      console.log("No se puede enviar notificación: correo del cliente no disponible")
      return false
    }

    const statusText = {
      pending: "Pendiente",
      approved: "Aprobada",
      rejected: "Rechazada",
      in_progress: "En Proceso",
      completed: "Completada",
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: customerEmail,
      subject: `Actualización de su garantía - ${warranty.brand} ${warranty.model}`,
      html: `
        <h1>Actualización de estado de garantía</h1>
        <p>Estimado/a ${warranty.customer_name},</p>
        <p>Le informamos que el estado de su solicitud de garantía ha sido actualizado.</p>
        <p><strong>Producto:</strong> ${warranty.brand} ${warranty.model}</p>
        <p><strong>Serial:</strong> ${warranty.serial}</p>
        <p><strong>Estado actual:</strong> ${statusText[warranty.status] || warranty.status}</p>
        ${warranty.technician_observations ? `<p><strong>Observaciones:</strong> ${warranty.technician_observations}</p>` : ""}
        <p>Si tiene alguna pregunta, no dude en contactarnos.</p>
        <p>Atentamente,<br>El equipo de garantías</p>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log("Notificación de actualización enviada al cliente")
    return true
  } catch (error) {
    console.error("Error al enviar notificación de actualización:", error)
    return false
  }
}

// Enviar correo de bienvenida al registrarse
export async function sendWelcomeEmail(user) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Bienvenido al Sistema de Garantías",
      html: `
        <h1>Bienvenido al Sistema de Garantías</h1>
        <p>Hola ${user.name},</p>
        <p>Gracias por registrarte en nuestro sistema de gestión de garantías.</p>
        <p>Ahora puedes acceder con tu correo electrónico y contraseña para gestionar tus garantías.</p>
        <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
        <p>Atentamente,<br>El equipo de garantías</p>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log("Correo de bienvenida enviado")
    return true
  } catch (error) {
    console.error("Error al enviar correo de bienvenida:", error)
    return false
  }
}

// Enviar correo de recuperación de contraseña
export async function sendPasswordResetEmail(user, resetToken) {
  try {
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Recuperación de contraseña",
      html: `
        <h1>Recuperación de contraseña</h1>
        <p>Hola ${user.name},</p>
        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
        <p><a href="${resetUrl}">Restablecer contraseña</a></p>
        <p>Este enlace expirará en 1 hora.</p>
        <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
        <p>Atentamente,<br>El equipo de garantías</p>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log("Correo de recuperación enviado")
    return true
  } catch (error) {
    console.error("Error al enviar correo de recuperación:", error)
    return false
  }
}
