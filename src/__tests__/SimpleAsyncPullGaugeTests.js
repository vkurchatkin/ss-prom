/* @flow */

import assert from 'assert';

import { SimpleAsyncPullGauge as SimpleAsyncPullGaugeT } from '../types.js';
import SimpleAsyncPullGauge from '../SimpleAsyncPullGauge.js';

class SimpleAsyncPullGaugeTests {
  testSimpleAsyncPullGauge() {
    const impl = new SimpleAsyncPullGauge();
    const iface: SimpleAsyncPullGaugeT = impl;
    const cb = () => Promise.resolve(42);
    assert.equal(impl.cb, null);

    iface.setCallback(cb);
    assert.equal(impl.cb, cb);

    iface.resetCallback();
    assert.equal(impl.cb, null);
  }
}

export default SimpleAsyncPullGaugeTests;
