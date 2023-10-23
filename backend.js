"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
//! Tool 後端用
const underscore_1 = __importDefault(require("underscore"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class Tool {
    // 比較兩個陣列是否相同
    static arrayEquals(a_array, b_array) {
        if (a_array.length != b_array.length)
            return false;
        for (let i = 0; i < b_array.length; i++) {
            if (a_array[i] instanceof Array && b_array[i] instanceof Array) {
                if (!a_array[i].equals(b_array[i]))
                    return false;
            }
            else if (a_array[i] != b_array[i]) {
                return false;
            }
        }
        return true;
    }
    // 擷取字串
    static truncateString(str, maxLength) {
        if (str.length <= maxLength) {
            return str;
        }
        else {
            return str.slice(0, maxLength) + '...';
        }
    }
    // 將 CSV 轉成陣列
    static CSVtoArray(text) {
        const re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
        const re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
        // Return NULL if input string is not well formed CSV string.
        if (!re_valid.test(text))
            return [];
        const a = []; // Initialize array to receive values.
        text.replace(re_value, // "Walk" the string using replace with callback.
        function (m0, m1, m2, m3) {
            // Remove backslash from \' in single quoted values.
            // if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
            // Remove backslash from \" in double quoted values.
            if (m2 !== undefined)
                a.push(m2.replace(/\\"/g, '"'));
            else if (m3 !== undefined)
                a.push(m3);
            return ''; // Return empty string.
        });
        // Handle special case of empty last value.
        if (/,\s*$/.test(text))
            a.push('');
        return a;
    }
    // 將 JSON 轉成 query string
    static JsonToQueryString(data) {
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
    static queryStringToJSON(queryString) {
        const pairs = queryString.slice(1).split('&');
        const result = {};
        pairs.forEach((pair) => {
            const [key, value] = pair.split('=');
            result[key] = decodeURIComponent(value || '');
        });
        return result;
    }
    // HASH 加密
    static async hashPwd(pwd, saltRounds = 5) {
        try {
            bcrypt_1.default.compare;
            const hashPwd = await bcrypt_1.default.hash(pwd, saltRounds);
            return hashPwd;
        }
        catch (e) {
            let message = 'unknown error';
            e instanceof Error && (message = e.message);
            throw 'Tool hashPwd Error: ' + message;
        }
    }
    // AES 加密
    static aesEncrypt(data, key, iv, input = 'utf-8', output = 'hex', method = 'aes-256-cbc') {
        while (key.length % 32 !== 0) {
            key += '\0';
        }
        while (iv.length % 16 !== 0) {
            iv += '\0';
        }
        const cipher = crypto_1.default.createCipheriv(method, key, iv);
        let encrypted = cipher.update(data, input, output);
        encrypted += cipher.final(output);
        return encrypted;
    }
}
_a = Tool;
// 現在時間
Tool.nowTime = (timeZone) => {
    return (0, moment_timezone_1.default)()
        .tz(timeZone ?? 'Asia/Taipei')
        .format('YYYY-MM-DD HH:mm:ss');
};
// 重設時間字串
Tool.replaceDatetime = (datetime) => {
    if (datetime)
        return datetime.replace('T', ' ').replace('.000Z', '').replace('+00:00', '');
    return datetime;
};
// 確認陣列元素是否為空, 未定義, 不存在, 字串長度0
Tool.isNull = (...args) => {
    if (!args || args.length == 0) {
        return true;
    }
    for (let i = 0; i < args.length; i++) {
        if (underscore_1.default.isNull(args[i]) ||
            underscore_1.default.isUndefined(args[i]) ||
            args[i].length == 0 ||
            (underscore_1.default.isObject(args[i]) && underscore_1.default.isEmpty(args[i]))) {
            return true;
        }
    }
    return false;
};
// 檢查字串是否可轉換為數字
Tool.checkStringTurnNumber = (str) => {
    if (str === undefined || /[^0-9]/.test(str)) {
        return undefined;
    }
    const t = parseInt(str, 10);
    return isNaN(t) ? undefined : t;
};
// 比較兩個物件是否相同 (Zack ver.)
Tool.compareVar = (var1, var2) => {
    function isPrimitiveOrArray(value) {
        if (Array.isArray(value)) {
            return 'Array';
        }
        else if (typeof value !== 'object' || value === null) {
            return 'Primitive';
        }
        else {
            return 'Object';
        }
    }
    if (isPrimitiveOrArray(var1) != isPrimitiveOrArray(var1)) {
        return false;
    }
    else if (isPrimitiveOrArray(var1) === 'Array') {
        if (var1.length != var2.length) {
            return false;
        }
        var1.map((arrayData, index) => {
            if (isPrimitiveOrArray(arrayData) != isPrimitiveOrArray(var2[index])) {
                return false;
            }
            else if (isPrimitiveOrArray(arrayData) != 'Primitive') {
                if (!_a.compareVar(var1[index], var2[index])) {
                    return false;
                }
                else if (arrayData != var2[index]) {
                    return false;
                }
            }
        });
    }
    else if (isPrimitiveOrArray(var1) === 'Object') {
        let keyArray1 = Object.keys(var1);
        let keyArray2 = Object.keys(var2);
        if (keyArray1.length != keyArray2.length) {
            return false;
        }
        else {
            keyArray1.map((data, index) => {
                if (data != keyArray2[index]) {
                    return false;
                }
            });
            Object.entries(var1).map((data) => {
                if (isPrimitiveOrArray(data[1] != isPrimitiveOrArray(var2[data[0]]))) {
                    return false;
                }
                else if (isPrimitiveOrArray(data[1]) != 'Primitive') {
                    if (!_a.compareVar(data[1], var2[data[0]])) {
                        return false;
                    }
                }
                else {
                    if (data[1] != var2[data[0]]) {
                        return false;
                    }
                }
            });
        }
    }
    else if (var1 != var2) {
        return false;
    }
    return true;
};
// 比較兩個物件是否相同
Tool.ObjCompare = (obj1, obj2) => {
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
// 依照 key 排序物件
Tool.sortObjectByKey = (x) => {
    const ordered = Object.keys(x)
        .sort()
        .reduce((obj, key) => {
        obj[key] = x[key];
        return obj;
    }, {});
    return ordered;
};
// 生成隨機英數字字串
Tool.randomString = (max) => {
    const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
    for (let i = 1; i < max; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};
// 生成隨機數字字串
Tool.randomNumber = (max) => {
    const possible = '0123456789';
    let text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
    for (let i = 1; i < max; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};
// 生成訂單編號
Tool.getOrderNumber = (x) => {
    let orderID = '';
    const now = new Date();
    const m = (now.getMonth() < 9 ? '0' : '') + (now.getMonth() + 1);
    const d = (now.getDate() < 9 ? '0' : '') + now.getDate();
    const orderDate = (now.getFullYear() - 2000).toString() + m + d;
    if (x === undefined) {
        orderID = orderDate + '0000';
    }
    else {
        let i = '' + (x.slice(6, 10) + 1);
        i = i == '10000' ? '0000' : i.padStart(4, '0');
        orderID = orderDate + i;
    }
    return orderID;
};
// 生成訂單 id
Tool.createOrderId = () => {
    const orderId = '#' + (0, moment_timezone_1.default)(new Date()).format('YYYYMMDD') + crypto_1.default.randomBytes(4).toString('hex');
    return orderId;
};
// 安全轉換至 JSON 的 String
Tool.toJSONSafeString = (val) => {
    return val.replace(/[\t\n\r]/g, (match) => {
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
// Compare Hash
Tool.compareHash = async (pwd, has) => bcrypt_1.default.compare(pwd, has);
// AES 解密
Tool.aesDecrypt = (data, key, iv, input = 'hex', output = 'utf-8', method = 'aes-256-cbc') => {
    while (key.length % 32 !== 0) {
        key += '\0';
    }
    while (iv.length % 16 !== 0) {
        iv += '\0';
    }
    const decipher = crypto_1.default.createDecipheriv(method, key, iv);
    let decrypted = decipher.update(data, input, output);
    try {
        decrypted += decipher.final(output);
    }
    catch (e) {
        e instanceof Error && console.log(e.message);
    }
    return decrypted;
};
// 驗證英文字母
Tool.containsEnglish = (input) => {
    const englishPattern = /[a-zA-Z]/;
    return englishPattern.test(input);
};
// 中英文姓氏名稱修正
Tool.formatUserName = (first_name, last_name) => {
    if (_a.containsEnglish(first_name) || _a.containsEnglish(last_name)) {
        return first_name + ' ' + last_name;
    }
    else if (last_name.length == 1 && first_name.length != 1) {
        return last_name + first_name;
    }
    return first_name + last_name;
};
// 因為資料庫為台灣時間，統一轉換成 ISO String
Tool.toIsoString = (date) => {
    date.setHours(date.getHours() - 8);
    return date.toISOString();
};
// 因為資料庫為台灣時間，統一轉換成 ISO Date
Tool.toIsoDate = (date) => {
    date.setHours(date.getHours() - 8);
    return date;
};
// 錯誤回報
Tool.errorCaller = (filename, error, logger) => {
    const path = `[${filename.split('src').pop()}]`;
    error instanceof Error && logger.error(path, error.message);
    console.error(error);
};
exports.default = Tool;
