/* @flow */

import assert from 'assert';

import type { Gauge as GaugeT } from '../types.js';
import Gauge from '../Gauge.js';

class GaugeTests {
  testSimple() {
    const impl = new Gauge('foo', 'Foo gauge', []);
    const g: GaugeT<{}> = impl;

    g.set({}, 4);
    g.inc({}, 39);
    g.dec({});

    const result = impl.collect();

    assert.deepEqual(result, [
      {
        name: 'foo',
        help: 'Foo gauge',
        type: 'Gauge',
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
    const impl = new Gauge('foo', 'Foo Gauge', []);
    const g = impl.withLabels({});

    g.set(42);

    const result = impl.collect();

    assert.deepEqual(result, [
      {
        name: 'foo',
        help: 'Foo Gauge',
        type: 'Gauge',
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
    const impl = new Gauge('foo', 'Foo Gauge', ['foo']);
    const g: GaugeT<{ foo: string }> = impl;

    g.withLabels({ foo: 'bar' }).set(3);
    g.withLabels({ foo: 'baz' }).set(39);

    const result = impl.collect();

    assert.deepEqual(result, [
      {
        name: 'foo',
        help: 'Foo Gauge',
        type: 'Gauge',
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

export default GaugeTests;
