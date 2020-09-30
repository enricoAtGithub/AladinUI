import CryptoJS from 'crypto-js';
import { strict } from 'assert';

export default class CryptUtils {

    // todo: find better way to store hard wired key
    private static readonly _key = '03062b1d-9142-4be5-ad2b-7b6486773709';
    private static readonly _logLength = 100;
    private static readonly ENCRYPTED_TOKEN_PREFIX = '#$§$§$§#';

    static encryptForLocalStorage = (value: string): string => {

        if (!value || value.trim().length === 0) {
            return value;
        }

        // read token
        const obj = JSON.parse(value);
        if (!obj || !Object.keys(obj).some(key => key === 'user')) {
            return value;
        }
        const userObj = obj['user'];
        if (!userObj || !Object.keys(userObj).some(key => key === 'token')) {
            return value;
        }
        const token = userObj['token'];
        // console.log('token:', token);

        // if token is empty, return
        if (!token) {
            return value;
        }

        // encrypt token
        const encryptedToken = CryptoJS.AES.encrypt(token, CryptUtils._key).toString();

        // add prefix to encrypted token and write back to object
        obj['user']['token'] = `${CryptUtils.ENCRYPTED_TOKEN_PREFIX}${encryptedToken}`;


        const result = JSON.stringify(obj);

        console.log(`encrypting state for local storage. \nunencrypted value: ${value.substr(0, CryptUtils._logLength)}. \nencrypted value: ${result.substr(0, CryptUtils._logLength)}`);

        return result;
    }

    static encryptToken = (token: string): string => CryptoJS.AES.encrypt(token, CryptUtils._key).toString();


    static decryptForLocalStorage = (value: string): string => {

        // read token
        const obj = JSON.parse(value);
        if (!obj || !Object.keys(obj).some(key => key === 'user')) {
            return value;
        }
        const userObj = obj['user'];
        if (!userObj || !Object.keys(userObj).some(key => key === 'token')) {
            return value;
        }
        const encryptedToken = userObj['token'] as string;

        // check if token is encrypted
        if (!encryptedToken.startsWith(CryptUtils.ENCRYPTED_TOKEN_PREFIX)) {
            // console.log('token has no prefix. No decrypting will take place.');
            return value;
        }

        // remove prefix from encrypted token
        // console.log('encrypted token with prefix:', encryptedToken);
        const tokenWithoutPrefix = encryptedToken.replace(CryptUtils.ENCRYPTED_TOKEN_PREFIX, '');
        // console.log('encrypted token:', tokenWithoutPrefix);

        // decrypt token
        const decryptedTokenBytes = CryptoJS.AES.decrypt(tokenWithoutPrefix, CryptUtils._key);
        const decryptedToken = decryptedTokenBytes.toString(CryptoJS.enc.Utf8);

        // write back decrypted token
        obj['user']['token'] = decryptedToken;
        const result = JSON.stringify(obj);

        console.log(`decrypting state for local storage. \nencrypted value: ${value.substr(0, CryptUtils._logLength)}. \ndecrypted value: ${result.substr(0, CryptUtils._logLength)}`);

        return result;
    }

    static decryptToken = (encryptedToken: string) => CryptoJS.AES.decrypt(encryptedToken, CryptUtils._key).toString(CryptoJS.enc.Utf8);

    // static encryptForLocalStorage = (value: string): string => {

    //     return value;
    // }


    // static decryptForLocalStorage = (value: string): string => {

    //     return value;
    // }

}
