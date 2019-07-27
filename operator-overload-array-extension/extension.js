require('../operator-overload/lib/operators/binary');

const binaryOperation = (callback) => (left, right) => {
    if(right === undefined) {
        throw new Error(`Can't perform binary operation on Array and undefined`);
    }
    if (typeof right === 'number' || typeof right === 'string') {
        const copy = new Array(left.length);
        for (let i = 0; i < left.length; i++) {
            copy[i] = callback(left[i], right);
        }
        return copy;
    } else if (typeof left === 'number' || typeof left === 'string') {
        const copy = new Array(right.length);
        for (let i = 0; i < right.length; i++) {
            copy[i] = callback(left, right[i]);
        }
        return copy;
    } else {
        if (left.length !== right.length) {
            throw new Error(`Array length should match`);
        }
        const copy = new Array(left.length);
        for (let i = 0; i < left.length; i++) {
            copy[i] = callback(left[i], right[i]);
        }
        return copy;
    }
}

Array.prototype[Symbol.addition] = binaryOperation((a, b) => a + b);
Array.prototype[Symbol.subtract] = binaryOperation((a, b) => a - b);
Array.prototype[Symbol.multiply] = binaryOperation((a, b) => a * b);
Array.prototype[Symbol.divide] = binaryOperation((a, b) => a / b);
Array.prototype[Symbol.mod] = binaryOperation((a, b) => a % b);