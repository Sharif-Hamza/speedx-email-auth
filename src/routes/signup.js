const express = require('express');
const validator = require('validator');
const supabase = require('../lib/supabaseClient');
const { sendEmail } = require('../lib/sesClient');
const { generateToken, getTokenExpiration } = require('../lib/token');
const { getConfirmationEmailHTML, getConfirmationEmailText } = require('../lib/emailTemplates');

const router = express.Router();

/**
 * POST /api/signup
 * Create a new user and send confirmation email
 */
router.post('/', async (req, res) => {
  try {
    const { email, password, metadata = {} } = req.body;

    // Validate email
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Validate password
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('auth.users')
      .select('id, email')
      .eq('email', email)
      .single();

    if (existingUser) {
      // Don't reveal if user exists (security)
      return res.status(200).json({ message: 'Signup accepted. Check your email for confirmation link.' });
    }

    // Create user in Supabase (unconfirmed)
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Don't auto-confirm
      user_metadata: {
        ...metadata,
        signup_source: req.get('User-Agent')?.includes('SpeedX') ? 'ios' : 'web',
        signup_ip: req.ip
      }
    });

    if (createError) {
      console.error('Error creating user:', createError);
      
      // Check if it's a duplicate email error
      if (createError.message?.includes('already registered')) {
        return res.status(200).json({ message: 'Signup accepted. Check your email for confirmation link.' });
      }
      
      return res.status(500).json({ error: 'Failed to create account' });
    }

    // Create waitlist entry (required for admin approval workflow)
    const { error: waitlistError } = await supabase
      .from('waitlist_users')
      .insert({
        auth_user_id: newUser.user.id,
        email: email,
        full_name: metadata.full_name || email.split('@')[0],
        status: 'pending' // User needs admin approval
      });

    if (waitlistError) {
      console.error('Error creating waitlist entry:', waitlistError);
      // Continue anyway - user can still confirm email
    }

    // Generate confirmation token
    const token = generateToken();
    const expiresAt = getTokenExpiration();

    // Store token in database
    const { error: tokenError } = await supabase
      .from('email_confirmations')
      .insert({
        user_id: newUser.user.id,
        email: email,
        token: token,
        expires_at: expiresAt.toISOString(),
        ip: req.ip,
        user_agent: req.get('User-Agent')
      });

    if (tokenError) {
      console.error('Error storing confirmation token:', tokenError);
      // Continue anyway - user can request resend
    }

    // Generate confirmation URL
    const baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    const confirmUrl = `${baseUrl}/api/confirm?token=${token}`;

    // Send confirmation email
    const expiresIn = `${process.env.TOKEN_EXPIRATION_HOURS || 48} hours`;
    const username = metadata.full_name || metadata.username || email.split('@')[0];
    
    try {
      await sendEmail({
        to: email,
        subject: 'Confirm your SpeedX account',
        htmlBody: getConfirmationEmailHTML({ confirmUrl, email, username, expiresIn }),
        textBody: getConfirmationEmailText({ confirmUrl, email, username, expiresIn })
      });

      console.log(`✅ Confirmation email sent to ${email}`);
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the request - user can request resend
    }

    return res.status(200).json({
      message: 'Signup accepted. Check your email for confirmation link.',
      email: email
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
