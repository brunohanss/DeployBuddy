import CryptoJS from 'crypto-js';

// Ensure these environment variables are set and contain valid Base64 encoded values
const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY; // Should be a string like "magickey"
const encryptionIV = import.meta.env.VITE_ENCRYPTION_IV; // Base64 encoded IV

if (!encryptionKey || !encryptionIV) {
  throw new Error("Missing encryption secrets");
}

// Derive the key using SHA-256
const key = CryptoJS.SHA256(encryptionKey);

// Parse the Base64 encoded IV
const iv = CryptoJS.enc.Base64.parse(encryptionIV);

export const encrypt = (text: string | CryptoJS.lib.WordArray) => {
  const encrypted = CryptoJS.AES.encrypt(text, key, { iv: iv });
  return encrypted.toString();
};

export const decrypt = (ciphertext: string) => {
  console.log("ciphertext", ciphertext
    
  )
  const parts = ciphertext.split(':');
  const iv = CryptoJS.enc.Base64.parse(parts[0]);
  const encrypted = parts[1];
  const decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: iv });
  return decrypted.toString(CryptoJS.enc.Utf8);
};