const { curry } = require('lodash');
const { merge, combineLatest,concat, iif } = require('rxjs');
const { map, filter, skipUntil, mergeMap, withLatestFrom, takeLast, last } = require('rxjs/operators');
const {
 addition,
 subtract,
 multiply,
 divide,
 mod,
 strictEqual,
 strictNotEqual,
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

const conditionOperation = (condition, consequent, alternate) => {
    const trueCondition = filter(v => !!v)(condition);
    const falseCondition = filter(v => !v)(condition);
    return merge(
        withLatestFrom(consequent, (a, b) => b)(trueCondition),
        withLatestFrom(alternate, (a, b) => b)(falseCondition),
    );
}

const patch = (v) => {
    v[Symbol.addition] = binaryOperation(addition);
    v[Symbol.subtract] = binaryOperation(subtract);
    v[Symbol.multiply] = binaryOperation(multiply);
    v[Symbol.divide] = binaryOperation(divide);
    v[Symbol.mod] = binaryOperation(mod);
    v[Symbol.strictEqual] = binaryOperation(strictEqual);
    v[Symbol.strictNotEqual] = binaryOperation(strictNotEqual);
    v[Symbol.ternary] = conditionOperation;
    return v;
};

module.exports = {
    patch,
};
