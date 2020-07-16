import * as CryptoJS from 'crypto-js';

export default class CryptUtils {

    private static _key = '03062b1d-9142-4be5-ad2b-7b6486773709';

    // static encryptForLocalStorage = (value: string): string => CryptoJS.AES.encrypt(value, CryptUtils._key).ciphertext;
    static encryptForLocalStorage = (value: string): string => {
        const result = CryptoJS.AES.encrypt(value, CryptUtils._key).ciphertext;
        console.log(`encrypting state for local storage. value: ${value}. encrypted value: ${result}`);
        return result;
    }


    // static decryptForLocalStorage = (value: string): string => CryptoJS.AES.decrypt(value, CryptUtils._key).toString();
    static decryptForLocalStorage = (value: string): string => {
        const result = CryptoJS.AES.decrypt(value, CryptUtils._key).toString();
        console.log(`decrypting state for local storage. value: ${value}. decrypted value: ${result}`);
        return result;
    }

}
