const { curry } = require('lodash');
const { map } = require('rxjs/operators');
const {
 addition,
 subtract,
 multiply,
 divide,
 mod,
} = require('../operator-overload/lib/operators/binary');

const binaryOperation = (callback) => (left, right) => {
    if (left.subscribe) {
        const curried = (l) => callback(l, right);
        return patch(map(curried)(left));
    }
    if (right.subscribe) {
        return patch(map(curry(callback)(left))(right));
    }
    return Symbol.unhandledOperator;
}

const patch = (v) => {
    v[Symbol.addition] = binaryOperation(addition);
    v[Symbol.subtract] = binaryOperation(subtract);
    v[Symbol.multiply] = binaryOperation(multiply);
    v[Symbol.divide] = binaryOperation(divide);
    v[Symbol.mod] = binaryOperation(mod);
    return v;
};

module.exports = {
    patch,
};
