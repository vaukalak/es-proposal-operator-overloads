Symbol.addition = Symbol('addition');
Symbol.subtract = Symbol('subtract');
Symbol.mod = Symbol('mod');
Symbol.divide = Symbol('divide');
Symbol.multiply = Symbol('multiply');
Symbol.strictEqual = Symbol('strictEqual');
Symbol.strictNotEqual = Symbol('strictNotEqual');

const primitives = new Set([
  'string',
  'number',
  'boolean',
]);

const createBinaryExpression = (s, defaultHandler) => (left, right) => {
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
  if (primitives.has(typeof left) && primitives.has(typeof right)) {
    return defaultHandler(left, right)
  }
  throw new Error(`${typeof left} ${left} doesn't support ${s.toString()} with ${typeof right} ${right}`);
};

module.exports = {
  addition: createBinaryExpression(Symbol.addition, (a, b) => a + b),
  subtract: createBinaryExpression(Symbol.subtract, (a, b) => a - b),
  multiply: createBinaryExpression(Symbol.multiply, (a, b) => a * b),
  divide: createBinaryExpression(Symbol.divide, (a, b) => a / b),
  mod: createBinaryExpression(Symbol.mod, (a, b) => a % b),
  strictEqual: createBinaryExpression(Symbol.strictEqual, (a, b) => a === b),
  strictNotEqual: createBinaryExpression(Symbol.strictNotEqual, (a, b) => a !== b),
};
