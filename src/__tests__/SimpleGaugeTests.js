/* @flow */

import assert from 'assert';

import { SimpleGauge as SimpleGaugeT } from '../types.js';
import SimpleGauge from '../SimpleGauge.js';

class SimpleGaugeTests {
  testSimpleGauge() {
    const impl = new SimpleGauge();
    const iface: SimpleGaugeT = impl;

    assert(isNaN(impl.val));
    iface.set(42)
    assert.equal(impl.val, 42);
  }
}

export default SimpleGaugeTests;
