/* @flow */

import assert from 'assert';

import {
  createLabelsHash,
  createLabelValues,
  labelValueToString,
  numberToString
} from '../util.js';

class UtilTests {
  testNumberToString() {
    const testCases = [
      [32, '32'],
      [NaN, 'NaN'],
      [Infinity, '+Inf'],
      [-Infinity, '-Inf']
    ];

    for (const testCase of testCases) {
      const [input, expected] = testCase;
      assert.equal(numberToString(input), expected);
    }
  }

  testLabelValueToString() {
    const testCases = [
      [false, 'false'],
      [true, 'true'],
      [32, '32'],
      [NaN, 'NaN'],
      ['foo', 'foo'],
      [Infinity, '+Inf']
    ];

    for (const testCase of testCases) {
      const [input, expected] = testCase;
      assert.equal(labelValueToString(input), expected);
    }
  }

  testCreateLabelValues() {
    const labelNames = ['foo', 'baz', 'bar'];
    const labelValues = createLabelValues(labelNames, {
      baz: false,
      foo: 42,
      bar: 'xxx'
    });

    assert.deepEqual(labelValues, ['42', 'false', 'xxx']);
  }

  testCreateLabelValuesError() {
    const labelNames = ['foo', 'baz', 'bar'];
    assert.throws(() => createLabelValues(labelNames, {
      baz: false,
      foo: 42
    }));
  }

  testCreateLabelsHash() {
    const labelValues = ['foo', 'baz', 'bar'];
    const hash = createLabelsHash([], labelValues);
    assert.equal(hash, 'foo,baz,bar');
  }
}

export default UtilTests;
