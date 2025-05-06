import sgMail from "@sendgrid/mail"

// Configure SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

/**
 * Send an email notification using SendGrid
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 * @returns {Promise<Object>} - Send result
 */
async function sendEmail({ to, subject, text, html }) {
  try {
    const from = process.env.EMAIL_FROM || "noreply@warrantymanagement.com"

    const msg = {
      to,
      from,
      subject,
      text,
      html,
    }

    await sgMail.send(msg)
    return { success: true }
  } catch (error) {
    console.error("Error sending email with SendGrid:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Send a notification about a new warranty
 * @param {Object} warranty - Warranty data
 * @param {string[]} sellerEmails - Array of seller emails to notify
 * @returns {Promise<Object>} - Send result
 */
export async function sendWarrantyNotification(warranty, sellerEmails) {
  const subject = "[Warranty System] New Warranty Request"

  const text = `
    Hello,
    
    A new warranty request has been submitted.
    
    Customer: ${warranty.customerName}
    Product: ${warranty.brand} ${warranty.model}
    Serial: ${warranty.serial}
    
    Please log in to the Warranty Management System to review the request.
    
    Thank you,
    Warranty System Team
  `

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3b82f6;">New Warranty Request</h2>
      <p>Hello,</p>
      <p>A new warranty request has been submitted.</p>
      <p><strong>Customer:</strong> ${warranty.customerName}</p>
      <p><strong>Product:</strong> ${warranty.brand} ${warranty.model}</p>
      <p><strong>Serial:</strong> ${warranty.serial}</p>
      <div style="margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/seller/warranties/${warranty.id}" 
           style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
          View Warranty Details
        </a>
      </div>
      <p>Thank you,<br>Warranty System Team</p>
    </div>
  `

  const results = []
  for (const sellerEmail of sellerEmails) {
    const result = await sendEmail({ to: sellerEmail, subject, text, html })
    results.push({ email: sellerEmail, success: result.success })
  }

  return { success: true, results }
}

/**
 * Send a welcome email to a new user
 * @param {Object} user - User data
 * @returns {Promise<Object>} - Send result
 */
export async function sendWelcomeEmail(user) {
  const subject = "[Warranty System] Welcome to Our Platform"

  const text = `
    Hello ${user.name},
    
    Welcome to the Warranty Management System!
    
    Thank you for registering. You can now log in and start managing your warranties.
    
    Thank you,
    Warranty System Team
  `

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3b82f6;">Welcome to Our Platform</h2>
      <p>Hello ${user.name},</p>
      <p>Welcome to the Warranty Management System!</p>
      <p>Thank you for registering. You can now log in and start managing your warranties.</p>
      <div style="margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" 
           style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
          Log In
        </a>
      </div>
      <p>Thank you,<br>Warranty System Team</p>
    </div>
  `

  return sendEmail({ to: user.email, subject, text, html })
}

/**
 * Send a notification about a warranty status update
 * @param {Object} warranty - Warranty data
 * @param {string} customerEmail - Customer email to notify
 * @returns {Promise<Object>} - Send result
 */
export async function sendStatusUpdateNotification(warranty, customerEmail) {
  const subject = `[Warranty System] Warranty Status Updated: ${warranty.status}`

  const text = `
    Hello,
    
    The status of your warranty request has been updated to ${warranty.status}.
    
    Please log in to the Warranty Management System to view the details.
    
    Thank you,
    Warranty System Team
  `

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3b82f6;">Warranty Status Updated</h2>
      <p>Hello,</p>
      <p>The status of your warranty request has been updated to <strong>${warranty.status}</strong>.</p>
      <p>Please log in to the Warranty Management System to view the details.</p>
      <div style="margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/customer/warranties/${warranty.id}" 
           style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
          View Warranty Details
        </a>
      </div>
      <p>Thank you,<br>Warranty System Team</p>
    </div>
  `

  return sendEmail({ to: customerEmail, subject, text, html })
}

/**
 * Send a notification about pending warranties
 * @param {Object} options - Options
 * @param {string} options.to - Recipient email
 * @param {number} options.count - Number of pending warranties
 * @returns {Promise<Object>} - Send result
 */
export async function sendPendingWarrantiesNotification({ to, count }) {
  const subject = "[Warranty System] Pending Warranties Notification"

  const text = `
    Hello,
    
    There are currently ${count} pending warranty requests that require your attention.
    
    Please log in to the Warranty Management System to review them.
    
    Thank you,
    Warranty System Team
  `

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3b82f6;">Pending Warranties Notification</h2>
      <p>Hello,</p>
      <p>There are currently <strong>${count} pending warranty requests</strong> that require your attention.</p>
      <div style="margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/seller/warranties?status=pending" 
           style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
          View Pending Warranties
        </a>
      </div>
      <p>Thank you,<br>Warranty System Team</p>
    </div>
  `

  return sendEmail({ to, subject, text, html })
}
