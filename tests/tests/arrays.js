"use overload";
require('../../operator-overload-array-extension/extension');

const overloaded_arrayTest = () => {
    console.log([5, 3] - 1); // [ 4, 2 ]
    console.log([5, 3] * 2); // [ 10, 6 ]
    console.log([5, 3] / 2); // [ 2.5, 1.5 ]
    console.log([5, 2] % 2); // [ 1, 0 ]
    console.log([5, 3] + [2, 1]); // [ 7, 4 ]
    console.log([5, 3] + 1); // [ 6, 4 ]
    console.log([5, 3] + 'px'); // [ '5px', '3px' ]
    console.log(`size-${[5, 3]}px`); // [ 'size-5px', 'size-3px' ]
};

overloaded_arrayTest();