const { Observable } = require('rxjs');
require('../../operator-overload-array-extension/extension');
const { patch } = require('../../operator-overload-rxjs-extension/extension');

const observable = patch(new Observable(observer => {
    let n = 0;
    let timerId = setInterval(() => {
        observer.next(n++);
        return () => {
            clearTimeout(timerId);
        };
    }, 1000);
}));

const logObservable = (o) => {
    o.subscribe((value) => { console.log(value); });
} 

logObservable('log: ' + observable);
logObservable(observable + '.');
logObservable(`multiply by 5: ${observable * 5}`);
logObservable(`array entry ${observable + [1, 4]}`);
