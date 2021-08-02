const { BehaviorSubject } = require("rxjs");
const { map } = require("rxjs/operators");
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

test('compare observable to object', () => {
    "use overload"
    let a;
    const value = { foo: true };
    const subj = patch(new BehaviorSubject(value));
    const compare = value == subj;
    (compare).subscribe(v => {
        a = v;
    });
    expect(a).toBe(true);
});

test('strict equal should check instances', () => {
    "use overload"
    let a;
    const value = { foo: true };
    const subj = patch(new BehaviorSubject(value));
    const compare = value === subj;
    expect(compare).toBe(false);
});


test('sum observable with itself', () => {
    "use overload"
    const observable = patch(new BehaviorSubject(2));
    let a;
    (observable + observable).subscribe(v => {
        a = v;
    });
    expect(a).toBe(4);
});

describe("binary operations", () => {
    test('not observables', () => {
        "use overload"
        expect(false && true).toBe(false);
        expect(true && false).toBe(false);
        expect(true && true).toBe(true);
    });

    test('not observables', () => {
        "use overload"
        expect(false && true).toBe(false);
        expect(true && false).toBe(false);
        expect(true && true).toBe(true);
    });

    test('left not observable false', () => {
        "use overload"
        expect(false && patch(new BehaviorSubject(2))).toBe(false);
    });

    test('left not observable true', () => {
        "use overload"
        const obs = true && patch(new BehaviorSubject(2));
        let a;
        (obs).subscribe(v => {
            a = v;
        });
        expect(a).toBe(2);
    });

    test('right not observable false', () => {
        "use overload"
        const obs = patch(new BehaviorSubject(true)) && false;
        const a = [];
        (obs).subscribe(v => {
            a.push(v);
        });
        expect(a).toEqual([false]);
    });

    test('right not observable true', () => {
        "use overload"
        const subject = new BehaviorSubject(true);
        const obs = patch(subject) && true;
        const a = [];
        (obs).subscribe(v => {
            a.push(v);
        });
        subject.next(false);
        expect(a).toEqual([true, false]);
    });

    test('both observables', () => {
        "use overload"
        const a = patch(new BehaviorSubject(false));
        const b = patch(new BehaviorSubject(false));
        const expression = a && b;
        const results = [];
        (expression).subscribe(v => {
            results.push(v);
        });
        a.next(true);
        b.next(true);
        a.next(false);
        expect(results).toEqual([false, false, true, false]);
    });

    test('both observables or operator', () => {
        "use overload"
        const a = patch(new BehaviorSubject(false));
        const b = patch(new BehaviorSubject(false));
        const expression = a || b;
        const results = [];
        (expression).subscribe(v => {
            results.push(v);
        });
        b.next(true);
        a.next(true);
        b.next(false);
        a.next(false);
        expect(results).toEqual([false, true, true, false]);
    });

    test('should not fail when left pass from true to false', () => {
        "use overload"
        const a = patch(new BehaviorSubject({ name: "Mihas" }));
        const b = patch(a.pipe(map(({ name }) => name)));
        const expression = a && b;
        const results = [];
        (expression).subscribe(v => {
            results.push(v);
        });
        a.next(null);
        a.next({ name: "Miron" });
        expect(results).toEqual(["Mihas", null, "Miron"]);
    });
});