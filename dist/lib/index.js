"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.ReverseString = void 0;
exports.ReverseString = (val) => {
    return val.split('').reverse().join('');
};
class User {
    constructor(_uObj) {
        this.userObj = _uObj;
    }
    show() {
        console.log('user is', this.userObj);
    }
}
exports.User = User;
