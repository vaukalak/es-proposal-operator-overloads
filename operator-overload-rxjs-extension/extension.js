const { merge, of, combineLatest } = require("rxjs");
const { withLatestFrom, map, switchMap, filter } = require('rxjs/operators');
const {
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
    v[Symbol.and] = andOperation();
    v[Symbol.or] = orOperation();
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
        return patch(map(callback)(argument));
    }
    return Symbol.unhandledOperator;
};

const orOperation = () => (left, right) => {
    const isLeftObservable = left.subscribe;
    
    if (!isLeftObservable) {
        if (left) {
            return left;
        }
        const rightValue = right(); 
        if (rightValue.subscribe) {
            return left || patch(map((r) => left || r)(rightValue));
        }
        return Symbol.unhandledOperator;
    }
    return patch(left.pipe(
        switchMap(
            (leftValue) => {
                if (leftValue) {
                    return of(leftValue);
                }
                const rightUnwrapped = right();
                if (rightUnwrapped.subscribe) {
                    return map((r) => {
                        return leftValue || r;
                    })(rightUnwrapped);
                }
                return of(leftValue || rightUnwrapped);
            }
        )
    ));
};

const andOperation = () => (left, right) => {
    const isLeftObservable = left.subscribe;
    
    if (!isLeftObservable) {
        if (!left) {
            return false;
        }
        const rightValue = right(); 
        if (rightValue.subscribe) {
            return left && patch(map((r) => left && r)(rightValue));
        }
        return Symbol.unhandledOperator;
    }
    let rightUnwrapped;
    return patch(left.pipe(
        switchMap(
            (leftValue) => {
                if (!leftValue) {
                    return of(leftValue);
                }
                if (!rightUnwrapped) {
                  rightUnwrapped = right();
                }
                if (rightUnwrapped.subscribe) {
                    return rightUnwrapped.pipe(
                        map((r) => {
                            return leftValue && r;
                        })
                    );
                }                
                return of(leftValue && rightUnwrapped);
            }
        )
    ));
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
