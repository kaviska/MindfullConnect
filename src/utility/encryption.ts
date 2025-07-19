// ✅ Create encryption utility
// src/utils/encryption.ts
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'your-secure-key';

export class MessageEncryption {
  // ✅ Encrypt message before sending
  static encryptMessage(message: string, conversationKey: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(message, conversationKey).toString();
      return encrypted;
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt message');
    }
  }

  // ✅ Decrypt message after receiving
  static decryptMessage(encryptedMessage: string, conversationKey: string): string {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedMessage, conversationKey);
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt message');
    }
  }

  // ✅ Generate unique conversation key
  static generateConversationKey(patientId: string, counselorId: string): string {
    const combined = `${patientId}-${counselorId}-${ENCRYPTION_KEY}`;
    return CryptoJS.SHA256(combined).toString();
  }

  // ✅ Hash sensitive data
  static hashData(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }
}