export default class Tool {
    // 確認方法載入成功
    static waitLoadModule = (name: string, event: () => void, timeout?: number, msg?: boolean) => {
        let t = timeout && timeout > 500 ? timeout : 500;
        (window as any).siArray === undefined && ((window as any).siArray = []);
        const n = (window as any).siArray.length;

        (window as any).siArray.push({
            n: n,
            e: setInterval(() => {
                if ((window as any)[name]) {
                    event();
                    msg && console.log(`${name} load finish`);
                    clearInterval((window as any).siArray[n].e);
                } else {
                    msg && console.log(`Waiting for ${name}...`);
                }
            }, t),
        });
    };

    // 千分位
    static addQuantile = (num: number | string) => {
        if (typeof num !== 'number') return num;
        let result: string[] = [];
        num.toString()
            .split('')
            .reverse()
            .map((n, i) => {
                result.splice(0, 0, n);
                i % 3 == 2 && i != num.toString().length - 1 && result.splice(0, 0, ',');
            });
        return result.join('').replace('-,', '-');
    };

    // 是否為 UNO
    static isUNO = (value: any) => {
        if (
            value === undefined ||
            value === null ||
            value === 'undefined' ||
            value === 'null' ||
            value === 0 ||
            value.length === 0 ||
            (typeof value === 'object' && Object.keys(value).length === 0)
        ) {
            return true;
        } else {
            return false;
        }
    };

    // 驗證英文字母
    static containsEnglish = (input: string): boolean => {
        const englishPattern = /[a-zA-Z]/;
        return englishPattern.test(input);
    };

    // 中英文姓氏名稱修正
    static formatUserName = (first_name: string, last_name: string): string => {
        if (Tool.containsEnglish(first_name) || Tool.containsEnglish(last_name)) {
            return first_name + ' ' + last_name;
        } else if (last_name.length == 1 && first_name.length != 1) {
            return last_name + first_name;
        }
        return first_name + last_name;
    };
}
