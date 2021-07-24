const { interval } = require('rxjs');
const { tap, map } = require('rxjs/operators');
// require('../../operator-overload-array-extension/extension');
const { patch } = require('operator-overload-rxjs-extension/extension');

const observable = patch(interval(1000));
// const observable = `${}`;

const log = (o) => {
    o.subscribe((value) => { console.log(value); });
} 

const overloaded_equal = () => {
    "use overload";
    const value = { foo: true };
    const subj = patch(new BehaviorSubject(value));
    console.log(">>> subj:", subj);
    console.log(">>> value:", value);
    console.log(">>> eq:", subj == value);
}

const overloaded_observableTest = () => {
    "use overload";
    // console.log(">>> a:", require("operator-overload"));
    // log(observable !== 1 && observable !== 3);
    // log("abc" + (observable !== 1));
    log((observable !== 1) + "abc");
    log(!(observable !== 1) + "dfc");
    observable && 1
    // log(!observable);
    // log((observable !== 1) + "dfc");
    // log(observable === 0 ? "START:" : "******");
    // log('value: ' + observable);
    // log("sum:" + (observable + observable));
    // log(observable + '.');
    // log(`multiply by 5: ${observable * 5}`);
    // // log(`array entry ${observable + [1, 4]}`);
    // log(
    //   observable % 2 ?
    //     `odd: ${observable}` :
    //     `multiple of 4: ${observable % 4 === 0}`
    // );
};

overloaded_observableTest();
