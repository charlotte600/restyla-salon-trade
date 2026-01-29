import axios from 'axios';

/**
 * Send email using a simple email service (e.g., SendGrid, Mailgun, or custom)
 * For now, we'll use a placeholder that logs to console
 * In production, replace with actual email service
 */
export async function sendEmail({ to, subject, html }) {
  try {
    // Placeholder: In production, integrate with SendGrid, Mailgun, or AWS SES
    console.log(`📧 Email sent to ${to}`);
    console.log(`   Subject: ${subject}`);
    
    // Example: SendGrid integration
    // await axios.post('https://api.sendgrid.com/v3/mail/send', {
    //   personalizations: [{ to: [{ email: to }] }],
    //   from: { email: 'noreply@restyla.com' },
    //   subject,
    //   content: [{ type: 'text/html', value: html }]
    // }, {
    //   headers: { 'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}` }
    // });

    return { success: true };
  } catch (error) {
    console.error('Email send failed:', error.message);
    throw error;
  }
}

/**
 * Email template for validation error
 */
export function validationErrorEmailTemplate(message) {
  return `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2>Oops! There was an issue with your order</h2>
        <p>${message}</p>
        <p>Please try again with the correct quantity.</p>
        <hr>
        <p style="color: #999; font-size: 12px;">Restyla Salon Trade</p>
      </body>
    </html>
  `;
}

/**
 * Email template for checkout link
 */
export function checkoutEmailTemplate(invoiceUrl, email) {
  return `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2>Your Restyla Order is Ready!</h2>
        <p>Hi there,</p>
        <p>Your draft order has been created. Click the link below to review and complete payment:</p>
        <p>
          <a href="${invoiceUrl}" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Complete Your Order
          </a>
        </p>
        <p style="margin-top: 20px; color: #666;">
          If the button doesn't work, copy and paste this link:<br>
          <code>${invoiceUrl}</code>
        </p>
        <hr>
        <p style="color: #999; font-size: 12px;">Restyla Salon Trade</p>
      </body>
    </html>
  `;
}
