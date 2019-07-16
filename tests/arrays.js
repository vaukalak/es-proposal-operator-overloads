require('../../operator-overload-array-extension/extension');

// 5 + 2 * 1 / 3 + 4;
console.log([5, 3] + [2, 1]);
console.log([5, 3] + 1);
console.log([5, 3] + 'px');
console.log(`size-${[5, 3]}px`);