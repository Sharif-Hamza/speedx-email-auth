const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');

// Validate environment variables
if (!process.env.MAILERSEND_API_KEY) {
  throw new Error('MAILERSEND_API_KEY is required');
}

if (!process.env.FROM_EMAIL) {
  throw new Error('FROM_EMAIL is required (e.g., support@speed-x.us)');
}

if (!process.env.FROM_NAME) {
  throw new Error('FROM_NAME is required (e.g., SpeedX)');
}

// Create Mailersend client
const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

/**
 * Send email via Mailersend
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.htmlBody - HTML email body
 * @param {string} options.textBody - Plain text email body
 * @returns {Promise<Object>} Mailersend response
 */
async function sendEmail({ to, subject, htmlBody, textBody }) {
  try {
    const sentFrom = new Sender(process.env.FROM_EMAIL, process.env.FROM_NAME);
    const recipients = [new Recipient(to, to.split('@')[0])];
    
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(subject)
      .setHtml(htmlBody)
      .setText(textBody);
    
    const result = await mailerSend.email.send(emailParams);
    
    console.log('✅ Email sent successfully via Mailersend');
    return result;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
}

module.exports = {
  mailerSend,
  sendEmail
};
