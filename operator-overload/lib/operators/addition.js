Symbol.addition = Symbol('addition');

module.exports = {
  addition: (left, right) => {
    if (left && left[Symbol.addition]) {
        const result = left[Symbol.addition](left, right);
        if (result !== Symbol.unhandledOperator) {
            return result;
        }
    }
    if (right && right[Symbol.addition]) {
        const result = right[Symbol.addition](left, right);
        if (result !== Symbol.unhandledOperator) {
            return result;
        }
    }
    throw new Error(`${typeof left} doesn't support sum with ${typeof right}`);
  },
};
