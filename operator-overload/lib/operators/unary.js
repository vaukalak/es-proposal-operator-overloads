require("../symbols");
const binary = require("./binary");

const { primitives } = binary;

const createUnaryExpression = (s, defaultHandler) => {
    const expression = (value) => {
      if (value && value[s]) {
          const result = value[s](value);
          if (result !== Symbol.unhandledOperator) {
              return result;
          }
      }
      if (primitives.has(typeof value)) {
        return defaultHandler(value)
      }
    };
    expression.defaultHandler = defaultHandler;
    return expression;
  };

module.exports = {
    createUnaryExpression,
    negate: createUnaryExpression(Symbol.negate, (v) => !v),
  };
  