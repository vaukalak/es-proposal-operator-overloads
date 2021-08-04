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
    const left = patch(new BehaviorSubject(2));
    const right = patch(new BehaviorSubject(1));
    (left + right).subscribe(v => {
        a = v;
    });
    expect(a).toBe(3);
    left.next(3);
    expect(a).toBe(4);
    right.next(3);
    expect(a).toBe(6);
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

describe("ternary operator", () => {
    test("observable condition", () => {
        "use overload"
        const condition = patch(new BehaviorSubject(false));
        let a;
        (condition ? 1 : 2).subscribe(v => {
            a = v;
        });
        expect(a).toBe(2);
        condition.next(true);
        expect(a).toBe(1);
        condition.next(false);
        expect(a).toBe(2);
    });

    test("observable left", () => {
        "use overload"
        const left = patch(new BehaviorSubject(1));
        let a;
        (true ? left : 0).subscribe(v => {
            a = v;
        });
        expect(a).toBe(1);
        left.next(2);
        expect(a).toBe(2);
        left.next(3);
        expect(a).toBe(3);
    });

    test("observable right", () => {
        "use overload"
        const right = patch(new BehaviorSubject(1));
        let a;
        (false ? 0 : right).subscribe(v => {
            a = v;
        });
        expect(a).toBe(1);
        right.next(2);
        expect(a).toBe(2);
        right.next(1);
        expect(a).toBe(1);
    });

    test("all observables", () => {
        "use overload"
        const condition = patch(new BehaviorSubject(false));
        const consequent = patch(new BehaviorSubject(1));
        const alternate = patch(new BehaviorSubject(10));
        let a;
        (condition ? consequent : alternate).subscribe(v => {
            a = v;
        });
        expect(a).toBe(10);
        alternate.next(11);
        expect(a).toBe(11);
        condition.next(true);
        expect(a).toBe(1);
        consequent.next(2);
        expect(a).toBe(2);
        alternate.next(12);
        expect(a).toBe(2);
        condition.next(false);
        expect(a).toBe(12);
    });
});

describe("logical operations", () => {
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