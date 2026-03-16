import CryptoJS from 'crypto-js';
import { generateMockPublicKey } from '../utils/helpers';

/**
 * AES-256-GCM Encryption Service
 * Used for encrypting signaling messages and metadata.
 * WebRTC's DTLS-SRTP handles media encryption automatically.
 */

const ALGORITHM = 'AES-256-GCM';

/**
 * Generate a random encryption key (256-bit)
 */
export function generateKey() {
  return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
}

/**
 * Generate an initialization vector
 */
export function generateIV() {
  return CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
}

/**
 * Encrypt a message using AES-256-GCM (simulated with AES + HMAC)
 * Note: CryptoJS doesn't natively support GCM, so we use CBC + HMAC
 * which provides authenticated encryption equivalent security.
 */
export function encryptMessage(plaintext, keyHex) {
  try {
    const key = CryptoJS.enc.Hex.parse(keyHex);
    const iv = CryptoJS.lib.WordArray.random(16);

    // Encrypt using AES-CBC
    const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Create HMAC for authentication (simulating GCM auth tag)
    const hmac = CryptoJS.HmacSHA256(
      iv.toString(CryptoJS.enc.Hex) + encrypted.ciphertext.toString(CryptoJS.enc.Hex),
      key
    );

    // Return iv:ciphertext:hmac
    return [
      iv.toString(CryptoJS.enc.Hex),
      encrypted.ciphertext.toString(CryptoJS.enc.Hex),
      hmac.toString(CryptoJS.enc.Hex),
    ].join(':');
  } catch (error) {
    console.error('[Encryption] Encrypt failed:', error);
    return null;
  }
}

/**
 * Decrypt a message
 */
export function decryptMessage(encryptedPayload, keyHex) {
  try {
    const parts = encryptedPayload.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted payload format');
    }

    const [ivHex, cipherHex, hmacHex] = parts;
    const key = CryptoJS.enc.Hex.parse(keyHex);
    const iv = CryptoJS.enc.Hex.parse(ivHex);

    // Verify HMAC first
    const expectedHmac = CryptoJS.HmacSHA256(ivHex + cipherHex, key).toString(CryptoJS.enc.Hex);
    if (expectedHmac !== hmacHex) {
      throw new Error('Authentication failed — message may have been tampered with');
    }

    // Decrypt
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Hex.parse(cipherHex),
    });

    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('[Encryption] Decrypt failed:', error);
    return null;
  }
}

/**
 * Derive a shared secret from two user IDs (mock key exchange)
 */
export function deriveSharedKey(userId1, userId2) {
  const sorted = [userId1, userId2].sort().join(':');
  return CryptoJS.SHA256(`cainochat-shared-${sorted}`).toString(CryptoJS.enc.Hex);
}

/**
 * Generate a key pair for QR verification (mock)
 * In production, use actual ECDH key pairs
 */
export function generateKeyPair(userId) {
  const privateKey = CryptoJS.SHA256(`private-${userId}-${Date.now()}`).toString(CryptoJS.enc.Hex);
  const publicKey = generateMockPublicKey(userId);
  return { privateKey, publicKey };
}

/**
 * Verify that a scanned public key matches expected
 */
export function verifyPublicKey(scannedKey, expectedKey) {
  return scannedKey === expectedKey;
}

export default {
  generateKey,
  generateIV,
  encryptMessage,
  decryptMessage,
  deriveSharedKey,
  generateKeyPair,
  verifyPublicKey,
};
