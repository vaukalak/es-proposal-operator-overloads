const { curry } = require('lodash');
const { merge, of, combineLatest } = require("rxjs");
const { withLatestFrom, map, filter } = require('rxjs/operators');
const {
 addition,
 subtract,
 multiply,
 divide,
 mod,
 strictEqual,
 strictNotEqual,
} = require('operator-overload/lib/operators/binary');

const binaryOperation = (callback) => (left, right) => {
    if (left.subscribe && right.subscribe) {
        return patch(combineLatest(
            left,
            right,
            callback,
        ));
    }
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
    const consequentObservable = consequent.subscribe
        ? consequent
        : of(consequent);
    const alternateObservable = alternate.subscribe
        ? alternate
        : of(alternate);
    const trueCondition = filter(v => !!v)(condition);
    const falseCondition = filter(v => !v)(condition);
    return patch(merge(
        withLatestFrom(consequentObservable, (a, b) => b)(trueCondition),
        withLatestFrom(alternateObservable, (a, b) => b)(falseCondition),
    ));
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
