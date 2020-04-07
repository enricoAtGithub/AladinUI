
export default class StringUtils {

    // https://stackoverflow.com/a/55292366/5536342
    static trimAny = (target: string, remove: string): string  => {
        let start = 0;
        let end = target.length;
        const len = remove.length;

        while (start < end && StringUtils.hasSubstringAt(target, remove, start)) {
            start += len;
        }
        while (end > start && StringUtils.hasSubstringAt(target, remove, end - start)) {
            end -= len;
        }

        return (start > 0 || end < target.length) ? target.substring(start, end) : target;
    }

    // is supposed to be faster than indexOf
    private static hasSubstringAt = (str: string, subStr: string, pos: number): boolean => {
        const len = subStr.length;
        let idx = 0;
        const max = str.length;
        for (; idx < len; idx++) {
            if ((pos + idx) >= max || str[pos + idx] != subStr[idx]) {
                break;
            }
        }
        return idx === len;
    }
}
