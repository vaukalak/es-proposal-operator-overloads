const { BehaviorSubject } = require("rxjs");
const { patch } = require("./extension");

test('sum observable with number', () => {
    "use overload"
    let a;
    (patch(new BehaviorSubject(2)) + 1).subscribe(v => {
        a = v;
    });
    expect(a).toBe(3);
});

test('sum observable with observable', () => {
    "use overload"
    let a;
    (patch(new BehaviorSubject(2)) + patch(new BehaviorSubject(1))).subscribe(v => {
        a = v;
    });
    expect(a).toBe(3);
});

test('sum observable with itself', () => {
    "use overload"
    let a;
    const observable = patch(new BehaviorSubject(2));
    (observable + observable).subscribe(v => {
        a = v;
    });
    expect(a).toBe(4);
});