const crypto = require('crypto');

/**
 * Generate a secure random token
 * @param {number} length - Token length in bytes (default: 32)
 * @returns {string} Hex-encoded token
 */
function generateToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate HMAC signature for token validation
 * @param {string} token - Token to sign
 * @param {string} secret - Signing secret
 * @returns {string} HMAC signature
 */
function signToken(token, secret) {
  return crypto
    .createHmac('sha256', secret || process.env.JWT_SIGNING_SECRET)
    .update(token)
    .digest('hex');
}

/**
 * Verify HMAC signature
 * @param {string} token - Original token
 * @param {string} signature - Signature to verify
 * @param {string} secret - Signing secret
 * @returns {boolean} True if signature is valid
 */
function verifyTokenSignature(token, signature, secret) {
  const expectedSignature = signToken(token, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Calculate token expiration date
 * @param {number} hours - Hours until expiration (default: from env)
 * @returns {Date} Expiration date
 */
function getTokenExpiration(hours) {
  const expirationHours = hours || parseInt(process.env.TOKEN_EXPIRATION_HOURS) || 48;
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + expirationHours);
  return expiration;
}

/**
 * Check if token is expired
 * @param {Date|string} expiresAt - Expiration timestamp
 * @returns {boolean} True if expired
 */
function isTokenExpired(expiresAt) {
  return new Date(expiresAt) < new Date();
}

module.exports = {
  generateToken,
  signToken,
  verifyTokenSignature,
  getTokenExpiration,
  isTokenExpired
};
