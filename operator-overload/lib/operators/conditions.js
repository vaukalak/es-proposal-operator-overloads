require("../symbols");


const createConditionExpression = (s, defaultHandler) => (condition, left, right) => {
  if (condition[s]) {
    return condition[s](condition, left, right)
  }
  return defaultHandler(condition, left, right);
};

module.exports = {
  createConditionExpression,
  ternary: createConditionExpression(Symbol.ternary, (condition, a, b) => {
      if(condition) {
          return a();
      } else {
        if (b) {
          return b();
        }
      }
  }),
};
