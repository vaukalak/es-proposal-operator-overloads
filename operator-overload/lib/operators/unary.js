require("../symbols");
const binary = require("./binary");

// console.log(">>> binary:", binary);
const { primitives } = binary;

const createUnaryExpression = (s, defaultHandler) => {
    const expression = (value) => {
      if (value && value[s]) {
          const result = value[s](value);
          if (result !== Symbol.unhandledOperator) {
              return result;
          }
      }
      console.log(">>> s:", s);
      console.log(">>> primitives:", primitives);
      console.log(">>> value:", value);
      console.log(">>> value[s]:", value[s]);
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
  