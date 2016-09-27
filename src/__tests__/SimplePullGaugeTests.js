/* @flow */

import assert from 'assert';

import { SimplePullGauge as SimplePullGaugeT } from '../types.js';
import SimplePullGauge from '../SimplePullGauge.js';

class SimplePullGaugeTests {
  testSimplePullGauge() {
    const impl = new SimplePullGauge();
    const iface: SimplePullGaugeT = impl;
    const cb = () => 42;
    assert.equal(impl.cb, null);

    iface.setCallback(cb);
    assert.equal(impl.cb, cb);

    iface.resetCallback();
    assert.equal(impl.cb, null);
  }
}

export default SimplePullGaugeTests;
