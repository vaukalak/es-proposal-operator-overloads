require("../symbols");

const primitives = new Set([
  'string',
  'number',
  'boolean',
]);

const nativeBinaryExpression = (s, handler) =>
  handler;

const createBinaryExpression = (s, defaultHandler) => {
  const expression = (left, right) => {
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
  expression.defaultHandler = defaultHandler;
  return expression;
};

module.exports = {
  primitives,
  createBinaryExpression,
  nativeBinaryExpression,
  or: createBinaryExpression(Symbol.or, (a, b) => a || b),
  and: createBinaryExpression(Symbol.and, (a, b) => a && b),
  greaterThan: createBinaryExpression(Symbol.greaterThan, (a, b) => a > b),
  greaterThanOrEqual: createBinaryExpression(Symbol.greaterThanOrEqual, (a, b) => a >= b),
  lessThan: createBinaryExpression(Symbol.lessThan, (a, b) => a < b),
  lessThanOrEqual: createBinaryExpression(Symbol.lessThanOrEqual, (a, b) => a <= b),
  addition: createBinaryExpression(Symbol.addition, (a, b) => a + b),
  subtract: createBinaryExpression(Symbol.subtract, (a, b) => a - b),
  multiply: createBinaryExpression(Symbol.multiply, (a, b) => a * b),
  divide: createBinaryExpression(Symbol.divide, (a, b) => a / b),
  mod: createBinaryExpression(Symbol.mod, (a, b) => a % b),
  equal: nativeBinaryExpression(Symbol.equal, (a, b) => a == b),
  notEqual: nativeBinaryExpression(Symbol.notEqual, (a, b) => a != b),
  strictEqual: nativeBinaryExpression(Symbol.strictEqual, (a, b) => a === b),
  strictNotEqual: nativeBinaryExpression(Symbol.strictNotEqual, (a, b) => a !== b),
};
