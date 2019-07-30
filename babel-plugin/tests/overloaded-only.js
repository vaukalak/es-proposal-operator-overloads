require('../../operator-overload-array-extension/extension');

// should not be overloaded
const notOverloaded = () => {
    console.log('not overloaded: ' + [1, 2]);
}

// should not be overloaded
console.log('not overloaded: ' + [1, 2]);
console.log(`not overloaded: ${[1, 2]}`);

const overloaded_test = () => {
    console.log('overloaded: ' + [1, 2]);
}


notOverloaded();
overloaded_test();