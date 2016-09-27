/* @flow */

import assert from 'assert';

import type { Counter as CounterT } from '../types.js';
import Counter from '../Counter.js';

class CounterTests {
  testCounterType() {
    // TODO
  }

  testSimple() {
    const impl = new Counter('foo', 'Foo counter', []);
    const c: CounterT<{}> = impl;

    c.inc({});
    c.inc({}, 1);
    c.inc({}, 2);
    c.inc({}, 38);

    const result = impl.collect();

    assert.deepEqual(result, [
      {
        name: 'foo',
        help: 'Foo counter',
        type: 'Counter',
        samples: [
          {
            labelNames: [],
            labelValues: [],
            name: 'foo',
            value: 42
          }
        ]
      }
    ]);
  }

  testSimpleChild() {
    const impl = new Counter('foo', 'Foo counter', []);
    const c = impl.withLabels({});

    c.inc();
    c.inc(1);
    c.inc(2);
    c.inc(38);

    const result = impl.collect();

    assert.deepEqual(result, [
      {
        name: 'foo',
        help: 'Foo counter',
        type: 'Counter',
        samples: [
          {
            labelNames: [],
            labelValues: [],
            name: 'foo',
            value: 42
          }
        ]
      }
    ]);
  }

  testChildren() {
    const impl = new Counter('foo', 'Foo counter', ['foo']);
    const c: CounterT<{ foo: string }> = impl;

    c.inc({ foo: 'bar' });
    c.inc({ foo: 'baz' }, 1);
    c.inc({ foo: 'bar' }, 2);
    c.inc({ foo: 'baz' }, 38);

    const result = impl.collect();

    assert.deepEqual(result, [
      {
        name: 'foo',
        help: 'Foo counter',
        type: 'Counter',
        samples: [
          {
            labelNames: ['foo'],
            labelValues: ['bar'],
            name: 'foo',
            value: 3
          },
          {
            labelNames: ['foo'],
            labelValues: ['baz'],
            name: 'foo',
            value: 39
          }
        ]
      }
    ]);
  }
}

export default CounterTests;
