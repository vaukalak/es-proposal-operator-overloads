const { curry } = require('lodash');
const { merge, of, combineLatest } = require("rxjs");
const { withLatestFrom, map, filter } = require('rxjs/operators');
const {
 and,
 or,
 greaterThan,    
 greaterThanOrEqual, 
 lessThan,   
 lessThanOrEqual,    
 addition,
 subtract,
 multiply,
 divide,
 mod,
 equal,
 notEqual,
} = require('operator-overload/lib/operators/binary');
const {
    negate,
} = require('operator-overload/lib/operators/unary');

const patch = (v) => {
    v[Symbol.negate] = unaryOperation(negate);
    v[Symbol.and] = binaryOperation(and);
    v[Symbol.or] = binaryOperation(or);
    v[Symbol.greaterThan] = binaryOperation(greaterThan);
    v[Symbol.greaterThanOrEqual] = binaryOperation(greaterThanOrEqual);
    v[Symbol.lessThan] = binaryOperation(lessThan);
    v[Symbol.lessThanOrEqual] = binaryOperation(lessThanOrEqual);
    v[Symbol.addition] = binaryOperation(addition);
    v[Symbol.subtract] = binaryOperation(subtract);
    v[Symbol.multiply] = binaryOperation(multiply);
    v[Symbol.divide] = binaryOperation(divide);
    v[Symbol.mod] = binaryOperation(mod);
    v[Symbol.equal] = binaryOperation(equal);
    v[Symbol.notEqual] = binaryOperation(notEqual);
    // v[Symbol.strictEqual] = binaryOperation(strictEqual);
    // v[Symbol.strictNotEqual] = binaryOperation(strictNotEqual);
    v[Symbol.ternary] = conditionOperation;
    v["__isPatchedObservable"] = true;
    return v;
};

const unaryOperation = (callback) => (argument) => {
    if (argument.subscribe) {
        return patch(argument.pipe(map(callback)));
    }
    return Symbol.unhandledOperator;
};

const binaryOperation = (callback) => (left, right) => {
    if (left.subscribe && right.subscribe) {
        return patch(combineLatest(
            left,
            right,
            callback,
        ));
    }
    if (left.subscribe) {
        const rightCurried = (l) => {
            return callback(l, right);
        };
        return patch(map(rightCurried)(left));
    }
    if (right.subscribe) {
        const leftCurried = (r) => {
            return callback(left, r);
        };
        return patch(map(leftCurried)(right));
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

module.exports = {
    patch,
};
