const binaryOperatorPath = '../../operator-overload/lib/operators/binary';

const operatorMap = {
  '+': { exportMethod: 'addition' },
  '-': { exportMethod: 'subtract' },
  '*': { exportMethod: 'multiply' },
  '/': { exportMethod: 'divide' },
  '%': { exportMethod: 'mod' },
};

const isInOverloadedFunction = (path) => {
  let nextParent = path.parentPath;
  while(nextParent) {
    if (nextParent.node.type === 'ArrowFunctionExpression') {
      break;
    }
    nextParent = nextParent.parentPath;
  }
  return nextParent && nextParent.parent && nextParent.parent.id.name.indexOf('overloaded_') === 0;
}

module.exports = function({ types: t }) {
    const requireExpression = t.callExpression(t.identifier('require'), [t.stringLiteral(binaryOperatorPath)]);
    return {
      visitor: {
        // ArrowFunctionExpression: (path) => {
        //   console.log(1);
        // },
        BinaryExpression: function(path) {
          const { node } = path;
          if (isInOverloadedFunction(path)) {
            const additionMethod = t.memberExpression(
              requireExpression,
              t.identifier(operatorMap[node.operator].exportMethod),
            );
            path.replaceWith(
              t.callExpression(
                additionMethod,
                [
                  node.left,
                  node.right,
                ],
              )
            );
          }
        },
        TemplateLiteral: function(path) {
          if (isInOverloadedFunction(path)) {
            const expressions = path.get("expressions");
            const [firstQuasis, ...quasis] = path.node.quasis;
            let index = 0;
            let cummulative = t.stringLiteral(firstQuasis.value.cooked);
            for (const elem of quasis) {
              const additionMethod = t.memberExpression(requireExpression, t.identifier(operatorMap['+'].exportMethod));
  
              if (index < expressions.length) {
                cummulative = t.callExpression(
                  additionMethod,
                  [
                    cummulative,
                    expressions[index].node,
                  ],
                )
              }
              cummulative = t.callExpression(
                additionMethod,
                [
                  cummulative,
                  t.stringLiteral(elem.value.cooked),
                ],
              );
              index++;
            }
            path.replaceWith(cummulative);
          }
        },
      }
    };
  };