//! Tool 後端用
import _ from 'underscore';
import bcrypt from 'bcrypt';
import crypto, { Encoding } from 'crypto';
import moment from 'moment-timezone';

export default class Tool {
    // 現在時間
    static nowTime = (timeZone?: string) => {
        return moment()
            .tz(timeZone ?? 'Asia/Taipei')
            .format('YYYY-MM-DD HH:mm:ss');
    };

    // 重設時間字串
    static replaceDatetime = (datetime: any) => {
        if (datetime) return datetime.replace('T', ' ').replace('.000Z', '').replace('+00:00', '');
        return datetime;
    };

    // 確認陣列元素是否為空, 未定義, 不存在, 字串長度0
    static isNull = (...args: any[]) => {
        if (!args || args.length == 0) {
            return true;
        }
        for (let i = 0; i < args.length; i++) {
            if (
                _.isNull(args[i]) ||
                _.isUndefined(args[i]) ||
                args[i].length == 0 ||
                (_.isObject(args[i]) && _.isEmpty(args[i]))
            ) {
                return true;
            }
        }
        return false;
    };

    // 檢查字串是否可轉換為數字
    static checkStringTurnNumber = (str: string | undefined) => {
        if (str === undefined || /[^0-9]/.test(str)) {
            return undefined;
        }
        const t = parseInt(str, 10);
        return isNaN(t) ? undefined : t;
    };

    // 比較兩個物件是否相同 (Zack ver.)
    static compareVar = (var1: any, var2: any) => {
        function isPrimitiveOrArray(value: any) {
            if (Array.isArray(value)) {
                return 'Array';
            } else if (typeof value !== 'object' || value === null) {
                return 'Primitive';
            } else {
                return 'Object';
            }
        }
        if (isPrimitiveOrArray(var1) != isPrimitiveOrArray(var1)) {
            return false;
        } else if (isPrimitiveOrArray(var1) === 'Array') {
            if (var1.length != var2.length) {
                return false;
            }
            var1.map((arrayData: any, index: number) => {
                if (isPrimitiveOrArray(arrayData) != isPrimitiveOrArray(var2[index])) {
                    return false;
                } else if (isPrimitiveOrArray(arrayData) != 'Primitive') {
                    if (!this.compareVar(var1[index], var2[index])) {
                        return false;
                    } else if (arrayData != var2[index]) {
                        return false;
                    }
                }
            });
        } else if (isPrimitiveOrArray(var1) === 'Object') {
            let keyArray1 = Object.keys(var1);
            let keyArray2 = Object.keys(var2);
            if (keyArray1.length != keyArray2.length) {
                return false;
            } else {
                keyArray1.map((data, index) => {
                    if (data != keyArray2[index]) {
                        return false;
                    }
                });
                Object.entries(var1).map((data) => {
                    if (isPrimitiveOrArray(data[1] != isPrimitiveOrArray(var2[data[0]]))) {
                        return false;
                    } else if (isPrimitiveOrArray(data[1]) != 'Primitive') {
                        if (!this.compareVar(data[1], var2[data[0]])) {
                            return false;
                        }
                    } else {
                        if (data[1] != var2[data[0]]) {
                            return false;
                        }
                    }
                });
            }
        } else if (var1 != var2) {
            return false;
        }
        return true;
    };

    // 比較兩個物件是否相同
    static ObjCompare = (obj1: { [k: string]: any }, obj2: { [k: string]: any }) => {
        const Obj1_keys = obj1 ? Object.keys(obj1) : [];
        const Obj2_keys = obj2 ? Object.keys(obj2) : [];
        if (Obj1_keys.length !== Obj2_keys.length) {
            return false;
        }
        for (const k of Obj1_keys) {
            if (obj1[k] !== obj2[k]) {
                return false;
            }
        }
        return true;
    };

    // 比較兩個陣列是否相同
    static arrayEquals(a_array: any[], b_array: any[]) {
        if (a_array.length != b_array.length) return false;
        for (let i = 0; i < b_array.length; i++) {
            if (a_array[i] instanceof Array && b_array[i] instanceof Array) {
                if (!a_array[i].equals(b_array[i])) return false;
            } else if (a_array[i] != b_array[i]) {
                return false;
            }
        }
        return true;
    }

    // 依照 key 排序物件
    static sortObjectByKey = (x: { [k: string]: any }) => {
        const ordered = Object.keys(x)
            .sort()
            .reduce((obj: { [k: string]: any }, key) => {
                obj[key] = x[key];
                return obj;
            }, {});
        return ordered;
    };

    // 擷取字串
    static truncateString(str: string, maxLength: number) {
        if (str.length <= maxLength) {
            return str;
        } else {
            return str.slice(0, maxLength) + '...';
        }
    }

    // 生成隨機英數字字串
    static randomString = (max: number) => {
        const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
        for (let i = 1; i < max; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    };

    // 生成隨機數字字串
    static randomNumber = (max: number) => {
        const possible = '0123456789';
        let text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
        for (let i = 1; i < max; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    };

    // 生成訂單編號
    static getOrderNumber = (x: string | undefined) => {
        let orderID = '';
        const now = new Date();
        const m = (now.getMonth() < 9 ? '0' : '') + (now.getMonth() + 1);
        const d = (now.getDate() < 9 ? '0' : '') + now.getDate();
        const orderDate = (now.getFullYear() - 2000).toString() + m + d;
        if (x === undefined) {
            orderID = orderDate + '0000';
        } else {
            let i = '' + (x.slice(6, 10) + 1);
            i = i == '10000' ? '0000' : i.padStart(4, '0');
            orderID = orderDate + i;
        }
        return orderID;
    };

    // 生成訂單 id
    static createOrderId = (): string => {
        const orderId = '#' + moment(new Date()).format('YYYYMMDD') + crypto.randomBytes(4).toString('hex');
        return orderId;
    };

    // 安全轉換至 JSON 的 String
    static toJSONSafeString = (val: string): string => {
        return val.replace(/[\t\n\r]/g, (match: string) => {
            switch (match) {
                case '\t':
                    return '\\t';
                case '\n':
                    return '\\n';
                case '\r':
                    return '\\r';
                default:
                    return match;
            }
        });
    };

    // 將 CSV 轉成陣列
    static CSVtoArray(text: string) {
        const re_valid =
            /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
        const re_value =
            /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
        // Return NULL if input string is not well formed CSV string.
        if (!re_valid.test(text)) return [];
        const a = []; // Initialize array to receive values.
        text.replace(
            re_value, // "Walk" the string using replace with callback.
            function (m0: string | undefined, m1: string | undefined, m2: string | undefined, m3: string | undefined) {
                // Remove backslash from \' in single quoted values.
                // if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
                // Remove backslash from \" in double quoted values.
                if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
                else if (m3 !== undefined) a.push(m3);
                return ''; // Return empty string.
            }
        );
        // Handle special case of empty last value.
        if (/,\s*$/.test(text)) a.push('');
        return a;
    }

    // 將 JSON 轉成 query string
    static JsonToQueryString(data: { [key: string]: string | string[] | number }): string {
        const queryString = Object.keys(data)
            .map((key) => {
                const value = data[key];
                if (Array.isArray(value)) {
                    return value.map((v) => `${encodeURIComponent(key)}[]=${encodeURIComponent(v)}`).join('&');
                }
                return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
            })
            .join('&');
        return queryString;
    }

    // 將 query string 轉成 JSON
    static queryStringToJSON(queryString: string): Record<string, string> {
        const pairs = queryString.slice(1).split('&');
        const result: Record<string, string> = {};
        pairs.forEach((pair) => {
            const [key, value] = pair.split('=');
            result[key] = decodeURIComponent(value || '');
        });
        return result;
    }

    // Compare Hash
    static compareHash = async (pwd: string, has: string) => bcrypt.compare(pwd, has);

    // HASH 加密
    static async hashPwd(pwd: string, saltRounds: number = 5): Promise<string> {
        try {
            bcrypt.compare;
            const hashPwd = await bcrypt.hash(pwd, saltRounds);
            return hashPwd;
        } catch (e) {
            let message = 'unknown error';
            e instanceof Error && (message = e.message);
            throw 'Tool hashPwd Error: ' + message;
        }
    }

    // AES 加密
    static aesEncrypt(
        data: string,
        key: string,
        iv: string,
        input: Encoding = 'utf-8',
        output: Encoding = 'hex',
        method = 'aes-256-cbc'
    ): string {
        while (key.length % 32 !== 0) {
            key += '\0';
        }
        while (iv.length % 16 !== 0) {
            iv += '\0';
        }
        const cipher = crypto.createCipheriv(method, key, iv);
        let encrypted = cipher.update(data, input, output);
        encrypted += cipher.final(output);
        return encrypted;
    }

    // AES 解密
    static aesDecrypt = (
        data: string,
        key: string,
        iv: string,
        input: Encoding = 'hex',
        output: Encoding = 'utf-8',
        method = 'aes-256-cbc'
    ) => {
        while (key.length % 32 !== 0) {
            key += '\0';
        }
        while (iv.length % 16 !== 0) {
            iv += '\0';
        }
        const decipher = crypto.createDecipheriv(method, key, iv);
        let decrypted = decipher.update(data, input, output);
        try {
            decrypted += decipher.final(output);
        } catch (e) {
            e instanceof Error && console.log(e.message);
        }
        return decrypted;
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

    // 因為資料庫為台灣時間，統一轉換成 ISO String
    static toIsoString = (date: Date): string => {
        date.setHours(date.getHours() - 8);
        return date.toISOString();
    };

    // 因為資料庫為台灣時間，統一轉換成 ISO Date
    static toIsoDate = (date: Date): Date => {
        date.setHours(date.getHours() - 8);
        return date;
    };

    // 錯誤回報
    static errorCaller = (filename: string, error: any, logger: any) => {
        const path = `[${filename.split('src').pop()}]`;
        error instanceof Error && logger.error(path, error.message);
        console.error(error);
    };
}
