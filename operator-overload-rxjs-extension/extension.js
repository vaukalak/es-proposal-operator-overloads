const { curry } = require('lodash');
const { merge, BehaviorSubject, of } = require("rxjs");
const { withLatestFrom, map, flatMap, filter, skipUntil, mergeMap, takeLatest, takeLast, last } = require('rxjs/operators');
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

const flatMapObservable = (o) => {
    return o.pipe(
        flatMap(i => i)
    )
    // if (o.subscribe) {
    //     return o.pipe(
    //         flatMap(i => i)
    //     )
    // }
    // return o;
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
    return merge(
        withLatestFrom(consequentObservable, (a, b) => b)(trueCondition),
        withLatestFrom(alternateObservable, (a, b) => b)(falseCondition),
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
