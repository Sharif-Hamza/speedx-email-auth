const express = require('express');
const validator = require('validator');
const supabase = require('../lib/supabaseClient');
const { sendEmail } = require('../lib/sesClient');
const { generateToken, getTokenExpiration } = require('../lib/token');
const { getResendConfirmationEmailHTML, getResendConfirmationEmailText } = require('../lib/emailTemplates');

const router = express.Router();

/**
 * POST /api/resend
 * Resend confirmation email
 */
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Find user by email
    const { data: { users }, error: findUserError } = await supabase.auth.admin.listUsers();
    
    if (findUserError) {
      console.error('Error finding user:', findUserError);
      // Don't reveal if user exists
      return res.status(200).json({ message: 'If this email is registered, a new confirmation link has been sent.' });
    }

    const user = users?.find(u => u.email === email);
    
    if (!user) {
      // Don't reveal if user exists (security)
      return res.status(200).json({ message: 'If this email is registered, a new confirmation link has been sent.' });
    }

    // Check if already confirmed
    if (user.email_confirmed_at) {
      return res.status(200).json({ 
        message: 'Your email is already confirmed. You can log in now.',
        already_confirmed: true 
      });
    }

    // Invalidate old tokens
    await supabase
      .from('email_confirmations')
      .update({ used: true, used_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('used', false);

    // Generate new token
    const token = generateToken();
    const expiresAt = getTokenExpiration();

    // Store new token in database
    const { error: tokenError } = await supabase
      .from('email_confirmations')
      .insert({
        user_id: user.id,
        email: email,
        token: token,
        expires_at: expiresAt.toISOString(),
        ip: req.ip,
        user_agent: req.get('User-Agent')
      });

    if (tokenError) {
      console.error('Error storing confirmation token:', tokenError);
      return res.status(500).json({ error: 'Failed to generate new confirmation link' });
    }

    // Generate confirmation URL
    const baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    const confirmUrl = `${baseUrl}/api/confirm?token=${token}`;

    // Send confirmation email
    const expiresIn = `${process.env.TOKEN_EXPIRATION_HOURS || 48} hours`;
    
    try {
      await sendEmail({
        to: email,
        subject: 'Resend: Confirm your SpeedX account',
        htmlBody: getResendConfirmationEmailHTML({ confirmUrl, email, expiresIn }),
        textBody: getResendConfirmationEmailText({ confirmUrl, email, expiresIn })
      });

      console.log(`✅ Resend confirmation email sent to ${email}`);
    } catch (emailError) {
      console.error('Error sending resend email:', emailError);
      return res.status(500).json({ error: 'Failed to send confirmation email' });
    }

    return res.status(200).json({
      message: 'A new confirmation link has been sent to your email.',
      email: email
    });

  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
