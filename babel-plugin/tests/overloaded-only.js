require('../../operator-overload-array-extension/extension');

// should not be overloaded
console.log('not overloaded: ' + [1, 2]);
console.log(`not overloaded: ${[1, 2]}`);
