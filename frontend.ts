//! Tool 前端用
export default class Tool {
    // 小數點後精準定位
    static safeRound(v: number, n: number) {
        if (v % 1 !== 0) {
            v = parseFloat(v.toPrecision(15));
        }
        const t = Math.pow(10, n);
        let nv = v * t;
        if (nv % 1 !== 0) {
            nv = parseFloat(nv.toPrecision(15));
        }
        return Math.round(nv) / t;
    }

    // 檢查字串是否可轉換為數字
    static checkStringTurnNumber = (str: string | undefined) => {
        if (str === undefined || /[^0-9]/.test(str)) {
            return undefined;
        }
        const t = parseInt(str, 10);
        return isNaN(t) ? undefined : t;
    };

    // 現在時間（需確認全域含有 moment-timezone.js）
    static nowTime = (timeZone?: string) => {
        return (window as any)
            .moment()
            .tz(timeZone ?? 'Asia/Taipei')
            .format('YYYY-MM-DD HH:mm:ss');
    };

    // 重設時間字串
    static replaceDatetime = (datetime: any) => {
        if (datetime) return datetime.replace('T', ' ').replace('.000Z', '').replace('+00:00', '');
        return datetime;
    };

    // 生成隨機英數字字串
    static randomString = (max: number) => {
        const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
        for (let i = 1; i < max; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    };

    // 擷取字串，過多則補刪節號
    static truncateString(str: string, maxLength: number) {
        if (str.length <= maxLength) {
            return str;
        } else {
            return str.slice(0, maxLength) + '...';
        }
    }

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
}
