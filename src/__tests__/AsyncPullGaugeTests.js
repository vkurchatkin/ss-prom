/* @flow */

import assert from 'assert';

import type { AsyncPullGauge as AsyncPullGaugeT } from '../types.js';
import AsyncPullGauge from '../AsyncPullGauge.js';

class AsyncPullGaugeTests {
  testAsyncPullGaugeType() {
    // TODO
  }

  async testSimple() {
    const impl = new AsyncPullGauge('foo', 'Foo AsyncPullGauge', []);
    const g: AsyncPullGaugeT<{}> = impl;

    g.setCallback({}, async () => 42);

    const result = await impl.collect();

    assert.deepEqual(result, [
      {
        name: 'foo',
        help: 'Foo AsyncPullGauge',
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

  async testSimpleChild() {
    const impl = new AsyncPullGauge('foo', 'Foo AsyncPullGauge', []);
    const g = impl.withLabels({});

    g.setCallback(async () => 42);

    const result = await impl.collect();

    assert.deepEqual(result, [
      {
        name: 'foo',
        help: 'Foo AsyncPullGauge',
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

  async testChildren() {
    const impl = new AsyncPullGauge('foo', 'Foo AsyncPullGauge', ['foo']);
    const g: AsyncPullGaugeT<{ foo: string }> = impl;

    g.withLabels({ foo: 'bar' }).setCallback(async () => 3);
    g.withLabels({ foo: 'baz' }).setCallback(async () => 39);

    const result = await impl.collect();

    assert.deepEqual(result, [
      {
        name: 'foo',
        help: 'Foo AsyncPullGauge',
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

  async testResetAllCallbacks() {
    const impl = new AsyncPullGauge('foo', 'Foo AsyncPullGauge', ['foo']);
    const g: AsyncPullGaugeT<{ foo: string }> = impl;

    g.withLabels({ foo: 'bar' }).setCallback(async () => 3);
    g.withLabels({ foo: 'baz' }).setCallback(async () => 39);

    g.resetAllCallbacks();

    const result = await impl.collect();

    assert.deepEqual(result, [
      {
        name: 'foo',
        help: 'Foo AsyncPullGauge',
        type: 'Gauge',
        samples: []
      }
    ]);
  }
}

export default AsyncPullGaugeTests;
