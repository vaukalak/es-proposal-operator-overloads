const { interval } = require('rxjs');
require('../../operator-overload-array-extension/extension');
const { patch } = require('../../operator-overload-rxjs-extension/extension');

const observable = patch(interval(1000));

const logObservable = (o) => {
    o.subscribe((value) => { console.log(value); });
} 

const overloaded_observableTest = () => {
    logObservable('log: ' + observable);
    logObservable(observable + '.');
    logObservable(`multiply by 5: ${observable * 5}`);
    logObservable(`array entry ${observable + [1, 4]}`);
    logObservable(
        observable % 2 ?
          `odd: ${observable}` :
          `multiple of 4: ${observable % 4 === 0}`
      );
};

overloaded_observableTest();
