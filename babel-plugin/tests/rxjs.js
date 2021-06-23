const { interval } = require('rxjs');
const { tap } = require('rxjs/operators');
require('../../operator-overload-array-extension/extension');
const { patch } = require('../../operator-overload-rxjs-extension/extension');

const observable = patch(interval(1000));

const log = (o) => {
    o.subscribe((value) => { console.log(value); });
} 

const overloaded_observableTest = () => {
    "use overload";
    log(observable === 0 ? "START:" : "******");
    log('value: ' + observable);
    log(observable + '.');
    log(`multiply by 5: ${observable * 5}`);
    log(`array entry ${observable + [1, 4]}`);
    log(
      observable % 2 ?
        `odd: ${observable}` :
        `multiple of 4: ${observable % 4 === 0}`
    );
};

overloaded_observableTest();
