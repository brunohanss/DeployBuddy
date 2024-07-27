import { Injectable } from '@nestjs/common';
import { generateKeyPair as generateKeys } from 'crypto';
import * as CryptoJS from 'crypto-js';
import { promisify } from 'util';
const sshpk = require('sshpk');
@Injectable()
export class EncryptionService {
  private readonly key = CryptoJS.SHA256(process.env.ENCRYPTION_KEY);
  private readonly iv = CryptoJS.enc.Base64.parse(process.env.ENCRYPTION_IV);

  encrypt(text: string): string {
    const encrypted = CryptoJS.AES.encrypt(text, this.key, { iv: this.iv });
    return encrypted.toString();
  }

  decrypt(encryptedText: string): string {
    const decrypted = CryptoJS.AES.decrypt(encryptedText, this.key, {
      iv: this.iv,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  // Renamed method from decryptToken to decryptData
  decryptData(token: string): string {
    return this.decrypt(token);
  }

  // Method to generate SSH key pair
  async generateKeyPair(): Promise<{
    privateKey: string;
    publicKey: string;
    fingerPrint: string;
  }> {
    try {
      const generateKeyPairAsync = promisify(generateKeys);
      const { publicKey, privateKey } = await generateKeyPairAsync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
        },
      });

      // Convert the public key to OpenSSH format
      const key = sshpk.parseKey(publicKey, 'pem');
      const sshPublicKey = key.toString('ssh');
      console.log('Formatted SSH Public Key:', sshPublicKey);

      // Convert the private key to OpenSSH format
      const privateKeyObj = sshpk.parsePrivateKey(privateKey, 'pem');
      const sshPrivateKey = privateKeyObj.toString('ssh');

      console.log('Generated public key:', publicKey);
      console.log('Generated private key:', privateKey);
      console.log('Generated private key object:', sshPrivateKey);

      // Extract the fingerprint in MD5 format
      const fingerPrint = key.fingerprint('md5').toString();
      console.log('Fingerprint:', fingerPrint);

      // Return or save the keys and fingerprint as needed
      return {
        publicKey: sshPublicKey,
        privateKey: sshPrivateKey,
        fingerPrint,
      };
    } catch (error) {
      console.error('Error generating keys', error);
      throw new Error('Key generation failed');
    }
  }
}
