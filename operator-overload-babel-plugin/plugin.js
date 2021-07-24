const path = 'operator-overload';

const operatorMap = {
  '!': { exportMethod: 'negate' },
  '&&': { exportMethod: 'and' },
  '||': { exportMethod: 'or' },
  '>': { exportMethod: 'greaterThan' },
  '>=': { exportMethod: 'greaterThanOrEqual' },
  '<': { exportMethod: 'lessThan' },
  '<=': { exportMethod: 'lessThanOrEqual' },
  '&&': { exportMethod: 'and' },
  '+': { exportMethod: 'addition' },
  '-': { exportMethod: 'subtract' },
  '*': { exportMethod: 'multiply' },
  '/': { exportMethod: 'divide' },
  '%': { exportMethod: 'mod' },
  '===': { exportMethod: 'strictEqual' },
  '!==': { exportMethod: 'strictNotEqual' },
  '==': { exportMethod: 'equal' },
  '!=': { exportMethod: 'notEqual' },
};

const isInOverloadedFunction = (path) => {
  let nextParent = path.parentPath;
  while(nextParent) {
    const { parent } = nextParent;
    const useOverload = parent.directives && parent.directives.some(
      ({ value }) => {
        return value.value === "use overload";
      }
    );
    if (useOverload) {
      return true;
    }
    nextParent = nextParent.parentPath;
  }
  return false;
}

const pluginVisitor = function(babel) {
    const { types: t } = babel;
    const binaryExpression = t.memberExpression(
      t.callExpression(t.identifier('require'), [t.stringLiteral(path)]),
      t.identifier("binary")
    );
    const unaryExpression = t.memberExpression(
      t.callExpression(t.identifier('require'), [t.stringLiteral(path)]),
      t.identifier("unary")
    );
    const conditionExpression = t.memberExpression(
      t.callExpression(t.identifier('require'), [t.stringLiteral(path)]),
      t.identifier("conditions")
    );
    return {
      visitor: {
        ConditionalExpression: (path) => {
          const { node } = path;
          if (isInOverloadedFunction(path)) {
            const ternaryMethod = t.memberExpression(
              conditionExpression,
              t.identifier('ternary'),
            );
            path.replaceWith(
              t.callExpression(
                ternaryMethod,
                [
                  node.test,
                  node.consequent,
                  node.alternate,
                ],
              )
            );
          }
        },
        UnaryExpression(path) {
          const { node } = path;
          if (isInOverloadedFunction(path)) {
            const unaryMethod = t.memberExpression(
              unaryExpression,
              t.identifier(operatorMap[node.operator].exportMethod),
            );
            path.replaceWith(
              t.callExpression(
                unaryMethod,
                [
                  node.argument,
                ],
              )
            );
          }
        },
        Binary: function(path) {
          const { node } = path;
          if (isInOverloadedFunction(path)) {
            const binaryMethod = t.memberExpression(
              binaryExpression,
              t.identifier(operatorMap[node.operator].exportMethod),
            );
            const isBinary = node.operator === "&&" || node.operator === "||";
            path.replaceWith(
              t.callExpression(
                binaryMethod,
                [
                  node.left,
                  isBinary ?
                    t.arrowFunctionExpression(
                      [],
                      t.blockStatement(
                        [t.returnStatement(node.right)]
                      )
                    ) :
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
              const additionMethod = t.memberExpression(binaryExpression, t.identifier(operatorMap['+'].exportMethod));
  
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

  module.exports = pluginVisitor;
