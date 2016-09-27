/* @flow */

import assert from 'assert';

import { SimpleCounter as SimpleCounterT } from '../types.js';
import SimpleCounter from '../SimpleCounter.js';

class SimpleCounterTests {
  testSimpleCounter() {
    const impl = new SimpleCounter();
    const iface: SimpleCounterT = impl;

    assert.equal(impl.val, 0);
    iface.inc();
    assert.equal(impl.val, 1);
    iface.inc(41);
    assert.equal(impl.val, 42);
  }
}

export default SimpleCounterTests;
