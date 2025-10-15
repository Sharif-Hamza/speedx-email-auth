const express = require('express');
const supabase = require('../lib/supabaseClient');
const { isTokenExpired } = require('../lib/token');

const router = express.Router();

/**
 * GET /api/confirm?token=xxxxx
 * Confirm user email via token
 */
router.get('/', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invalid Token</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #0C0C0C; color: #F5F5F5; }
            .error { color: #FF5555; }
          </style>
        </head>
        <body>
          <h1 class="error">❌ Invalid Confirmation Link</h1>
          <p>The confirmation token is missing.</p>
          <p><a href="${process.env.FRONTEND_CONFIRM_REDIRECT}" style="color: #00FF7F;">Return to SpeedX</a></p>
        </body>
        </html>
      `);
    }

    // Find token in database
    const { data: confirmation, error: findError } = await supabase
      .from('email_confirmations')
      .select('*')
      .eq('token', token)
      .single();

    if (findError || !confirmation) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invalid Token</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #0C0C0C; color: #F5F5F5; }
            .error { color: #FF5555; }
          </style>
        </head>
        <body>
          <h1 class="error">❌ Invalid Confirmation Link</h1>
          <p>This confirmation token is not valid.</p>
          <p><a href="${process.env.FRONTEND_CONFIRM_REDIRECT}" style="color: #00FF7F;">Return to SpeedX</a></p>
        </body>
        </html>
      `);
    }

    // Check if already used
    if (confirmation.used) {
      return res.redirect(`${process.env.FRONTEND_CONFIRM_REDIRECT}?confirmed=true&email=${encodeURIComponent(confirmation.email)}&already_confirmed=true`);
    }

    // Check if expired
    if (isTokenExpired(confirmation.expires_at)) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Token Expired</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #0C0C0C; color: #F5F5F5; }
            .error { color: #FFB300; }
            .button { display: inline-block; padding: 12px 24px; background: #00FF7F; color: #0C0C0C; text-decoration: none; border-radius: 8px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1 class="error">⏱️ Confirmation Link Expired</h1>
          <p>This confirmation link has expired.</p>
          <p>Please request a new confirmation email.</p>
          <a href="${process.env.FRONTEND_CONFIRM_REDIRECT}?resend=${encodeURIComponent(confirmation.email)}" class="button">Request New Link</a>
        </body>
        </html>
      `);
    }

    // Mark user as email confirmed in Supabase Auth
    const { error: updateAuthError } = await supabase.auth.admin.updateUserById(
      confirmation.user_id,
      { email_confirm: true }
    );

    if (updateAuthError) {
      console.error('Error confirming user email:', updateAuthError);
      return res.status(500).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Error</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #0C0C0C; color: #F5F5F5; }
            .error { color: #FF5555; }
          </style>
        </head>
        <body>
          <h1 class="error">❌ Confirmation Error</h1>
          <p>There was an error confirming your email. Please try again or contact support.</p>
          <p><a href="${process.env.FRONTEND_CONFIRM_REDIRECT}" style="color: #00FF7F;">Return to SpeedX</a></p>
        </body>
        </html>
      `);
    }

    // Mark token as used
    const { error: updateTokenError } = await supabase
      .from('email_confirmations')
      .update({
        used: true,
        used_at: new Date().toISOString()
      })
      .eq('id', confirmation.id);

    if (updateTokenError) {
      console.error('Error marking token as used:', updateTokenError);
      // Continue anyway - user is confirmed
    }

    // Log success
    console.log(`✅ Email confirmed for user: ${confirmation.email}`);

    // Redirect to waitlist with success message
    // Check if mobile (iOS) or web
    const userAgent = req.get('User-Agent') || '';
    const isMobile = userAgent.includes('iPhone') || userAgent.includes('iPad') || userAgent.includes('SpeedX');

    if (isMobile && process.env.IOS_CONFIRM_REDIRECT) {
      // Try iOS deep link first, with web fallback
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Email Confirmed</title>
          <meta http-equiv="refresh" content="0;url=${process.env.IOS_CONFIRM_REDIRECT}?token=${token}&email=${encodeURIComponent(confirmation.email)}">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #0C0C0C; color: #F5F5F5; }
            .success { color: #00FF7F; }
          </style>
        </head>
        <body>
          <h1 class="success">✅ Email Confirmed!</h1>
          <p>Redirecting to SpeedX app...</p>
          <p>If the app doesn't open, <a href="${process.env.FRONTEND_CONFIRM_REDIRECT}?confirmed=true&email=${encodeURIComponent(confirmation.email)}" style="color: #00FF7F;">click here</a></p>
          <script>
            setTimeout(function() {
              window.location.href = "${process.env.FRONTEND_CONFIRM_REDIRECT}?confirmed=true&email=${encodeURIComponent(confirmation.email)}";
            }, 3000);
          </script>
        </body>
        </html>
      `);
    }

    // Web redirect
    return res.redirect(`${process.env.FRONTEND_CONFIRM_REDIRECT}?confirmed=true&email=${encodeURIComponent(confirmation.email)}`);

  } catch (error) {
    console.error('Confirmation error:', error);
    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #0C0C0C; color: #F5F5F5; }
          .error { color: #FF5555; }
        </style>
      </head>
      <body>
        <h1 class="error">❌ Server Error</h1>
        <p>An unexpected error occurred. Please try again later.</p>
        <p><a href="${process.env.FRONTEND_CONFIRM_REDIRECT}" style="color: #00FF7F;">Return to SpeedX</a></p>
      </body>
      </html>
    `);
  }
});

module.exports = router;
