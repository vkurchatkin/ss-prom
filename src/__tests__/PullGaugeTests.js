/* @flow */

import assert from 'assert';

import type { PullGauge as PullGaugeT } from '../types.js';
import PullGauge from '../PullGauge.js';

class PullGaugeTests {
  testPullGaugeType() {
    // TODO
  }

   testSimple() {
    const impl = new PullGauge('foo', 'Foo PullGauge', []);
    const g: PullGaugeT<{}> = impl;

    g.setCallback({}, () => 42);

    const result = impl.collect();

    assert.deepEqual(result, [
      {
        name: 'foo',
        help: 'Foo PullGauge',
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
    const impl = new PullGauge('foo', 'Foo PullGauge', []);
    const g = impl.withLabels({});

    g.setCallback(() => 42);

    const result = impl.collect();

    assert.deepEqual(result, [
      {
        name: 'foo',
        help: 'Foo PullGauge',
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
    const impl = new PullGauge('foo', 'Foo PullGauge', ['foo']);
    const g: PullGaugeT<{ foo: string }> = impl;

    g.withLabels({ foo: 'bar' }).setCallback( () => 3);
    g.withLabels({ foo: 'baz' }).setCallback( () => 39);

    const result = impl.collect();

    assert.deepEqual(result, [
      {
        name: 'foo',
        help: 'Foo PullGauge',
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

   testResetAllCallbacks() {
    const impl = new PullGauge('foo', 'Foo PullGauge', ['foo']);
    const g: PullGaugeT<{ foo: string }> = impl;

    g.withLabels({ foo: 'bar' }).setCallback(() => 3);
    g.withLabels({ foo: 'baz' }).setCallback(() => 39);

    g.resetAllCallbacks();

    const result = impl.collect();

    assert.deepEqual(result, [
      {
        name: 'foo',
        help: 'Foo PullGauge',
        type: 'Gauge',
        samples: []
      }
    ]);
  }
}

export default PullGaugeTests;
