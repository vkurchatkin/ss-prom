/* @flow */

import type {
  Metric,
  Sample,
  SimpleCounter,
  AnyLabels,
  Child
} from './types.js';

import {
  createLabelsHash,
  createLabelValues
} from './util.js';

import SimpleCounterImpl from './SimpleCounter.js';

class Counter {
  name: string;
  help: string;
  labelNames: Array<string>;
  children: Array<Child<SimpleCounterImpl>>;
  childrenByHash: { [hash: string]: ?Child<SimpleCounterImpl> };

  constructor(
    name: string,
    help: string,
    labels: Array<string>
  ) {
    this.name = name;
    this.help = help;
    this.labelNames = labels;
    this.children = [];
    this.childrenByHash = {};
  }

  withLabels(labels: AnyLabels): SimpleCounter {
    const labelValues = createLabelValues(this.labelNames, labels);
    const hash = createLabelsHash(this.labelNames, labelValues);

    let child = this.childrenByHash[hash];

    if (child) {
      return child.obj;
    }

    const obj = new SimpleCounterImpl();

    child = {
      labelValues,
      obj
    };

    this.childrenByHash[hash] = child;
    this.children.push(child);
    return obj;
  }

  inc(labels: AnyLabels, val?: number) {
    this.withLabels(labels).inc(val);
  }

  collect(): Array<Metric> {
    const { name, help, labelNames } = this;

    return [
      {
        name,
        help,
        type: 'Counter',
        samples: this.children.map(({ labelValues, obj })=> ({
          name,
          value: obj.val,
          labelNames,
          labelValues
        }))
      }
    ];
  }
}

export default Counter;
