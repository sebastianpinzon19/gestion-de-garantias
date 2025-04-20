import nodemailer from "nodemailer"

// Configure email transport
// In production, you would use a service like SendGrid, Mailgun, etc.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.example.com",
  port: Number.parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER || "user@example.com",
    pass: process.env.EMAIL_PASSWORD || "password",
  },
})

// Function to send notification email to administrators
export async function sendAdminNotification(warranty) {
  try {
    // Get admin emails (in production, this would come from the database)
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || ["admin@example.com"]

    const mailOptions = {
      from: `"Warranty System" <${process.env.EMAIL_FROM || "warranties@example.com"}>`,
      to: adminEmails.join(","),
      subject: `New warranty request #${warranty.id}`,

      html: `
        <h1>New Warranty Request</h1>
        <p>A new warranty request has been received with the following details:</p>
        <ul>
          <li><strong>ID:</strong> ${warranty.id}</li>
          <li><strong>Customer:</strong> ${warranty.customer_name}</li>
          <li><strong>Product:</strong> ${warranty.brand} ${warranty.model}</li>
          <li><strong>Serial:</strong> ${warranty.serial}</li>
          <li><strong>Date:</strong> ${new Date(warranty.created_at).toLocaleDateString()}</li>
        </ul>
        <p>Please access the <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/warranties/${warranty.id}">admin panel</a> to review and assign this warranty.</p>
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

// Function to notify a seller that a warranty has been assigned to them
export async function sendSellerAssignmentNotification(warranty, seller) {
  try {
    const mailOptions = {
      from: `"Warranty System" <${process.env.EMAIL_FROM || "warranties@example.com"}>`,
      to: seller.email,
      subject: `Warranty #${warranty.id} assigned to you`,
      html: `
        <h1>Warranty Assigned</h1>
        <p>A warranty request has been assigned to you with the following details:</p>
        <ul>
          <li><strong>ID:</strong> ${warranty.id}</li>
          <li><strong>Customer:</strong> ${warranty.customer_name}</li>
          <li><strong>Product:</strong> ${warranty.brand} ${warranty.model}</li>
          <li><strong>Serial:</strong> ${warranty.serial}</li>
          <li><strong>Date:</strong> ${new Date(warranty.created_at).toLocaleDateString()}</li>
        </ul>
        <p>Please access the <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/warranties/${warranty.id}">seller panel</a> to manage this warranty.</p>
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

