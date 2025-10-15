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
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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
<body style="margin: 0; padding: 0; background-color: #0C0C0C;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0C0C0C;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; max-width: 600px;" class="container">
          <!-- Header -->
          <tr>
            <td style="text-align: center; padding: 20px 0; border-bottom: 2px solid #00FF7F; background-color: #0C0C0C;">
              <div style="font-size: 32px; font-weight: bold; color: #00FF7F; letter-spacing: 2px;">SPEEDX</div>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 20px; background-color: #0C0C0C;">
              <h1 style="color: #00FF7F; font-size: 28px; margin: 0 0 20px 0; font-weight: bold;">🏁 Welcome to SpeedX!</h1>
              
              <p style="color: #E0E0E0; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Hi ${username || 'there'},</p>
              
              <p style="color: #E0E0E0; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Thank you for signing up for SpeedX. We're excited to have you join our community of speed enthusiasts!</p>
              
              <p style="color: #E0E0E0; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">To complete your registration and activate your account, please confirm your email address by clicking the button below:</p>
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center; padding: 20px 0;">
                    <a href="${confirmUrl}" style="display: inline-block; padding: 16px 32px; background-color: #00FF7F; color: #0C0C0C; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Confirm My Email</a>
                  </td>
                </tr>
              </table>
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="background-color: #1A1A1A; border-left: 4px solid #FFB300; padding: 16px; margin: 20px 0;">
                    <p style="color: #FFB300; margin: 0; font-size: 14px;">⏱️ This confirmation link will expire in ${expiresIn}.</p>
                  </td>
                </tr>
              </table>
              
              <p style="color: #E0E0E0; font-size: 16px; line-height: 1.6; margin: 20px 0;">If the button doesn't work, copy and paste this link into your browser:</p>
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="background-color: #1A1A1A; border: 1px solid #333; border-radius: 8px; padding: 16px; word-break: break-all;">
                    <a href="${confirmUrl}" style="color: #00FF7F; text-decoration: none; font-size: 14px;">${confirmUrl}</a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #E0E0E0; font-size: 16px; line-height: 1.6; margin: 20px 0 10px 0;"><strong>What happens next?</strong></p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="color: #E0E0E0; font-size: 16px; line-height: 1.8; padding-left: 20px;">
                    • Your email will be confirmed<br>
                    • Your account will be reviewed by our team<br>
                    • You'll receive an approval notification (usually within 24 hours)<br>
                    • Once approved, you can start tracking your drives!
                  </td>
                </tr>
              </table>
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="background-color: #1A1A1A; border-left: 4px solid #FFB300; padding: 16px; margin: 20px 0;">
                    <p style="color: #FFB300; margin: 0; font-size: 14px;">⚠️ If you didn't sign up for SpeedX, you can safely ignore this email.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="text-align: center; padding: 20px; border-top: 1px solid #333; background-color: #0C0C0C;">
              <p style="color: #9E9E9E; font-size: 14px; margin: 0 0 5px 0;">© 2025 SpeedX. All rights reserved.</p>
              <p style="color: #9E9E9E; font-size: 14px; margin: 0 0 10px 0;">Track every drive. Master your speed.</p>
              <p style="margin: 10px 0 0 0;">
                <a href="https://speed-x.us" style="color: #00FF7F; text-decoration: none; font-size: 14px;">Visit Dashboard</a> • 
                <a href="https://speed-x.us/support" style="color: #00FF7F; text-decoration: none; font-size: 14px;">Support</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
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
