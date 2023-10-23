"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Tool {
}
// 確認方法載入成功
Tool.waitLoadModule = (name, event, timeout, msg) => {
    let t = timeout && timeout > 500 ? timeout : 500;
    window.siArray === undefined && (window.siArray = []);
    const n = window.siArray.length;
    window.siArray.push({
        n: n,
        e: setInterval(() => {
            if (window[name]) {
                event();
                msg && console.log(`${name} load finish`);
                clearInterval(window.siArray[n].e);
            }
            else {
                msg && console.log(`Waiting for ${name}...`);
            }
        }, t),
    });
};
// 千分位
Tool.addQuantile = (num) => {
    if (typeof num !== 'number')
        return num;
    let result = [];
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
Tool.isUNO = (value) => {
    if (value === undefined ||
        value === null ||
        value === 'undefined' ||
        value === 'null' ||
        value === 0 ||
        value.length === 0 ||
        (typeof value === 'object' && Object.keys(value).length === 0)) {
        return true;
    }
    else {
        return false;
    }
};
// 驗證英文字母
Tool.containsEnglish = (input) => {
    const englishPattern = /[a-zA-Z]/;
    return englishPattern.test(input);
};
// 中英文姓氏名稱修正
Tool.formatUserName = (first_name, last_name) => {
    if (Tool.containsEnglish(first_name) || Tool.containsEnglish(last_name)) {
        return first_name + ' ' + last_name;
    }
    else if (last_name.length == 1 && first_name.length != 1) {
        return last_name + first_name;
    }
    return first_name + last_name;
};
exports.default = Tool;
