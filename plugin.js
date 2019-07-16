const pathNode = '../../operator-overload/lib/operators/addition';

module.exports = function({ types: t }) {
    return {
      visitor: {
        BinaryExpression: function(path) {
          const additionRequire = t.callExpression(t.identifier('require'), [t.stringLiteral(pathNode)]);
          const additionMethod = t.memberExpression(additionRequire, t.identifier("addition"));
          path.replaceWith(
            t.callExpression(
              additionMethod,
              [
                path.node.left,
                path.node.right,
              ],
            )
          );
        },
        TemplateLiteral: function(path) {
          const expressions = path.get("expressions");
          // console.log('expressions: ', expressions[0].node);
          const [firstQuasis, ...quasis] = path.node.quasis;
          let index = 0;
          let cummulative = t.stringLiteral(firstQuasis.value.cooked);
          for (const elem of quasis) {
            const additionRequire = t.callExpression(t.identifier('require'), [t.stringLiteral(pathNode)]);
            const additionMethod = t.memberExpression(additionRequire, t.identifier("addition"));

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
        },
      }
    };
  };