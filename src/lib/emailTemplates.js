/**
 * Generate confirmation email HTML
 * @param {Object} options
 * @param {string} options.confirmUrl - Confirmation URL
 * @param {string} options.email - User's email
 * @param {string} options.username - User's name/username
 * @param {string} options.expiresIn - Expiration time (e.g. "48 hours")
 * @returns {string} HTML email content
 */
function getConfirmationEmailHTML({ confirmUrl, email, username, expiresIn = '48 hours' }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your SpeedX Account</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #0C0C0C;
      color: #F5F5F5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 2px solid #00FF7F;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #00FF7F;
      letter-spacing: 2px;
    }
    .content {
      padding: 40px 0;
    }
    h1 {
      color: #00FF7F;
      font-size: 28px;
      margin-bottom: 20px;
    }
    p {
      color: #E0E0E0;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .button {
      display: inline-block;
      padding: 16px 32px;
      background-color: #00FF7F;
      color: #0C0C0C;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      font-size: 16px;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #00E070;
    }
    .link-fallback {
      background-color: #1A1A1A;
      border: 1px solid #333;
      border-radius: 8px;
      padding: 16px;
      margin: 20px 0;
      word-break: break-all;
    }
    .link-fallback a {
      color: #00FF7F;
      text-decoration: none;
      font-size: 14px;
    }
    .footer {
      text-align: center;
      padding: 20px 0;
      border-top: 1px solid #333;
      color: #9E9E9E;
      font-size: 14px;
    }
    .warning {
      background-color: #1A1A1A;
      border-left: 4px solid #FFB300;
      padding: 16px;
      margin: 20px 0;
    }
    .warning p {
      color: #FFB300;
      margin: 0;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">SPEEDX</div>
    </div>
    
    <div class="content">
      <h1>🏁 Welcome to SpeedX!</h1>
      
      <p>Hi ${username || 'there'},</p>
      
      <p>Thank you for signing up for SpeedX. We're excited to have you join our community of speed enthusiasts!</p>
      
      <p>To complete your registration and activate your account, please confirm your email address by clicking the button below:</p>
      
      <div style="text-align: center;">
        <a href="${confirmUrl}" class="button">Confirm My Email</a>
      </div>
      
      <div class="warning">
        <p>⏱️ This confirmation link will expire in ${expiresIn}.</p>
      </div>
      
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      
      <div class="link-fallback">
        <a href="${confirmUrl}">${confirmUrl}</a>
      </div>
      
      <p><strong>What happens next?</strong></p>
      <ul style="color: #E0E0E0; line-height: 1.8;">
        <li>Your email will be confirmed</li>
        <li>Your account will be reviewed by our team</li>
        <li>You'll receive an approval notification (usually within 24 hours)</li>
        <li>Once approved, you can start tracking your drives!</li>
      </ul>
      
      <div class="warning">
        <p>⚠️ If you didn't sign up for SpeedX, you can safely ignore this email.</p>
      </div>
    </div>
    
    <div class="footer">
      <p>© 2025 SpeedX. All rights reserved.</p>
      <p>Track every drive. Master your speed.</p>
      <p style="margin-top: 10px;">
        <a href="https://speed-x.us" style="color: #00FF7F; text-decoration: none;">Visit Dashboard</a> • 
        <a href="https://speed-x.us/support" style="color: #00FF7F; text-decoration: none;">Support</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generate confirmation email plain text
 * @param {Object} options
 * @param {string} options.confirmUrl - Confirmation URL
 * @param {string} options.email - User's email
 * @param {string} options.username - User's name/username
 * @param {string} options.expiresIn - Expiration time
 * @returns {string} Plain text email content
 */
function getConfirmationEmailText({ confirmUrl, email, username, expiresIn = '48 hours' }) {
  return `
SPEEDX - Confirm Your Email

Hi ${username || 'there'},

Thank you for signing up for SpeedX. We're excited to have you join our community of speed enthusiasts!

To complete your registration and activate your account, please confirm your email address by visiting this link:

${confirmUrl}

⏱️ This confirmation link will expire in ${expiresIn}.

What happens next?
- Your email will be confirmed
- Your account will be reviewed by our team
- You'll receive an approval notification (usually within 24 hours)
- Once approved, you can start tracking your drives!

⚠️ If you didn't sign up for SpeedX, you can safely ignore this email.

---

© 2025 SpeedX. All rights reserved.
Track every drive. Master your speed.

Visit: https://speed-x.us
Support: https://speed-x.us/support
  `;
}

/**
 * Generate resend confirmation email HTML
 */
function getResendConfirmationEmailHTML({ confirmUrl, email, username, expiresIn = '48 hours' }) {
  return getConfirmationEmailHTML({ confirmUrl, email, username, expiresIn })
    .replace('Welcome to SpeedX!', 'Resend: Confirm Your Email')
    .replace('Thank you for signing up for SpeedX.', 'You requested a new confirmation email.');
}

/**
 * Generate resend confirmation email text
 */
function getResendConfirmationEmailText({ confirmUrl, email, username, expiresIn = '48 hours' }) {
  return getConfirmationEmailText({ confirmUrl, email, username, expiresIn })
    .replace('Thank you for signing up for SpeedX.', 'You requested a new confirmation email.');
}

module.exports = {
  getConfirmationEmailHTML,
  getConfirmationEmailText,
  getResendConfirmationEmailHTML,
  getResendConfirmationEmailText
};
