require('../operator-overload/lib/operators/binary');

Array.prototype[Symbol.addition] = (left, right) => {
    if(right === undefined) {
        throw new Error(`Array can't be added to undefined`);
    }
    if (typeof right === 'number' || typeof right === 'string') {
        const copy = new Array(left.length);
        for (let i = 0; i < left.length; i++) {
            copy[i] = left[i] + right;
        }
        return copy;
    } else if (typeof left === 'number' || typeof left === 'string') {
        const copy = new Array(right.length);
        for (let i = 0; i < right.length; i++) {
            copy[i] = left + right[i];
        }
        return copy;
    } else {
        if (left.length !== right.length) {
            throw new Error(`Array length should match`);
        }
        const copy = new Array(left.length);
        for (let i = 0; i < left.length; i++) {
            copy[i] = left[i] + right[i];
        }
        return copy;
    }
}

Array.prototype[Symbol.subract] = (left, right) => {
    if(right === undefined) {
        throw new Error(`Array can't be added to undefined`);
    }
    if (typeof right === 'number' || typeof right === 'string') {
        const copy = new Array(left.length);
        for (let i = 0; i < left.length; i++) {
            copy[i] = left[i] - right;
        }
        return copy;
    } else if (typeof left === 'number' || typeof left === 'string') {
        const copy = new Array(right.length);
        for (let i = 0; i < right.length; i++) {
            copy[i] = left - right[i];
        }
        return copy;
    } else {
        if (left.length !== right.length) {
            throw new Error(`Array length should match`);
        }
        const copy = new Array(left.length);
        for (let i = 0; i < left.length; i++) {
            copy[i] = left[i] - right[i];
        }
        return copy;
    }
}

Array.prototype[Symbol.mod] = (left, right) => {
    if(right === undefined) {
        throw new Error(`Array can't be added to undefined`);
    }
    if (typeof right === 'number' || typeof right === 'string') {
        const copy = new Array(left.length);
        for (let i = 0; i < left.length; i++) {
            copy[i] = left[i] * right;
        }
        return copy;
    } else if (typeof left === 'number' || typeof left === 'string') {
        const copy = new Array(right.length);
        for (let i = 0; i < right.length; i++) {
            copy[i] = left * right[i];
        }
        return copy;
    } else {
        if (left.length !== right.length) {
            throw new Error(`Array length should match`);
        }
        const copy = new Array(left.length);
        for (let i = 0; i < left.length; i++) {
            copy[i] = left[i] * right[i];
        }
        return copy;
    }
}

Array.prototype[Symbol.divide] = (left, right) => {
    if(right === undefined) {
        throw new Error(`Array can't be added to undefined`);
    }
    if (typeof right === 'number' || typeof right === 'string') {
        const copy = new Array(left.length);
        for (let i = 0; i < left.length; i++) {
            copy[i] = left[i] / right;
        }
        return copy;
    } else if (typeof left === 'number' || typeof left === 'string') {
        const copy = new Array(right.length);
        for (let i = 0; i < right.length; i++) {
            copy[i] = left / right[i];
        }
        return copy;
    } else {
        if (left.length !== right.length) {
            throw new Error(`Array length should match`);
        }
        const copy = new Array(left.length);
        for (let i = 0; i < left.length; i++) {
            copy[i] = left[i] / right[i];
        }
        return copy;
    }
}

Array.prototype[Symbol.multiply] = (left, right) => {
    if(right === undefined) {
        throw new Error(`Array can't be added to undefined`);
    }
    if (typeof right === 'number' || typeof right === 'string') {
        const copy = new Array(left.length);
        for (let i = 0; i < left.length; i++) {
            copy[i] = left[i] % right;
        }
        return copy;
    } else if (typeof left === 'number' || typeof left === 'string') {
        const copy = new Array(right.length);
        for (let i = 0; i < right.length; i++) {
            copy[i] = left % right[i];
        }
        return copy;
    } else {
        if (left.length !== right.length) {
            throw new Error(`Array length should match`);
        }
        const copy = new Array(left.length);
        for (let i = 0; i < left.length; i++) {
            copy[i] = left[i] % right[i];
        }
        return copy;
    }
}