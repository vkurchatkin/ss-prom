/* @flow */

import type {
  Metric,
  Sample,
  SimpleGauge,
  AnyLabels,
  Child
} from './types.js';

import {
  createLabelsHash,
  createLabelValues
} from './util.js';

import SimpleGaugeImpl from './SimpleGauge.js';

class Gauge {
  name: string;
  help: ?string;
  labelNames: Array<string>;
  children: Array<Child<SimpleGaugeImpl>>;
  childrenByHash: { [hash: string]: ?Child<SimpleGaugeImpl> };

  constructor(
    name: string,
    help: ?string,
    labels: Array<string>
  ) {
    this.name = name;
    this.help = help;
    this.labelNames = labels;
    this.children = [];
    this.childrenByHash = {};
  }

  withLabels(labels: AnyLabels): SimpleGauge {
    const labelValues = createLabelValues(this.labelNames, labels);
    const hash = createLabelsHash(this.labelNames, labelValues);

    let child = this.childrenByHash[hash];

    if (child) {
      return child.obj;
    }

    const obj = new SimpleGaugeImpl();

    child = {
      labelValues,
      obj
    };

    this.childrenByHash[hash] = child;
    this.children.push(child);
    return obj;
  }

  set(labels: AnyLabels, value: number): void {
    this.withLabels(labels).set(value);
  }

  collect(): Array<Metric> {
    const { name, help, labelNames } = this;

    return [
      {
        name,
        help,
        type: 'Gauge',
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

export default Gauge;
