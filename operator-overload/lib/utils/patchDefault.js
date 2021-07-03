const {
  createBinaryExpression,
  and,
  greaterThan,
  greaterThanOrEqual,
  lessThan,
  lessThanOrEqual,
  addition,
  subtract,
  multiply,
  divide,
  mod,
  strictEqual,
  primitives,
  strictNotEqual
} = require("../operators/binary");
const {
  createConditionExpression,
  ternary
} = require("../operators/conditions");

const binaryWithPrimitive = callback => (left, right) => {
    if (primitives.has(typeof left) || primitives.has(typeof right)) {
        return callback(left, right);
    }
    return Symbol.unhandledOperator;
};

const patchDefault = v => {
  // v[Symbol.ternary] = ternary;
  // // -------------
  v[Symbol.and] = binaryWithPrimitive(and.defaultHandler);
  // v[Symbol.greaterThan] = greaterThan;
  // v[Symbol.greaterThanOrEqual] = greaterThanOrEqual;
  // v[Symbol.lessThan] = lessThan;
  // v[Symbol.lessThanOrEqual] = lessThanOrEqual;
  // v[Symbol.addition] = addition;
  // v[Symbol.subtract] = subtract;
  // v[Symbol.multiply] = multiply;
  // v[Symbol.divide] = divide;
  // v[Symbol.mod] = mod;
  // v[Symbol.strictEqual] = strictEqual;
  // v[Symbol.strictNotEqual] = strictNotEqual;
  return v;
};

module.exports = {
  patchDefault
};
