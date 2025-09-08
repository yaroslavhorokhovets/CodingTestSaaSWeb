import CryptoJS from 'crypto-js'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production'

export function encrypt(text: string): string {
  try {
    const encrypted = CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString()
    return encrypted
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt data')
  }
}

export function decrypt(encryptedText: string | number | boolean | object | any[]): string {
  try {
    // Handle different input types from Prisma JsonValue
    const text = typeof encryptedText === 'string' ? encryptedText : JSON.stringify(encryptedText)
    const bytes = CryptoJS.AES.decrypt(text, ENCRYPTION_KEY)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    return decrypted
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('Failed to decrypt data')
  }
}

export function encryptObject(obj: any): string {
  return encrypt(JSON.stringify(obj))
}

export function decryptObject<T>(encryptedText: string): T {
  const decrypted = decrypt(encryptedText)
  return JSON.parse(decrypted)
}

export function hashPassword(password: string): string {
  return CryptoJS.SHA256(password + ENCRYPTION_KEY).toString()
}

export function generateSecureToken(): string {
  return CryptoJS.lib.WordArray.random(32).toString()
}