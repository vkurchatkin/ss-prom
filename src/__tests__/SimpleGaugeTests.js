/* @flow */

import assert from 'assert';

import { SimpleGauge as SimpleGaugeT } from '../types.js';
import SimpleGauge from '../SimpleGauge.js';

class SimpleGaugeTests {
  testSimpleGauge() {
    const impl = new SimpleGauge();
    const iface: SimpleGaugeT = impl;

    assert.equal(impl.val, 0);
    iface.set(42);
    assert.equal(impl.val, 42);
    iface.inc();
    assert.equal(impl.val, 43);
    iface.dec();
    assert.equal(impl.val, 42);
    iface.inc(100);
    assert.equal(impl.val, 142);
    iface.dec(30);
    assert.equal(impl.val, 112);
  }
}

export default SimpleGaugeTests;
