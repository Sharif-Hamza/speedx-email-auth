const { Resend } = require('resend');

// Validate environment variables
if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is required');
}

if (!process.env.FROM_EMAIL) {
  throw new Error('FROM_EMAIL is required (e.g., support@speed-x.us)');
}

// Create Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send email via Resend
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.htmlBody - HTML email body
 * @param {string} options.textBody - Plain text email body
 * @returns {Promise<Object>} Resend response
 */
async function sendEmail({ to, subject, htmlBody, textBody }) {
  try {
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: [to],
      subject: subject,
      html: htmlBody,
      text: textBody
    });
    
    console.log('✅ Email sent successfully:', result.id);
    return result;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
}

module.exports = {
  resend,
  sendEmail
};
