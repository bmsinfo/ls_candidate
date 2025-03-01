import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY =
  process.env.NEXT_PUBLIC_STORE_ENCRYPTION_KEY ||
  '4555744CD4218D2DFB7D44F6D9235';

export const secureStorage = {
  setItem: (key: string, value: any) => {
    try {
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(value),
        ENCRYPTION_KEY,
      ).toString();
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Error encrypting data:', error);
    }
  },

  getItem: (key: string) => {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;

      const decrypted = CryptoJS.AES.decrypt(
        encrypted,
        ENCRYPTION_KEY,
      ).toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Error decrypting data:', error);
      return null;
    }
  },

  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
};
