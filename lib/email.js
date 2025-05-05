import sgMail from '@sendgrid/mail';
import prisma from './prisma'; // Importar Prisma

// Configurar la clave API de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendEmail({ to, subject, text, html }) {
  try {
    const msg = {
      to,
      from: process.env.EMAIL_FROM,
      subject,
      text,
      html,
    };

    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendWarrantyNotification({ to, warrantyId, status }) {
  const subject = `Warranty Status Update - ${status}`;
  const text = `Your warranty claim (ID: ${warrantyId}) has been updated to ${status}.`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Warranty Status Update</h2>
      <p>Your warranty claim (ID: ${warrantyId}) has been updated to <strong>${status}</strong>.</p>
      <p>You can check the status of your claim by visiting our website.</p>
      <p>Best regards,<br>The Warranty Team</p>
    </div>
  `;

  return sendEmail({ to, subject, text, html });
}

export async function sendWelcomeEmail({ to, name }) {
  const subject = 'Welcome to Warranty Management System';
  const text = `Welcome ${name} to our Warranty Management System!`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to Warranty Management System</h2>
      <p>Hello ${name},</p>
      <p>Thank you for joining our Warranty Management System. You can now:</p>
      <ul>
        <li>Submit new warranty claims</li>
        <li>Track the status of your claims</li>
        <li>Receive notifications about updates</li>
      </ul>
      <p>Best regards,<br>The Warranty Team</p>
    </div>
  `;

  return sendEmail({ to, subject, text, html });
}

export async function sendNewWarrantyNotification({ warrantyData }) {
  // Obtener correos de administradores desde la base de datos
  let adminEmails = [];
  try {
    const adminUsers = await prisma.user.findMany({
      where: { role: 'admin' },
      select: { email: true },
    });
    adminEmails = adminUsers.map(user => user.email);
  } catch (dbError) {
    console.error('Error fetching admin emails from database:', dbError);
    // Opcional: Podrías retornar un error aquí o intentar con un fallback
    // return { success: false, error: 'Failed to fetch admin emails' };
  }

  if (adminEmails.length === 0) {
    console.warn('No admin emails found in the database or failed to fetch.');
    // Decidir si retornar error o simplemente no enviar si no hay admins
    return { success: true, message: 'No admin emails found or configured.' }; // O retornar error
  }

  const subject = 'New Warranty Claim Submitted';
  const text = `A new warranty claim has been submitted. ID: ${warrantyData.id}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Warranty Claim Submitted</h2>
      <h3 style="color: #666;">Claim Details</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Claim ID:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${warrantyData.id}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Company:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${warrantyData.company || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Contact Person:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${warrantyData.contactPerson || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Phone:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${warrantyData.phone || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Homeowner Name:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${warrantyData.name || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Homeowner Phone:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${warrantyData.homeownerPhone || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Homeowner Address:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${warrantyData.homeownerAddress || 'N/A'}, ${warrantyData.homeownerCity || 'N/A'}, ${warrantyData.homeownerState || 'N/A'} ${warrantyData.homeownerZip || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Item:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${warrantyData.item || 'N/A'}</td>
        </tr>
         <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Brand:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${warrantyData.brand || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Model:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${warrantyData.model || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Serial Number:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${warrantyData.serialNumber || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Date Installed:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${warrantyData.dateInstalled ? new Date(warrantyData.dateInstalled).toLocaleDateString() : 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Reason for Warranty:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${warrantyData.warrantyReason || 'N/A'}</td>
        </tr>
      </table>
      <p>You can review this claim in the admin dashboard.</p>
      <p>Best regards,<br>The Warranty Team</p>
    </div>
  `;

  // Enviar correo a todos los administradores encontrados
  const results = await Promise.all(
    adminEmails.map(email =>
      sendEmail({ to: email, subject, text, html })
    )
  );

  // Verificar si todos los correos se enviaron correctamente
  const allSuccess = results.every(result => result.success);
  const errors = results.filter(result => !result.success).map(result => result.error);

  if (!allSuccess) {
    console.error('Some admin notification emails failed to send:', errors);
  }

  return {
    success: allSuccess,
    error: allSuccess ? null : `Some emails failed to send: ${errors.join(', ')}`
  };
}