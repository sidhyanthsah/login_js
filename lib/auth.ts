import { generateOTPSecret } from '@/lib/otp';
import { delay } from '@/lib/utils';

// These are mock functions that simulate backend API calls
// In a real application, these would make actual HTTP requests

export async function simulateLoginRequest(data: { 
  email: string; 
  password: string 
}) {
  // Simulate network delay
  await delay(1000);
  
  // Demo accounts for testing
  if (data.email === 'remev57384@nutrv.com' && data.password === 'Asdf@123') {
    // This user has 2FA enabled
    return { success: true, requires2FA: true };
  } else if (data.email === 'test@gmail.com' && data.password === 'Asdf@123') {
    // This user needs to set up 2FA
    return { success: true, needs2FASetup: true };
  } else if (data.email.includes('@example.com') && data.password.length >= 8) {
    // For demo purposes, accept any example.com email with valid password
    return { success: true, requires2FA: false, needs2FASetup: false };
  }
  
  throw new Error('Invalid email or password');
}

export async function simulateSignupRequest(data: {
  name: string;
  email: string;
  password: string;
}) {
  // Simulate network delay
  await delay(1000);
  
  // Check if email is already in use (for demo)
  if (data.email === 'user@example.com') {
    throw new Error('Email already in use');
  }
  
  // Generate a 2FA secret
  const twoFactorSecret = generateOTPSecret();
  
  return {
    success: true,
    twoFactorSecret,
  };
}

export async function simulateVerifyRequest(data: {
  email: string;
  code: string;
  mode: '2fa-setup' | '2fa-verify';
}) {
  // Simulate network delay
  await delay(1000);
  
  // In a real app, you would validate the OTP code against the stored secret
  // For demo purposes, we'll accept any 6-digit code
  
  // Randomly fail ~30% of the time with wrong codes (for demo purposes)
  if (data.code !== '123456' && Math.random() < 0.3) {
    throw new Error('Invalid verification code');
  }
  
  return {
    success: true,
  };
}