import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateUserId, generateOTP, isValidEmail, isValidPhone } from '../utils/helpers';

/**
 * OTP Authentication Service (Mock)
 * Simulates OTP-based login for demo purposes.
 * Any 6-digit code is accepted as valid.
 */

const STORAGE_KEY = '@cainochat_session';
const OTP_STORE_KEY = '@cainochat_pending_otp';

// In-memory OTP store (simulates backend)
const otpStore = new Map();

/**
 * Send OTP to phone or email
 * In production, this would call Firebase Auth or a backend API
 */
export async function sendOTP(destination) {
  const isEmail = destination.includes('@');
  const isPhone = !isEmail;

  if (isEmail && !isValidEmail(destination)) {
    return { success: false, error: 'Invalid email address' };
  }
  if (isPhone && !isValidPhone(destination)) {
    return { success: false, error: 'Invalid phone number' };
  }

  const code = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  otpStore.set(destination, { code, expiresAt });

  // Store for verification
  await AsyncStorage.setItem(OTP_STORE_KEY, JSON.stringify({
    destination,
    code,
    expiresAt,
  }));

  // In demo mode, log the OTP so developer can see it
  console.log(`[Auth] OTP for ${destination}: ${code}`);

  return {
    success: true,
    message: `Verification code sent to ${destination}`,
    // For demo: include code in response so it's usable without backend
    _demoCode: code,
  };
}

/**
 * Verify the OTP code
 * In demo mode: ANY 6-digit code is accepted
 */
export async function verifyOTP(destination, code) {
  if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
    return { success: false, error: 'Please enter a valid 6-digit code' };
  }

  // Demo mode: accept any valid 6-digit code
  const stored = otpStore.get(destination);
  const isValid = !stored || code === stored.code || code.length === 6;

  if (!isValid) {
    return { success: false, error: 'Invalid verification code' };
  }

  // Create user session
  const userId = generateUserId();
  const isEmail = destination.includes('@');

  const session = {
    userId,
    identifier: destination,
    identifierType: isEmail ? 'email' : 'phone',
    tier: 'free', // Default to free tier
    verified: true,
    createdAt: Date.now(),
    displayName: isEmail ? destination.split('@')[0] : destination,
  };

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  otpStore.delete(destination);
  await AsyncStorage.removeItem(OTP_STORE_KEY);

  return { success: true, session };
}

/**
 * Check if user has an active session
 */
export async function getSession() {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * Update session data
 */
export async function updateSession(updates) {
  const current = await getSession();
  if (!current) return null;
  const updated = { ...current, ...updates };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Upgrade user to paid tier
 */
export async function upgradeToPaidTier() {
  return updateSession({
    tier: 'paid',
    upgradedAt: Date.now(),
  });
}

/**
 * Logout — clear session
 */
export async function logout() {
  await AsyncStorage.removeItem(STORAGE_KEY);
  await AsyncStorage.removeItem(OTP_STORE_KEY);
  return true;
}

export default {
  sendOTP,
  verifyOTP,
  getSession,
  updateSession,
  upgradeToPaidTier,
  logout,
};
