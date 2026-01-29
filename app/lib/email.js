import axios from 'axios';

/**
 * Send email using Brevo email service
 */
export async function sendEmail({ to, subject, html }) {
  try {
    const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
      sender: { name: 'Restyla Salon Trade', email: 'noreply@restyla.com' },
      to: [{ email: to }],
      subject,
      htmlContent: html
    }, {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log(`✅ Email sent to ${to}`);
    return { success: true, messageId: response.data.messageId };
  } catch (error) {
    console.error('❌ Email send failed:', error.response?.data || error.message);
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
