-- ============================================================================
-- Email Confirmations Table Migration
-- ============================================================================
-- This table tracks email confirmation tokens and admin approval status
-- Run this in your Supabase SQL Editor

-- Create email_confirmations table
CREATE TABLE IF NOT EXISTS email_confirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  ip INET,
  user_agent TEXT,
  admin_approved BOOLEAN DEFAULT FALSE,
  admin_approved_by UUID REFERENCES auth.users(id),
  admin_approved_at TIMESTAMPTZ
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_confirmations_user_id ON email_confirmations(user_id);
CREATE INDEX IF NOT EXISTS idx_email_confirmations_token ON email_confirmations(token);
CREATE INDEX IF NOT EXISTS idx_email_confirmations_email ON email_confirmations(email);
CREATE INDEX IF NOT EXISTS idx_email_confirmations_used ON email_confirmations(used) WHERE NOT used;
CREATE INDEX IF NOT EXISTS idx_email_confirmations_admin_approved ON email_confirmations(admin_approved) WHERE NOT admin_approved;

-- Enable Row Level Security
ALTER TABLE email_confirmations ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
CREATE POLICY "Service role has full access to email_confirmations"
  ON email_confirmations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can view their own confirmations
CREATE POLICY "Users can view their own email confirmations"
  ON email_confirmations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Admins can view all confirmations (for admin dashboard)
CREATE POLICY "Admins can view all email confirmations"
  ON email_confirmations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Add comment
COMMENT ON TABLE email_confirmations IS 'Tracks email confirmation tokens and admin approval status for SpeedX users';

-- Grant permissions
GRANT ALL ON email_confirmations TO service_role;
GRANT SELECT ON email_confirmations TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Email confirmations table created successfully';
  RAISE NOTICE '📧 Table: email_confirmations';
  RAISE NOTICE '🔐 RLS enabled with service_role and user policies';
END $$;
