/* @flow */

import type {
  AnyLabels,
  Metric
} from './types.js';

import {
  numberToString
} from './util.js';

import ParentMetric from './ParentMetric.js';
import SimpleHistogramImpl from './SimpleHistogram.js';

// TODO check labels for "le"
class Histogram extends ParentMetric<SimpleHistogramImpl> {
  constructor(
    name: string,
    help: string,
    labels: Array<string>,
    buckets: Array<number>
  ) {
    super(
      name,
      help,
      'Histogram',
      labels,
      () => new SimpleHistogramImpl(buckets)
    );
  }

  observe(labels: AnyLabels, val: number): void {
    this.withLabels(labels).observe(val);
  }

  collect(): Array<Metric> {
    const { name, help, labelNames, type } = this;
    const bucketLabelsNames = labelNames.concat(['le']);

    let samples = [];

    for (const child of this.children) {
      const { obj, labelValues } = child;

      samples = samples.concat(obj.buckets.map(bucket => ({
        name: name + '_bucket',
        value: bucket.val,
        labelNames: bucketLabelsNames,
        labelValues: labelValues.concat([numberToString(bucket.le)])
      })));

      samples.push({
        name: name + '_sum',
        value: obj.sum,
        labelNames,
        labelValues
      });

      samples.push({
        name: name + '_count',
        value: obj.buckets[obj.buckets.length - 1].val,
        labelNames,
        labelValues
      });
    }

    return [
      {
        name,
        help,
        type,
        samples
      }
    ];
  }
}

export default Histogram;
