// ✅ Enhanced encryption.ts with better error handling
// src/utility/encryption.ts
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'your-secure-fallback-key-12345';

export class MessageEncryption {
  // ✅ Add debug logging
  private static debugMode = process.env.NODE_ENV === 'development';
  
  private static log(message: string, data?: any) {
    if (this.debugMode) {
      console.log(`[Encryption] ${message}`, data);
    }
  }

  private static logError(message: string, error?: any) {
    console.error(`[Encryption Error] ${message}`, error);
  }

  // ✅ Enhanced encrypt with better validation
  static encryptMessage(message: string, conversationKey: string): string {
    try {
      this.log('Encrypting message', { messageLength: message?.length, hasKey: !!conversationKey });
      
      // Validate inputs more thoroughly
      if (!message) {
        throw new Error('Message is required and cannot be empty');
      }
      
      if (!conversationKey) {
        throw new Error('Conversation key is required and cannot be empty');
      }

      if (typeof message !== 'string') {
        throw new Error('Message must be a string');
      }

      if (typeof conversationKey !== 'string') {
        throw new Error('Conversation key must be a string');
      }

      // Encrypt with proper formatting
      const encrypted = CryptoJS.AES.encrypt(message, conversationKey).toString();
      
      // Validate encryption result
      if (!encrypted || encrypted.length === 0) {
        throw new Error('Encryption produced empty result');
      }

      this.log('Encryption successful', { encryptedLength: encrypted.length });
      return encrypted;
    } catch (error) {
      this.logError('Encryption failed', error);
      throw new Error(`Failed to encrypt message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ✅ Enhanced decrypt with better validation
  static decryptMessage(encryptedMessage: string, conversationKey: string): string {
    try {
      this.log('Decrypting message', { encryptedLength: encryptedMessage?.length, hasKey: !!conversationKey });
      
      // Validate inputs more thoroughly
      if (!encryptedMessage) {
        throw new Error('Encrypted message is required and cannot be empty');
      }
      
      if (!conversationKey) {
        throw new Error('Conversation key is required and cannot be empty');
      }

      if (typeof encryptedMessage !== 'string') {
        throw new Error('Encrypted message must be a string');
      }

      if (typeof conversationKey !== 'string') {
        throw new Error('Conversation key must be a string');
      }

      // Check if the encrypted message looks valid (base64-like)
      if (!/^[A-Za-z0-9+/=]+$/.test(encryptedMessage)) {
        throw new Error('Invalid encrypted message format');
      }

      // Attempt decryption with additional error catching
      let decrypted;
      try {
        decrypted = CryptoJS.AES.decrypt(encryptedMessage, conversationKey);
      } catch (cryptoError) {
        this.logError('CryptoJS decryption failed', cryptoError);
        throw new Error('Failed to decrypt - invalid format or corrupted data');
      }
      
      // Check if decryption was successful before converting to string
      if (!decrypted || decrypted.sigBytes <= 0) {
        throw new Error('Decryption failed - invalid key or corrupted message');
      }

      // Convert to UTF-8 string with additional error handling
      let decryptedText;
      try {
        decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      } catch (utf8Error) {
        this.logError('UTF-8 conversion failed', utf8Error);
        throw new Error('Invalid encryption key or corrupted message data');
      }
      
      // Validate the result
      if (!decryptedText || decryptedText.length === 0) {
        throw new Error('Decryption resulted in empty message - wrong key or corrupted data');
      }

      this.log('Decryption successful', { decryptedLength: decryptedText.length });
      return decryptedText;
    } catch (error) {
      this.logError('Decryption failed', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('Malformed UTF-8')) {
          throw new Error('Invalid encryption key or corrupted message data');
        }
        throw new Error(`Failed to decrypt message: ${error.message}`);
      }
      
      throw new Error('Failed to decrypt message: Unknown error');
    }
  }

  // ✅ Enhanced key generation with validation
  static generateConversationKey(patientId: string, counselorId: string): string {
    try {
      this.log('Generating conversation key', { patientId: patientId?.substring(0, 8), counselorId: counselorId?.substring(0, 8) });
      
      if (!patientId || !counselorId) {
        throw new Error('Patient ID and Counselor ID are required and cannot be empty');
      }

      if (typeof patientId !== 'string' || typeof counselorId !== 'string') {
        throw new Error('Patient ID and Counselor ID must be strings');
      }

      if (patientId.trim().length === 0 || counselorId.trim().length === 0) {
        throw new Error('Patient ID and Counselor ID cannot be empty strings');
      }

      // Sort IDs to ensure consistent key regardless of order
      const sortedIds = [patientId.trim(), counselorId.trim()].sort();
      const combined = `${sortedIds[0]}-${sortedIds[1]}-${ENCRYPTION_KEY}`;
      
      const key = CryptoJS.SHA256(combined).toString();
      
      if (!key || key.length === 0) {
        throw new Error('Key generation produced empty result');
      }

      this.log('Key generation successful', { keyLength: key.length });
      return key;
    } catch (error) {
      this.logError('Key generation failed', error);
      throw new Error(`Failed to generate conversation key: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ✅ Enhanced test function with better error handling
  static canDecrypt(encryptedMessage: string, conversationKey: string): boolean {
    try {
      if (!encryptedMessage || !conversationKey) {
        return false;
      }

      const decrypted = CryptoJS.AES.decrypt(encryptedMessage, conversationKey);
      if (!decrypted || decrypted.sigBytes <= 0) {
        return false;
      }

      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      return decryptedText.length > 0;
    } catch (error) {
      this.log('canDecrypt failed', error);
      return false;
    }
  }
}

// ✅ Enhanced utility functions with better error handling
export const encryptionUtils = {
  // Safe encrypt wrapper with detailed logging
  safeEncrypt: (message: string, patientId: string, counselorId: string): string | null => {
    try {
      // Validate inputs before proceeding
      if (!message || !patientId || !counselorId) {
        console.warn('[Encryption] Missing required parameters for encryption');
        return null;
      }

      const key = MessageEncryption.generateConversationKey(patientId, counselorId);
      const encrypted = MessageEncryption.encryptMessage(message, key);
      
      // Double-check the result
      if (!encrypted) {
        console.error('[Encryption] Encryption returned null/undefined');
        return null;
      }

      return encrypted;
    } catch (error) {
      console.error('[Encryption] Safe encrypt failed:', error);
      return null;
    }
  },

  // Safe decrypt wrapper with detailed logging
  safeDecrypt: (encryptedMessage: string, patientId: string, counselorId: string): string | null => {
    try {
      // Validate inputs before proceeding
      if (!encryptedMessage || !patientId || !counselorId) {
        console.warn('[Encryption] Missing required parameters for decryption');
        return null;
      }

      const key = MessageEncryption.generateConversationKey(patientId, counselorId);
      
      // Test if decryption is possible before attempting
      if (!MessageEncryption.canDecrypt(encryptedMessage, key)) {
        console.warn('[Encryption] Message cannot be decrypted with current key');
        return null;
      }

      const decrypted = MessageEncryption.decryptMessage(encryptedMessage, key);
      
      // Double-check the result
      if (!decrypted) {
        console.error('[Encryption] Decryption returned null/undefined');
        return null;
      }

      return decrypted;
    } catch (error) {
      console.error('[Encryption] Safe decrypt failed:', error);
      return null;
    }
  },

  // ✅ Validate encryption setup
  validateSetup: (): boolean => {
    try {
      const testMessage = 'test_message_' + Date.now();
      const testKey = 'test_key_' + Date.now();
      
      const encrypted = MessageEncryption.encryptMessage(testMessage, testKey);
      const decrypted = MessageEncryption.decryptMessage(encrypted, testKey);
      
      const isValid = decrypted === testMessage;
      console.log('[Encryption] Setup validation:', isValid ? 'PASSED' : 'FAILED');
      
      return isValid;
    } catch (error) {
      console.error('[Encryption] Setup validation failed:', error);
      return false;
    }
  }
};

// ✅ Add initialization check
export const initializeEncryption = (): boolean => {
  try {
    console.log('[Encryption] Initializing encryption system...');
    
    // Check if CryptoJS is available
    if (typeof CryptoJS === 'undefined') {
      console.error('[Encryption] CryptoJS is not available');
      return false;
    }

    // Validate setup
    const isValid = encryptionUtils.validateSetup();
    
    if (isValid) {
      console.log('[Encryption] System initialized successfully');
    } else {
      console.error('[Encryption] System initialization failed');
    }
    
    return isValid;
  } catch (error) {
    console.error('[Encryption] Initialization error:', error);
    return false;
  }
};