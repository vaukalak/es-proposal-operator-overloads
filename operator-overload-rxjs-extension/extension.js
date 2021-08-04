const { of } = require("rxjs");
const { map, switchMap } = require('rxjs/operators');
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
    // console.log("orOperation!!!");
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
    let rightUnwrapped;
    return patch(left.pipe(
        switchMap(
            (leftValue) => {
                // console.log(">>> leftValue:", leftValue);
                if (leftValue) {
                    rightUnwrapped = undefined;
                    return of(leftValue);
                }
                if (!rightUnwrapped) {
                    // console.log("unwrapping right!");
                    rightUnwrapped = right();
                }
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
    // console.log("andOperation!!!");
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
                    rightUnwrapped = undefined;
                    return of(leftValue);
                }
                if (!rightUnwrapped) {
                //   console.log("unwrapping and right!");
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
        return patch(left.pipe(
            switchMap(
                (leftValue) => {
                    return right.pipe(
                        map(rightValue => callback(leftValue, rightValue))
                    );
                }
            )
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

const ensureObservable = (observable) => {
    if (observable === undefined || observable === null || !observable.subscribe) {
        return of(observable);
    }
    return observable;
}

const conditionOperation = (condition, consequent, alternate) => {

    const isConditionObservable = condition !== undefined && condition !== null && condition.subscribe;
    
    if (!isConditionObservable) {
        return condition ?
            patch(ensureObservable(consequent())) :
            patch(ensureObservable(alternate()));
    }
    let alternateUnwrapped;
    let consequentUnwrapped;
    return patch(condition.pipe(
        switchMap(
            (conditionValue) => {
                if (conditionValue) {
                    alternateUnwrapped = undefined;
                    if (!consequentUnwrapped) {
                        consequentUnwrapped = ensureObservable(consequent());
                    }
                    return ensureObservable(consequentUnwrapped);
                }

                consequentUnwrapped = undefined;
                if (!alternateUnwrapped) {
                    alternateUnwrapped = ensureObservable(alternate());
                }
                return ensureObservable(alternateUnwrapped);
            }
        )
    ));
}

module.exports = {
    patch,
};
