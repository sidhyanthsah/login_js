// This is a simplified implementation for demo purposes
// In a real application, you would use a proper OTP library

/**
 * Generates a random OTP secret
 * This is a simplified version - in production use a proper TOTP library
 */
export function generateOTPSecret(): string {
  // Generate a random 16-character string for the secret
  // In production, use a cryptographically secure random generator
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; // Base32 character set
  let secret = '';
  
  for (let i = 0; i < 16; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    secret += chars.charAt(randomIndex);
  }
  
  return secret;
}

/**
 * Validates an OTP token against a secret
 * This is a simplified version - in production use a proper TOTP library
 */
export function validateOTP(token: string, secret: string): boolean {
  // In a real app, you would:
  // 1. Generate HMAC-SHA1 of the secret and current 30-second time window
  // 2. Extract a 6-digit code from the HMAC
  // 3. Compare it with the provided token
  // 4. Also check the previous and next time windows to account for clock skew
  
  // For demo purposes, we'll just check if the token is 6 digits
  return /^\d{6}$/.test(token);
}