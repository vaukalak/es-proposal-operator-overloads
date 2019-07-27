Symbol.addition = Symbol('addition');
Symbol.subtract = Symbol('subtract');
Symbol.mod = Symbol('mod');
Symbol.divide = Symbol('divide');
Symbol.multiply = Symbol('multiply');

const createBinaryExpression = (s) => (left, right) => {
  if (left && left[s]) {
      const result = left[s](left, right);
      if (result !== Symbol.unhandledOperator) {
          return result;
      }
  }
  if (right && right[s]) {
      const result = right[s](left, right);
      if (result !== Symbol.unhandledOperator) {
          return result;
      }
  }
  throw new Error(`${typeof left} doesn't support ${s.toString()} with ${typeof right}`);
};

module.exports = {
  addition: createBinaryExpression(Symbol.addition),
  subtract: createBinaryExpression(Symbol.subtract),
  multiply: createBinaryExpression(Symbol.multiply),
  divide: createBinaryExpression(Symbol.divide),
  mod: createBinaryExpression(Symbol.mod),
};
