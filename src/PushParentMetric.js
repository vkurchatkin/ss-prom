/* @flow */

import type {
  Metric
} from './types.js';

import ParentMetric from './ParentMetric.js';

class PushParentMetric<T: { val: number }> extends ParentMetric<T> {
  collect(): Array<Metric> {
    const { name, help, labelNames, type } = this;

    return [
      {
        name,
        help,
        type,
        samples: this.children.map(({ labelValues, obj }) => ({
          name,
          value: obj.val,
          labelNames,
          labelValues
        }))
      }
    ];
  }
}

export default PushParentMetric;
