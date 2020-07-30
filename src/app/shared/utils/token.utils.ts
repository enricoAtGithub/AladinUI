export default class TokenUtils {

    static readonly DEFAULT_TOKEN_LENGTH = 20;

    static generateToken(length: number = 20): string {
        // https://gist.github.com/6174/6062387#gistcomment-2762722
        const radom13chars = function () {
            return Math.random().toString(16).substring(2, 15);
        };
        const loops = Math.ceil(length / 13);
        return new Array(loops).fill(radom13chars).reduce((string, func) => {
            return string + func();
        }, '').substring(0, length);
    }

    static addTokenToUrl = (url: string, length: number = 20): string => `${url}${(url.indexOf('?') >= 0 ? '&' : '?')}token=${TokenUtils.generateToken(length)}`;

}
